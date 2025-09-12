<script context="module">
  const KEY = "tonies-collection.favorites.v1";

  export function loadFavorites() {
    try {
        return new Set(JSON.parse(localStorage.getItem(KEY) || "[]"));
    } catch {
        return new Set();
    }
  }

  export function saveFavorites(set) {
    try {
        localStorage.setItem(KEY, JSON.stringify([...set]));
    } catch {
      /* ignore */
    }
  }

  export function toggleFavorite(set, model) {
    const s = new Set(set);
    if (s.has(model))
        s.delete(model);
    else
        s.add(model);
    saveFavorites(s);
    return s;
  }
</script>
