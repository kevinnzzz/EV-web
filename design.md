# Desain Proyek EV-Web

## 1. Latar Belakang

EV-Web adalah aplikasi web yang menjelaskan pola minat masyarakat terhadap pembelian kendaraan listrik (EV) berdasarkan data responden yang besar dan beragam. Tujuan utama proyek ini adalah menyajikan insight data dan analisis prediktif dalam bentuk antarmuka yang mudah dipahami, khususnya bagi pengguna yang ingin melihat faktor-faktor yang memengaruhi keputusan beli EV.

Proyek ini menggabungkan dua sisi:

- front-end berbasis React untuk presentasi data dan landing page,
- analisis data dan model prediksi berbasis Python untuk memproses dataset dan mengevaluasi faktor-faktor seperti subsidi, pendapatan, akses charging, dan tingkat kepedulian lingkungan.

## 2. Tujuan Proyek

1. Menyediakan landing page yang informatif tentang minat pembelian mobil listrik.
2. Menjelaskan faktor-faktor yang memengaruhi keputusan membeli EV.
3. Menampilkan data statistik dan insight dari dataset publik yang digunakan.
4. Menyiapkan fondasi dashboard analitik yang dapat dikembangkan ke tahap interaktif lebih lanjut.
5. Mengintegrasikan hasil analisis data dan model prediksi dalam tampilan yang mudah dipahami oleh audiens umum.

## 3. Target Pengguna

- Mahasiswa dan peneliti yang mempelajari analisis data dan EV adoption.
- Stakeholder atau pembuat kebijakan yang ingin melihat pola minat terhadap mobil listrik.
- Pengguna umum yang ingin memahami alasan orang beralih ke kendaraan listrik.

## 4. Ruang Lingkup

### 4.1 Fitur yang Sudah Ada

- Hero section dengan ringkasan proyek dan CTA ke dashboard.
- Section "Mengapa dashboard ini berguna".
- Section mobil dengan variasi tipe EV.
- Section highlight komparasi berdasarkan subsidi.
- Section langkah kerja / cara pemodelan data.
- Section insight data dengan temuan utama.
- Navbar dan footer untuk navigasi halaman.

### 4.2 Fitur yang Direncanakan

- Dashboard interaktif untuk membandingkan grup data.
- Filter berdasarkan atribut seperti gender, wilayah, tipe mobil, subsidi, dan akses charging.
- Visualisasi chart untuk hubungan faktor dengan peluang beli EV.
- Halaman detail prediksi yang menampilkan skor peluang seseorang membeli EV.
- Integrasi API / backend untuk menjalankan prediksi dari form input pengguna.

## 5. Arsitektur Sistem

### 5.1 Arsitektur Umum

EV-Web dibangun dalam tiga lapisan utama:

1. Front-end layer
   - React + Vite
   - Tailwind CSS
   - Menangani presentasi UI, navigasi, dan informasi visual.

2. Data and modeling layer
   - Dataset EV diproses menggunakan Python.
   - Modul `src/ev_web/model.py` memuat preprocessing, feature engineering, dan inferensi ensemble model.
   - Model menggunakan kombinasi XGBoost dan CatBoost untuk menghasilkan probabilitas `Will_Buy_EV`.

3. Domain data layer
   - Data asal berada di folder `data/`.
   - Metadata statistik dan insight disimpan di `src/data/stats.js`.

### 5.2 Diagram Alur Sederhana

Browser
-> React App
-> Landing Page / Dashboard
-> Data Stats / UI Cards / Chart Components
-> model inference (future API integration)

Python Model
-> raw dataset
-> feature engineering
-> ensemble predictions
-> probability output

## 6. Teknologi yang Digunakan

- React 19
- Vite
- Tailwind CSS
- JavaScript (front-end)
- Python
- pandas, numpy
- XGBoost
- CatBoost

## 7. Struktur Direktori

```text
EV-web/
├── data/                     # dataset dan artefak data
├── notebook/                 # notebook analisis eksperimen
├── public/                   # aset statis publik
├── src/
│   ├── components/           # komponen reusable
│   ├── data/                 # data statis untuk UI
│   ├── ev_web/               # modul model Python
│   ├── pages/                # halaman utama
│   ├── sections/             # section landing page
│   ├── App.jsx               # routing sederhana berbasis hash
│   ├── main.jsx              # entry point
│   └── index.css             # styling global
├── README.md
├── design.md
├── package.json
├── vite.config.js
└── pyproject.toml
```

## 8. Desain UX/UI

### 8.1 Gaya Visual

- Warna utama berfokus pada nuansa hijau dan alam untuk merepresentasikan kendaraan ramah lingkungan.
- Layout bersih dengan ruang yang cukup agar konten mudah dibaca.
- Penggunaan kartu, badge, dan icon untuk memperjelas poin informasi.

### 8.2 Prinsip Antarmuka

- Sederhana dan ringan.
- Fokus pada insight, bukan pada kompleksitas visual.
- CTA utama mengarah ke dashboard.
- Data disajikan dalam bentuk ringkas agar mudah dipahami pengguna non-teknis.

### 8.3 Alur Pengguna

1. Pengguna membuka landing page.
2. Melihat gambaran umum masalah dan minat EV.
3. Memahami alasan pentingnya analisis EV adoption.
4. Klik tombol "Buka Dashboard" untuk masuk ke halaman analitik.
5. Melihat insight dan membandingkan faktor-faktor utama.

## 9. Desain Komponen

### 9.1 Navbar

- Berisi brand EV Compass.
- Menyediakan navigasi ke bagian utama.

### 9.2 Hero

- Menampilkan headline utama tentang berpindah ke kendaraan listrik.
- Menyediakan CTA dan metrik cepat.

### 9.3 Why

- Menjelaskan alasan dashboard ini berguna.
- Menggunakan kartu fitur reusable.

### 9.4 Cars

- Menampilkan beberapa tipe EV dan preferensi pasar.
- Menyoroti kebutuhan serta karakter pengguna.

### 9.5 Highlight

- Menekankan dampak subsidi terhadap minat beli EV.

### 9.6 Steps

- Menjelaskan bagaimana data dan model bekerja.

### 9.7 Insights

- Menampilkan temuan analisis data yang penting.

### 9.8 Dashboard (Tahap Selanjutnya)

- Menyediakan filter, chart, dan ringkasan kelompok.
- Fokus pada analisis comparative dan interpretasi hasil.

## 10. Data dan Model

### 10.1 Dataset

Dataset menggambarkan profil responden dengan atribut seperti:

- usia,
- pendapatan,
- commuting distance,
- jumlah kendaraan yang dimiliki,
- ketersediaan stasiun pengisian,
- tingkat kepedulian lingkungan,
- subsidi,
- dan status pembelian EV.

### 10.2 Feature Engineering

Pada modul Python, fitur turunan dibuat untuk membantu model menangkap pola non-linier, seperti:

- `Income_per_Car`
- `Total_Charging_Stations`
- `Concern_x_Subsidy`
- `Anxiety_x_Commute`
- `Charging_Access`
- `Income_Clipped`
- `Commute_Clipped`

### 10.3 Model Prediksi

Model menggunakan ensemble dari:

- XGBoost
- CatBoost

Tujuannya adalah menghasilkan probabilitas seseorang berminat membeli EV berdasarkan kombinasi fitur yang telah diproses.

## 11. Alur Implementasi

### Fase 1: Landing Page

- Membuat struktur halaman utama.
- Menyusun konten edukasi dan insight.
- Menyediakan navigasi dan branding.

### Fase 2: Analisis Data

- Mengolah dataset resmi.
- Membuat statistik deskriptif.
- Menentukan insight utama yang relevan untuk ditampilkan.

### Fase 3: Dashboard Interaktif

- Menambahkan filter dan chart.
- Menampilkan perbandingan antar kelompok.
- Mengintegrasikan hasil prediksi.

### Fase 4: Deployment dan Uji Coba

- Verifikasi performa UI.
- Menguji responsivitas perangkat.
- Persiapan deployment ke lingkungan publik.

## 12. Kebutuhan Non-Fungsional

### 12.1 Performa

- Landing page harus ringan dan dapat dimuat dengan cepat.
- Komponen UI harus rapi dan responsif pada layar kecil maupun besar.

### 12.2 Maintainability

- Struktur komponen modular.
- Pemisahan data statis dan logika model.
- Kode JavaScript dan Python dipisah berdasarkan fungsi.

### 12.3 Accessibilitas

- Gunakan contrast yang cukup.
- Label, heading, dan navigasi yang jelas.
- Desain yang mudah dibaca dengan ukuran teks yang sesuai.

## 13. Risiko dan Tantangan

1. Dashboard belum sepenuhnya terhubung dengan model prediksi.
2. Diperlukan validasi tambahan agar insight yang ditampilkan tidak salah interpretasi.
3. Integrasi data dan model perlu dikelola dengan struktur yang konsisten agar mudah dikembangkan.
4. Visualisasi harus tetap sederhana agar pengguna umum dapat memahami tanpa penjelasan teknis yang berlebihan.

## 14. Kesimpulan

EV-Web dirancang sebagai aplikasi edukatif dan analitis yang menggabungkan data, insight, dan prediksi terkait adopsi kendaraan listrik. Dengan pendekatan berbasis landing page yang kuat dan fondasi dashboard yang siap dikembangkan, proyek ini dapat menjadi media untuk menjelaskan bagaimana faktor ekonomi, infrastruktur, dan lingkungan memengaruhi keputusan masyarakat beralih ke EV.

Pada tahap berikutnya, prioritas utama adalah mengembangkan dashboard interaktif, menghubungkan data dengan visualisasi yang informatif, dan memperkuat integrasi antara hasil analitik dengan interface pengguna.
