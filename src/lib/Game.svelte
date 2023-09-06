<script lang="ts">
    import type { BidGame } from "./Bid";
    import PlayingCard from "./PlayingCard.svelte";
    
    export let deck:{ suit: string; value: string; }[];
    let unsubscribe: () => void;

</script>

<div style="outline-style: dotted ">
    <div style="display: grid; grid-template-columns: auto auto auto;">

        {#each deck as card}
        
        <PlayingCard suit = {card.suit} value = {card.value}/>
        {/each}
    </div>

</div>
