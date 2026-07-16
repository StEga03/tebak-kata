import { useState } from 'react'
import type { CategoryId, Config } from '../game/types'
import { CATEGORIES, ALL_CATEGORY_IDS } from '../game/words'
import { DEFAULT_CONFIG } from '../game/reducer'

const DURASI_PILIHAN = [30, 60, 90, 120]
const KARTU_PILIHAN = [5, 10, 15, 20]

type Props = {
  onStart: (teamNames: string[], config: Config) => void
}

export function SetupScreen({ onStart }: Props) {
  const [teamNames, setTeamNames] = useState(['Tim A', 'Tim B'])
  const [categoryIds, setCategoryIds] = useState<CategoryId[]>(ALL_CATEGORY_IDS)
  const [durationSec, setDurationSec] = useState(DEFAULT_CONFIG.durationSec)
  const [maxCards, setMaxCards] = useState(DEFAULT_CONFIG.maxCards)

  const semuaDipilih = categoryIds.length === ALL_CATEGORY_IDS.length
  const namaBersih = teamNames.map((n) => n.trim()).filter(Boolean)
  const bisaMulai = namaBersih.length >= 1 && categoryIds.length >= 1

  const jumlahKartu = CATEGORIES.filter((c) => categoryIds.includes(c.id)).reduce(
    (sum, c) => sum + c.words.length,
    0,
  )

  const toggleCategory = (id: CategoryId) =>
    setCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )

  const ubahNama = (index: number, value: string) =>
    setTeamNames((prev) => prev.map((n, i) => (i === index ? value : n)))

  return (
    <div className="min-h-full overflow-y-auto px-5 py-8 sm:px-8">
      <div className="mx-auto flex max-w-2xl flex-col gap-9">
        <header>
          <h1 className="font-display text-5xl leading-[0.9] tracking-tight text-kuning sm:text-7xl">
            TEBAK
            <br />
            KATA
          </h1>
          <p className="mt-3 max-w-md text-sm text-kertas/60 sm:text-base">
            Satu orang baca kata di layar dan kasih petunjuk. Penebak nggak boleh
            lihat. Tap kanan kalau kena, kiri kalau nyerah.
          </p>
        </header>

        <Bagian judul="Tim">
          <div className="flex flex-col gap-2">
            {teamNames.map((name, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={name}
                  onChange={(e) => ubahNama(i, e.target.value)}
                  placeholder={`Tim ${i + 1}`}
                  maxLength={20}
                  className="min-w-0 flex-1 rounded-xl border-2 border-ink-muda bg-ink-muda px-4 py-3 font-display text-xl tracking-wide text-kertas placeholder:text-kertas/25 focus:border-kuning focus:outline-none"
                />
                {teamNames.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setTeamNames((prev) => prev.filter((_, x) => x !== i))}
                    aria-label={`Hapus ${name || `Tim ${i + 1}`}`}
                    className="rounded-xl border-2 border-ink-muda px-4 text-lg text-kertas/40 hover:border-merah hover:text-merah"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          {teamNames.length < 6 && (
            <button
              type="button"
              onClick={() => setTeamNames((prev) => [...prev, ''])}
              className="mt-2 self-start text-sm font-semibold text-kuning hover:underline"
            >
              + Tambah tim
            </button>
          )}
        </Bagian>

        <Bagian judul="Kategori" catatan={`${jumlahKartu} kata`}>
          <div className="flex flex-wrap gap-2">
            <Chip
              aktif={semuaDipilih}
              onClick={() => setCategoryIds(semuaDipilih ? [] : ALL_CATEGORY_IDS)}
            >
              Campur Semua
            </Chip>
            {CATEGORIES.map((c) => (
              <Chip
                key={c.id}
                aktif={categoryIds.includes(c.id)}
                onClick={() => toggleCategory(c.id)}
              >
                {c.label}
              </Chip>
            ))}
          </div>
        </Bagian>

        <div className="grid gap-9 sm:grid-cols-2">
          <Bagian judul="Waktu per ronde">
            <div className="flex flex-wrap gap-2">
              {DURASI_PILIHAN.map((d) => (
                <Chip key={d} aktif={durationSec === d} onClick={() => setDurationSec(d)}>
                  {d} detik
                </Chip>
              ))}
            </div>
          </Bagian>

          <Bagian judul="Maks kartu per ronde">
            <div className="flex flex-wrap gap-2">
              {KARTU_PILIHAN.map((k) => (
                <Chip key={k} aktif={maxCards === k} onClick={() => setMaxCards(k)}>
                  {k} kartu
                </Chip>
              ))}
            </div>
          </Bagian>
        </div>

        <button
          type="button"
          disabled={!bisaMulai}
          onClick={() => onStart(namaBersih, { durationSec, maxCards, categoryIds })}
          className="tekan-terang w-full rounded-2xl border-4 border-kertas bg-kuning py-5 font-display text-3xl tracking-wide text-ink transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none disabled:pointer-events-none disabled:opacity-30 sm:text-4xl"
        >
          MULAI MAIN
        </button>

        {!bisaMulai && (
          <p className="-mt-6 text-center text-sm text-kertas/40">
            Isi minimal satu nama tim dan pilih minimal satu kategori.
          </p>
        )}
      </div>
    </div>
  )
}

function Bagian({
  judul,
  catatan,
  children,
}: {
  judul: string
  catatan?: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="font-display text-sm tracking-[0.2em] text-kertas/45 uppercase">
          {judul}
        </h2>
        {catatan && <span className="text-sm text-kuning/70 tabular-nums">{catatan}</span>}
      </div>
      {children}
    </section>
  )
}

function Chip({
  aktif,
  onClick,
  children,
}: {
  aktif: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={aktif}
      className={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors ${
        aktif
          ? 'border-kuning bg-kuning text-ink'
          : 'border-ink-muda bg-ink-muda text-kertas/60 hover:border-kertas/30'
      }`}
    >
      {children}
    </button>
  )
}
