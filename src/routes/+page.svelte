<script lang="ts">
    import Boards from "$lib/Boards.svelte";
    import Login from "$lib/Login.svelte";
    import { currentUser } from "$lib/pocketbase";
  
  </script>
  
 
  <h1>Bid</h1>
  
  <Login />

  {#if $currentUser}

    {#if $currentUser.active}
    <h3>
      Currently in Game
      <a href="/{$currentUser.gameIn}">
        <button>
          join
        </button>
      </a>
    </h3>

  {/if}
    <Boards/>
  {/if}

  <br/>
  
<a href="/offline">
  <button>
    Play Offline (Recommended)
  </button>
</a>
