<script>
  export let cards = [];
  export let selected = [];

  export let labels = {
    "de-de": "German", "en-gb": "English (UK)", "en-us": "English (US)",
    "fr-fr": "French", "unknown": "Unknown"
  };
  const base = import.meta.env.BASE_URL || "/";
  const labelFor = (code) => labels[code] ?? code;
  const flagSrc = (code) => `${base}assets/flags/${code}.svg`;
  const fallbackFlag = `${base}assets/flags/unknown.svg`;

  $: languageOptions = (() => {
    const map = new Map();
    for (const c of cards) {
      const code = c.language || "unknown";
      map.set(code, (map.get(code) || 0) + 1);
    }
    return Array.from(map, ([code, count]) => ({ code, label: labelFor(code), count }))
      .sort((a, b) => a.label.localeCompare(b.label));
  })();

  function toggle(code, checked) {
    selected = checked
      ? Array.from(new Set([...selected, code]))
      : selected.filter((c) => c !== code);
  }
</script>

<fieldset class="lang">
  <legend class="legend">Language</legend>

  <div class="row">
    {#each languageOptions as opt}
      <label class="option" class:active={selected.includes(opt.code)}>
        <input
          type="checkbox"
          checked={selected.includes(opt.code)}
          on:change={(e) => toggle(opt.code, e.currentTarget.checked)}
          aria-label={`Filter by ${opt.label}`}
        />
        <img
          class="flag"
          src={flagSrc(opt.code)}
          alt={opt.label}
          width="20"
          height="14"
          on:error={(e) => (e.currentTarget.src = fallbackFlag)}
        />
        <span class="name">{opt.label}</span>
        <small class="count">({opt.count})</small>
      </label>
    {/each}
  </div>
</fieldset>

<style>
  .lang {
    --accent: #2563eb;
    margin: .25rem 0 1rem; padding: 0; border: 0;
  }
  .legend { font-weight: 600; font-size: .9rem; margin: 0 0 .4rem; }

  .row {
    display: flex; flex-wrap: wrap; gap: .45rem; align-items: center;
  }

  .option {
    position: relative;
    display: inline-flex; align-items: center; gap: .45rem;
    padding: .3rem .6rem;
    border: 1px solid #e5e7eb; border-radius: 999px;
    background: #fff;
    font-size: .9rem; line-height: 1;
    user-select: none; cursor: pointer;
    transition: border-color .15s ease, background-color .15s ease, color .15s ease, filter .15s ease;
    color: #111;
  }
  .option:hover { box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 30%, transparent); border-color: var(--accent); }

  .option input {
    position: absolute; opacity: 0; pointer-events: none; width: 0; height: 0;
  }

  .flag {
    display: block;
    width: 20px; height: 14px;
    object-fit: cover;
    filter: grayscale(100%);
    opacity: .7;
    border-radius: 2px;
  }

  .option.active .flag {
    filter: none;
    opacity: 1;
  }

  .option.active {
    background: #e6ecff;
    border-color: #a2b7ff;
    color: #0b1324;
  }

  .name { white-space: nowrap; }
  .count { opacity: .65; font-size: .78rem; }
  .option.active .count { opacity: .9; }
</style>
