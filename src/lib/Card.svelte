<script>
  import { createEventDispatcher } from "svelte";

  export let card;

  const placeholder =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

  const dispatch = createEventDispatcher();

  function toggleFav(e) {
    e.stopPropagation();
    dispatch("toggleFavorite", { model: card.model });
  }

  function onError(e) {
    if (e.currentTarget.src !== placeholder) {
      e.currentTarget.src = placeholder;
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="card" on:click={() => dispatch("select", card)}>
  <!-- Series row with star -->
  <div class="card-series">
    <div
      class="fav"
      type="button"
      aria-label={card.favorite ? "Unstar" : "Star"}
      aria-pressed={card.favorite}
      on:click={toggleFav}
    >
      <svg viewBox="0 0 24 24" class:active={card.favorite}>
        <path
          d="M12 3l2.9 5.9 6.5.9-4.7 4.5 1.1 6.5L12 18.9 6.2 20.8 7.3 14.3 2.6 9.8l6.5-.9L12 3z"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        />
      </svg>
    </div>
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
      class={card.collected ? "" : "grayscale"}
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
      class={card.collected ? "" : "grayscale"}
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
    border: 1px solid #ddd;
    border-radius: 6px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s ease;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  .card:hover {
    transform: scale(1.05);
  }

  .card-series {
    margin-top: 0.3rem;
    padding: 0 2.5rem 0.5rem 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .card-series h2 {
    margin: 0;
    font-size: 0.8rem;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .fav {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: none;
    background: transparent;
    cursor: pointer;
    color: #facc15;
    padding: 0;
  }
  .fav svg {
    width: 24px;
    height: 24px;
    filter: grayscale(100%);
  }
  .fav svg.active,
  .fav svg.active path {
    fill: #facc15;
    filter: none;
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
    opacity: 1;
  }
  .card-flag img.grayscale {
    opacity: 0.6;
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
    opacity: 1;
  }
  .card-pic img.grayscale {
    opacity: 0.7;
    filter: grayscale(100%);
  }

  .card-episodes {
    padding: 0.5rem;
  }
  .card-episodes p {
    margin: 0;
    font-size: 0.8rem;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
