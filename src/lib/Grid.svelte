<script>
  import Card from "./Card.svelte";
  import { createEventDispatcher } from "svelte";
  export let items = [];
  const dispatch = createEventDispatcher();
</script>

<section class="grid">
  {#each items as card}
    <Card {card} on:select on:toggleFavorite={(e)=>dispatch('toggleFavorite', e.detail)} />
  {/each}
</section>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.25rem;
  }
</style>
