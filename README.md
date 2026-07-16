# Tebak Kata

Game tebak kata buat rame-rame, ala *Heads Up*, dimainkan di tablet.
Main di **https://stega03.github.io/tebak-kata/**

## Cara main

Butuh 3 peran (peran 2 dan 3 boleh dirangkap orang yang sama):

- **Penebak** — nggak boleh lihat layar sama sekali.
- **Pemberi petunjuk** — baca kata di layar, kasih clue tanpa nyebut katanya. Jawaban yang boleh keluar cuma "iya", "tidak", "bisa jadi".
- **Operator** — pegang tab di samping penebak. Tap kanan (**BENAR**) kalau kena, tap kiri (**LEWAT**) kalau nyerah.

Ronde berhenti kalau waktu habis **atau** kartunya sudah mentok — mana pun yang duluan. Benar dapat 1 poin, lewat nggak dihukum. Tiap tim main bergantian, skornya diakumulasi, pemenangnya muncul di akhir.

**Babak** dipakai buat tukar posisi: default 2 babak, jadi tiap tim dapat giliran dua kali dan di babak ke-2 penebak gantian sama pemberi petunjuk. Gilirannya selang-seling (A1 → B1 → A2 → B2), dan kartunya nggak pernah keulang antar babak — jadi orang kedua nggak dapat kata bekas yang tadi sudah kesebut.

**Layar kuning = ronde lagi jalan.** Kelihatan dari seberang ruangan.

## Nambah kata

Semua kata ada di satu file: [`src/game/words.ts`](src/game/words.ts). Tambahin string ke array kategori yang sesuai, commit, push. Nggak ada build step, manifest, atau tooling yang perlu disentuh.

Aturannya cuma satu: **kata harus bisa ditebak lewat clue verbal tanpa nyebut katanya**. Kembar di dalam satu kategori dilarang (tes bakal gagal); kembar lintas kategori boleh — "Palu" bisa berarti perkakas atau kota, dan penebak tetap jawab kata yang sama.

Sekarang ada 800 kata di 7 kategori.

## Development

```sh
npm install
npm run dev          # http://localhost:5173/tebak-kata/
npm test             # logika deck, aturan ronde, sanity konten
npm run build        # typecheck + build produksi
```

Push ke `main` bikin GitHub Actions jalanin tes, build, lalu deploy ke Pages.

## Struktur

```
src/
  game/         # logika murni, nol dependency React — di sini tesnya
    words.ts      # semua konten kartu
    deck.ts       # shuffle + tarik kartu (cursor hidup per sesi, bukan per ronde)
    reducer.ts    # aturan ronde, skor, giliran tim
  screens/      # satu file per layar
  components/   # timer, zona tap
```

Cursor deck hidup di level sesi, jadi tim berikutnya lanjut dari tumpukan yang sama — nggak ada tim yang dapat kartu bekas tim lain. Keacakan diisolasi di `deck.ts` dan rng-nya bisa disuntik, jadi shuffle bisa dites deterministik.
