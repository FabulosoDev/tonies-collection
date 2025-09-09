<script>
  export let cards = [];
  export let start = "";
  export let end = "";

  const toDateStr = (sec) => {
    const d = new Date(Number(sec) * 1000);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${da}`;
  };

  $: bounds = (() => {
    const nums = cards
      .map((c) => Number(c.release))
      .filter((n) => Number.isFinite(n) && n > 0);
    if (!nums.length) return { min: "", max: "" };
    return {
      min: toDateStr(Math.min(...nums)),
      max: toDateStr(Math.max(...nums)),
    };
  })();
</script>

<fieldset class="date">
  <legend class="legend">Release date</legend>
  <div class="row">
    <label class="field">
      <span class="lbl">From</span>
      <input type="date" bind:value={start} min={bounds.min} max={bounds.max} />
    </label>
    <label class="field">
      <span class="lbl">To</span>
      <input type="date" bind:value={end} min={bounds.min} max={bounds.max} />
    </label>
  </div>
</fieldset>

<style>
  .date {
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
  .field {
    flex-wrap: wrap;
  }
  .lbl {
    font-size: 0.85rem;
    line-height: 1;
    padding: 0.2rem;
  }
  input[type="date"] {
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
    font: inherit;
    user-select: none;
    cursor: pointer;
    transition:
      border-color 0.15s ease,
      background-color 0.15s ease,
      color 0.15s ease;
    color: #111;
  }
  input[type="date"]:hover {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 30%, transparent);
    border-color: var(--accent);
  }
</style>
