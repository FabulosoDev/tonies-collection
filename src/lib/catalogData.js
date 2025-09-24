const CATALOG_URL = "https://raw.githubusercontent.com/toniebox-reverse-engineering/tonies-json/release/toniesV2.json";
const COLLECTED_REL_PATH = "data/collected.json";
const IGNORED_REL_PATH = "data/ignored.json";

function isModelAllowed(item) {
  const model = String(item.article ?? "").trim();
  return (
    model &&
    /^[0-9-]+$/.test(model) &&
    ((model.includes("-") && !/^(09|10|99)/.test(model)) ||
      (!model.includes("-") && model.startsWith("1")))
  );
}

function isCategoryAllowed(item) {
  const category = String(item.data[0].category ?? "").trim();
  return category && category !== "creative-tonie";
}

const baseFilter = (item) =>
  isModelAllowed(item) && isCategoryAllowed(item);

function annotateCollected(collection, collectedList) {
  const set = new Set((collectedList ?? []).map(v => String(typeof v === "string" ? v : v?.model)));
  return collection.map((card) => ({ ...card, collected: set.has(String(card.article)) }));
}

function sortByReleaseDesc(a, b) {
  return Number(b.data[0].release) - Number(a.data[0].release);
}

async function fetchJSON(url, init) {
  const res = await fetch(url, { cache: "no-store", ...init });
  if (!res.ok) throw new Error(`Failed to fetch ${url} (${res.status})`);
  return res.json();
}

export async function loadCards() {
  const [catalogRaw, collectedRaw, ignoredRaw] = await Promise.all([
    fetchJSON(CATALOG_URL),
    fetchJSON((import.meta.env?.BASE_URL ?? "/") + COLLECTED_REL_PATH),
    fetchJSON((import.meta.env?.BASE_URL ?? "/") + IGNORED_REL_PATH),
  ]);

  const catalog = Array.isArray(catalogRaw) ? catalogRaw : (catalogRaw.items ?? []);
  const collected = collectedRaw ?? [];
  const ignored = Array.isArray(ignoredRaw) ? ignoredRaw : [];

  const ignoredSet = new Set(
    ignored.map((m) => String(m).trim()).filter(Boolean)
  );

  const filtered = catalog
    .filter(baseFilter)
    .filter((item) => !ignoredSet.has(String(item.article).trim()));

  return annotateCollected(filtered, collected).sort(sortByReleaseDesc);
}
