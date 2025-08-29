<script>
  import { onMount } from "svelte";
  import Header from "./lib/Header.svelte";
  import Grid from "./lib/Grid.svelte";
  import Modal from "./lib/Modal.svelte";
  import { loadCards } from "./lib/catalogData.js";

  let cards = [];
  let open = false;
  let selected = null;
  let query = "";

  onMount(async () => {
    try {
      cards = await loadCards();
    } catch (e) {
      console.error(e);
      cards = [];
    }
  });

  function onSelect(e) {
    selected = e.detail; // the clicked card
    open = true;
  }

  function matchesQuery(card, q) {
    if (!q) return true;
    q = q.trim().toLowerCase();
    const haystack = [
      card.title,
      card.series,
      card.episodes,
      card.model,
      Array.isArray(card.tags) ? card.tags.join(" ") : card.tags
    ]
      .filter(Boolean)
      .map((c) => String(c ?? "").toLowerCase())
      .join(" ");
    return haystack.includes(q);
  }

  $: filtered = cards.filter((c) => matchesQuery(c, query));
</script>

<div class="container">
  <Header bind:query />
  <main>
    <Grid items={filtered} on:select={onSelect} />
    <Modal open={open} card={selected} on:close={() => { open = false; selected = null; }} />
  </main>
</div>

<style>
  .container {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 1.25rem;
  }
</style>
