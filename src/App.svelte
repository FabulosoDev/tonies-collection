<script>
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";

  import Grid from "./lib/Grid.svelte";
  import Search from "./lib/Search.svelte";
  import LanguageFilter from "./lib/LanguageFilter.svelte";
  import CollectedFilter from "./lib/CollectedFilter.svelte";
  import DateRangeFilter from "./lib/DateRangeFilter.svelte";
  import Modal from "./lib/Modal.svelte";
  import { loadFilters, saveFilters, debounce } from "./lib/FilterStorage.svelte";
  import { loadCards } from "./lib/catalogData.js";

  let allCards = [];
  let selectedLangs = [];
  let selectedCollected = [];
  let startDate = "";
  let endDate = "";
  let query = "";

  let selected = null;
  let modalOpen = false;
  let filtersOpen = false;

  onMount(async () => {
    try {
      const filters = loadFilters();
      if (filters) {
        query             = filters.query ?? "";
        selectedLangs     = filters.selectedLangs ?? [];
        selectedCollected = filters.selectedCollected ?? [];
        startDate         = filters.startDate ?? "";
        endDate           = filters.endDate ?? "";
        filtersOpen       = filters.filtersOpen ?? false;
      }

      allCards = await loadCards();
    } catch (e) {
      console.error(e);
      allCards = [];
    }
  });

  function onSelect(e) {
    selected = e.detail; // the clicked card
    modalOpen = true;
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
      Array.isArray(card.hash) ? card.hash.join(" ") : card.hash,
    ]
      .filter(Boolean)
      .map((c) => String(c ?? "").toLowerCase())
      .join(" ");
    return haystack.includes(q);
  }

  const toStartEpoch = (s) =>
    s ? Math.floor(new Date(s).getTime() / 1000) : null;
  const toEndEpoch = (s) =>
    s ? Math.floor(new Date(s).getTime() / 1000) + 86399 : null;

  const saveDebounced = debounce(() => {
    saveFilters({
      query,
      selectedLangs,
      selectedCollected,
      startDate,
      endDate,
      filtersOpen
    });
  }, 150);

  $: saveDebounced(), query, selectedLangs, selectedCollected, startDate, endDate, filtersOpen;

  // 1) query
  $: queryCards = allCards.filter((c) => matchesQuery(c, query));

  // 2) date range
  $: dateCards = queryCards.filter((c) => {
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
    (c) => !selectedLangs.length || selectedLangs.includes(c.language)
  );

  // 4) ownership
  $: visibleCards = languageCards.filter((c) => {
    if (!selectedCollected.length) return true;
    const key = c?.collected ? "collected" : "missing";
    return selectedCollected.includes(key);
  });
</script>

<div class="container">
  <Search cards={visibleCards} bind:query />

  <section class="filterbox">
    <button
      class="filterbar"
      type="button"
      on:click={() => (filtersOpen = !filtersOpen)}
      aria-expanded={filtersOpen}
    >
      <span class="chev" aria-hidden="true" class:open={filtersOpen}></span>
      <span>{filtersOpen ? "Hide filters" : "Show filters"}</span>
    </button>

    {#if filtersOpen}
      <div
        class="filters-row"
        in:slide={{ duration: 220 }}
        out:slide={{ duration: 220 }}
      >
        <DateRangeFilter
          cards={queryCards}
          bind:start={startDate}
          bind:end={endDate}
        />
        <LanguageFilter cards={dateCards} bind:selected={selectedLangs} />
        <CollectedFilter
          cards={languageCards}
          bind:selected={selectedCollected}
        />
      </div>
    {/if}
  </section>

  <main>
    <Grid items={visibleCards} on:select={onSelect} />
    <Modal
      open={modalOpen}
      card={selected}
      on:close={() => {
        modalOpen = false;
        selected = null;
      }}
    />
  </main>
</div>

<style>
  .container {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0.5rem;
    box-sizing: border-box;
  }

  .filterbox {
    background: rgba(0, 0, 0, 0.04);
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 0.5rem 0.75rem;
    margin: 0 0 0.75rem;
  }

  .filterbar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    user-select: none;
    background: transparent;
    border: 0;
    border-radius: 6px;
    padding: 0.25rem 0.25rem;
    font: inherit;
    font-weight: 600;
    width: 100%;
    -webkit-tap-highlight-color: transparent;
  }
  .chev {
    width: 0.6rem;
    height: 0.6rem;
    border-right: 2px solid #111;
    border-bottom: 2px solid #111;
    transform: rotate(-45deg);
    transition: transform 0.22s ease;
    margin-right: 0.25rem;
  }
  .chev.open {
    transform: rotate(45deg);
  }

  .filters-row {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 0.75rem 1rem;
    margin-top: 0.5rem;
  }
</style>
