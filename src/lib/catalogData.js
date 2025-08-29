const TONIES_JSON_URL = "https://raw.githubusercontent.com/toniebox-reverse-engineering/tonies-json/release/tonies.json";
const OWNED_REL_PATH = "data/owned.json";
const IGNORED_REL_PATH = "data/ignored.json";

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

const baseFilter = (item) =>
  isModelAllowed(item.model) && isCategoryAllowed(item.category);

function annotateOwned(catalog, ownedList) {
  const set = new Set((ownedList ?? []).map((o) => String(o.model)));
  return catalog.map((card) => ({ ...card, owned: set.has(String(card.model)) }));
}

function sortByReleaseDesc(a, b) {
  return Number(b.release) - Number(a.release);
}

function getBaseUrl() {
  return import.meta.env?.BASE_URL ?? "/";
}

async function fetchJSON(url, init) {
  const res = await fetch(url, { cache: "no-store", ...init });
  if (!res.ok) throw new Error(`Failed to fetch ${url} (${res.status})`);
  return res.json();
}

export async function loadCards() {
  const [catalogRaw, ownedRaw, ignoredRaw] = await Promise.all([
    fetchJSON(TONIES_JSON_URL),
    fetchJSON(getBaseUrl() + OWNED_REL_PATH),
    fetchJSON(getBaseUrl() + IGNORED_REL_PATH),
  ]);

  const catalog = Array.isArray(catalogRaw) ? catalogRaw : (catalogRaw.items ?? []);
  const owned   = ownedRaw   ?? [];
  const ignored = Array.isArray(ignoredRaw) ? ignoredRaw : [];

  const ignoredSet = new Set(
    ignored.map((m) => String(m).trim()).filter(Boolean)
  );

  const filtered = catalog
    .filter(baseFilter)
    .filter((item) => !ignoredSet.has(String(item.model).trim()));

  return annotateOwned(filtered, owned).sort(sortByReleaseDesc);
}
