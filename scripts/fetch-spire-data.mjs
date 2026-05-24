import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE_URL = "https://spire-codex.com";
const CLASS_COLORS = ["ironclad", "silent", "defect", "regent", "necrobinder"];

function absoluteUrl(value) {
  if (!value) return null;
  return new URL(value, BASE_URL).href;
}

async function getJson(url) {
  const response = await fetch(url, {
    headers: { "user-agent": "slaythespire2-build-portal/1.0" },
  });
  if (!response.ok) {
    throw new Error(`Failed ${response.status} ${response.statusText}: ${url}`);
  }
  return response.json();
}

async function getText(url) {
  const response = await fetch(url, {
    headers: { "user-agent": "slaythespire2-build-portal/1.0" },
  });
  if (!response.ok) {
    throw new Error(`Failed ${response.status} ${response.statusText}: ${url}`);
  }
  return response.text();
}

function extractBracketedJson(text, startIndex, openChar, closeChar) {
  let start = startIndex;
  while (start < text.length && text[start] !== openChar) start++;
  if (start >= text.length) {
    throw new Error(`Could not find ${openChar} after index ${startIndex}`);
  }

  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let index = start; index < text.length; index++) {
    const char = text[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') inString = true;
    else if (char === openChar) depth++;
    else if (char === closeChar) {
      depth--;
      if (depth === 0) return text.slice(start, index + 1);
    }
  }

  throw new Error(`Could not find closing ${closeChar}`);
}

function extractNextFlightStrings(html) {
  return [
    ...html.matchAll(
      /self\.__next_f\.push\(\[1,"((?:\\.|[^"\\])*)"\]\)<\/script>/g,
    ),
  ].map((match) => JSON.parse(`"${match[1]}"`));
}

async function getSpanishCardMap() {
  const html = await getText(`${BASE_URL}/spa/cards`);
  const flight = extractNextFlightStrings(html).find((chunk) =>
    chunk.includes('"initialCards":'),
  );
  if (!flight) {
    throw new Error(
      "Could not find Spanish initialCards data in Spire Codex HTML",
    );
  }

  const marker = '"initialCards":';
  const start = flight.indexOf(marker) + marker.length;
  const cards = JSON.parse(extractBracketedJson(flight, start, "[", "]"));
  return new Map(
    cards.map((card) => [
      card.id,
      {
        name: card.name,
        description: card.description,
        upgrade_description: card.upgrade_description,
        type: card.type,
        type_key: card.type_key,
        rarity: card.rarity,
        rarity_key: card.rarity_key,
      },
    ]),
  );
}

const charactersRaw = await getJson(`${BASE_URL}/api/characters`);
const spanishCardsById = await getSpanishCardMap();
const allCardsRaw = await getJson(`${BASE_URL}/api/cards`);
const characters = charactersRaw
  .map((character) => ({
    id: character.id,
    name: character.name,
    description: character.description,
    starting_hp: character.starting_hp,
    starting_gold: character.starting_gold,
    max_energy: character.max_energy,
    orb_slots: character.orb_slots,
    starting_deck: character.starting_deck,
    starting_relics: character.starting_relics,
    unlocks_after: character.unlocks_after,
    gender: character.gender,
    color: character.color,
    image_url: absoluteUrl(character.image_url),
  }))
  .sort(
    (a, b) =>
      CLASS_COLORS.indexOf(a.id.toLowerCase()) -
      CLASS_COLORS.indexOf(b.id.toLowerCase()),
  );

function mapCard(card) {
  return {
    id: card.id,
    name: card.name,
    description: card.description,
    cost: card.cost,
    is_x_cost: card.is_x_cost,
    is_x_star_cost: card.is_x_star_cost,
    star_cost: card.star_cost,
    type: card.type,
    rarity: card.rarity,
    target: card.target,
    color: card.color,
    damage: card.damage,
    block: card.block,
    hit_count: card.hit_count,
    powers_applied: card.powers_applied,
    cards_draw: card.cards_draw,
    energy_gain: card.energy_gain,
    hp_loss: card.hp_loss,
    keywords: card.keywords,
    tags: card.tags,
    spawns_cards: card.spawns_cards,
    upgrade_description: card.upgrade_description,
    image_url: absoluteUrl(card.image_url),
    beta_image_url: absoluteUrl(card.beta_image_url),
    compendium_order: card.compendium_order,
    localized: {
      es: spanishCardsById.get(card.id) || null,
    },
  };
}

const allCards = allCardsRaw.map(mapCard);
const cardsByClass = {};
for (const color of CLASS_COLORS) {
  cardsByClass[color] = allCards.filter((card) => card.color === color);
}

const payload = {
  fetchedAt: new Date().toISOString(),
  source: {
    name: "Spire Codex",
    cards: `${BASE_URL}/api/cards`,
    classCards: `${BASE_URL}/api/cards?color={class}`,
    characters: `${BASE_URL}/api/characters`,
    spanishCards: `${BASE_URL}/spa/cards`,
    website: BASE_URL,
  },
  characters,
  allCards,
  cardsByClass,
};

const outputPath = path.join(process.cwd(), "src", "data", "spire-data.json");
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

console.log(`Wrote ${outputPath}`);
for (const [color, cards] of Object.entries(cardsByClass)) {
  console.log(`${color}: ${cards.length} cards`);
}
console.log(`All cards: ${allCards.length}`);
console.log(`Spanish translations: ${spanishCardsById.size} cards`);
