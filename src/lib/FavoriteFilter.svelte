<script>
  export let cards = [];
  export let selected = [];

  $: counts = (() => {
    let starred = 0, unstarred = 0;
    for (const c of cards) (c?.favorite ? starred++ : unstarred++);
    return { starred, unstarred };
  })();

  function toggle(key, checked) {
    selected = checked
      ? Array.from(new Set([...selected, key]))
      : selected.filter(k => k !== key);
  }
</script>

<fieldset class="fav">
  <legend class="legend">Favorites</legend>

  <div class="row">
    <label class="chip" class:active={selected.includes("starred")}>
      <input
        type="checkbox"
        checked={selected.includes("starred")}
        on:change={(e) => toggle("starred", e.currentTarget.checked)}
        aria-label="Filter: starred"
      />
      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 3l2.9 5.9 6.5.9-4.7 4.5 1.1 6.5L12 18.9 6.2 20.8 7.3 14.3 2.6 9.8l6.5-.9L12 3z"
          fill="currentColor"
          stroke="currentColor"
          stroke-width="2"
        />
      </svg>
      <span class="name">Starred</span>
      <small class="count">({counts.starred})</small>
    </label>

    <label class="chip" class:active={selected.includes("unstarred")}>
      <input
        type="checkbox"
        checked={selected.includes("unstarred")}
        on:change={(e) => toggle("unstarred", e.currentTarget.checked)}
        aria-label="Filter: unstarred"
      />
      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 3l2.9 5.9 6.5.9-4.7 4.5 1.1 6.5L12 18.9 6.2 20.8 7.3 14.3 2.6 9.8l6.5-.9L12 3z"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        />
      </svg>
      <span class="name">Unstarred</span>
      <small class="count">({counts.unstarred})</small>
    </label>
  </div>
</fieldset>

<style>
  .fav {
    --accent: #2563eb;
    margin: 0.25rem 0 0.25rem;
    padding: 0;
    border: 0;
  }
  .legend {
    font-weight: 600;
    font-size: 0.9rem;
    margin: 0 0 0.4rem;
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
    align-items: center;
  }
  .chip {
    position: relative;
    display: inline-flex;
    align-items: center;
    height: 20px;
    gap: 0.4rem;
    padding: 0.3rem 0.6rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: #fff;
    font-size: 0.9rem;
    line-height: 1;
    user-select: none;
    cursor: pointer;
    transition:
      border-color 0.15s ease,
      background-color 0.15s ease,
      color 0.15s ease;
    color: #111;
  }
  .chip:hover {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 30%, transparent);
    border-color: var(--accent);
  }
  .chip input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
    width: 0;
    height: 0;
  }
  .icon {
    width: 18px;
    height: 18px;
    opacity: 0.8;
    color: #eab308;
    filter: grayscale(100%);
  }
  .chip.active .icon {
    opacity: 1;
    filter: none;
  }
  .chip.active {
    background: #e6ecff;
    border-color: #a2b7ff;
    color: #0b1324;
  }
  .name {
    white-space: nowrap;
  }
  .count {
    opacity: 0.65;
    font-size: 0.78rem;
  }
  .chip.active .count {
    opacity: 0.9;
  }
</style>
