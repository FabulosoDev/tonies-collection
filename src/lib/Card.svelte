<script>
  import { createEventDispatcher } from "svelte";

  export let card;

  const placeholder = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

  const dispatch = createEventDispatcher();
  function handleClick() {
    dispatch("select", card);
  }

  function onError(e) {
    if (e.currentTarget.src !== placeholder) {
      e.currentTarget.src = placeholder;
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="card" on:click={handleClick}>
  <!-- Series -->
  <div class="card-series">
    <h2>{card.series}</h2>
  </div>

  <!-- Flag -->
  <div class="card-flag">
    <img
      loading="lazy"
      decoding="async"
      fetchpriority="low"
      src={`${import.meta.env.BASE_URL}assets/flags/${card.language}.svg`}
      alt={card.language}
      class={card.owned ? "" : "grayscale"}
      width="24"
      height="16"
      on:error={onError}
    />
  </div>

  <!-- Pic -->
  <div class="card-pic">
    <img
      loading="lazy"
      decoding="async"
      fetchpriority="low"
      src={card.pic || placeholder}
      alt={card.title}
      class={card.owned ? "" : "grayscale"}
      on:error={onError}
    />
  </div>

  <!-- Episodes -->
  <div class="card-episodes">
    <p>{card.episodes || ""}</p>
  </div>
</div>

<style>
  .card {
    position: relative;
    background: rgba(0, 0, 0, 0.04);
    border-radius: 6px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s ease;
  }
  .card:hover {
    transform: scale(1.05);
  }

  .card-series {
    padding: 0.5rem 2.5rem 0.5rem 0.5rem;
  }
  .card-series h2 {
    margin: 0;
    font-size: 0.75rem;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-flag {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 24px;
    height: 16px;
  }
  .card-flag img {
    display: block;
    width: 100%;
    height: auto;
  }
  .card-flag img.grayscale {
    filter: grayscale(100%);
  }

  .card-pic {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 220px;
    overflow: hidden;
  }
  .card-pic img {
    max-width: 100%;
    max-height: 100%;
    display: block;
  }
  .card-pic img.grayscale {
    filter: grayscale(100%);
  }

  .card-episodes {
    padding: 0.5rem;
  }
  .card-episodes p {
    margin: 0;
    font-size: 0.75rem;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
