<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { currentUser, pb } from "./pocketbase";

  let boards: any[] = [];
  let unsubscribe: () => void;

  onMount(async () => {
    $currentUser = await pb.collection("users").getOne($currentUser!.id);
    const resultList = await pb.collection("boards").getList(1, 50, {
      sort: "created",
      expand: "user",
    });
    boards = resultList.items;

    unsubscribe = await pb
      .collection("boards")
      .subscribe("*", async ({ action, record }) => {
        if (action === "create" && boards) {
          boards = [...boards, record];
        }
        if (action === "delete" && boards) {
          boards = boards.filter((b) => b.id !== record.id);
        }
        if (action === "update"){
          boards.forEach((b)=>{
            if (b.id === record.id){
              b.participants = record.participants;
            } 
          });
          boards = boards;
        }
      });

      unsubscribe = await pb
      .collection("users")
      .subscribe("*", async ({ action, record }) => {
        if ($currentUser!.id == record!.id) $currentUser = record;

        
      });
  });

  

  onDestroy(() => {
    unsubscribe?.();
  });

  async function createBoard() {
    const data = {
      creator: $currentUser!.id,
      creator_name: $currentUser!.username,
      participants: [$currentUser!.id],
    };
    const board = await pb.collection("boards").create(data);
    await pb.collection("users").update($currentUser!.id, {
        active: true,
        gameIn: board.id,
    });
  }

  async function deleteBoard(id: string) {
    const board = await pb.collection("boards").getOne(id);
    board.participants.forEach((p:string)=>{
      pb.collection("users").update(p, {
        active: false,
        gameIn: " ",
      });
    });
    await pb.collection("boards").delete(id);
  }
  async function joinGame(id: string) {
    if (!$currentUser!.active) {
      await pb.collection("users").update($currentUser!.id, {
        active: true,
        gameIn: id,
      });
      try {
        const players = await getPlayers(id);
        const updatedPlayers = [...players, $currentUser!.id];

        const updatedRecord = await pb.collection("boards").update(id, {
          participants: updatedPlayers,
        });
      } catch (error) {
        window.alert("Error joining game:" + error);
      }
    } else window.alert("already in game");
  }

  async function getPlayers(id: string) {
    const record = await pb.collection("boards").getOne(id);
    return record.participants;
  }
</script>

<table>

      {#each boards as board (board.id)}
      <tr>
          <td>
            Game created by @{board.creator_name} at {new Date(board.created).toLocaleTimeString()}
          </td>
          <td>
            {#if !$currentUser.active}
            <a  href={board.id} data-sveltekit-reload on:click={() => {joinGame(board.id);}}>
              <button>join</button>
            </a>
            {/if}
          </td>
          <td>
            {#if board.creator == $currentUser.id}
            <button
              on:click={() => {
                deleteBoard(board.id);
              }}>delete</button
            >
          {/if}
          </td>
          <td>
            {board.participants.length}/2
          </td>
        </tr>
    {/each}

</table>

{#if !$currentUser.active}
  <form on:submit|preventDefault={createBoard}>
    <button>create</button>
  </form>
{/if}

<style>
  table, tr, td {
  border: 1px solid black;
}
</style>