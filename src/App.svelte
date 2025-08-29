<script>
  import { onMount } from "svelte";
  import Grid from "./lib/Grid.svelte";
  import Search from "./lib/Search.svelte";
  import LanguageFilter from "./lib/LanguageFilter.svelte";
  import CollectedFilter from "./lib/CollectedFilter.svelte";
  import Modal from "./lib/Modal.svelte";
  import { loadCards } from "./lib/catalogData.js";

  let allCards = [];
  let selectedLangs = [];
  let selectedCollected = [];
  let query = "";

  let open = false;
  let selected = null;

  onMount(async () => {
    try {
      allCards = await loadCards();
    } catch (e) {
      console.error(e);
      allCards = [];
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

  // 1) query
  $: queryCards = allCards.filter(c => matchesQuery(c, query));

  // 2) language
  $: languageCards = queryCards.filter(
    c => !selectedLangs.length || selectedLangs.includes(c.language)
  );

  // 3) ownership
  $: visibleCards = languageCards.filter(c => {
    if (!selectedCollected.length) return true;
    const key = c?.collected ? 'collected' : 'missing';
    return selectedCollected.includes(key);
  });
</script>

<div class="container">
  <Search bind:query />
  <LanguageFilter cards={queryCards} bind:selected={selectedLangs} />
  <CollectedFilter cards={languageCards} bind:selected={selectedCollected} />
  <main>
    <Grid items={visibleCards} on:select={onSelect} />
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
