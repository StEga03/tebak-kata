import type { Card, Deck } from './types'

export type Rng = () => number

/** Fisher-Yates. `rng` dioper dari luar supaya bisa dites deterministik. */
export function shuffle(cards: Card[], rng: Rng): Card[] {
  const result = [...cards]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function createDeck(cards: Card[], rng: Rng): Deck {
  return { order: shuffle(cards, rng), cursor: 0 }
}

/**
 * Tarik kartu berikutnya. Cursor hidup di level sesi (bukan ronde), jadi tim
 * berikutnya lanjut dari posisi terakhir — nggak ada yang dapat kartu bekas tim lain.
 * Kalau tumpukan mentok, shuffle ulang semuanya dan mulai dari awal.
 */
export function draw(deck: Deck, rng: Rng): { card: Card; deck: Deck } {
  if (deck.cursor >= deck.order.length) {
    const reshuffled = shuffle(deck.order, rng)
    return { card: reshuffled[0], deck: { order: reshuffled, cursor: 1 } }
  }
  return {
    card: deck.order[deck.cursor],
    deck: { order: deck.order, cursor: deck.cursor + 1 },
  }
}
