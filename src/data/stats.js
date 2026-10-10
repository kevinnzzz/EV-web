// Semua angka di sini dihitung langsung dari
// data/raw/predicting-electric-vehicle-purchases.csv (668.665 baris, 13 atribut
// selain id dan target). Nilai adalah persentase responden dengan
// Will_Buy_EV = "Yes" pada tiap kelompok. Ini statistik deskriptif, bukan
// hubungan sebab-akibat.

export const BRAND = 'EV Compass';
export const REPO_URL = 'https://github.com/kevinnzzz/EV-web';

export const dataset = {
  rows: '668 rb+',
  features: '13',
  buyRate: '17,5%',
};

// Persentase pemilik tiap tipe mobil saat ini yang berminat beralih ke EV.
export const cars = [
  {
    id: 'sedan',
    variant: 'sedan',
    name: 'Sedan listrik',
    traits: 'Komuter harian · Perjalanan jauh',
    text: 'Nyaman dan stabil untuk rutinitas harian maupun perjalanan antarkota.',
    stat: '17,2%',
    statNote: 'pemilik sedan berminat beralih ke EV',
  },
  {
    id: 'suv',
    variant: 'suv',
    name: 'SUV listrik',
    tag: 'Terbanyak berminat',
    traits: 'Keluarga · Ruang lega',
    text: 'Kabin lapang dan posisi duduk tinggi untuk keluarga dan bawaan banyak.',
    stat: '18,1%',
    statNote: 'pemilik SUV berminat beralih ke EV',
  },
  {
    id: 'hatch',
    variant: 'hatch',
    name: 'Hatchback listrik',
    traits: 'Kota padat · Ringkas',
    text: 'Ringkas dan lincah, mudah diparkir dan pas untuk mobilitas dalam kota.',
    stat: '17,4%',
    statNote: 'pemilik hatchback berminat beralih ke EV',
  },
];

export const highlight = {
  withSubsidy: 27.5,
  withoutSubsidy: 0.6,
};

export const insights = [
  {
    tag: 'Temuan',
    title: 'Usia dan gender hampir tidak membedakan',
    text: 'Rata-rata usia yang berminat 46,8 tahun, yang tidak 47,1. Minat pria 17,2%, wanita 17,8%.',
  },
  {
    tag: 'Temuan',
    title: 'Yang berminat berpendapatan lebih tinggi',
    text: 'Rata-rata pendapatan tahunan US$98,8 rb pada yang berminat, dibanding US$81,8 rb pada yang tidak.',
  },
  {
    tag: 'Catatan',
    title: 'Jumlah stasiun umum nyaris sama di kedua kelompok',
    text: 'Rata-rata 4,8 stasiun dekat rumah pada yang berminat dan 5,0 pada yang tidak. Pengisian di rumah lebih menentukan.',
  },
];
