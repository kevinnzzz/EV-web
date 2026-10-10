# Frontend Requirements — EV Purchase Prediction Web

## 1. Purpose

Dokumen ini menjadi acuan implementasi frontend React untuk aplikasi EV Purchase Prediction Web.

Frontend dikembangkan lebih dahulu dengan data dashboard yang sudah diekspor dan kontrak API sementara. Backend akan menyesuaikan implementasinya dengan kontrak tersebut.

## 2. Existing Stack

Repository awal menggunakan React, Vite, dan Tailwind CSS. Pertahankan konfigurasi yang sudah berfungsi sebelum melakukan perubahan struktur.

Gunakan:
- React untuk UI.
- Vite untuk development server dan build.
- Tailwind CSS untuk styling.
- React Router untuk navigasi.
- Recharts untuk grafik apabila sesuai.
- Lucide React untuk ikon apabila diperlukan.

## 3. Routes

| Route | Page | Layout |
|---|---|---|
| `/` | Landing Page | Public layout |
| `/dashboard` | Dashboard | App layout with sidebar |
| `/prediksi` | Prediction | App layout with sidebar |

Semua route harus dapat diakses langsung melalui URL, bukan hanya dengan klik tombol navigasi.

## 4. Landing Page

Komponen yang diperlukan:
- Header sederhana dengan nama atau logo proyek.
- Hero section dengan judul dan deskripsi.
- Primary CTA: "Coba Sekarang".
- Ringkasan fungsi dashboard.
- Ringkasan model XGBoost dan CatBoost.
- Footer sederhana.

Perilaku:
- CTA mengarahkan pengguna ke `/dashboard`.
- Tampilan harus ringkas dan tidak terlalu padat.
- Jangan menampilkan statistik atau skor model yang belum diverifikasi.

## 5. Application Layout

Layout aplikasi digunakan bersama oleh halaman dashboard dan prediksi.

Komponen:
- Sidebar.
- Identitas aplikasi.
- Navigasi Dashboard dan Prediksi.
- Indikator halaman aktif.
- Area konten utama.
- Penyesuaian sidebar untuk layar kecil.

Perilaku:
- Navigasi menggunakan React Router.
- Sidebar tidak ditampilkan di landing page.
- Pada layar kecil, sidebar boleh berubah menjadi drawer atau menu yang dapat dibuka.
- Layout harus konsisten di kedua halaman aplikasi.

## 6. Dashboard Page

Dashboard dibagi menjadi beberapa section.

### 6.1 Dataset Overview

Menampilkan ringkasan dataset yang tersedia dan telah diverifikasi, misalnya:
- Jumlah baris.
- Jumlah fitur.
- Distribusi target.
- Jumlah missing values jika hasil audit tersedia.

Tampilkan hanya informasi yang memiliki sumber data jelas.

### 6.2 Exploratory Data Analysis

Menampilkan grafik berdasarkan hasil EDA yang sudah dilakukan.

Pilihan visualisasi ditentukan berdasarkan artefak yang benar-benar tersedia, misalnya:
- Distribusi fitur numerik.
- Distribusi fitur kategorikal.
- Distribusi kelas target.
- Perbandingan fitur dengan target.
- Grafik lain yang relevan dengan hasil analisis.

Hindari membuat grafik duplikat atau grafik yang tidak memiliki nilai analitis.

### 6.3 Model Comparison

Menampilkan XGBoost dan CatBoost dalam satu area perbandingan.

Metrik yang dapat ditampilkan jika tersedia:
- ROC-AUC.
- Accuracy.
- Precision.
- Recall.
- F1-score.

ROC-AUC menjadi metrik utama apabila sesuai dengan hasil evaluasi proyek. Jangan mengasumsikan seluruh metrik di atas telah dihitung.

### 6.4 Model Evaluation

Tampilkan visualisasi evaluasi yang tersedia, seperti:
- ROC curve.
- Confusion matrix.
- Feature importance.
- Grafik evaluasi lain dari hasil eksperimen.

Gunakan gambar hasil evaluasi secara langsung jika gambar tersebut sudah tersedia dan sesuai. Jika grafik harus dibuat dari CSV atau JSON, gunakan data asli dan pastikan hasilnya konsisten dengan sumber.

### 6.5 Model Information

Berikan informasi singkat mengenai model dan sumber evaluasinya. Jangan menetapkan model terbaik sebelum hasil yang valid diperiksa.

## 7. Prediction Page

### 7.1 Input Form

Form dibuat berdasarkan fitur input aktual yang diperlukan model.

Ketentuan:
- Label input mudah dipahami.
- Gunakan dropdown untuk kategori dengan pilihan terbatas.
- Gunakan input numerik untuk fitur numerik.
- Tampilkan satuan jika relevan.
- Validasi nilai wajib dan rentang input.
- Berikan pesan error dekat dengan input yang bermasalah.
- Jangan meminta ID dataset atau target `Will_Buy_EV` sebagai input prediksi, kecuali secara khusus dibuktikan diperlukan model.

### 7.2 Model Selection

Sediakan pilihan:
- XGBoost
- CatBoost

Nilai internal yang dikirim ke API:
- `xgboost`
- `catboost`

### 7.3 Prediction Result

Setelah API mengembalikan hasil, tampilkan:
- Label prediksi.
- Probabilitas kelas positif jika tersedia.
- Nama model.
- Ringkasan data yang dikirim.
- Pesan yang menjelaskan hasil tanpa menyatakan prediksi sebagai kepastian.

### 7.4 Prediction States

Sediakan state:
- Idle: belum ada prediksi.
- Loading: permintaan sedang diproses.
- Success: prediksi berhasil.
- Error: prediksi gagal.

Tombol prediksi dinonaktifkan selama permintaan berlangsung untuk mencegah pengiriman berulang.

## 8. API Integration

Base URL diambil dari environment variable:

`VITE_API_BASE_URL=http://127.0.0.1:8000`

Endpoint awal:
- `GET /health`
- `GET /models`
- `GET /features`
- `POST /predict`

Buat service terpisah, misalnya `src/services/predictionApi.js`. Komponen UI tidak boleh menyebarkan pemanggilan `fetch` secara langsung di banyak tempat.

Frontend harus menangani:
- API tidak dapat diakses.
- Response tidak valid.
- Input tidak valid.
- Model belum siap.
- Request gagal.
- Waktu tunggu yang terlalu lama jika timeout diterapkan.

Jangan menampilkan data prediksi contoh sebagai hasil prediksi nyata.

## 9. Dashboard Data Source

Dashboard menggunakan data statis dari file JSON, CSV, atau gambar hasil evaluasi yang telah diekspor.

Sumber data dipisahkan dari komponen visual. Contohnya:
- `public/data/dashboard.json`
- `public/data/metrics.json`
- `public/images/evaluation/`

Nama file di atas adalah usulan struktur, bukan pernyataan bahwa file tersebut sudah tersedia.

## 10. Code Organization

Pisahkan kode menjadi:
- `pages/` untuk halaman.
- `components/` untuk komponen yang dapat digunakan kembali.
- `layouts/` untuk layout.
- `services/` untuk API.
- `types/` atau skema data jika dibutuhkan.
- `public/data/` untuk data dashboard statis.

Gunakan nama komponen dan variabel yang jelas serta hindari membuat satu komponen besar untuk seluruh aplikasi.

## 11. Responsive and Accessibility

- Mendukung desktop, tablet, dan mobile.
- Memiliki kontras teks yang memadai.
- Semua input memiliki label.
- Tombol dapat digunakan dengan keyboard.
- Grafik memiliki judul dan konteks yang jelas.
- Jangan mengandalkan warna saja untuk membedakan hasil.

## 12. Acceptance Criteria

Frontend dianggap memenuhi tahap awal apabila:
1. Ketiga route dapat diakses.
2. CTA landing page menuju dashboard.
3. Sidebar bekerja dan menunjukkan halaman aktif.
4. Dashboard membaca data dari sumber yang disiapkan.
5. Tidak ada angka evaluasi yang dibuat-buat.
6. Form prediksi menggunakan skema fitur yang disepakati.
7. Pemilihan model mengirim nilai yang benar.
8. Loading, success, dan error ditangani.
9. Build frontend berhasil.
10. Frontend tetap dapat menampilkan dashboard meskipun backend prediksi belum dijalankan.
