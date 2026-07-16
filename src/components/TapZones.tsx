type Props = {
  onPass: () => void
  onCorrect: () => void
}

/**
 * Dua zona tap 50/50 setinggi layar. Tombolnya cuma jangkar visual — seluruh
 * separuh layar bisa di-tap, karena operator nge-tap sambil kepalanya di kata,
 * bukan di tombol.
 */
export function TapZones({ onPass, onCorrect }: Props) {
  return (
    <div className="absolute inset-0 flex">
      <button
        type="button"
        onClick={onPass}
        aria-label="Lewat"
        className="group flex flex-1 items-end justify-center pb-8 active:bg-ink/10 sm:pb-12"
      >
        <span className="tekan rounded-2xl border-4 border-ink bg-kertas px-6 py-3 font-display text-2xl tracking-wide text-ink transition-transform group-active:translate-x-1 group-active:translate-y-1 group-active:shadow-none sm:px-10 sm:py-4 sm:text-4xl">
          LEWAT
        </span>
      </button>

      <button
        type="button"
        onClick={onCorrect}
        aria-label="Benar"
        className="group flex flex-1 items-end justify-center pb-8 active:bg-ink/10 sm:pb-12"
      >
        <span className="tekan rounded-2xl border-4 border-ink bg-hijau px-6 py-3 font-display text-2xl tracking-wide text-kertas transition-transform group-active:translate-x-1 group-active:translate-y-1 group-active:shadow-none sm:px-10 sm:py-4 sm:text-4xl">
          BENAR
        </span>
      </button>
    </div>
  )
}
