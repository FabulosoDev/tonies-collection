<script>
  export let selected = { prop: '', direction: 'asc' };

  const props = [
    { key: 'article', name: 'Model' },
    { key: 'release', name: 'Release' },
    { key: 'series', name: 'Series' },
    { key: 'episode', name: 'Episode' },
    { key: 'age', name: 'Age' },
    { key: 'runtime', name: 'Runtime' }
  ];

  function toggle(propKey) {
    if (selected.prop === propKey) {
      selected = selected.direction === 'asc' 
        ? { prop: propKey, direction: 'desc' } 
        : { prop: '', direction: 'asc' };
    } else {
      selected = { prop: propKey, direction: 'asc' };
    }
  }
</script>

<fieldset class="sort">
  <legend class="legend">Sort</legend>

  <div class="row">
    {#each props as { key, name }}
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label
        class="chip"
        class:active={selected.prop === key}
        on:click={() => toggle(key)}
        aria-label="Sort by {name} {selected.prop === key ? selected.direction : ''}"
      >
        {#if selected.prop === key}
            <span class="icon">
                {selected.direction === 'asc' ? '▲' : '▼'}
            </span>
        {/if}
        <span class="name">{name}</span>
    </label>
    {/each}
  </div>
</fieldset>

<style>
  .sort {
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
  .icon {
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    opacity: 0.8;
  }
  .chip.active .icon {
    opacity: 1;
  }
  .chip.active {
    background: #e6ecff;
    border-color: #a2b7ff;
    color: #0b1324;
  }
  .name {
    white-space: nowrap;
  }
</style>
