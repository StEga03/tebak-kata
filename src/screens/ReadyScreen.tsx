import type { Team } from '../game/types'

type Props = {
  team: Team
  teamNumber: number
  totalTeams: number
  round: number
  totalRounds: number
  onStart: () => void
}

export function ReadyScreen({
  team,
  teamNumber,
  totalTeams,
  round,
  totalRounds,
  onStart,
}: Props) {
  // Babak ke-2 dan seterusnya = saatnya tukar posisi. Ditaruh di sini karena ini
  // satu-satunya momen semua orang lagi lihat layar sambil siap-siap ganti peran.
  const tukarPosisi = round > 1

  return (
    <button
      type="button"
      onClick={onStart}
      // Seluruh layar jadi tombol: operator lagi megang tab, jangan dipaksa
      // ngincer target kecil.
      className="flex h-full w-full flex-col items-center justify-center gap-6 px-6 text-center active:bg-ink-muda"
    >
      <span className="font-display text-sm tracking-[0.3em] text-kertas/40 uppercase">
        {totalRounds > 1 && `Babak ${round} dari ${totalRounds} · `}
        Tim {teamNumber} dari {totalTeams}
      </span>

      <h1 className="font-display text-[clamp(3rem,14vw,9rem)] leading-[0.9] text-kuning text-balance">
        {team.name}
      </h1>

      {tukarPosisi && (
        <span className="tekan rounded-xl border-4 border-ink bg-kuning px-5 py-2 font-display text-lg tracking-wide text-ink sm:text-xl">
          TUKAR POSISI — GANTIAN YANG NEBAK
        </span>
      )}

      <span className="tekan-terang mt-2 rounded-2xl border-4 border-kertas px-8 py-4 font-display text-2xl tracking-wide text-kertas">
        TAP UNTUK MULAI
      </span>

      <p className="max-w-xs text-sm text-kertas/50">
        Arahkan layar ke pemberi petunjuk, jauh dari penebak.
      </p>
    </button>
  )
}
