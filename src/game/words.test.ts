import { describe, it, expect } from 'vitest'
import { CATEGORIES, ALL_CATEGORY_IDS, buildCards } from './words'

describe('konten kartu', () => {
  it('nggak ada kata kembar di dalam satu kategori', () => {
    // Kembar lintas kategori sengaja dibolehin: "Palu" bisa berarti perkakas
    // atau kota, dan penebak tetap jawab kata yang sama — dua-duanya benar.
    for (const category of CATEGORIES) {
      const duplicates = category.words.filter((w, i) => category.words.indexOf(w) !== i)
      expect(duplicates, category.label).toEqual([])
    }
  })

  it('tiap kategori punya minimal 100 kata', () => {
    // Tumpukan tebal itu yang bikin kartu jarang keulang. Kalau ada yang kepangkas
    // sampai di bawah ambang ini, tes yang kasih tahu.
    for (const category of CATEGORIES) {
      expect(category.words.length, category.label).toBeGreaterThanOrEqual(100)
    }
  })

  it('nggak ada kata kosong atau kesisa spasi', () => {
    for (const category of CATEGORIES) {
      for (const word of category.words) {
        expect(word).toBe(word.trim())
        expect(word.length).toBeGreaterThan(0)
      }
    }
  })

  it('id kategori unik', () => {
    expect(new Set(ALL_CATEGORY_IDS).size).toBe(CATEGORIES.length)
  })
})

describe('buildCards', () => {
  it('cuma ngasih kartu dari kategori yang dipilih', () => {
    const cards = buildCards(['hewan'])

    expect(cards.length).toBeGreaterThan(0)
    expect(cards.every((c) => c.categoryId === 'hewan')).toBe(true)
  })

  it('gabungin semua kategori pas campur semua', () => {
    const cards = buildCards(ALL_CATEGORY_IDS)
    const total = CATEGORIES.reduce((sum, c) => sum + c.words.length, 0)

    expect(cards).toHaveLength(total)
  })

  it('id kartu unik biar aman dipakai sebagai React key', () => {
    const cards = buildCards(ALL_CATEGORY_IDS)

    expect(new Set(cards.map((c) => c.id)).size).toBe(cards.length)
  })

  it('ngasih tumpukan kosong kalau nggak ada kategori dipilih', () => {
    expect(buildCards([])).toEqual([])
  })
})
