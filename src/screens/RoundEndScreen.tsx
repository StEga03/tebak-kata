import type { Team } from '../game/types'

type Props = {
  team: Team
  roundScore: number
  isLastTeam: boolean
  onNext: () => void
}

export function RoundEndScreen({ team, roundScore, isLastTeam, onNext }: Props) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 px-6 text-center">
      <div>
        <p className="font-display text-sm tracking-[0.3em] text-kertas/40 uppercase">
          Ronde {team.name} selesai
        </p>
        <p className="mt-6 font-display text-[clamp(6rem,32vw,18rem)] leading-[0.8] text-kuning tabular-nums">
          {roundScore}
        </p>
        <p className="mt-2 font-display text-2xl tracking-wide text-kertas/70">KARTU KENA</p>
      </div>

      <p className="text-kertas/50">
        Total {team.name}: <span className="font-semibold text-kertas">{team.total}</span>
      </p>

      <button
        type="button"
        onClick={onNext}
        className="tekan-terang rounded-2xl border-4 border-kertas bg-kuning px-10 py-4 font-display text-2xl tracking-wide text-ink transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none sm:text-3xl"
      >
        {isLastTeam ? 'LIHAT HASIL' : 'TIM BERIKUTNYA'}
      </button>
    </div>
  )
}
