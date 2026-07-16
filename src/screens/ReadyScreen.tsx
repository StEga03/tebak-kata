import type { Team } from '../game/types'

type Props = {
  team: Team
  roundNumber: number
  totalTeams: number
  onStart: () => void
}

export function ReadyScreen({ team, roundNumber, totalTeams, onStart }: Props) {
  return (
    <button
      type="button"
      onClick={onStart}
      // Seluruh layar jadi tombol: operator lagi megang tab, jangan dipaksa
      // ngincer target kecil.
      className="flex h-full w-full flex-col items-center justify-center gap-8 px-6 text-center active:bg-ink-muda"
    >
      <span className="font-display text-sm tracking-[0.3em] text-kertas/40 uppercase">
        Giliran {roundNumber} dari {totalTeams}
      </span>

      <h1 className="font-display text-[clamp(3rem,14vw,9rem)] leading-[0.9] text-kuning text-balance">
        {team.name}
      </h1>

      <span className="tekan-terang rounded-2xl border-4 border-kertas px-8 py-4 font-display text-2xl tracking-wide text-kertas">
        TAP UNTUK MULAI
      </span>

      <p className="max-w-xs text-sm text-kertas/50">
        Arahkan layar ke pemberi petunjuk, jauh dari penebak.
      </p>
    </button>
  )
}
