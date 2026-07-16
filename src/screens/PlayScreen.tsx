import { useEffect, useState } from 'react'
import type { Card } from '../game/types'
import { Timer } from '../components/Timer'
import { TapZones } from '../components/TapZones'

type Props = {
  card: Card
  timeLeft: number
  cardsPlayed: number
  maxCards: number
  roundScore: number
  onPass: () => void
  onCorrect: () => void
}

type Kilat = 'benar' | 'lewat' | null

export function PlayScreen({
  card,
  timeLeft,
  cardsPlayed,
  maxCards,
  roundScore,
  onPass,
  onCorrect,
}: Props) {
  const [kilat, setKilat] = useState<Kilat>(null)

  // Konfirmasi tap: layar berkedip sekejap. Operator nggak sempat baca teks
  // konfirmasi — warna jauh lebih cepat dicerna.
  useEffect(() => {
    if (!kilat) return
    const t = setTimeout(() => setKilat(null), 160)
    return () => clearTimeout(t)
  }, [kilat])

  const jawab = (jenis: Exclude<Kilat, null>, aksi: () => void) => {
    setKilat(jenis)
    aksi()
  }

  return (
    <div className="relative h-full overflow-hidden bg-kuning">
      {kilat && (
        <div
          aria-hidden
          // pointer-events-none itu wajib: tanpa ini overlay-nya makan tap
          // berikutnya selama dia tampil, dan operator kehilangan poin.
          className={`pointer-events-none absolute inset-0 z-20 ${
            kilat === 'benar' ? 'bg-hijau/70' : 'bg-ink/25'
          }`}
        />
      )}

      <header className="absolute inset-x-0 top-0 z-10 flex items-start justify-between px-5 pt-4 sm:px-8 sm:pt-6">
        <Timer timeLeft={timeLeft} />
        <div className="text-right font-display text-2xl leading-none tabular-nums text-ink/70 sm:text-3xl">
          <div>
            {cardsPlayed}
            <span className="text-ink/35">/{maxCards}</span>
          </div>
          <div className="mt-1 text-ink">{roundScore} poin</div>
        </div>
      </header>

      <main className="pointer-events-none flex h-full items-center justify-center px-6 pb-28 sm:pb-36">
        <p
          key={card.id}
          // Ini satu-satunya hal yang benar-benar penting di layar ini: harus
          // kebaca sekilas, dari sudut miring, dari seberang meja.
          className="font-display text-[clamp(2.75rem,13vw,10rem)] leading-[0.95] tracking-tight text-ink uppercase text-balance text-center"
        >
          {card.text}
        </p>
      </main>

      <TapZones
        onPass={() => jawab('lewat', onPass)}
        onCorrect={() => jawab('benar', onCorrect)}
      />
    </div>
  )
}
