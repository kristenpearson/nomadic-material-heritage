/* Nomadic Material Heritage — collection browser.
   Reads data/items.json (written by scripts/build_data.py) and shows the grid,
   the filters and the item view. Filters and the open item live in the web
   address, so any view can be shared. */

const PER_PAGE = 24;
const FEATURED_UID = "2021SG06-C04-1293";   // Unique ID of the home page photo

const CATEGORY_COLOURS = {
  "Syrmaq": ["#B8321F", "#fff"],
  "Tus Kiiz": ["#1E6B66", "#fff"],
  "Terme": ["#C98A12", "#1F1D1A"],
  "Skins & Leather": ["#1E2A4A", "#fff"],
  "Spindles": ["#4A7A2E", "#fff"],
  "Felt & Fibre": ["#5F7A6B", "#fff"],
  "Shi": ["#2F6D8F", "#fff"],
  "Craft Videos": ["#6A4A7A", "#fff"],
  "Interviews": ["#8A3B5C", "#fff"],
  "Behind The Scenes": ["#7D6340", "#fff"],
};

// buttons that are not a craft: shown in a lighter style
const UTILITY_BUTTONS = ["Craft Videos", "Interviews", "Behind The Scenes"];

// Button labels by language. The English name is the key used in the data,
// the spreadsheet and the web address; only the label changes.
const CATEGORY_LABELS = {
  kk: {
    "Syrmaq": "Сырмақ",
    "Tus Kiiz": "Тұс киіз",
    "Terme": "Терме",
    "Skins & Leather": "Тері мен былғары",
    "Spindles": "Ұршық",
    "Felt & Fibre": "Киіз бен талшық",
    "Shi": "Ши",
    "Craft Videos": "Қолөнер бейнелері",
    "Interviews": "Сұхбаттар",
    "Behind The Scenes": "Жұмыс барысы",
  },
  // Mongolian: machine translation, awaiting review
  mn: {
    "Syrmaq": "Сырмак",
    "Tus Kiiz": "Тус кииз",
    "Terme": "Терме",
    "Skins & Leather": "Арьс ширэн эдлэл",
    "Spindles": "Ээрүүл",
    "Felt & Fibre": "Эсгий ба утас",
    "Shi": "Ши",
    "Craft Videos": "Гар урлалын бичлэг",
    "Interviews": "Ярилцлага",
    "Behind The Scenes": "Ажлын явц",
  },
};

const STRINGS = {
  en: {
    all: "All", place: "All places", sum: "All sums", makers: "All makers",
    search_placeholder: "Search names, places, titles…",
    search_label: "Search the collection",
    cleared: "Search cleared",
    photographer: "All photographers", maker: "Maker", place_row: "Place",
    household_row: "Household", group: "Cultural group", date: "Date taken",
    unavailable: "Unavailable", photo_by: "Photo", video_by: "Film",
    contributors: "Contributors",
    licence: "Licence", showing: "Showing {n} items", showing_one: "Showing 1 item",
    of: "{n} of {m} in this view", copied: "Link copied",
    mt_notice: "Some of this page is translated automatically and is still being checked. " +
      "Corrections are welcome.", no_preview:
      "This item has no preview in the repository. Open it there to see the original.",
    page: "Page {n}", next_page: "Next →", prev_page: "← Previous",
    // what you are looking at, shown above the grid, and the empty state
    everything: "Show everything", only: "Show only {x}", remove: "Remove {x}",
    none_craft_place: "No {craft} from {place} yet.",
    none_for: "Nothing here for {what} yet.",
    not_ready: "This language is not ready yet, so the page is still in English. " +
      "Item titles appear in the language the repository recorded them in.",
  },
  // Kazakh: machine translation, corrected by Marima Khaumyen (September 2026)
  kk: {
    all: "Барлығы", place: "Мекендер", sum: "Сумындар",
    makers: "Шеберлер", photographer: "Фото түсірушілер",
    search_placeholder: "Есім, жер, атау бойынша іздеу…",
    search_label: "Жинақтан іздеу",
    maker: "Шеберлер", contributors: "Қатысушылар", place_row: "Жері",
    household_row: "Үй шаруашылығы", group: "Мәдени топ", date: "Түсірілген күні",
    unavailable: "Қолжетімсіз", photo_by: "Фото", video_by: "Бейне жазба",
    licence: "Лицензия",
    showing: "{n} бұйым көрсетілуде", showing_one: "Бір бұйым көрсетілуде",
    of: "осы көріністегі {m} бұйымдардың {n}-шісі", copied: "Сілтеме көшірілді",
    no_preview: "Бұл бұйымның қоймада алдын ала қарау нұсқасы жоқ. Түпнұсқаны қоймадан ашыңыз.",
    next_page: "Келесі →", prev_page: "← Алдыңғы",
    next: "Келесі →", previous: "← Алдыңғы",
    clear_filters: "Іріктеуді өшіру",
    browse_by_craft: "Қолөнер бойынша қарау",
    no_items: "Бұл іріктеуге сәйкес бұйым табылмады. Бір іріктеуді алып тастаңыз немесе «Барлығын» таңдаңыз.",
    copy_link: "Осы бұйымның сілтемесін көшіру",
    view_repository: "Британ мұражайының қоймасынан қарау ↗",
    skip: "Жинаққа өту",
    nav_collection: "Жинақ", nav_crafts: "Қолөнер", nav_makers: "Шеберлер",
    nav_community: "Қауымдастық пікірлері", nav_about: "Жоба туралы",
    hero_title: "Батыс Моңғолиядағы тоқыма және тері қолөнері",
    hero_blurb: "Баян-Өлгийдегі қазақ және урианхай шеберлері жасаған сырмақ, тұс киіз, терме және тері бұйымдарын құжаттаған суреттер, бейнелер мен сұхбаттар.",
    footer: "Материал Британ мұражайының Endangered Material Knowledge Programme бағдарламасынан алынған, Creative Commons BY-NC-SA 4.0 лицензиясымен. Әр бұйым түсірушісін көрсетеді және қоймадағы жазбасына сілтейді.",
    mt_notice: "Бұл беттің бір бөлігі автомат түрде аударылған және әлі тексерілуде. Түзетулерді қуана қабылдаймыз.",
    // machine translation, not yet reviewed
    everything: "Барлығын көрсету", only: "Тек {x} көрсету", remove: "{x} алып тастау",
    none_craft_place: "{place} жерінен {craft} әзірге жоқ.",
    none_for: "{what} бойынша әзірге ештеңе жоқ.",
  },
  // Mongolian: machine translation, partly corrected by Marima Khaumyen (September 2026)
  mn: {
    all: "Бүгд", place: "Бүх газар", sum: "Бүх сум",
    makers: "Бүх урлаач", photographer: "Бүх гэрэл зурагчин",
    search_placeholder: "Нэр, газар, гарчигаар хайх…",
    search_label: "Цуглуулгаас хайх",
    maker: "Урлаач", contributors: "Оролцогчид", place_row: "Газар",
    household_row: "Өрх", group: "Угсаатны бүлэг", date: "Авсан огноо",
    unavailable: "Байхгүй", photo_by: "Гэрэл зураг", video_by: "Бичлэг",
    licence: "Лиценз",
    showing: "{n} бүтээл харуулж байна", showing_one: "1 бүтээл харуулж байна",
    of: "энэ жагсаалтын {m}-аас {n} дэх", copied: "Холбоос хуулагдлаа",
    no_preview: "Энэ бүтээлд архивын урьдчилсан хувилбар байхгүй. Эх хувийг архиваас үзнэ үү.",
    next_page: "Дараах →", prev_page: "← Өмнөх",
    next: "Дараах →", previous: "← Өмнөх",
    clear_filters: "Шүүлтүүрийг арилгах",
    browse_by_craft: "Гар урлалаар үзэх",
    no_items: "Эдгээр шүүлтүүрт тохирох зүйл олдсонгүй. Нэг шүүлтүүрийг хасах эсвэл «Бүгд» сонгоно уу.",
    copy_link: "Энэ бүтээлийн холбоосыг хуулах",
    view_repository: "Британийн музейн архиваас үзэх ↗",
    skip: "Цуглуулга руу очих",
    nav_collection: "Цуглуулга", nav_crafts: "Гар урлал", nav_makers: "Урлаачид",
    nav_community: "Олон нийтийн хариу", nav_about: "Төслийн тухай",
    hero_title: "Баруун Монголын нэхмэл ба арьс ширний урлал",
    hero_blurb: "Баян-Өлгий аймгийн казах болон урианхай урлаачдын хийсэн сырмак, тус кииз, терме, арьс ширэн эдлэлийг баримтжуулсан гэрэл зураг, бичлэг, ярилцлага.",
    footer: "Материал Британийн музейн Endangered Material Knowledge Programme-аас авсан бөгөөд Creative Commons BY-NC-SA 4.0 лицензтэй. Бүтээл бүр гэрэл зурагчнаа заасан бөгөөд архив дахь бүртгэл рүү холбогдоно.",
    mt_notice: "Энэ хуудсын зарим хэсгийг машин орчуулгаар хөрвүүлсэн бөгөөд хянагдаж байна. Залруулгыг талархан хүлээн авна.",
    // machine translation, not yet reviewed
    everything: "Бүгдийг харуулах", only: "Зөвхөн {x} харуулах", remove: "{x} хасах",
    none_craft_place: "{place}-аас {craft} одоогоор алга.",
    none_for: "{what} гэсэн зүйл одоогоор алга.",
  },
};

const state = {
  lang: "en",
  items: [],
  categories: [],
  filtered: [],
  crafts: new Set(),
  q: "", sum: "", place: "", maker: "", photographer: "",
  page: 1,
  open: null,
};

const $ = (id) => document.getElementById(id);
const catLabel = (c) =>
  (CATEGORY_LABELS[state.lang] && CATEGORY_LABELS[state.lang][c]) || c;
const t = (key, vars) => {
  let s = (STRINGS[state.lang] && STRINGS[state.lang][key]) || STRINGS.en[key] || key;
  if (vars) for (const k in vars) s = s.replace("{" + k + "}", vars[k]);
  return s;
};
const text = (item, field) => {
  const v = item[field] || {};
  return v[state.lang] || v.en || "";
};

/* ---------------------------------------------------------------- start */
async function start() {
  try {
    const res = await fetch("data/items.json", { cache: "no-cache" });
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    state.items = data.items || [];
    state.categories = data.categories || Object.keys(CATEGORY_COLOURS);
  } catch (e) {
    $("grid").innerHTML =
      '<p class="empty">The collection could not be loaded just now. Please try again in a moment.</p>';
    return;
  }
  buildChips();
  buildSelects();
  readAddress();
  document.querySelectorAll("[data-lang]").forEach((b) =>
    b.addEventListener("click", () => setLanguage(b.dataset.lang)));
  $("reset").addEventListener("click", clearFilters);
  setUpClearers();
  $("close").addEventListener("click", closeItem);
  $("prev").addEventListener("click", () => step(-1));
  $("next").addEventListener("click", () => step(1));
  document.querySelectorAll("[data-nav]").forEach((b) =>
    b.addEventListener("click", () => step(b.dataset.nav === "next" ? 1 : -1)));
  $("copy").addEventListener("click", copyLink);
  $("overlay").addEventListener("click", (e) => { if (e.target === $("overlay")) closeItem(); });
  document.addEventListener("keydown", onKey);
  window.addEventListener("popstate", () => { readAddress(); apply(false); });
  apply(false);
}

/* ---------------------------------------------------------------- filters */
function buildChips() {
  const wrap = $("chips");
  wrap.innerHTML = "";
  wrap.appendChild(chip(t("all"), "", null));
  state.categories.forEach((c) => wrap.appendChild(chip(catLabel(c), c, CATEGORY_COLOURS[c])));
}

function chip(label, value, colours) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "chip" + (!value ? " util" : UTILITY_BUTTONS.includes(value) ? " kind" : "");
  b.innerHTML = escape(label) + (value ? '<span class="x" aria-hidden="true">\u00d7</span>' : "");
  b.dataset.craft = value;
  if (colours) {
    b.style.setProperty("--chip", colours[0]);
    b.style.setProperty("--chip-ink", colours[1]);
  }
  b.addEventListener("click", () => {
    if (!value) state.crafts.clear();
    else if (state.crafts.has(value)) state.crafts.delete(value);
    else state.crafts.add(value);
    state.page = 1;
    apply(true);
  });
  return b;
}

function buildSelects() {
  const sums = new Map(), makers = new Set(), photographers = new Set();
  state.places = new Map();
  state.items.forEach((i) => {
    const p = i.place || {};
    if (p.sum_key && !sums.has(p.sum_key)) sums.set(p.sum_key, p);
    // a smaller place counts even when only its Kazakh name is recorded
    if (p.key && (p.en || p.kk || p.mn) && !state.places.has(p.key)) state.places.set(p.key, p);
    if (i.maker) makers.add(i.maker);
    if (i.credit) photographers.add(i.credit);
  });
  fill($("sum"), t("sum"), [...sums.values()]
    .sort((a, b) => sumName(a).localeCompare(sumName(b)))
    .map((p) => [p.sum_key, [sumName(p), aimagName(p)].filter(Boolean).join(", ")]));
  fillPlaces();
  // the makers dropdown appears by itself once makers are filled in
  fill($("maker"), t("makers"), [...makers].sort().map((m) => [m, m]));
  $("maker").hidden = makers.size === 0;
  fill($("photographer"), t("photographer"), [...photographers].sort().map((p) => [p, p]));

  $("sum").addEventListener("change", () => {
    state.sum = $("sum").value;
    state.place = "";
    fillPlaces();
    state.page = 1;
    apply(true);
  });
  [["place", "place"], ["maker", "maker"], ["photographer", "photographer"]]
    .forEach(([id, key]) => $(id).addEventListener("change", () => {
      state[key] = $(id).value; state.page = 1; apply(true);
    }));

  let timer;
  $("q").addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      state.q = $("q").value.trim();
      state.page = 1;
      apply(false);
    }, 200);
  });
}

/* the second dropdown only lists places inside the chosen sum */
function fillPlaces() {
  const select = $("place");
  const inside = [...state.places.values()]
    .filter((p) => !state.sum || p.sum_key === state.sum)
    .sort((a, b) => placeName(a).localeCompare(placeName(b)));
  // sum, then any smaller place, then aimag — the order people say them in
  fill(select, t("place"), inside.map((p) => [p.key,
    [sumName(p), placeName(p), aimagName(p)].filter(Boolean).join(", ")]));
  select.value = state.place;
  select.disabled = inside.length === 0;
}

/* Place names are shown in the language chosen at the top of the page, falling
   back to English when that language has no name recorded. Searching is
   unaffected: the search box looks at every language at once. */
/* Names follow the language chosen at the top of the page, falling back to
   whatever the repository recorded when that language has no name. Searching
   is unaffected: the search box reads every language at once. */
function named(p, field) {
  if (!p) return "";
  const en = p[field.en] || "";
  const other = (state.lang === "kk" ? p[field.kk] : p[field.mn]) || "";
  if (state.lang === "en") return en || p[field.kk] || "";
  return other || en || p[field.kk] || "";
}

const SUM_FIELDS = { en: "sum", kk: "sum_kk", mn: "sum_mn" };
const PLACE_FIELDS = { en: "en", kk: "kk", mn: "mn" };
const AIMAG_FIELDS = { en: "aimag", kk: "aimag_kk", mn: "aimag_mn" };

const sumName = (p) => named(p, SUM_FIELDS);
const placeName = (p) => named(p, PLACE_FIELDS);
const aimagName = (p) => named(p, AIMAG_FIELDS);

function fill(select, blank, pairs) {
  const current = select.value;
  select.innerHTML = "";
  const o = document.createElement("option");
  o.value = ""; o.textContent = blank;
  select.appendChild(o);
  pairs.forEach(([value, label]) => {
    const opt = document.createElement("option");
    opt.value = value; opt.textContent = label;
    select.appendChild(opt);
  });
  select.value = current;
}

/* the full place, as written on an item: place, sum, aimag */
function placeLabel(p) {
  if (!p) return "";
  return [sumName(p), placeName(p), aimagName(p)].filter(Boolean).join(", ");
}

function clearFilters() {
  state.crafts.clear();
  state.q = state.sum = state.place = state.maker = state.photographer = "";
  $("q").value = "";
  $("sum").value = $("maker").value = $("photographer").value = "";
  fillPlaces();
  state.page = 1;
  apply(true);
}

/* ---------------------------------------------------------------- address */
function readAddress() {
  const p = new URLSearchParams(location.search);
  state.crafts = new Set((p.get("craft") || "").split(",").filter(Boolean));
  state.q = p.get("q") || "";
  state.sum = p.get("sum") || "";
  state.place = p.get("place") || "";
  state.maker = p.get("maker") || "";
  state.photographer = p.get("photographer") || "";
  state.page = Math.max(1, parseInt(p.get("page") || "1", 10) || 1);
  state.open = p.get("item") || null;
  const lang = p.get("lang");
  if (lang && STRINGS[lang]) state.lang = lang;
  $("q").value = state.q;
  $("sum").value = state.sum;
  if (state.items.length) fillPlaces();
  $("place").value = state.place;
  $("maker").value = state.maker;
  $("photographer").value = state.photographer;
}

function writeAddress(push) {
  const p = new URLSearchParams();
  if (state.crafts.size) p.set("craft", [...state.crafts].join(","));
  if (state.q) p.set("q", state.q);
  if (state.sum) p.set("sum", state.sum);
  if (state.place) p.set("place", state.place);
  if (state.maker) p.set("maker", state.maker);
  if (state.photographer) p.set("photographer", state.photographer);
  if (state.page > 1) p.set("page", state.page);
  if (state.open) p.set("item", state.open);
  if (state.lang !== "en") p.set("lang", state.lang);
  const url = location.pathname + (p.toString() ? "?" + p : "");
  if (push) history.pushState({}, "", url);
  else history.replaceState({}, "", url);
}

/* ---------------------------------------------------------------- search */
/* Accents and case are ignored, so "Olgii" finds "Ölgii". Every word typed
   must appear somewhere in the item, in any order. */
function flatten(value) {
  return String(value || "").toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function searchWords(q) {
  return flatten(q).split(/\s+/).filter(Boolean);
}

function haystack(item) {
  if (!item._hay) {
    const p = item.place || {};
    item._hay = flatten([
      item.title.en, item.title.kk, item.title.mn,
      item.description.en, item.description.kk, item.description.mn,
      item.maker, item.contributors, item.household, item.credit,
      p.en, p.kk, p.mn, p.sum, p.sum_kk, p.sum_mn, p.aimag, p.aimag_kk,
      item.cultural_group, item.date, item.uid, item.categories.join(" "),
    ].filter(Boolean).join(" \u00b7 "));
  }
  return item._hay;
}

function matches(item, needles) {
  const hay = haystack(item);
  return needles.every((w) => hay.includes(w));
}

/* ---------------------------------------------------------------- what you are looking at */
/* Everything currently narrowing the grid, as a list of things the visitor
   chose, each with a way to undo just that one. */
function activeFacets() {
  const f = [];
  if (state.crafts.size) {
    const crafts = [...state.crafts];
    f.push({
      kind: "craft",
      label: crafts.map(catLabel).join(", "),
      clear: () => state.crafts.clear(),
    });
  }
  if (state.place) {
    const p = state.places && state.places.get(state.place);
    f.push({
      kind: "place",
      label: p ? (placeName(p) || sumName(p)) : state.place,
      clear: () => { state.place = ""; },
    });
  } else if (state.sum) {
    const p = [...(state.places ? state.places.values() : [])]
      .find((x) => x.sum_key === state.sum) ||
      (state.items.find((i) => i.place && i.place.sum_key === state.sum) || {}).place;
    f.push({
      kind: "place",
      label: p ? sumName(p) : state.sum,
      clear: () => { state.sum = ""; state.place = ""; },
    });
  }
  if (state.maker) f.push({ kind: "maker", label: state.maker, clear: () => { state.maker = ""; } });
  if (state.photographer) {
    f.push({ kind: "photographer", label: state.photographer,
      clear: () => { state.photographer = ""; } });
  }
  if (state.q) f.push({ kind: "q", label: "\u201c" + state.q + "\u201d", clear: () => { state.q = ""; } });
  return f;
}

/* Put the dropdowns and search box back in step with the state, then redraw. */
function syncControls() {
  $("q").value = state.q;
  $("sum").value = state.sum;
  $("maker").value = state.maker;
  $("photographer").value = state.photographer;
  fillPlaces();
  state.page = 1;
  apply(true);
}

function keepOnly(facet) {
  activeFacets().forEach((f) => { if (f !== facet) f.clear(); });
  syncControls();
}

function setUpClearers() {
  // a small × beside each dropdown, shown only while something is chosen
  [["sum", () => { state.sum = ""; state.place = ""; }],
   ["place", () => { state.place = ""; }],
   ["maker", () => { state.maker = ""; }],
   ["photographer", () => { state.photographer = ""; }]].forEach(([id, clear]) => {
    const select = $(id);
    if (select.nextElementSibling && select.nextElementSibling.classList.contains("unpick")) return;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "unpick";
    b.dataset.for = id;
    b.hidden = true;
    b.innerHTML = '<span aria-hidden="true">\u00d7</span>';
    b.addEventListener("click", () => { clear(); syncControls(); });
    select.insertAdjacentElement("afterend", b);
  });
  const css = document.createElement("style");
  css.textContent = `
    .chip .x { display: none; margin-left: .45em; font-weight: 600; }
    .chip[aria-pressed="true"] .x { display: inline; }
    .unpick { font: inherit; line-height: 1; cursor: pointer; margin-left: .25rem; padding: .25em .55em;
      border-radius: 999px; border: 1px solid currentColor; background: transparent; color: inherit; }
    .unpick:hover { background: rgba(0,0,0,.06); }
    .empty-choices { display: flex; flex-wrap: wrap; gap: .5rem; justify-content: center; margin-top: .75rem; }
    .empty-choices button { font: inherit; line-height: 1.2; cursor: pointer; padding: .3em .8em;
      border-radius: 999px; border: 1px solid currentColor; background: transparent; color: inherit; }
    .empty-choices button:hover { background: rgba(0,0,0,.06); }
  `;
  document.head.appendChild(css);
}

function drawClearers() {
  document.querySelectorAll(".unpick").forEach((b) => {
    const select = $(b.dataset.for);
    b.hidden = !select.value || select.hidden || select.disabled;
    b.setAttribute("aria-label", t("remove", { x: select.options[select.selectedIndex]
      ? select.options[select.selectedIndex].textContent : "" }));
  });
  const reset = $("reset");
  reset.textContent = t("everything");
  reset.hidden = activeFacets().length === 0;
}

/* When nothing matches: say what was asked for, in plain words, and offer
   the ways out as choices rather than asking anyone to "clear filters". */
function drawEmpty() {
  const box = $("empty");
  const facets = activeFacets();
  box.innerHTML = "";
  const p = document.createElement("p");
  const craft = facets.find((f) => f.kind === "craft");
  const place = facets.find((f) => f.kind === "place");
  if (facets.length === 2 && craft && place) {
    p.textContent = t("none_craft_place", { craft: craft.label, place: place.label });
  } else if (facets.length) {
    p.textContent = t("none_for", { what: facets.map((f) => f.label).join(" \u00b7 ") });
  } else {
    p.textContent = t("no_items");
  }
  box.appendChild(p);
  if (!facets.length) return;
  const choices = document.createElement("div");
  choices.className = "empty-choices";
  if (facets.length > 1) {
    facets.forEach((f) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = t("only", { x: f.label });
      b.addEventListener("click", () => keepOnly(f));
      choices.appendChild(b);
    });
  }
  const all = document.createElement("button");
  all.type = "button";
  all.textContent = t("everything");
  all.addEventListener("click", clearFilters);
  choices.appendChild(all);
  box.appendChild(choices);
}

/* ---------------------------------------------------------------- render */
function apply(push) {
  const needles = searchWords(state.q);
  state.filtered = state.items.filter((i) =>
    (!state.crafts.size || i.categories.some((c) => state.crafts.has(c))) &&
    (!state.sum || (i.place && i.place.sum_key === state.sum)) &&
    (!state.place || (i.place && i.place.key === state.place)) &&
    (!state.maker || i.maker === state.maker) &&
    (!state.photographer || i.credit === state.photographer) &&
    (!needles.length || matches(i, needles)));

  const pages = Math.max(1, Math.ceil(state.filtered.length / PER_PAGE));
  if (state.page > pages) state.page = pages;

  document.querySelectorAll(".chip").forEach((b) => {
    const v = b.dataset.craft;
    b.setAttribute("aria-pressed", v ? state.crafts.has(v) : state.crafts.size === 0);
  });

  const n = state.filtered.length;
  $("count").textContent = n === 1 ? t("showing_one") : t("showing", { n });
  drawClearers();
  $("hero").hidden = state.crafts.size > 0 || !!state.q || !!state.sum || !!state.place ||
    !!state.maker || !!state.photographer || state.page > 1;

  drawGrid();
  drawPager(pages);
  writeAddress(push);
  if (state.open) showItem(state.open, false); else closeItem(false);
}

function drawGrid() {
  const grid = $("grid");
  grid.innerHTML = "";
  const slice = state.filtered.slice((state.page - 1) * PER_PAGE, state.page * PER_PAGE);
  $("empty").hidden = slice.length > 0;
  if (!slice.length) drawEmpty();

  slice.forEach((item) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "card";
    const frame = document.createElement("div");
    frame.className = "frame";
    if (item.grid) {
      const img = document.createElement("img");
      img.src = item.grid;
      img.alt = text(item, "title");
      img.loading = "lazy";
      img.decoding = "async";
      frame.appendChild(img);
    } else {
      const p = document.createElement("p");
      p.className = "missing";
      p.textContent = text(item, "title");
      frame.appendChild(p);
    }
    if (item.type === "video") {
      const badge = document.createElement("span");
      badge.className = "play";
      badge.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.5v11l9-5.5z" fill="#171A2B"/></svg>';
      frame.appendChild(badge);
    }
    const title = document.createElement("span");
    title.className = "title";
    title.textContent = text(item, "title");
    const meta = document.createElement("span");
    meta.className = "meta";
    const by = item.type === "video" ? t("video_by") : t("photo_by");
    const where = item.place ? (placeName(item.place) || sumName(item.place)) : "";
    meta.textContent = [where, catLabel(item.categories[0] || ""), item.credit && `${by}: ${item.credit}`]
      .filter(Boolean).join(" · ");
    card.append(frame, title, meta);
    card.addEventListener("click", () => showItem(item.uid, true));
    grid.appendChild(card);
  });

  if (!$("hero").hidden) {
    const featured = state.items.find((i) => i.uid === FEATURED_UID) ||
      state.items.find((i) => i.type === "photo" && i.grid);
    if (featured) {
      const img = $("hero-img");
      img.src = featured.grid || featured.preview;
      // phones load the small grid image; wide screens the large preview
      if (featured.preview && featured.grid) {
        img.srcset = `${featured.grid} 700w, ${featured.preview} 2000w`;
        img.sizes = "100vw";
      }
      img.alt = text(featured, "title");
      const credit = $("hero-credit");
      if (credit) {
        const by = featured.type === "video" ? t("video_by") : t("photo_by");
        credit.textContent = featured.credit
          ? `${text(featured, "title")} · ${by}: ${featured.credit}` : "";
      }
    }
  }
}

function drawPager(pages) {
  const pager = $("pager");
  pager.innerHTML = "";
  if (pages < 2) return;
  const go = (n) => { state.page = n; apply(true); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const button = (label, n, current) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    if (current) b.setAttribute("aria-current", "page");
    b.addEventListener("click", () => go(n));
    return b;
  };
  const dots = () => {
    const s = document.createElement("span");
    s.className = "dots"; s.textContent = "…";
    return s;
  };
  if (state.page > 1) pager.appendChild(button(t("prev_page"), state.page - 1));
  const near = new Set([1, pages, state.page, state.page - 1, state.page + 1]);
  let last = 0;
  [...near].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b).forEach((n) => {
    if (n - last > 1) pager.appendChild(dots());
    pager.appendChild(button(String(n), n, n === state.page));
    last = n;
  });
  if (state.page < pages) pager.appendChild(button(t("next_page"), state.page + 1));
}

/* ---------------------------------------------------------------- item view */
function showItem(uid, push) {
  const index = state.filtered.findIndex((i) => i.uid === uid);
  const item = index >= 0 ? state.filtered[index] : state.items.find((i) => i.uid === uid);
  if (!item) return;
  state.open = uid;

  const stage = $("stage");
  [...stage.querySelectorAll("img, video, iframe, .fallback")].forEach((el) => el.remove());
  if (item.type === "video" && item.preview) {
    const v = document.createElement("video");
    v.src = item.preview;
    v.controls = true;
    v.playsInline = true;
    if (item.poster) v.poster = item.poster;
    stage.appendChild(v);
  } else if (item.type === "photo" && item.preview) {
    const img = document.createElement("img");
    img.src = item.preview;
    img.alt = text(item, "title");
    stage.appendChild(img);
  } else if (item.embed) {
    const frame = document.createElement("iframe");
    frame.src = item.embed;
    frame.title = text(item, "title");
    frame.allowFullscreen = true;
    stage.appendChild(frame);
  } else {
    const p = document.createElement("p");
    p.className = "fallback";
    p.textContent = t("no_preview");
    stage.appendChild(p);
  }

  const cat = item.categories[0];
  const tag = $("item-cat");
  tag.textContent = cat ? catLabel(cat) : "";
  tag.hidden = !cat;
  if (cat && CATEGORY_COLOURS[cat]) {
    tag.style.background = CATEGORY_COLOURS[cat][0];
    tag.style.color = CATEGORY_COLOURS[cat][1];
  }

  $("item-title").textContent = text(item, "title");
  const desc = text(item, "description");
  $("item-desc").textContent = desc;
  $("item-desc").hidden = !desc;

  const rows = [
    [t("maker"), item.maker || t("unavailable")],
    [t("contributors"), item.contributors],
    [t("place_row"), placeLabel(item.place)],
    [t("household_row"), item.household],
    [t("group"), item.cultural_group],
    [t("date"), item.date],
  ].filter(([, v]) => v);
  $("item-rows").innerHTML = rows.map(([k, v]) =>
    `<div><dt>${escape(k)}</dt><dd>${escape(v)}</dd></div>`).join("");

  const by = item.type === "video" ? t("video_by") : t("photo_by");
  $("item-credit").innerHTML =
    `${escape(by)}: <strong>${escape(item.credit || "")}</strong><br>${escape(t("licence"))}: ` +
    `<a href="${escape(item.licence.url || "#")}" target="_blank" rel="noopener">${escape(item.licence.name || "")}</a>` +
    " · EMKP, British Museum";

  $("item-doi").href = item.doi_url || item.repository_url || "#";
  $("counter").textContent = index >= 0
    ? t("of", { n: index + 1, m: state.filtered.length }) : "";
  $("prev").hidden = $("next").hidden = index < 0;

  $("overlay").hidden = false;
  document.body.style.overflow = "hidden";
  $("close").focus();
  writeAddress(push);
}

function step(delta) {
  const index = state.filtered.findIndex((i) => i.uid === state.open);
  if (index < 0) return;
  const next = (index + delta + state.filtered.length) % state.filtered.length;
  showItem(state.filtered[next].uid, false);
}

function closeItem(push) {
  const overlay = $("overlay");
  if (overlay.hidden) return;
  overlay.hidden = true;
  [...$("stage").querySelectorAll("img, video, iframe, .fallback")].forEach((el) => el.remove());
  document.body.style.overflow = "";
  if (push !== false) { state.open = null; writeAddress(true); }
}

function onKey(e) {
  if ($("overlay").hidden) return;
  if (e.key === "Escape") closeItem();
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(location.href);
    $("copy").textContent = t("copied");
    setTimeout(() => { $("copy").textContent = t("copy_link") || "Copy link to this item"; }, 2000);
  } catch (e) { /* some browsers refuse; the address bar still holds the link */ }
}

/* ---------------------------------------------------------------- language */
function setLanguage(lang) {
  state.lang = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-lang]").forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
  document.querySelectorAll("[data-t-placeholder]").forEach((el) => {
    const s2 = STRINGS[lang] && STRINGS[lang][el.dataset.tPlaceholder];
    if (s2) el.placeholder = s2;
  });
  document.querySelectorAll("[data-t]").forEach((el) => {
    const key = el.dataset.t;
    const s = STRINGS[lang] && STRINGS[lang][key];
    if (s) el.textContent = s;
  });
  const notice = $("translation-notice");
  if (notice) {
    const translated = Object.keys(STRINGS[lang] || {}).length > 0;
    notice.hidden = lang === "en";
    notice.textContent = translated ? t("mt_notice") : STRINGS.en.not_ready;
  }
  buildChips();
  buildSelects();
  apply(true);
}

function escape(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

start();
