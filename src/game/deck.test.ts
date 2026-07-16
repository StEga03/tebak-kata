import { describe, it, expect } from 'vitest'
import { shuffle, createDeck, draw } from './deck'
import type { Card } from './types'

const makeCards = (n: number): Card[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `c${i}`,
    text: `Kata ${i}`,
    categoryId: 'benda' as const,
  }))

// rng deterministik: selalu balikin nilai yang sama biar urutan shuffle bisa diprediksi
const fixedRng = (value: number) => () => value

describe('shuffle', () => {
  it('nggak ilangin atau nge-duplikat kartu', () => {
    const cards = makeCards(50)
    const result = shuffle(cards, Math.random)

    expect(result).toHaveLength(50)
    expect(new Set(result.map((c) => c.id)).size).toBe(50)
  })

  it('nggak mutasi array aslinya', () => {
    const cards = makeCards(10)
    const before = cards.map((c) => c.id)

    shuffle(cards, Math.random)

    expect(cards.map((c) => c.id)).toEqual(before)
  })

  it('deterministik kalau rng-nya deterministik', () => {
    const cards = makeCards(20)

    const a = shuffle(cards, fixedRng(0.5))
    const b = shuffle(cards, fixedRng(0.5))

    expect(a.map((c) => c.id)).toEqual(b.map((c) => c.id))
  })
})

describe('draw', () => {
  it('ngasih kartu berurutan sesuai tumpukan', () => {
    let deck = createDeck(makeCards(3), fixedRng(0))
    const drawn: string[] = []

    for (let i = 0; i < 3; i++) {
      const result = draw(deck, fixedRng(0))
      drawn.push(result.card.id)
      deck = result.deck
    }

    expect(new Set(drawn).size).toBe(3)
  })

  it('nggak ngulang kartu sampai tumpukan habis — termasuk lintas ronde', () => {
    // Cursor hidup di level sesi, jadi "ronde" cuma pengelompokan buatan di sini:
    // ambil 5, lalu ambil 5 lagi. Nggak boleh ada yang nongol dua kali.
    let deck = createDeck(makeCards(10), Math.random)
    const seen: string[] = []

    for (let round = 0; round < 2; round++) {
      for (let i = 0; i < 5; i++) {
        const result = draw(deck, Math.random)
        seen.push(result.card.id)
        deck = result.deck
      }
    }

    expect(seen).toHaveLength(10)
    expect(new Set(seen).size).toBe(10)
  })

  it('shuffle ulang dan lanjut pas tumpukan mentok', () => {
    let deck = createDeck(makeCards(3), Math.random)

    // habisin tumpukan
    for (let i = 0; i < 3; i++) {
      deck = draw(deck, Math.random).deck
    }
    expect(deck.cursor).toBe(3)

    // tarikan ke-4 harus tetap ngasih kartu, bukan error/null
    const result = draw(deck, Math.random)

    expect(result.card).toBeDefined()
    expect(result.deck.cursor).toBe(1)
    expect(result.deck.order).toHaveLength(3)
  })
})
