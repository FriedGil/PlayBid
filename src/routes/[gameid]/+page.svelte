<script lang="ts">
  import Game from '$lib/Game.svelte';
  import { currentUser, pb } from '$lib/pocketbase';
    import { onMount } from 'svelte';
  import type { PageData } from '../[gameid]/$types';
    import { BidGame } from '$lib/Bid';
  
  export let data: PageData;
  let deck: { suit: "s" | "c" | "h" | "d"; value: "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K"; }[] = [];
  let canStartGame = false;

  async function leaveGame(){
    await pb.collection("users").update($currentUser!.id, {
        active: false,
        gameIn: " "
      });
      
      const players = await getPlayers(data.id);
      const updatedPlayers = await players.filter((p: string) => p !== $currentUser!.id)
      const updatedRecord = await pb.collection("boards").update(data.id, {
        participants: updatedPlayers,
      });
      if (updatedPlayers.length == 0){
        await pb.collection("boards").delete(data.id);
      }
      location.replace("/");


      
  }

  async function getPlayers(id: string) {
    const record = await pb.collection("boards").getOne(id);
    return record.participants;
  }
  async function getNameFromID(id: string) {
    const record = await pb.collection("users").getOne(id);
    return record.username;
  }

  async function startGame(){
    const game = new BidGame(players);
    const record = pb.collection("boards").update(data.id,{
      active: true,
      cards: game.deck,
    });
    deck = game.deck;
  }

  let players: string[] = [];
  let unsubscribe: () => void;

  onMount(async () => {
    data.players.forEach(async (p)=>{
      const temp = await getNameFromID(p);
      players.push(temp);
      players = players;
    });
    const board = await pb.collection("boards").getOne(data.id);
    deck = board.cards;
    canStartGame = (data.creator === $currentUser!.id) && !board.active
    unsubscribe = await pb
      .collection("boards")
      .subscribe("*", async ({ action, record }) => {
        if (action === "update") {
          const playerIDs = await getPlayers(data.id);
          players = [];
          playerIDs.forEach(async (p: string)=>{
              const temp = await getNameFromID(p);
              players.push(temp);
              players = players;     
            });
          deck = record.deck;
        }
      });
  });

  
  </script>
  
  <h1>{data.title} created by {data.creator}</h1>
  <h2>
    players: {players}
  </h2>

  {#if canStartGame}
  <button on:click={startGame}>
    start game
  </button>
  {/if}

<a href="/" on:click={leaveGame}>
  <button>
    leave game
  </button>
</a>

{#key deck}
<Game deck={deck}/>
{/key}