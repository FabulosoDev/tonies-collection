<script>
  export let cards = [];
  export let selected = [];

  $: counts = (() => {
    let collected = 0, missing = 0;
    for (const c of cards) (c?.collected ? collected++ : missing++);
    return { collected, missing };
  })();

  function toggle(key, checked) {
    selected = checked
      ? Array.from(new Set([...selected, key]))
      : selected.filter(k => k !== key);
  }
</script>

<fieldset class="own">
  <legend class="legend">Collection</legend>

  <div class="row">
    <label class="chip" class:active={selected.includes('collected')}>
      <input
        type="checkbox"
        checked={selected.includes('collected')}
        on:change={(e) => toggle('collected', e.currentTarget.checked)}
        aria-label="Filter: collected"
      />
      <svg class="icon icon-collected" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
        <path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="name">Collected</span>
      <small class="count">({counts.collected})</small>
    </label>

    <label class="chip" class:active={selected.includes('missing')}>
      <input
        type="checkbox"
        checked={selected.includes('missing')}
        on:change={(e) => toggle('missing', e.currentTarget.checked)}
        aria-label="Filter: missing"
      />
      <svg class="icon icon-missing" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
        <path d="M15 9l-6 6M9 9l6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="name">Missing</span>
      <small class="count">({counts.missing})</small>
    </label>
  </div>
</fieldset>

<style>
  .own {
    --accent: #2563eb;
    margin: .25rem 0 1rem;
    padding: 0;
    border: 0;
  }
  .legend {
    font-weight: 600;
    font-size: .9rem;
    margin: 0 0 .4rem;
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    gap: .45rem;
    align-items: center;
  }
  .chip {
    position: relative;
    display: inline-flex;
    align-items: center;
    height: 20px;
    gap: .4rem;
    padding: .3rem .6rem;
    border: 1px solid #e5e7eb;
    border-radius: 999px;
    background: #fff;
    font-size: .9rem;
    line-height: 1;
    user-select: none;
    cursor: pointer;
    transition: border-color .15s ease, background-color .15s ease, color .15s ease;
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
    opacity: .8;
    filter: grayscale(100%);
  }
  .icon-collected {
    color: #16a34a;
  }
  .icon-missing {
    color: #dc2626;
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
    opacity: .65;
    font-size: .78rem;
  }
  .chip.active .count {
    opacity: .9;
  }
</style>
