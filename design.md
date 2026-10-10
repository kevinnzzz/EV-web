# Design System & UI Guidelines — EV Purchase Prediction Web

> **Revisi:** disesuaikan ulang dengan gambar prototype PRIMO DRIVE. Perubahan utama: (1) halaman putih dengan kartu abu hangat, bukan sebaliknya; (2) navigasi header di tengah dan header melayang di atas hero; (3) hero full-bleed dengan fade, indikator, dan ikon panah pada tombol; (4) pola header section dengan tautan "lihat semua"; (5) padanan grid katalog, testimoni, dan berita tanpa konten palsu; (6) footer berupa container melayang; (7) lebar berlapis, jarak antarseksi, dan ketebalan judul; (8) warna `foreground-muted` digelapkan demi kontras.

## 1. Design Overview

### 1.1 Purpose

Dokumen ini menjadi pedoman desain antarmuka untuk EV Purchase Prediction Web. Seluruh halaman harus mengikuti karakter visual dari prototype landing page PRIMO DRIVE yang diberikan oleh pemilik proyek.

Prototype tersebut digunakan sebagai referensi gaya visual, bukan sebagai konten yang harus disalin secara literal.

Tujuan desain:
- Menciptakan tampilan premium, modern, elegan, dan profesional.
- Menggunakan layout yang bersih dengan whitespace yang cukup.
- Menampilkan informasi secara terstruktur dan mudah dipahami.
- Menghindari tampilan dashboard generik yang terlalu ramai atau terlihat seperti template AI.
- Menjaga konsistensi visual antara landing page, dashboard, dan halaman prediksi.

### 1.2 Design Direction

Karakter desain utama:

- Premium automotive aesthetic.
- Minimalist editorial layout.
- Warm neutral background.
- Dark charcoal dan deep green sebagai warna aksen.
- Rounded cards dengan sudut lembut.
- Typography yang tegas dan mudah dibaca.
- Foto kendaraan berkualitas tinggi.
- Informasi disajikan dalam section yang jelas.
- Animasi ringan dan transisi yang tidak berlebihan.

Desain harus terasa seperti produk digital otomotif premium, bukan dashboard admin konvensional.

### 1.3 Reference Interpretation

Ciri visual prototype PRIMO DRIVE (hasil pemeriksaan ulang terhadap gambar):

1. Header kapsul putih translusen yang **melayang di atas hero**. Tiga zona: logo kiri, **navigasi di tengah**, kontak dan tombol CTA hijau tua di kanan.
2. Hero **full-bleed**: foto kendaraan memenuhi lebar, gradient putih memudar dari kiri agar teks terbaca, monogram logo samar di belakang mobil. Teks kiri: judul 3–4 baris, deskripsi, dua tombol (primary dengan ikon panah, secondary outline), lalu **baris tiga indikator** (ikon outline, nilai tebal, keterangan kecil).
3. Halaman berlatar **putih**. Kartu berwarna **abu hangat terang** (kebalikan dari kartu putih di atas background off-white).
4. Header section: judul di kiri, **tautan teks "lihat semua" dengan ikon panah** di kanan.
5. Kartu keunggulan: ikon putih di lingkaran hijau tua **sejajar dengan judul**, deskripsi di bawahnya.
6. Katalog: grid 3 kolom x 2 baris. Gambar di atas, badge hijau tua di pojok gambar, judul, satu baris meta, harga, ikon aksi di kanan bawah.
7. Banner promosi hijau tua, lebih lebar dari konten, dengan foto yang memudar ke background.
8. Testimoni: kartu horizontal ringkas (foto, kutipan, nama, rating).
9. Berita: kartu gelap dengan tag, judul, deskripsi, dan tombol bulat berpanah.
10. Footer: **container melayang** dengan sudut membulat di semua sisi (bukan full-bleed), dua blok (langganan dan kontak), monogram samar, dan bar hukum di bagian bawah.
11. Lebar berlapis: header paling lebar (sekitar 1260 px), banner dan footer (sekitar 1210 px), konten (sekitar 1160 px).

Padanan untuk EV Purchase Prediction Web (konten prototype tidak disalin):

| Prototype | Padanan di proyek ini |
|---|---|
| Indikator hero (10+ tahun, dst.) | Fakta terverifikasi tentang proyek, tanpa angka performa |
| Keunggulan layanan | Tentang Proyek (4 kartu) |
| Katalog mobil | Preview Analisis (grid kartu visual ke Dashboard) |
| Banner promo | Banner CTA ke `/prediksi` |
| Testimoni | Alur Proyek (3 kartu langkah) |
| Berita dan artikel | Catatan Proyek (3 kartu gelap berisi panduan) |
| Footer langganan dan kontak | Footer deskripsi, navigasi, sumber dataset |

Adaptasikan karakter tersebut. Jangan menyalin identitas merek, teks Rusia, kontak, harga, foto orang, atau konten PRIMO DRIVE.

---

## 2. Color System

Gunakan palet yang terinspirasi dari prototype. Halaman berlatar putih dan kartu berwarna abu hangat.

| Token | Warna | Penggunaan |
|---|---|---|
| `background` | `#FFFFFF` | Background halaman |
| `surface` | `#F6F5F2` | Kartu dan area konten di atas background |
| `surface-muted` | `#EBEAE6` | Area gambar, hover secondary, blok ikon |
| `surface-raised` | `#FFFFFF` | Header kapsul, input, elemen yang berada di atas `surface` |
| `foreground` | `#202522` | Judul dan teks utama |
| `foreground-muted` | `#6B6E6A` | Deskripsi dan metadata (kontras minimal 4.5:1 pada `background` dan `surface`) |
| `primary` | `#26352F` | Tombol utama, ikon lingkaran, banner, footer |
| `primary-hover` | `#35483F` | Hover tombol utama |
| `border` | `#E5E3DE` | Border tipis jika diperlukan |
| `success` | `#397454` | Status positif dan focus ring |
| `warning` | `#A97936` | Peringatan |
| `danger` | `#B94A42` | Error |

Aturan:

- Warna gelap dipakai untuk kontras: tombol utama, ikon, banner, kartu gelap, sidebar aktif, dan footer.
- Jangan menggunakan banyak warna aksen sekaligus. Warna status hanya jika bermakna.
- Grafik dashboard boleh memakai beberapa warna pembeda yang selaras dengan palet.
- Satu-satunya gradient yang diizinkan adalah fade fungsional (hero dan banner) agar teks terbaca di atas foto.
- Jangan menggunakan neon atau kombinasi warna yang mencolok.

---

## 3. Typography

Gunakan font sans-serif modern dengan karakter bersih dan profesional.

Pilihan utama:
- Inter.

Alternatif:
- Manrope.
- Plus Jakarta Sans.

Gunakan satu keluarga font utama secara konsisten.

### Typography hierarchy

| Elemen | Panduan |
|---|---|
| Hero heading | 40–52 px pada desktop, semibold (600), line-height sekitar 1.1 |
| Page heading | 32–40 px pada desktop |
| Section heading | 22–28 px |
| Card heading | 15–18 px |
| Body text | 14–16 px |
| Metadata | 12–13 px |
| Button text | 13–15 px, medium atau semibold |

Ketentuan:
- Judul harus tegas dan mudah dipindai.
- Gunakan line-height yang nyaman.
- Batasi lebar paragraf agar tidak terlalu panjang.
- Hindari penggunaan terlalu banyak ukuran dan ketebalan font. Judul memakai semibold (600), bukan bold (700), sesuai prototype.
- Sesuaikan skala typography pada tablet dan mobile.

---

## 4. Layout and Spacing

### 4.1 General Layout

Gunakan layout yang terstruktur dengan whitespace yang cukup.

- Maksimum lebar halaman desktop: sekitar 1440 px.
- Lebar berlapis: header sekitar 1260 px, banner dan footer sekitar 1210 px, konten sekitar 1160 px.
- Padding horizontal desktop: 40–72 px.
- Padding horizontal tablet: 24–32 px.
- Padding horizontal mobile: 16–20 px.
- Jarak antarseksi landing page: sekitar 40–64 px (prototype cukup rapat).
- Jarak antarcard: sekitar 16–24 px.
- Padding card: sekitar 20–24 px.

Nilai tersebut adalah panduan awal. Sesuaikan berdasarkan ukuran layar dan kompleksitas konten.

### 4.2 Grid System

Gunakan grid responsif untuk:
- Feature cards.
- Dashboard statistic cards.
- Model comparison cards.
- Evaluation charts.
- Prediction result panels.

Desktop dapat menggunakan beberapa kolom. Tablet dan mobile harus menurunkan jumlah kolom tanpa membuat konten terlalu sempit.

Jangan mempertahankan layout tiga atau empat kolom pada layar kecil apabila menyebabkan teks atau grafik sulit dibaca.

---

## 5. Shared UI Components

Semua halaman harus menggunakan sistem komponen yang konsisten.

### 5.1 Buttons

Primary button:
- Background deep green atau charcoal.
- Teks putih, dengan ikon panah (Lucide `arrow-right`) di sisi kanan teks pada CTA utama.
- Sudut pill.
- Padding horizontal yang cukup.
- Hover state sedikit lebih terang.
- Transisi singkat.

Secondary button:
- Background transparan atau putih.
- Border tipis.
- Teks gelap.
- Hover state dengan background abu-abu hangat.

Button harus memiliki state:
- Default.
- Hover.
- Focus.
- Disabled.
- Loading jika menjalankan proses.

Hindari tombol berukuran terlalu besar atau menggunakan banyak warna.

### 5.2 Cards

Karakter card:
- Background `surface` (abu hangat) di atas halaman putih; tanpa border dan tanpa shadow pada landing page.
- Border tipis atau shadow sangat lembut hanya pada dashboard bila perlu.
- Rounded corners sekitar 14–18 px; container besar (banner, footer, hero) 20–28 px.
- Padding konsisten.
- Hierarki judul, isi, dan metadata yang jelas.

Jangan menggunakan shadow hitam yang tebal atau border kontras berlebihan.

### 5.3 Inputs

Gunakan input dengan:
- Background `surface-raised` (putih) agar terbaca di atas kartu `surface`.
- Border tipis.
- Sudut rounded sekitar 10–14 px.
- Label di atas field.
- Placeholder yang singkat.
- Focus ring yang jelas.
- Error message yang mudah dipahami.

Formulir prediksi harus terasa seperti bagian dari produk yang sama, bukan aplikasi berbeda.

### 5.4 Icons

Gunakan Lucide React apabila dibutuhkan.

- Gunakan ikon dengan ukuran konsisten.
- Hindari mencampur banyak gaya ikon.
- Ikon harus mendukung fungsi atau membantu pemindaian informasi.
- Jangan menambahkan ikon dekoratif pada setiap elemen tanpa alasan.

### 5.5 Badges

Gunakan badge secara terbatas untuk:
- Status model.
- Label kelas hasil prediksi.
- Kategori metrik atau informasi singkat.

Badge harus berukuran kecil dan tidak mengalahkan informasi utama.

Pada kartu bergambar, badge kategori berada di pojok kiri atas gambar: background `primary`, teks putih, radius sekitar 8 px.

---

## 6. Landing Page — `/`

Landing page harus paling dekat dengan struktur visual prototype PRIMO DRIVE.

Urutan: Header, Hero, Tentang Proyek, Preview Analisis, Banner CTA, Alur Proyek, Catatan Proyek, Footer.

Pola header section: judul di kiri dan, bila ada tujuan, tautan teks kecil dengan ikon panah di kanan (contoh "Buka Dashboard").

### 6.1 Header

- Kapsul putih translusen yang melayang di atas hero (fixed atau sticky), lebar sekitar 1260 px.
- Tiga zona: logo atau nama aplikasi di kiri, **navigasi di tengah**, tombol CTA "Coba Sekarang" (pill `primary`) di kanan.
- Navigasi: Beranda, Tentang Proyek, Dashboard, Prediksi.
- Mobile: navigasi diganti menu ringkas yang bisa ditutup dengan keyboard.
- Jangan menggunakan nama PRIMO DRIVE, logo referensi, atau nomor telepon.

### 6.2 Hero

- Full-bleed, tinggi sekitar 520–600 px pada desktop. Header melayang di atasnya.
- Background berupa foto atau visual kendaraan listrik di kanan, dengan fade putih dari kiri agar teks terbaca. Monogram logo samar di belakang kendaraan bersifat opsional.
- Kolom kiri: eyebrow kecil (opsional), headline 3–4 baris, deskripsi (maks sekitar 46 karakter per baris), tombol primary "Coba Sekarang" (dengan ikon panah) dan secondary outline "Lihat Dashboard".
- Di bawah tombol: baris tiga indikator ringkas (ikon outline, judul tebal, keterangan kecil). Isi hanya fakta terverifikasi tentang proyek, misalnya "2 model: XGBoost dan CatBoost". Jangan menampilkan angka akurasi atau performa sebelum diverifikasi.
- Kolom kanan: kendaraan listrik sebagai elemen visual utama, menyatu dengan background.
- Mobile: teks terlebih dahulu, kemudian gambar.

### 6.3 Tentang Proyek

- Empat kartu `surface`, radius sekitar 16 px, tanpa border dan shadow.
- Baris atas kartu: ikon putih di dalam lingkaran `primary` (sekitar 36–40 px) sejajar dengan judul; di bawahnya deskripsi 2–3 baris.
- Konten: analisis data kendaraan listrik, evaluasi model, prediksi minat pembelian, perbandingan XGBoost dan CatBoost.

### 6.4 Preview Analisis

Pengganti katalog kendaraan.

- Grid 3 kolom x 2 baris (turun menjadi 2 lalu 1 kolom pada layar kecil).
- Kartu: area gambar di atas (background studio abu hangat) berisi pictogram atau preview grafik; badge kategori di pojok kiri atas; di bawahnya judul, satu baris meta, dan ikon aksi bulat di kanan. Tanpa harga dan tanpa tombol favorit.
- Topik: confusion matrix, kurva ROC, feature importance, perbandingan model, distribusi data, ringkasan data.
- Angka dan grafik asli hanya boleh tampil bila berasal dari hasil proyek yang valid. Jika belum, gunakan ilustrasi nonnumerik dan beri label "Ilustrasi".

### 6.5 Banner CTA

- Container sekitar 1210 px (sedikit lebih lebar dari konten), radius 20–24 px, background `primary`.
- Kiri: label kecil, judul singkat, deskripsi singkat, tombol putih pill "Mulai Prediksi" dengan ikon panah.
- Kanan: foto atau visual kendaraan listrik yang memudar ke background.
- Tujuan: mengarahkan pengguna ke `/prediksi`.

### 6.6 Alur Proyek

Pengganti testimoni.

- Tiga kartu horizontal ringkas (`surface`): blok ikon di kiri, judul, deskripsi, dan penanda langkah. Penomoran boleh dipakai karena urutannya nyata (data, model, prediksi).
- Jangan menampilkan testimoni, foto orang, rating, atau nama palsu.

### 6.7 Catatan Proyek

Pengganti berita dan artikel.

- Tiga kartu gelap dengan overlay: tag di kiri atas, judul, deskripsi, tombol bulat berpanah di kanan bawah.
- Isi berupa panduan nyata yang menaut ke Dashboard atau Prediksi (tentang data, perbandingan model, cara membaca hasil). Jangan membuat berita atau artikel palsu.

### 6.8 Footer

- Container melayang (bukan full-bleed), sudut membulat di semua sisi, lebar sekitar 1210 px, background `primary` atau charcoal.
- Dua blok: kiri nama aplikasi dan deskripsi singkat; kanan navigasi dan informasi sumber dataset. Monogram samar bersifat opsional.
- Bar bawah: hak cipta, tautan, dan disclaimer bahwa hasil adalah prediksi model.
- Jangan menambahkan alamat, nomor telepon, newsletter, atau media sosial kecuali memang dimiliki proyek.

### 6.9 Slot Gambar

Foto kendaraan ditempatkan di `assets/` (contoh `assets/hero-ev.jpg`). Selama foto belum tersedia, tampilkan ilustrasi fallback. Gunakan foto tanpa watermark, tone netral, dan sudah dioptimalkan.

---

## 7. Dashboard Page — `/dashboard`

Dashboard harus mengikuti bahasa desain landing page, tetapi lebih berorientasi pada informasi dan analisis.

Jangan menggunakan template admin dashboard generik dengan sidebar biru terang, banyak gradient, atau komponen padat.

### 7.1 App Layout

Gunakan layout aplikasi dengan sidebar di sebelah kiri dan konten utama di sebelah kanan.

Sidebar:
- Identitas proyek di bagian atas.
- Navigasi Dashboard dan Prediksi.
- Background putih atau surface terang.
- Item aktif menggunakan deep green dengan kontras yang jelas.
- Ikon sederhana dan label teks.
- Border tipis sebagai pemisah.

Area konten:
- Background utama putih (`background`).
- Header halaman.
- Judul "Dashboard".
- Deskripsi singkat.
- Area visualisasi dalam grid.

Sidebar harus konsisten dengan halaman `/prediksi`.

Pada mobile, sidebar berubah menjadi drawer atau navigasi yang dapat dibuka.

### 7.2 Dashboard Header

Tampilkan:
- Page title.
- Deskripsi fungsi dashboard.
- Metadata sumber data jika relevan.

Hindari header besar yang memakan banyak ruang seperti hero landing page. Konten analisis harus menjadi fokus.

### 7.3 Summary Cards

Gunakan card `surface` dengan sudut rounded dan border atau shadow sangat lembut.

Setiap card menampilkan:
- Label metrik.
- Nilai utama.
- Keterangan singkat.
- Ikon kecil jika relevan.

Contoh informasi yang mungkin ditampilkan:
- Jumlah observasi.
- Jumlah fitur.
- ROC-AUC XGBoost.
- ROC-AUC CatBoost.

Hanya tampilkan informasi yang tersedia dan sudah diverifikasi. Jangan membuat data contoh seolah-olah merupakan hasil eksperimen sebenarnya.

### 7.4 Chart Cards

Setiap grafik harus berada dalam card dengan:
- Judul.
- Deskripsi atau konteks singkat.
- Area grafik yang proporsional.
- Label sumbu dan legenda yang jelas.
- Spacing yang cukup.

Gunakan grafik sederhana dan mudah dibaca. Hindari efek 3D, animasi berlebihan, serta dekorasi yang mengurangi keterbacaan.

Gunakan visualisasi yang benar-benar tersedia atau dapat dibuat dari data sumber yang valid.

### 7.5 Model Comparison

Perbandingan XGBoost dan CatBoost harus memiliki format visual yang sama.

- Gunakan nama model secara konsisten.
- Tampilkan metrik yang dapat dibandingkan secara adil.
- Gunakan skala dan format angka yang konsisten.
- Jelaskan jenis data evaluasi.
- Jangan memberi label "Best Model" tanpa dasar evaluasi yang terverifikasi.

### 7.6 Evaluation Section

Tampilkan grafik evaluasi seperti confusion matrix, ROC curve, atau feature importance jika artefaknya tersedia.

Gunakan gambar statis jika hasil hanya tersedia sebagai gambar dan tidak ada kebutuhan untuk interaksi. Gunakan grafik interaktif jika data numerik sumber tersedia dan interaksi memang bermanfaat.

Jangan memaksakan semua grafik masuk ke dashboard jika membuat halaman terlalu padat.

---

## 8. Prediction Page — `/prediksi`

Halaman prediksi harus memiliki tampilan yang sama dengan dashboard dan landing page, tetapi fokus pada proses input dan hasil.

### 8.1 Page Header

Tampilkan:
- Judul "Prediksi Minat Pembelian EV".
- Deskripsi singkat mengenai fungsi halaman.
- Penjelasan bahwa hasil merupakan prediksi model, bukan kepastian perilaku pembelian.

### 8.2 Prediction Form

Letakkan formulir dalam card `surface` dengan padding yang cukup; input memakai `surface-raised` (putih).

Susunan:
- Section data pengguna atau karakteristik input, sesuai fitur model.
- Label dan input yang jelas.
- Dropdown untuk fitur kategorikal.
- Numeric input untuk fitur numerik.
- Informasi satuan jika relevan.
- Tombol primary untuk menjalankan prediksi.

Jangan menetapkan field formulir berdasarkan asumsi. Daftar field final harus berasal dari skema fitur model yang telah diaudit dan disepakati dengan tim backend.

### 8.3 Model Selection

Sediakan pilihan model:
- XGBoost.
- CatBoost.

Pilihan model dapat menggunakan segmented control, radio card, atau select. Gunakan desain yang sederhana dan tidak terlalu dekoratif.

Pastikan pilihan yang tampil sesuai dengan model yang benar-benar tersedia melalui API.

### 8.4 Prediction Result

Setelah prediksi berhasil, tampilkan hasil di card tersendiri.

Informasi yang dapat ditampilkan:
- Label hasil prediksi.
- Nama model.
- Probabilitas kelas positif jika tersedia.
- Ringkasan input yang digunakan.

Gunakan hierarki visual yang jelas agar pengguna langsung memahami hasilnya.

Warna hijau dapat digunakan untuk menandai kelas positif dan warna netral untuk informasi pendukung, tetapi hindari penggunaan warna yang mengesankan kepastian atau jaminan pembelian.

### 8.5 Prediction States

Buat tampilan untuk:
- Belum ada hasil.
- Sedang memproses.
- Prediksi berhasil.
- Input tidak valid.
- API atau model tidak tersedia.

Jangan menampilkan hasil hardcoded ketika API gagal. Gunakan pesan error yang jelas dan opsi untuk mencoba kembali.

---

## 9. Imagery and Visual Assets

Gunakan gambar yang relevan dengan kendaraan listrik dan mobilitas masa depan.

Panduan:
- Gunakan gambar berkualitas tinggi.
- Pilih pencahayaan natural, komposisi bersih, dan tone warna netral.
- Hindari gambar kendaraan yang memiliki watermark.
- Jangan menggunakan gambar mobil premium hanya untuk menyiratkan bahwa aplikasi menjual kendaraan.
- Jangan menggunakan gambar sebagai pengganti data evaluasi yang seharusnya disajikan dalam grafik.
- Optimalkan ukuran gambar agar halaman tetap cepat.

Gambar otomotif pada landing page boleh menjadi elemen visual utama. Pada dashboard dan halaman prediksi, gambar hanya digunakan jika mendukung konteks, bukan sebagai dekorasi dominan.

---

## 10. Motion and Interaction

Gunakan interaksi ringan:
- Hover button.
- Transisi warna.
- Card hover yang sangat halus jika relevan.
- Sidebar active state.
- Loading state pada prediksi.

Ketentuan:
- Durasi transisi umumnya sekitar 150–250 ms.
- Hindari parallax berat.
- Hindari animasi berulang yang mengganggu.
- Jangan menambahkan animasi hanya untuk membuat tampilan terlihat lebih kompleks.

Semua interaksi harus memiliki fungsi yang jelas.

---

## 11. Responsive Behavior

### Desktop
- Landing page menggunakan hero dua kolom.
- Dashboard menggunakan sidebar permanen.
- Grafik dapat ditampilkan dalam grid dua kolom jika sesuai.
- Form prediksi dapat menggunakan layout dua kolom untuk input yang berkaitan.

### Tablet
- Kurangi padding dan jumlah kolom.
- Pastikan sidebar dan grafik tidak mempersempit area konten secara berlebihan.
- Hero tetap seimbang dengan gambar yang disesuaikan.

### Mobile
- Hero berubah menjadi satu kolom.
- Navigasi desktop diganti menjadi menu ringkas.
- Sidebar berubah menjadi drawer atau navigasi mobile.
- Semua card disusun vertikal.
- Grafik tidak boleh terpotong.
- Form input menggunakan lebar penuh.
- Tombol utama mudah digunakan dengan sentuhan.

---

## 12. Accessibility

- Gunakan semantic HTML.
- Pastikan setiap input memiliki label.
- Sediakan focus state yang jelas.
- Pastikan teks dan background memiliki kontras memadai.
- Jangan membedakan status hanya menggunakan warna.
- Berikan alternatif teks untuk gambar yang informatif.
- Gunakan label dan keterangan pada grafik.
- Pastikan navigasi dapat digunakan dengan keyboard.

---

## 13. Implementation Guidelines

- Pertahankan stack React, Vite, dan Tailwind CSS yang sudah digunakan proyek.
- Gunakan komponen reusable untuk button, card, input, page header, dan chart container.
- Gunakan design tokens atau CSS variables untuk warna, radius, spacing, dan typography.
- Hindari menulis style yang sama berulang kali.
- Jangan mengubah logika model machine learning.
- Jangan memuat artefak model Python ke frontend.
- Pisahkan komponen visual dari pemanggilan API.
- Gunakan data dashboard yang valid dan terpisah dari komponen UI.
- Jangan menambahkan fitur yang tidak tercantum dalam requirements tanpa alasan yang jelas.

---

## 14. Final Design Acceptance Criteria

Desain dianggap sesuai apabila:

1. Landing page mengikuti komposisi, palet warna, whitespace, card, dan karakter premium dari prototype PRIMO DRIVE.
2. Identitas dan konten aplikasi tetap berfokus pada prediksi pembelian EV.
3. Dashboard dan halaman prediksi menggunakan palet warna, typography, button, card, radius, dan spacing yang konsisten dengan landing page.
4. Dashboard tetap berorientasi pada data dan tidak berubah menjadi landing page kedua.
5. Halaman prediksi memiliki formulir yang jelas, mudah dibaca, dan mengikuti gaya komponen yang sama.
6. Tidak ada grafik atau angka fiktif yang ditampilkan sebagai hasil model.
7. Seluruh halaman responsif di desktop, tablet, dan mobile.
8. Tidak ada dekorasi berlebihan, gradient berlebihan, atau elemen yang tidak memiliki fungsi.
9. Navigasi dan interaksi berfungsi.
10. Implementasi tetap mudah disesuaikan apabila prototype atau kebutuhan desain berubah.

## 15. Final Instruction to the Agent

Use the provided PRIMO DRIVE landing page screenshot as the primary visual reference.

Apply its premium automotive aesthetic, warm neutral palette, dark green accents, rounded cards, clean typography, generous whitespace, and editorial layout to the EV Purchase Prediction Web.

Build the landing page, dashboard, and prediction page as one cohesive product. Do not copy the reference brand or its unrelated content.

The dashboard and prediction page must follow the same design system while preserving their distinct functional purposes.

Prioritize clarity, consistency, real data, and maintainable components over visual decoration.
