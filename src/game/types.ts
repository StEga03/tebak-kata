export type CategoryId =
  | 'benda'
  | 'makanan'
  | 'hewan'
  | 'profesi'
  | 'negara'
  | 'ibukota'
  | 'kota'

export type Category = {
  id: CategoryId
  label: string
  words: string[]
}

export type Card = {
  id: string
  text: string
  categoryId: CategoryId
}

export type Deck = {
  order: Card[]
  cursor: number
}

export type Team = {
  name: string
  total: number
}

export type Config = {
  durationSec: number
  maxCards: number
  categoryIds: CategoryId[]
  /** Berapa kali tiap tim dapat giliran. Lebih dari 1 dipakai buat tukar posisi
   *  penebak dan pemberi petunjuk di babak berikutnya. */
  rounds: number
}

export type Phase = 'setup' | 'ready' | 'playing' | 'roundEnd' | 'finished'

export type GameState = {
  phase: Phase
  config: Config
  teams: Team[]
  currentTeamIndex: number
  /** Babak yang lagi jalan, mulai dari 1. */
  currentRound: number
  deck: Deck
  currentCard: Card | null
  roundScore: number
  cardsPlayed: number
  timeLeft: number
}

export type Action =
  | { type: 'START_SESSION'; teamNames: string[]; config: Config }
  | { type: 'START_ROUND' }
  | { type: 'CORRECT' }
  | { type: 'PASS' }
  | { type: 'TICK' }
  | { type: 'NEXT_TEAM' }
  | { type: 'RESET' }
