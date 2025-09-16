<script>
  import { createEventDispatcher, onMount } from "svelte";

  export let open = false;
  export let card = null;

  const placeholder =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

  const dispatch = createEventDispatcher();
  const close = () => dispatch("close");

  function toggleFav(e) {
    e.stopPropagation();
    card.favorite = !card.favorite;
    dispatch("toggleFavorite", { model: card.model });
  }

  let view = "info";
  let wasOpen = false;
  let lastModel;

  $: {
    if (open && !wasOpen) view = "info";
    if (!open) {
      minContentHeight = 0;
      lastModel = undefined;
    }
    if (open && card?.model !== lastModel) {
      lastModel = card?.model;
      minContentHeight = 0;
    }
    wasOpen = open;
  }

  $: metaText = card
    ? JSON.stringify(
        card,
        (key, value) => (key === "collected" || key === "favorite" ? undefined : value),
        2
      )
    : "";

  async function copyMeta() {
    try {
      await navigator.clipboard.writeText(metaText);
    } catch {}
  }

  function downloadMeta() {
    const name = (card?.model ? String(card.model) : "card") + ".json";
    const blob = new Blob([metaText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }

  let infoEl;
  let minContentHeight = 0;
  let ro;

  function measureInfo() {
    if (infoEl && open) {
      const h = infoEl.offsetHeight;
      if (h > 0) minContentHeight = h;
    }
  }

  onMount(() => {
    ro = new ResizeObserver(() => measureInfo());
    return () => {
      ro && ro.disconnect();
    };
  });

  $: if (ro) {
    ro.disconnect();
    if (open && view === "info" && infoEl) ro.observe(infoEl);
  }

  function switchToMeta() {
    if (minContentHeight === 0) measureInfo();
    view = "meta";
  }

  function onKeydown(e) {
    if (e.key === "Escape") close();
  }

  function onError(e) {
    if (e.currentTarget.src !== placeholder) {
      e.currentTarget.src = placeholder;
    }
  }
</script>

<svelte:window on:keydown={onKeydown} />

{#if open && card}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal-backdrop" on:click|self={close}>
    <div class="modal">
      <button class="modal-close" on:click={close} aria-label="Close">✕</button>

      <div
        class="fav modal-fav"
        type="button"
        aria-label={card.favorite ? "Unstar" : "Star"}
        aria-pressed={card.favorite}
        on:click={toggleFav}
      >
        <svg viewBox="0 0 24 24" class:active={card.favorite}>
          <path
            d="M12 3.5 14.85 8.65 20.5 9.55 16.25 13.65 17.2 19.25 12 16.5 6.8 19.25 7.75 13.65 3.5 9.55 9.15 8.65 Z"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          />
        </svg>
      </div>

      <div class="seg-center">
        <div class="seg">
          <button
            class="seg-btn {view === 'info' ? 'active' : ''}"
            on:click={() => (view = "info")}
            type="button">Info</button
          >
          <button
            class="seg-btn {view === 'meta' ? 'active' : ''}"
            on:click={switchToMeta}
            type="button">Metadata</button
          >
        </div>
      </div>

      <!-- lock height only while in metadata -->
      <div
        class="content"
        style={view === "meta" && minContentHeight
          ? `height:${minContentHeight}px`
          : ""}
      >
        {#if view === "info"}
          <section class="panel" bind:this={infoEl}>
            <img
              loading="lazy"
              decoding="async"
              fetchpriority="low"
              src={card.pic || placeholder}
              alt={card.title}
              class="modal-image"
              on:error={onError}
              on:load={measureInfo}
            />
            <h2 class="modal-title">{card.episodes || ""}</h2>
            <p class="modal-series">{card.series}</p>

            <div class="row">
              <div class="kv">
                <p class="title">Release:</p>
                <p>
                  {new Date(Number(card.release) * 1000)
                    .toISOString()
                    .split("T")[0]}
                </p>
              </div>
              <div class="kv">
                <p class="title">Model:</p>
                <p>{card.model}</p>
              </div>
            </div>
          </section>
        {:else}
          <section class="panel">
            <div class="meta-actions">
              <button type="button" class="btn" on:click={copyMeta}>Copy</button>
              <button type="button" class="btn" on:click={downloadMeta}>Download</button>
            </div>
            <pre class="json"><code>{metaText}</code></pre>
          </section>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50;
  }
  .modal {
    background: #fff;
    margin: 0 1rem;
    padding: 1rem 1.25rem;
    border-radius: 12px;
    position: relative;
    max-width: 28rem;
    width: 100%;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  .modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    color: #9ca3af;
    font-weight: 700;
    background: transparent;
    border: 0;
    cursor: pointer;
    font-size: 200%;
    line-height: 1;
  }
  .modal-close:hover {
    color: #4b5563;
  }
  .modal-fav {
    position: absolute;
    top: 1rem;
    left: 1rem;
  }

  .fav {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: none;
    background: transparent;
    cursor: pointer;
    color: #facc15;
    padding: 0;
  }
  .fav svg {
    width: 36px;
    height: 36px;
    filter: grayscale(100%);
  }
  .fav svg.active,
  .fav svg.active path {
    fill: #facc15;
    filter: none;
  }

  .seg-center {
    display: flex;
    justify-content: center;
  }

  .seg {
    display: inline-flex;
    gap: 0.25rem;
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    border-radius: 999px;
    padding: 0.2rem;
    margin-bottom: 0.75rem;
  }
  .seg-btn {
    border: 0;
    background: transparent;
    padding: 0.35rem 0.75rem;
    border-radius: 999px;
    cursor: pointer;
    font: inherit;
    line-height: 1;
    color: #374151;
  }
  .seg-btn.active {
    background: #fff;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
    color: #111827;
  }

  .content {
    display: flex;
  }
  .panel {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
    min-height: 0;
  }

  .modal-image {
    max-width: 100%;
    max-height: 100%;
    display: block;
  }
  .modal-title {
    margin: 0 0 0.625rem;
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.2;
  }
  .modal-series {
    margin: 0 0 0.625rem;
  }
  .row {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .kv {
    display: flex;
    gap: 0.5rem;
  }
  .kv p {
    margin: 0;
  }
  .kv .title {
    font-weight: 700;
    align-items: center;
  }

  .meta-actions {
    display: flex;
    gap: 0.5rem;
  }
  .btn {
    border: 1px solid #e5e7eb;
    background: #fff;
    padding: 0.35rem 0.6rem;
    border-radius: 6px;
    font: inherit;
    cursor: pointer;
  }
  .btn:hover {
    border-color: #cbd5e1;
    background: #f8fafc;
  }

  .json {
    margin: 0;
    flex: 1 1 auto;
    min-height: 0;
    overflow: auto;
    padding: 0.5rem 0.6rem;
    border-radius: 6px;
    background: #fff;
    border: 1px solid #eef0f2;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
      "Liberation Mono", "Courier New", monospace;
    font-size: 12px;
    line-height: 1.45;
    white-space: pre;
    contain: inline-size;
  }
</style>
