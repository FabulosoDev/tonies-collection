<script context="module">
  const KEY = "tonies-collection.filters.v1";
  const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

  export function loadFilters() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const { savedAt, data } = JSON.parse(raw);
      if (!savedAt || Date.now() - savedAt > TTL_MS) return null;
      return data ?? null;
    } catch {
      return null;
    }
  }

  export function saveFilters(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify({ savedAt: Date.now(), data }));
    } catch {
      /* ignore */
    }
  }

  export function clearFilters() {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }

  export function debounce(fn, wait = 150) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }
</script>
