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
  import FavoritesFilter from "./lib/FavoriteFilter.svelte";
  import { loadFavorites, toggleFavorite as toggleFavStore } from "./lib/FavoriteStorage.svelte";

  import { loadCards } from "./lib/catalogData.js";

  let allCards = [];
  let selectedLangs = [];
  let selectedCollected = [];
  let selectedFav = [];
  let startDate = "";
  let endDate = "";
  let query = "";
  let favorites = new Set();

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
        selectedFav       = filters.selectedFav ?? [];
        startDate         = filters.startDate ?? "";
        endDate           = filters.endDate ?? "";
        filtersOpen       = filters.filtersOpen ?? false;
      }

      favorites = loadFavorites();

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

  function onToggleFavorite(e) {
    const { model } = e.detail;
    favorites = toggleFavStore(favorites, model);
  }

  function matchesQuery(card, q) {
    if (!q) return true;
    q = q.trim().toLowerCase();
    const haystack = [
      card.data[0].episode,
      card.data[0].series,
      card.article,
      card.data[0].ids.map(id => id['audio-id']).join(" "),
      card.data[0].ids.map(id => id.hash).join(" "),
    ]
      .filter(Boolean)
      .map((card) => String(card ?? "").toLowerCase())
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
      selectedFav,
      startDate,
      endDate,
      filtersOpen
    });
  }, 150);

  $: saveDebounced(), query, selectedLangs, selectedCollected, selectedFav, startDate, endDate, filtersOpen;

  $: cardsWithFav = allCards.map(card => ({ ...card, favorite: favorites.has(card.article) }));

  // 1) query
  $: queryCards = cardsWithFav.filter((card) => matchesQuery(card, query));

  // 2) date range
  $: dateCards = queryCards.filter((card) => {
    const r = Number(card.data[0].release);
    if (!Number.isFinite(r)) return false;
    const a = toStartEpoch(startDate);
    const b = toEndEpoch(endDate);
    if (a && r < a) return false;
    if (b && r > b) return false;
    return true;
  });

  // 3) language
  $: languageCards = dateCards.filter(
    (card) => !selectedLangs.length || selectedLangs.includes(card.data[0].language)
  );

  // 4) ownership
  $: collectedCards = languageCards.filter((card) => {
    if (!selectedCollected.length) return true;
    const key = card?.collected ? "collected" : "missing";
    return selectedCollected.includes(key);
  });

  // 5) favorites
  $: visibleCards = collectedCards.filter((card) => {
    if (!selectedFav.length) return true;
    const key = card?.favorite ? "starred" : "unstarred";
    return selectedFav.includes(key);
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
        <LanguageFilter
          cards={dateCards}
          bind:selected={selectedLangs}
        />
        <CollectedFilter
          cards={languageCards}
          bind:selected={selectedCollected}
        />
        <FavoritesFilter
          cards={collectedCards}
          bind:selected={selectedFav}
        />
      </div>
    {/if}
  </section>

  <main>
    <Grid items={visibleCards}
      on:select={onSelect}
      on:toggleFavorite={onToggleFavorite}
    />
    <Modal
      open={modalOpen}
      card={selected}
      on:close={() => {
        modalOpen = false;
        selected = null;
      }}
      on:toggleFavorite={onToggleFavorite}
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
