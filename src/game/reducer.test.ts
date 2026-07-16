import { describe, it, expect } from 'vitest'
import { initialState, reducer } from './reducer'
import type { Action, Config, GameState } from './types'

const config: Config = { durationSec: 10, maxCards: 3, categoryIds: ['benda'], rounds: 1 }

const startedSession = (cfg: Config = config): GameState =>
  reducer(initialState, { type: 'START_SESSION', teamNames: ['Tim A', 'Tim B'], config: cfg })

const startedRound = (): GameState => reducer(startedSession(), { type: 'START_ROUND' })

const apply = (state: GameState, actions: Action[]): GameState =>
  actions.reduce((s, a) => reducer(s, a), state)

describe('START_SESSION', () => {
  it('bikin tim dengan skor nol dan masuk fase ready', () => {
    const state = startedSession()

    expect(state.phase).toBe('ready')
    expect(state.teams).toEqual([
      { name: 'Tim A', total: 0 },
      { name: 'Tim B', total: 0 },
    ])
    expect(state.currentTeamIndex).toBe(0)
    expect(state.deck.order.length).toBeGreaterThan(0)
  })
})

describe('START_ROUND', () => {
  it('mulai main dengan timer penuh, skor nol, dan kartu pertama sudah siap', () => {
    const state = startedRound()

    expect(state.phase).toBe('playing')
    expect(state.timeLeft).toBe(config.durationSec)
    expect(state.roundScore).toBe(0)
    expect(state.cardsPlayed).toBe(0)
    expect(state.currentCard).not.toBeNull()
  })
})

describe('skor', () => {
  it('benar nambah 1 poin, lewat nggak nambah', () => {
    const state = apply(startedRound(), [{ type: 'CORRECT' }, { type: 'PASS' }])

    expect(state.roundScore).toBe(1)
    expect(state.cardsPlayed).toBe(2)
  })

  it('tiap tebakan narik kartu baru', () => {
    const before = startedRound()
    const after = reducer(before, { type: 'CORRECT' })

    expect(after.currentCard?.id).not.toBe(before.currentCard?.id)
  })
})

describe('ronde berakhir', () => {
  it('berhenti pas timer habis', () => {
    const state = apply(
      startedRound(),
      Array.from({ length: config.durationSec }, () => ({ type: 'TICK' }) as Action),
    )

    expect(state.timeLeft).toBe(0)
    expect(state.phase).toBe('roundEnd')
  })

  it('berhenti pas maks kartu tercapai, walau timer masih ada', () => {
    const state = apply(startedRound(), [
      { type: 'CORRECT' },
      { type: 'PASS' },
      { type: 'CORRECT' },
    ])

    expect(state.cardsPlayed).toBe(config.maxCards)
    expect(state.phase).toBe('roundEnd')
    expect(state.timeLeft).toBeGreaterThan(0)
  })

  it('nggak nerima tebakan lagi setelah ronde tutup', () => {
    const ended = apply(startedRound(), [
      { type: 'CORRECT' },
      { type: 'CORRECT' },
      { type: 'CORRECT' },
    ])
    const after = reducer(ended, { type: 'CORRECT' })

    expect(after.roundScore).toBe(ended.roundScore)
  })

  it('akumulasi skor ronde ke tim yang lagi giliran', () => {
    const state = apply(startedRound(), [
      { type: 'CORRECT' },
      { type: 'CORRECT' },
      { type: 'PASS' },
    ])

    expect(state.teams[0].total).toBe(2)
    expect(state.teams[1].total).toBe(0)
  })
})

describe('giliran tim', () => {
  it('pindah ke tim berikutnya dan balik ke fase ready', () => {
    const ended = apply(startedRound(), [
      { type: 'CORRECT' },
      { type: 'CORRECT' },
      { type: 'CORRECT' },
    ])
    const next = reducer(ended, { type: 'NEXT_TEAM' })

    expect(next.currentTeamIndex).toBe(1)
    expect(next.phase).toBe('ready')
  })

  it('sesi selesai setelah tim terakhir main', () => {
    let state = startedSession()
    for (let team = 0; team < 2; team++) {
      state = apply(state, [
        { type: 'START_ROUND' },
        { type: 'CORRECT' },
        { type: 'CORRECT' },
        { type: 'CORRECT' },
        { type: 'NEXT_TEAM' },
      ])
    }

    expect(state.phase).toBe('finished')
  })

  it('kartu tim kedua lanjut dari tumpukan tim pertama, bukan ngulang', () => {
    let state = startedSession()
    const seen: string[] = []

    for (let team = 0; team < 2; team++) {
      state = reducer(state, { type: 'START_ROUND' })
      for (let i = 0; i < config.maxCards; i++) {
        seen.push(state.currentCard!.id)
        state = reducer(state, { type: 'CORRECT' })
      }
      state = reducer(state, { type: 'NEXT_TEAM' })
    }

    expect(seen).toHaveLength(6)
    expect(new Set(seen).size).toBe(6)
  })
})

describe('babak', () => {
  const duaBabak: Config = { ...config, rounds: 2 }
  const habiskanRonde: Action[] = [
    { type: 'START_ROUND' },
    { type: 'CORRECT' },
    { type: 'CORRECT' },
    { type: 'CORRECT' },
    { type: 'NEXT_TEAM' },
  ]

  it('mulai dari babak 1', () => {
    expect(startedSession(duaBabak).currentRound).toBe(1)
  })

  it('giliran selang-seling: A1, B1, A2, B2', () => {
    let state = startedSession(duaBabak)
    const urutan: string[] = []

    for (let i = 0; i < 4; i++) {
      urutan.push(`${state.teams[state.currentTeamIndex].name} babak ${state.currentRound}`)
      state = apply(state, habiskanRonde)
    }

    expect(urutan).toEqual([
      'Tim A babak 1',
      'Tim B babak 1',
      'Tim A babak 2',
      'Tim B babak 2',
    ])
  })

  it('belum selesai setelah tim terakhir main di babak 1', () => {
    const state = apply(startedSession(duaBabak), [...habiskanRonde, ...habiskanRonde])

    expect(state.phase).toBe('ready')
    expect(state.currentRound).toBe(2)
    expect(state.currentTeamIndex).toBe(0)
  })

  it('selesai setelah tim terakhir main di babak terakhir', () => {
    let state = startedSession(duaBabak)
    for (let i = 0; i < 4; i++) state = apply(state, habiskanRonde)

    expect(state.phase).toBe('finished')
  })

  it('skor dua babak diakumulasi ke tim yang sama', () => {
    let state = startedSession(duaBabak)
    for (let i = 0; i < 4; i++) state = apply(state, habiskanRonde)

    expect(state.teams[0].total).toBe(6)
    expect(state.teams[1].total).toBe(6)
  })

  it('kartu nggak keulang lintas babak', () => {
    // Tukar posisi cuma adil kalau babak 2 dapat kartu yang belum pernah kesebut.
    let state = startedSession(duaBabak)
    const seen: string[] = []

    for (let i = 0; i < 4; i++) {
      state = reducer(state, { type: 'START_ROUND' })
      for (let n = 0; n < config.maxCards; n++) {
        seen.push(state.currentCard!.id)
        state = reducer(state, { type: 'CORRECT' })
      }
      state = reducer(state, { type: 'NEXT_TEAM' })
    }

    expect(seen).toHaveLength(12)
    expect(new Set(seen).size).toBe(12)
  })
})

describe('RESET', () => {
  it('balik ke setup dengan skor bersih', () => {
    const state = reducer(startedRound(), { type: 'RESET' })

    expect(state.phase).toBe('setup')
    expect(state.teams).toEqual([])
  })
})
