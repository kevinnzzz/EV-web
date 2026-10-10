# Dashboard Data Requirements — EV Purchase Prediction Web

## 1. Purpose

Dokumen ini mengatur kebutuhan data dan visualisasi untuk halaman dashboard. Semua statistik, grafik, dan metrik harus bersumber dari dataset, hasil EDA, atau hasil evaluasi model yang valid.

## 2. Data Sources

Sumber data yang boleh digunakan:
- Dataset dan hasil preprocessing yang digunakan dalam eksperimen.
- File CSV atau JSON hasil evaluasi.
- Gambar hasil evaluasi yang tersimpan di repository.
- Hasil analisis dari notebook proyek.
- Metadata model yang dapat diverifikasi.

Jangan mengganti hasil proyek dengan angka dari internet, contoh tutorial, atau dataset lain.

## 3. Dataset Overview

Informasi yang dapat ditampilkan:
- Nama dataset.
- Jumlah observasi.
- Jumlah fitur.
- Nama target.
- Distribusi target.
- Missing values.
- Duplicate rows, jika pernah diperiksa.

Setiap angka harus memiliki sumber yang dapat ditelusuri. Jika statistik tidak tersedia, jangan menampilkan nilai perkiraan.

## 4. Exploratory Data Analysis

Pilih visualisasi yang benar-benar didukung oleh hasil EDA.

Kategori visualisasi:
- Distribusi fitur numerik.
- Distribusi fitur kategorikal.
- Distribusi kelas target.
- Hubungan fitur dengan target.
- Perbandingan kelompok yang relevan dengan minat pembelian EV.

Prioritaskan grafik yang membantu pengguna memahami karakteristik data. Hindari menampilkan semua kolom tanpa tujuan analisis yang jelas.

Setiap grafik harus mempunyai:
- Judul.
- Keterangan singkat.
- Label sumbu atau kategori.
- Sumber data.
- Satuan apabila relevan.

## 5. Model Evaluation

Tampilkan perbandingan XGBoost dan CatBoost berdasarkan hasil evaluasi aktual.

Metrik yang dapat ditampilkan jika tersedia:
- ROC-AUC.
- Accuracy.
- Precision.
- Recall.
- F1-score.

ROC-AUC dapat dijadikan metrik utama jika sesuai dengan evaluasi proyek. Jangan mencampur hasil training, validation, test, atau skor kompetisi tanpa memberi label yang jelas.

Setiap metrik harus menyertakan nama model dan jenis data evaluasi.

## 6. Evaluation Visualizations

Gunakan hasil yang tersedia, misalnya:
- ROC curve.
- Confusion matrix.
- Feature importance.
- Grafik perbandingan metrik.
- Visualisasi evaluasi lain yang telah dibuat oleh tim.

Jika gambar evaluasi sudah tersedia dan terbaca dengan baik, gambar dapat digunakan langsung. Jika grafik dibangun ulang, hasilnya harus cocok dengan data sumber.

Jangan menyimpulkan bahwa suatu model lebih baik hanya berdasarkan satu metrik tanpa konteks evaluasi.

## 7. Data Organization

Data dashboard harus dipisahkan dari komponen React.

Struktur yang disarankan:

public/
  data/
    dashboard.json
    metrics.json
  images/
    evaluation/

Nama file tersebut merupakan usulan. Sesuaikan dengan artefak yang benar-benar tersedia.

Gunakan JSON untuk data terstruktur dan gambar untuk grafik statis yang tidak perlu dibuat ulang. CSV dapat dikonversi menjadi JSON saat persiapan data jika hal itu memudahkan frontend.

## 8. Data Integrity Rules

- Jangan mengarang angka, persentase, jumlah data, atau hasil evaluasi.
- Jangan mengganti nilai yang hilang dengan angka contoh tanpa penjelasan.
- Jangan mengubah hasil metrik hanya untuk memperbaiki tampilan.
- Berikan label yang jelas untuk data training, validation, dan test.
- Jangan mencampur metrik dari eksperimen yang berbeda.
- Jika sumber data belum tersedia, tampilkan status "Data belum tersedia" atau sembunyikan section terkait.
- Catat nama file sumber untuk setiap grafik atau metrik.

## 9. Acceptance Criteria

1. Setiap angka pada dashboard berasal dari sumber yang dapat ditelusuri.
2. Grafik sesuai dengan hasil EDA atau evaluasi yang tersedia.
3. Metrik kedua model menggunakan konteks evaluasi yang jelas.
4. Data dashboard tidak bergantung pada endpoint prediksi.
5. Dashboard dapat dibuka saat backend prediksi belum berjalan.
6. Data yang belum diverifikasi tidak ditampilkan sebagai fakta.
