<script>
  import { createEventDispatcher, onMount } from "svelte";
  import QRCode from "qrcode";
  import pako from "pako";
  import { loadFavorites } from "./FavoriteStorage.svelte";

  export let open = false;

  const dispatch = createEventDispatcher();
  const close = () => dispatch("close");

  let qrCodeImage = "";
  let base64Data = "";
  let qrContainer;

  function onKeydown(e) {
    if (e.key === "Escape") close();
  }

  async function generateQRCode() {
    try {
      const favorites = loadFavorites();
      const favArray = Array.from(favorites);
      const jsonString = JSON.stringify(favArray);

      const compressed = pako.deflate(jsonString);
      base64Data = btoa(String.fromCharCode.apply(null, compressed));

      const origin = `${window.location.origin}${import.meta.env.BASE_URL}`;
      const favoritesUrl = `${origin}?f=${encodeURIComponent(base64Data)}`;

      qrCodeImage = await QRCode.toDataURL(favoritesUrl, {
        errorCorrectionLevel: "H",
        type: "image/png",
        quality: 0.95,
        margin: 1,
        width: 300
      });
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  }

  $: if (open && !qrCodeImage) {
    generateQRCode();
  }

</script>

<svelte:window on:keydown={onKeydown} />

{#if open}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal-backdrop" on:click|self={close}>
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">Favorites QR Code</div>
        <button class="modal-close" on:click={close} aria-label="Close">✕</button>
      </div>

      <div class="content">
        <section class="panel">
          <div class="qr-content">
            <p class="description">
              Scan this QR code to share your favorites.
            </p>

            {#if qrCodeImage}
              <div class="qr-code-container" bind:this={qrContainer}>
                <img src={qrCodeImage} alt="Favorites QR Code" class="qr-image" />
              </div>
            {:else}
              <div class="loading">Generating QR code...</div>
            {/if}
          </div>
        </section>
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
    margin: 0 0.5rem;
    padding: 1rem 1.25rem;
    border-radius: 12px;
    position: relative;
    max-width: 500px;
    max-height: 80vh;
    width: 90%;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.625rem;
    position: sticky;
    top: 0;
    background: #fff;
    padding: 0.5rem 0;
    z-index: 1;
  }

  .modal-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.0;
  }

  .modal-close {
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

  .content {
    display: flex;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }

  .panel {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .qr-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .description {
    margin: 0;
    color: #666;
    line-height: 1.5;
    font-size: 0.95rem;
  }

  .qr-code-container {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
    padding: 1rem;
    margin-right: 0.5rem;
    background: rgba(0, 0, 0, 0.04);
    border-radius: 6px;
  }

  .qr-image {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
  }

  .loading {
    text-align: center;
    color: #999;
    padding: 2rem;
    font-style: italic;
  }
</style>
