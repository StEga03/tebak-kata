const KRITIS_DETIK = 10

export function Timer({ timeLeft }: { timeLeft: number }) {
  const kritis = timeLeft <= KRITIS_DETIK
  const menit = Math.floor(timeLeft / 60)
  const detik = timeLeft % 60

  return (
    <div
      // Timer dibaca lewat sudut mata sambil baca kata — ukuran & warna yang
      // bikin sisa waktu kerasa tanpa perlu benar-benar dilihat.
      className={`font-display text-5xl tabular-nums leading-none ${
        kritis ? 'text-merah' : 'text-ink/70'
      }`}
      style={kritis ? { animation: 'denyut 1s steps(2, jump-none) infinite' } : undefined}
      aria-live="off"
    >
      {menit}:{String(detik).padStart(2, '0')}
    </div>
  )
}

export { KRITIS_DETIK }
