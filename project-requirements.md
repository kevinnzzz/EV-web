# Project Requirements — EV Purchase Prediction Web

## 1. Project Overview

EV Purchase Prediction Web adalah aplikasi web untuk menampilkan hasil analisis data dan evaluasi model machine learning yang digunakan untuk memprediksi minat pembelian kendaraan listrik (Electric Vehicle/EV).

Aplikasi menggunakan dua model klasifikasi, yaitu XGBoost dan CatBoost. Model sudah dilatih dan disimpan oleh tim machine learning. Pengembangan web berfokus pada visualisasi hasil eksperimen dan penyediaan antarmuka agar pengguna dapat mencoba prediksi.

## 2. Project Objectives

1. Menyajikan hasil eksplorasi data (EDA) melalui dashboard yang mudah dipahami.
2. Menampilkan hasil evaluasi dan perbandingan model XGBoost dengan CatBoost.
3. Memungkinkan pengguna memasukkan data dan mencoba prediksi minat pembelian kendaraan listrik.
4. Menyediakan antarmuka yang sederhana, konsisten, responsif, dan mudah digunakan.
5. Memisahkan frontend dan backend agar pengembangan dapat dilakukan oleh tim yang berbeda.

## 3. Target Users

- Pengunjung yang ingin mengetahui gambaran proyek prediksi pembelian EV.
- Pengguna yang ingin melihat data dan hasil evaluasi model.
- Pengguna yang ingin mencoba prediksi berdasarkan karakteristik yang dimasukkan.

## 4. Main Pages

### 4.1 Landing Page — `/`

Berfungsi sebagai halaman pengenalan proyek.

Konten utama:
- Nama dan deskripsi singkat proyek.
- Penjelasan tujuan prediksi.
- Ringkasan penggunaan machine learning.
- Pengenalan XGBoost dan CatBoost.
- Tombol "Coba Sekarang" yang mengarahkan pengguna ke `/dashboard`.

Landing page harus ringkas dan tidak menggantikan fungsi dashboard.

### 4.2 Dashboard — `/dashboard`

Berfungsi menampilkan informasi dataset, hasil EDA, dan evaluasi model.

Konten utama:
- Ringkasan dataset.
- Visualisasi eksplorasi data.
- Distribusi target pembelian EV.
- Perbandingan metrik XGBoost dan CatBoost.
- Visualisasi evaluasi model yang tersedia.
- Informasi singkat mengenai model yang digunakan.

Dashboard menggunakan data evaluasi yang sudah diekspor jika tersedia. Model tidak perlu dilatih ulang hanya untuk menampilkan dashboard.

### 4.3 Prediction — `/prediksi`

Berfungsi menyediakan formulir untuk mencoba prediksi.

Konten utama:
- Formulir input sesuai fitur yang dibutuhkan model.
- Pemilihan model XGBoost atau CatBoost.
- Tombol untuk menjalankan prediksi.
- Hasil prediksi dan probabilitas apabila didukung model.
- Ringkasan input yang digunakan.
- Indikator loading dan pesan kesalahan jika prediksi gagal.

Kolom formulir dan validasinya harus mengikuti skema fitur aktual dari model, bukan berdasarkan asumsi developer frontend.

## 5. Navigation

Landing page tidak menggunakan sidebar aplikasi.

Halaman `/dashboard` dan `/prediksi` menggunakan layout aplikasi yang sama, dengan sidebar berisi:
- Dashboard
- Prediksi

Sidebar harus menunjukkan halaman yang sedang aktif. Pengguna dapat berpindah antarhalaman tanpa kehilangan konsistensi layout.

## 6. Technology

- React JS
- Vite
- Tailwind CSS
- React Router untuk routing
- Recharts atau library visualisasi setara
- Lucide React untuk ikon jika diperlukan
- FastAPI sebagai backend prediksi yang dikembangkan terpisah

Gunakan dependensi yang sudah ada jika memenuhi kebutuhan. Hindari menambahkan library yang tidak diperlukan.

## 7. Development Scope

Tahap pertama berfokus pada frontend yang berjalan secara lokal.

Termasuk:
- Landing page.
- Dashboard dan visualisasi.
- Form prediksi.
- Routing.
- State loading, error, dan success.
- Integrasi API menggunakan kontrak yang disepakati.
- Responsive layout.

Tidak termasuk:
- Training ulang model.
- Sistem login dan registrasi.
- Dashboard administrator.
- Penyimpanan histori prediksi.
- Database khusus untuk pengguna.
- Deployment production.
- Pengubahan algoritma machine learning.

## 8. General Rules

- Tidak boleh mengarang nilai metrik, hasil prediksi, statistik dataset, atau kesimpulan eksperimen.
- Data evaluasi harus berasal dari artefak proyek yang valid.
- Frontend tidak boleh memuat atau menjalankan file model secara langsung.
- Jangan menampilkan fitur input yang belum diverifikasi.
- Pisahkan komponen UI, data dashboard, dan fungsi pemanggilan API.
- Semua halaman harus responsif dan memiliki state yang jelas.
