<script>
  import { createEventDispatcher } from "svelte";

  export let open = false;
  export let card = null;

  const dispatch = createEventDispatcher();
  function close() {
    dispatch("close");
  }
  function onKeydown(e) {
    if (e.key === "Escape") close();
  }
</script>

<svelte:window on:keydown={onKeydown} />

{#if open && card}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal-backdrop" on:click|self={close}>
    <div class="modal">
      <button class="modal-close" on:click={close} aria-label="Close">✕</button>

      <img
        loading="lazy"
        decoding="async"
        fetchpriority="high"
        src={card.pic}
        alt={card.title}
        class="modal-image"
      />

      <h2 class="modal-title">{card.episodes}</h2>
      <p class="modal-series">{card.series}</p>

      <div class="row">
        <div class="kv">
          <div class="kv-title">Release:</div>
          <div>{new Date(Number(card.release) * 1000).toISOString().split("T")[0]}</div>
        </div>
        <div class="kv">
          <div class="kv-title">Model:</div>
          <div>{card.model}</div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50;
  }
  .modal {
    background: #fff;
    padding: 1.25rem;
    border-radius: 12px;
    position: relative;
    max-width: 28rem;
    box-shadow: 0 15px 35px rgba(0,0,0,.25);
  }
  .modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    color: #9ca3af;
    font-weight: 700;
    font-size: 1.25rem;
    background: transparent;
    border: 0;
    cursor: pointer;
  }
  .modal-close:hover {
    color: #4b5563;
  }

  .modal-image {
    max-width: 100%;
    max-height: 100%;
    display: block;
  }
  .modal-title {
    font-size: 1.5rem;
    font-weight: 500;
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .kv {
    display: flex;
    align-items: center;
    gap: .5rem;
  }
  .kv-title {
    font-weight: 600;
  }
</style>
