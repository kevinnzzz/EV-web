# Agent Instructions — Audit Repository EV Purchase Prediction

## 1. Tujuan Audit

Sebelum melakukan implementasi frontend, lakukan audit menyeluruh terhadap folder `model/`, `model/result/`, dan `notebook/` pada repository EV-web.

Repository:
https://github.com/kevinnzzz/EV-web atau di folder EV-web pada folder project

Fokus audit adalah mengidentifikasi seluruh artefak machine learning yang sudah tersedia, menentukan mana yang bisa digunakan langsung oleh frontend, dan menentukan mana yang memerlukan pengolahan tambahan atau perlu dibuat oleh pemilik proyek.

**Pada tahap ini, jangan mulai membangun UI, mengubah desain, melatih ulang model, atau membuat artefak baru. Kerjakan audit dan dokumentasikan hasilnya terlebih dahulu.**

## 2. Folder yang Wajib Diperiksa

### A. Folder `model/`

Periksa seluruh file dan subfolder di dalam folder `model/`.

Identifikasi:
- File model XGBoost yang sudah disimpan.
- File model CatBoost yang sudah disimpan.
- Format dan ukuran file model.
- File preprocessing atau pipeline, jika ada.
- File konfigurasi dan metadata model.
- File kode untuk memuat model dan melakukan prediksi.
- File pendukung lain yang berkaitan dengan inference.

Untuk setiap artefak, catat:
1. Nama dan path file.
2. Jenis atau format file.
3. Tujuan file.
4. Apakah file dapat digunakan langsung oleh browser/frontend.
5. Jika tidak, apakah file dapat digunakan oleh backend FastAPI.
6. Apakah file membutuhkan proses konversi, preprocessing, atau pengolahan tambahan.

Jangan menganggap semua file model dapat dipanggil langsung oleh React. Periksa apakah artefak membutuhkan Python, library machine learning, atau dependensi lain.

### B. Folder `model/result/`

Periksa seluruh file dan subfolder yang berisi hasil evaluasi, screenshot, grafik, tabel, atau visualisasi model.

Identifikasi seluruh artefak yang tersedia, misalnya:
- Confusion matrix.
- ROC curve.
- Feature importance.
- Perbandingan metrik model.
- Classification report.
- Grafik evaluasi lainnya.
- Screenshot hasil eksperimen.
- File CSV, JSON, atau format data terstruktur lainnya.

Untuk setiap file, catat:
1. Nama dan path file.
2. Jenis hasil yang ditampilkan.
3. Model yang dievaluasi, jika dapat diketahui.
4. Metrik atau informasi yang terkandung.
5. Apakah hasilnya berupa gambar statis atau data terstruktur.
6. Apakah bisa langsung ditampilkan di frontend.
7. Apakah lebih baik ditampilkan sebagai gambar atau dibuat ulang menjadi grafik interaktif.
8. Apakah masih diperlukan data tambahan untuk menampilkan hasil tersebut.

Kelompokkan artefak menjadi tiga kategori:

**Kategori 1 — Siap digunakan**
- Bisa langsung ditampilkan sebagai gambar atau dibaca sebagai data terstruktur.
- Tidak membutuhkan pengolahan tambahan yang signifikan.

**Kategori 2 — Perlu pengolahan**
- Memerlukan konversi CSV ke JSON.
- Memerlukan penyusunan ulang struktur data.
- Memerlukan pembuatan grafik dari data yang sudah tersedia.
- Memerlukan penambahan judul, label, keterangan, atau metadata.

**Kategori 3 — Belum tersedia atau perlu dibuat**
- Hasil yang dibutuhkan belum ditemukan.
- File tidak lengkap atau tidak dapat dibaca.
- Diperlukan ekspor tambahan dari notebook atau kode evaluasi.

Jangan menyatakan suatu artefak tidak tersedia sebelum seluruh folder dan subfolder terkait diperiksa.

### C. Folder `notebook/`

Periksa seluruh notebook yang berhubungan dengan eksperimen dan training model.

Baca kode, markdown, output sel, dan referensi file yang relevan. Jika notebook memiliki output yang belum tersimpan atau tidak tersedia dalam repository, catat keterbatasannya.

Audit hal-hal berikut:

#### 1. Data dan preprocessing
- Sumber dataset yang digunakan.
- Target prediksi.
- Kolom yang dihapus atau tidak digunakan.
- Penanganan missing values.
- Encoding fitur kategorikal.
- Transformasi fitur numerik.
- Urutan dan nama fitur final.
- Perbedaan preprocessing antara XGBoost dan CatBoost, jika ada.

#### 2. Training model
- Cara model XGBoost dilatih dan disimpan.
- Cara model CatBoost dilatih dan disimpan.
- Nama file artefak model yang dihasilkan.
- Library dan versi yang dibutuhkan, jika dapat diketahui.
- Apakah preprocessing ikut disimpan dalam pipeline atau harus dilakukan secara terpisah.

Jangan menjalankan ulang training hanya untuk melakukan audit.

#### 3. Evaluasi model
- Metrik yang dihitung.
- Data yang digunakan untuk evaluasi.
- Hasil evaluasi setiap model.
- Grafik yang dibuat.
- File hasil ekspor yang dihasilkan.
- Apakah hasil yang diekspor cocok dengan output notebook.
- Apakah tersedia data mentah yang cukup untuk membuat ulang grafik interaktif.

#### 4. Inference
- Apakah terdapat fungsi untuk memuat model tersimpan.
- Apakah terdapat fungsi prediksi yang dapat dipanggil ulang.
- Bentuk input yang diharapkan model.
- Bentuk output prediksi.
- Apakah model menghasilkan probabilitas kelas.
- Apakah diperlukan preprocessing sebelum prediksi.

Identifikasi fungsi dan kode yang dapat digunakan kembali oleh tim backend tanpa melatih ulang model.

## 3. Analisis Kesiapan Frontend

Setelah memeriksa ketiga folder, tentukan artefak mana yang cocok untuk masing-masing kebutuhan berikut.

| Kebutuhan frontend | Yang harus diperiksa |
|---|---|
| Ringkasan dataset | Statistik dataset yang sudah tersedia atau bisa dihitung dari file yang ada |
| Distribusi target | Data atau grafik distribusi kelas target |
| Visualisasi EDA | Grafik yang sudah diekspor atau data yang bisa digunakan untuk membuat grafik |
| Perbandingan model | Metrik XGBoost dan CatBoost dengan konteks evaluasi yang jelas |
| Evaluasi model | Confusion matrix, ROC curve, feature importance, atau hasil lain yang tersedia |
| Form prediksi | Nama fitur final, tipe data, kategori, dan validasi input |
| Integrasi prediksi | File model, kode pemuatan, preprocessing, dan fungsi inference |

Untuk setiap kebutuhan, berikan rekomendasi:
- Gunakan gambar statis yang sudah tersedia.
- Gunakan CSV/JSON yang tersedia.
- Buat grafik interaktif dari data yang sudah tersedia.
- Minta pemilik proyek mengekspor data tambahan.
- Minta pemilik proyek menyediakan screenshot tambahan jika data sumber tidak tersedia dan hasil hanya dapat diperoleh dari lingkungan notebook.
- Serahkan proses ke backend jika berkaitan dengan pemuatan model atau inference Python.

**Jangan meminta screenshot apabila data numerik yang dibutuhkan sebenarnya dapat diekspor dan digunakan untuk membuat grafik yang lebih baik.** Screenshot menjadi alternatif apabila hasil visual hanya tersedia sebagai gambar atau data sumbernya tidak dapat dipulihkan dengan mudah.

## 4. Identifikasi Kebutuhan Tambahan dari Pemilik Proyek

Buat daftar permintaan yang spesifik dan dapat ditindaklanjuti.

Contoh:
- Ekspor metrik evaluasi kedua model ke CSV atau JSON.
- Ekspor data confusion matrix jika hanya tersedia gambar.
- Sediakan daftar fitur final untuk formulir prediksi.
- Sediakan kode preprocessing yang dapat digunakan ulang oleh backend.
- Sediakan screenshot tertentu jika output visual tidak tersimpan dalam repository.

Jangan meminta sesuatu yang sudah tersedia. Setiap permintaan harus menyebutkan alasan, file terkait, dan format yang disarankan.

Kelompokkan hasilnya menjadi:

**A. Wajib tersedia sebelum frontend dibangun**
Informasi yang memengaruhi struktur halaman, sumber data dashboard, atau skema formulir.

**B. Bisa dikerjakan oleh agent frontend**
Misalnya konversi format data yang sederhana, penyusunan JSON, atau pembuatan grafik dari data sumber yang tersedia.

**C. Harus disediakan tim machine learning/backend**
Misalnya kode inference, preprocessing model, atau artefak yang hanya bisa dihasilkan dari lingkungan training.

**D. Opsional**
Visualisasi atau informasi tambahan yang tidak menghalangi implementasi awal.

## 5. Aturan Audit

- Jangan mengubah file repository.
- Jangan melakukan training ulang.
- Jangan mengarang metrik, nama fitur, hasil eksperimen, atau status ketersediaan file.
- Jangan mengasumsikan nama file berdasarkan pola umum.
- Periksa semua subfolder yang relevan.
- Jika file tidak bisa dibaca, catat alasan dan bukti keterbatasannya.
- Bedakan fakta yang ditemukan dari rekomendasi.
- Jangan menyatakan audit selesai jika folder yang diwajibkan belum diperiksa.
- Jika menggunakan kode untuk membaca file, utamakan operasi baca saja.
- Jangan membuka atau menampilkan isi credential, token, atau secret yang mungkin ditemukan.

## 6. Format Laporan Audit

Buat laporan dengan struktur berikut.

### A. Ringkasan
- Apakah audit selesai.
- Folder yang berhasil diperiksa.
- Jumlah dan jenis artefak yang ditemukan.
- Hambatan yang ditemukan.

### B. Inventaris Artefak
Tabel berisi:
- Path file.
- Jenis file.
- Fungsi.
- Isi atau informasi penting.
- Status penggunaan frontend.
- Status penggunaan backend.
- Tindakan yang diperlukan.

### C. Audit Notebook
Untuk setiap notebook:
- Tujuan notebook.
- Preprocessing yang digunakan.
- Fitur dan target.
- Model yang dilatih.
- Metrik yang dihitung.
- Hasil yang diekspor.
- Fungsi inference yang tersedia.
- Informasi yang masih belum diketahui.

### D. Pemetaan Kebutuhan Dashboard
Untuk setiap section dashboard:
- Data yang dibutuhkan.
- File sumber.
- Format sumber.
- Rekomendasi penyajian.
- Status kesiapan.

### E. Kesiapan Form Prediksi
Cantumkan:
- Daftar fitur yang benar-benar terverifikasi.
- Tipe setiap fitur.
- Pilihan kategori yang tersedia.
- Validasi yang diperlukan.
- Model dan preprocessing yang digunakan.
- Informasi yang belum dapat ditentukan.

### F. Daftar Kebutuhan Tambahan
Buat tabel:
- Item yang diperlukan.
- Alasan.
- Pihak yang perlu menyediakan.
- Format yang disarankan.
- Prioritas.

### G. Kesimpulan dan Rekomendasi
Tentukan apakah proyek sudah siap untuk memulai frontend, siap sebagian, atau masih memiliki penghambat penting.

Sertakan langkah konkret berikutnya berdasarkan hasil audit.

## 7. Output yang Diharapkan

Hasil akhir tahap ini adalah laporan audit repository yang lengkap dan berbasis bukti.

Pada tahap audit ini, jangan mulai mengimplementasikan halaman frontend. Setelah laporan audit selesai, tunggu konfirmasi pemilik proyek sebelum melanjutkan ke implementasi.

Tujuan akhirnya adalah memastikan tim mengetahui dengan jelas:
1. Apa yang sudah tersedia dan dapat langsung digunakan.
2. Apa yang perlu disiapkan atau diolah oleh agent.
3. Apa yang perlu diminta dari pemilik proyek.
4. Apa yang harus disiapkan tim backend.
5. Apa saja yang masih belum diketahui sebelum pengembangan frontend dimulai.
