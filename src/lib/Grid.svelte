<script>
  import Card from "./Card.svelte";
  export let items = [];
</script>

<section class="grid">
  {#each items as card}
    <Card {card} on:select />
  {/each}
</section>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.25rem;
  }
</style>
