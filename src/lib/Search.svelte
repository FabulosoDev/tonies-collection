<script>
  import { createEventDispatcher } from "svelte";

  export let cards = [];
  export let query = "";

  const dispatch = createEventDispatcher();
  const openInfo = () => dispatch("openInfo");
</script>

<header class="header">
  <div class="brand">Tonies Collection ({cards.length})</div>
  <div class="search">
    <input
      type="search"
      placeholder="Search titles, series, models…"
      aria-label="Search collection"
      bind:value={query}
    />
    <button class="info-btn" on:click={openInfo} aria-label="Query help" title="Query help">?</button>
  </div>
</header>

<style>
  .header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem 0;
  }

  .brand {
    font-weight: 700;
    font-size: 1.25rem;
  }

  .search {
    flex: 1;
    display: flex;
    gap: 0.5rem;
    min-width: fit-content;
  }
  .search input {
    width: 100%;
    padding: 0.7rem 0.9rem;
    border-radius: 6px;
    border: 1px solid #ddd;
    background: white;
  }

  .info-btn {
    --accent: #2563eb;
    background: rgba(0, 0, 0, 0.04);
    color: #111;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 0.7rem 0.9rem;
    cursor: pointer;
    font-weight: 600;
    font-size: 1rem;
    min-width: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      border-color 0.15s ease,
      background-color 0.15s ease,
      color 0.15s ease;
  }

  .info-btn:hover {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 30%, transparent);
    border-color: var(--accent);
  }
</style>
