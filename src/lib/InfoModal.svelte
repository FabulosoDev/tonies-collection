<script>
  import { createEventDispatcher } from "svelte";

  export let open = false;

  const dispatch = createEventDispatcher();
  const close = () => dispatch("close");

  function onKeydown(e) {
    if (e.key === "Escape") close();
  }
</script>

<svelte:window on:keydown={onKeydown} />

{#if open}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal-backdrop" on:click|self={close}>
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">Search Query Filters</div>
        <button class="modal-close" on:click={close} aria-label="Close">✕</button>
      </div>

      <div class="content">
        <section class="panel">
          <div class="help-content">
            <section>
              <p>Use these special syntaxes in the search box to filter by specific criteria:</p>

              <div class="filter-item">
                <h4>Age Filter</h4>
                <code>a:5</code> - Find items for age 5<br>
                <code>a:&gt;=3</code> - Age greater than or equal to 3<br>
                <code>a:&lt;=6</code> - Age less than or equal to 6<br>
                <code>a:&gt;2</code> - Age greater than 2<br>
                <code>a:&lt;8</code> - Age less than 8
              </div>

              <div class="filter-item">
                <h4>Release Date Filter</h4>
                <code>r:1672531200</code> - Find items released on Jan 1, 2023 (Unix timestamp)<br>
                <code>r:&gt;=1577836800</code> - Released on or after Jan 1, 2020<br>
                <code>r:&lt;=1704067200</code> - Released on or before Jan 1, 2024<br>
                <code>r:&gt;1577836799</code> - Released after Dec 31, 2019<br>
                <code>r:&lt;1704067201</code> - Released before Jan 2, 2024
              </div>

              <div class="filter-item">
                <h4>Runtime Filter</h4>
                <code>t:30</code> - Find items with 30 minutes runtime<br>
                <code>t:&gt;=20</code> - Runtime 20+ minutes<br>
                <code>t:&lt;=45</code> - Runtime 45 minutes or less<br>
                <code>t:&gt;15</code> - Runtime longer than 15 minutes<br>
                <code>t:&lt;60</code> - Runtime shorter than 60 minutes
              </div>

              <div class="filter-item">
                <h4>Items without IDs</h4>
                <code>noids</code> - Find items that don't have any audio IDs assigned
              </div>
            </section>

            <section>
              <h3>Visual Filters</h3>
              <p>Additional filters available in the filters panel:</p>

              <div class="filter-item">
                <h4>Date Range</h4>
                <p>Filter items by their release date range using the date picker.</p>
              </div>

              <div class="filter-item">
                <h4>Language</h4>
                <p>Filter by the language of the content (German, English, French, etc.).</p>
              </div>

              <div class="filter-item">
                <h4>Collection Status</h4>
                <p>Filter by whether you have collected the item or not.</p>
              </div>

              <div class="filter-item">
                <h4>Favorites</h4>
                <p>Filter by your starred/favorite items.</p>
              </div>
            </section>

            <section>
              <h3>Regular Search</h3>
              <p>When not using special syntax, the search looks through:</p>
              <ul>
                <li>Episode titles</li>
                <li>Series names</li>
                <li>Article/model numbers</li>
                <li>Audio IDs</li>
                <li>Hash values</li>
              </ul>
            </section>
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
    max-width: 600px;
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
  }
  .panel {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 0;
    overflow-y: auto;
  }

  .modal-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.0;
    position: sticky;
    top: 0;
    left: 0;
    background: #fff;
    z-index: 1;
  }

  .help-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .help-content section {
    margin-bottom: 0;
  }

  .help-content h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
  }

  .help-content p {
    margin: 0 0 1rem 0;
    color: #666;
    line-height: 1.5;
  }

  .filter-item {
    margin-bottom: 1rem;
    padding: 1rem;
    margin-right: 0.5rem;
    background: rgba(0, 0, 0, 0.04);
    border-radius: 6px;
    border-left: 4px solid #333;
  }

  .filter-item h4 {
    margin: 0 0 0.5rem 0;
    color: #333;
    font-size: 1rem;
    font-weight: 600;
  }

  .filter-item code {
    background: #e9ecef;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
      "Liberation Mono", "Courier New", monospace;
    font-size: 0.9em;
    color: #333;
  }

  .filter-item br {
    margin-bottom: 0.25rem;
  }

  .help-content ul {
    margin: 0 0 1rem 0;
    padding-left: 1.5rem;
  }

  .help-content li {
    margin-bottom: 0.25rem;
    color: #666;
  }
</style>