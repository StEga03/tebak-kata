import type { Team } from '../game/types'

type Props = {
  teams: Team[]
  onRestart: () => void
}

export function FinalScreen({ teams, onRestart }: Props) {
  const peringkat = [...teams].sort((a, b) => b.total - a.total)
  const skorTertinggi = peringkat[0]?.total ?? 0
  const juara = peringkat.filter((t) => t.total === skorTertinggi)
  const seri = juara.length > 1

  return (
    <div className="min-h-full overflow-y-auto px-6 py-10">
      <div className="mx-auto flex max-w-lg flex-col gap-8">
        <header className="text-center">
          <p className="font-display text-sm tracking-[0.3em] text-kertas/40 uppercase">
            {seri ? 'Seri' : 'Juara'}
          </p>
          <h1 className="mt-3 font-display text-[clamp(2.5rem,11vw,5rem)] leading-[0.95] text-kuning text-balance">
            {juara.map((t) => t.name).join(' & ')}
          </h1>
        </header>

        <ol className="flex flex-col gap-2">
          {peringkat.map((team, i) => {
            const menang = team.total === skorTertinggi
            return (
              <li
                key={team.name}
                className={`flex items-center gap-4 rounded-xl border-2 px-4 py-3 ${
                  menang ? 'border-kuning bg-kuning/10' : 'border-ink-muda bg-ink-muda'
                }`}
              >
                <span
                  className={`font-display text-xl tabular-nums ${
                    menang ? 'text-kuning' : 'text-kertas/30'
                  }`}
                >
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 truncate font-display text-xl tracking-wide">
                  {team.name}
                </span>
                <span
                  className={`font-display text-2xl tabular-nums ${
                    menang ? 'text-kuning' : 'text-kertas/60'
                  }`}
                >
                  {team.total}
                </span>
              </li>
            )
          })}
        </ol>

        <button
          type="button"
          onClick={onRestart}
          className="tekan-terang w-full rounded-2xl border-4 border-kertas bg-kuning py-4 font-display text-2xl tracking-wide text-ink transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          MAIN LAGI
        </button>
      </div>
    </div>
  )
}
