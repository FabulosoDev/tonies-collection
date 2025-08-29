<script>
  import { onMount } from "svelte";
  import Header from "./lib/Header.svelte";
  import Grid from "./lib/Grid.svelte";
  import Modal from "./lib/Modal.svelte";

  let cards = [];
  let open = false;
  let selected = null;

    // Filtering and mapping logic merged here
  function isModelAllowed(model) {
    model = String(model ?? "").trim();
    return (
      model &&
      /^[0-9-]+$/.test(model) &&
      ((model.includes("-") && !/^(09|10|99)/.test(model)) ||
        (!model.includes("-") && model.startsWith("1")))
    );
  }

  function isCategoryAllowed(category) {
    category = String(category ?? "").trim();
    return category && category !== "creative-tonie";
  }

  onMount(async () => {
    try {
      const [catalogRes, ownedRes] = await Promise.all([
        fetch(import.meta.env.BASE_URL + 'data/tonies.json', { cache: 'no-store' }),
        fetch(import.meta.env.BASE_URL + 'data/owned.json', { cache: 'no-store' })
      ]);
      let catalog = await catalogRes.json();
      let owned = await ownedRes.json();
      cards = catalog
        .filter(item =>
          isModelAllowed(item.model) &&
          isCategoryAllowed(item.category)
        )
        .map(card => ({
          ...card,
          owned: owned.some(o => o.model === card.model)
        }))
        .filter(card =>
          card.language === "de-de" &&
          !card.owned &&
          Number(card.release) > 1704063599
        )
        .sort((a, b) => Number(b.release) - Number(a.release));
    } catch (e) {
      cards = [];
    }
  });

  function onSelect(e) {
    selected = e.detail; // the clicked card
    open = true;
  }
</script>

<div class="container">
  <!--<Header/>-->
  <main>
    <Grid items={cards} on:select={onSelect} />
    <Modal open={open} card={selected} on:close={() => { open = false; selected = null; }} />
  </main>
</div>

<style>
  .container {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 1.25rem;
  }
</style>
