import type { Action, GameState } from './types'
import { createDeck, draw, type Rng } from './deck'
import { buildCards, ALL_CATEGORY_IDS } from './words'

export const DEFAULT_CONFIG = {
  durationSec: 60,
  maxCards: 10,
  categoryIds: ALL_CATEGORY_IDS,
  // Default 2 biar penebak dan pemberi petunjuk bisa tukar posisi di babak ke-2.
  rounds: 2,
}

export const initialState: GameState = {
  phase: 'setup',
  config: DEFAULT_CONFIG,
  teams: [],
  currentTeamIndex: 0,
  currentRound: 1,
  deck: { order: [], cursor: 0 },
  currentCard: null,
  roundScore: 0,
  cardsPlayed: 0,
  timeLeft: 0,
}

/** Tutup ronde: akumulasi skor ke tim yang lagi giliran. */
function endRound(state: GameState): GameState {
  return {
    ...state,
    phase: 'roundEnd',
    currentCard: null,
    teams: state.teams.map((team, i) =>
      i === state.currentTeamIndex ? { ...team, total: team.total + state.roundScore } : team,
    ),
  }
}

/** Catat tebakan, tarik kartu berikutnya, tutup ronde kalau kartu sudah mentok. */
function answer(state: GameState, point: number, rng: Rng): GameState {
  if (state.phase !== 'playing') return state

  const cardsPlayed = state.cardsPlayed + 1
  const next: GameState = {
    ...state,
    roundScore: state.roundScore + point,
    cardsPlayed,
  }

  if (cardsPlayed >= state.config.maxCards) return endRound(next)

  const { card, deck } = draw(state.deck, rng)
  return { ...next, currentCard: card, deck }
}

/**
 * Sengaja 2 argumen — `useReducer` React nggak nerima reducer beparameter tambahan.
 * Keacakan diisolasi di `deck.ts`, yang rng-nya bisa disuntik buat tes.
 */
export function reducer(state: GameState, action: Action): GameState {
  const rng: Rng = Math.random
  switch (action.type) {
    case 'START_SESSION': {
      const cards = buildCards(
        action.config.categoryIds.length > 0 ? action.config.categoryIds : ALL_CATEGORY_IDS,
      )
      return {
        ...initialState,
        phase: 'ready',
        config: action.config,
        teams: action.teamNames.map((name) => ({ name, total: 0 })),
        deck: createDeck(cards, rng),
      }
    }

    case 'START_ROUND': {
      const { card, deck } = draw(state.deck, rng)
      return {
        ...state,
        phase: 'playing',
        deck,
        currentCard: card,
        roundScore: 0,
        cardsPlayed: 0,
        timeLeft: state.config.durationSec,
      }
    }

    case 'CORRECT':
      return answer(state, 1, rng)

    case 'PASS':
      return answer(state, 0, rng)

    case 'TICK': {
      if (state.phase !== 'playing') return state
      const timeLeft = state.timeLeft - 1
      if (timeLeft <= 0) return endRound({ ...state, timeLeft: 0 })
      return { ...state, timeLeft }
    }

    case 'NEXT_TEAM': {
      // Selang-seling: semua tim main dulu di babak ini, baru lanjut babak berikutnya.
      const nextIndex = state.currentTeamIndex + 1
      if (nextIndex < state.teams.length) {
        return { ...state, phase: 'ready', currentTeamIndex: nextIndex }
      }

      const nextRound = state.currentRound + 1
      if (nextRound > state.config.rounds) return { ...state, phase: 'finished' }

      return { ...state, phase: 'ready', currentTeamIndex: 0, currentRound: nextRound }
    }

    case 'RESET':
      return initialState

    default:
      return state
  }
}
