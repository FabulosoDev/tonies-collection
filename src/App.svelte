<script>
  import { onMount } from "svelte";
  import Grid from "./lib/Grid.svelte";
  import Search from "./lib/Search.svelte";
  import LanguageFilter from "./lib/LanguageFilter.svelte";
  import CollectedFilter from "./lib/CollectedFilter.svelte";
  import DateRangeFilter from "./lib/DateRangeFilter.svelte";
  import Modal from "./lib/Modal.svelte";
  import { loadCards } from "./lib/catalogData.js";

  let allCards = [];
  let selectedLangs = [];
  let selectedCollected = [];
  let startDate = "";
  let endDate = "";
  let query = "";

  let open = false;
  let selected = null;
  let filtersOpen = true;

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
      Array.isArray(card.audio_id) ? card.audio_id.join(" ") : card.audio_id,
      Array.isArray(card.hash) ? card.hash.join(" ") : card.hash
    ]
      .filter(Boolean)
      .map((c) => String(c ?? "").toLowerCase())
      .join(" ");
    return haystack.includes(q);
  }

  const toStartEpoch = (s) => (s ? Math.floor(new Date(s).getTime() / 1000) : null);
  const toEndEpoch   = (s) => (s ? Math.floor(new Date(s).getTime() / 1000) + 86399 : null);

  // 1) query
  $: queryCards = allCards.filter(c => matchesQuery(c, query));

  // 2) date range
  $: dateCards = queryCards.filter(c => {
    const r = Number(c.release);
    if (!Number.isFinite(r)) return false;
    const a = toStartEpoch(startDate);
    const b = toEndEpoch(endDate);
    if (a && r < a) return false;
    if (b && r > b) return false;
    return true;
  });

  // 3) language
  $: languageCards = dateCards.filter(
    c => !selectedLangs.length || selectedLangs.includes(c.language)
  );

  // 4) ownership
  $: visibleCards = languageCards.filter(c => {
    if (!selectedCollected.length) return true;
    const key = c?.collected ? 'collected' : 'missing';
    return selectedCollected.includes(key);
  });
</script>

<div class="container">
  <Search bind:query />
  <details class="filterbox" bind:open={filtersOpen}>
    <summary>
      <span class="chev" aria-hidden="true"></span>
      <span class="sum-label">{filtersOpen ? 'Hide filters' : 'Show filters'}</span>
    </summary>

    <div class="filters-row">
      <DateRangeFilter cards={queryCards} bind:start={startDate} bind:end={endDate} />
      <LanguageFilter cards={dateCards} bind:selected={selectedLangs} />
      <CollectedFilter cards={languageCards} bind:selected={selectedCollected} />
    </div>
  </details>
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

  .filters-row {
    display: flex;
    flex-wrap: wrap;
    gap: .5rem 1rem;
    align-items: flex-start;
  }

  .filterbox {
    background: rgba(0, 0, 0, 0.04);
    border-radius: 6px;
    padding: .5rem .75rem;
    margin: 0 0 .75rem;
  }

  .filterbox > summary {
    list-style: none;
    display: inline-flex;
    align-items: center;
    gap: .5rem;
    cursor: pointer;
    border-radius: 8px;
    padding: .25rem .25rem;
    font-weight: 600;
  }
  .filterbox > summary::-webkit-details-marker {
    display: none;
  }

  .filterbox .chev {
    width: .6rem;
    height: .6rem;
    border-right: 2px solid #111;
    border-bottom: 2px solid #111;
    transform: rotate(-45deg);
    transition: transform .18s ease;
    margin-right: .25rem;
  }
  .filterbox[open] .chev {
    transform: rotate(45deg);
  }

  .filterbox .filters-row {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: .75rem 1rem;
    margin-top: .5rem;
  }
</style>
