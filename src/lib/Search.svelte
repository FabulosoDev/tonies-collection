<script>
  export let query = "";
</script>

<header class="header">
  <div class="brand">Tonies Catalog</div>
  <div class="search">
    <input
      type="search"
      placeholder="Search titles, series, models…"
      aria-label="Search catalog"
      bind:value={query}
    />
  </div>
</header>

<style>
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem 0;
  }

  .brand {
    font-weight: 800;
    font-size: 1.25rem;
  }

  .search {
    flex: 1;
    display: flex;
    gap: 0.5rem;
  }
  .search input {
    width: 100%;
    padding: 0.7rem 0.9rem;
    border-radius: 12px;
    border: 1px solid #ddd;
    background: white;
  }
</style>
