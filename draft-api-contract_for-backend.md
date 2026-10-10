# API Contract Draft — EV Purchase Prediction Web

**Project:** EV Purchase Prediction Web  
**Backend:** FastAPI  
**Frontend:** React + Vite  
**Environment:** Local Development  
**API Version:** v1  
**Base URL:** `http://127.0.0.1:8000`

---

## 1. Project Overview

API ini digunakan untuk menghubungkan frontend EV Purchase Prediction Web dengan model machine learning yang telah dilatih dan disimpan.

Model yang digunakan:
- XGBoost
- CatBoost

Tanggung jawab backend:
1. Memuat model yang sudah disimpan.
2. Menjalankan preprocessing sesuai proses training.
3. Menyediakan informasi status model.
4. Menyediakan skema fitur yang dibutuhkan untuk formulir prediksi.
5. Menerima input pengguna dan menjalankan prediksi.
6. Mengembalikan hasil prediksi dalam format JSON yang konsisten.
7. Menangani input tidak valid, model yang belum siap, dan kesalahan pemrosesan.

Backend tidak perlu melakukan training ulang model.

## 2. General API Rules

### 2.1 Response Format

Semua response menggunakan JSON, kecuali apabila endpoint secara khusus dirancang untuk mengirimkan file.

### 2.2 Naming Convention

- Gunakan `snake_case` untuk nama field JSON.
- Gunakan HTTP status code sesuai kondisi.
- Gunakan nama model `xgboost` dan `catboost` sebagai identifier internal.
- Gunakan format error yang konsisten.
- Jangan mengembalikan traceback atau informasi sensitif server kepada frontend.

### 2.3 Model Loading

Model sebaiknya dimuat ketika aplikasi mulai berjalan, bukan dimuat ulang setiap kali endpoint prediksi dipanggil.

Apabila salah satu model gagal dimuat:
- API harus melaporkan model tersebut sebagai tidak tersedia.
- Model lain yang berhasil dimuat tetap dapat digunakan.
- Endpoint health harus menunjukkan status yang akurat.
- Endpoint prediksi untuk model yang tidak tersedia harus mengembalikan error yang sesuai.

### 2.4 Model and Preprocessing Consistency

Backend wajib menggunakan preprocessing yang konsisten dengan proses training.

Jangan:
- Mengubah urutan fitur tanpa alasan.
- Menggunakan encoding yang berbeda dari training.
- Mengganti penanganan missing values tanpa validasi.
- Menganggap kedua model memiliki preprocessing yang sama.
- Mengubah arti kelas prediksi tanpa dasar dari training.

---

## 3. Endpoint Summary

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/` | Informasi singkat API |
| `GET` | `/health` | Memeriksa status API dan kesiapan model |
| `GET` | `/models` | Mendapatkan daftar model yang tersedia |
| `GET` | `/features` | Mendapatkan skema fitur untuk formulir prediksi |
| `POST` | `/predict` | Menjalankan prediksi menggunakan model pilihan |

Semua endpoint di atas menggunakan prefix root untuk versi awal. Jika tim memilih prefix `/api/v1`, sepakati perubahan tersebut sebelum implementasi frontend dan backend diintegrasikan.

---

## 4. Endpoint Details

### 4.1 GET `/`

**Purpose:** Menyediakan informasi dasar API.

Response status: `200 OK`

Example response:

    {
      "name": "EV Purchase Prediction API",
      "version": "1.0.0",
      "status": "running"
    }

Ketentuan:
- Endpoint ini tidak menjalankan prediksi.
- Status `running` hanya menunjukkan bahwa aplikasi API sedang berjalan, bukan bahwa semua model siap digunakan.

### 4.2 GET `/health`

**Purpose:** Memeriksa kondisi API dan status pemuatan model.

Response status: `200 OK` apabila aplikasi API berjalan dan dapat memberikan statusnya.

Example response ketika kedua model tersedia:

    {
      "status": "ok",
      "models": {
        "xgboost": "ready",
        "catboost": "ready"
      }
    }

Example response ketika CatBoost gagal dimuat:

    {
      "status": "degraded",
      "models": {
        "xgboost": "ready",
        "catboost": "unavailable"
      }
    }

Ketentuan:
- `status` bernilai `ok` apabila semua model wajib tersedia.
- `status` bernilai `degraded` apabila API berjalan tetapi setidaknya satu model tidak tersedia.
- Jika API belum mampu melayani request sama sekali, server dapat mengembalikan status layanan yang sesuai.
- Jangan mengembalikan `ready` sebelum model berhasil dimuat.
- Jangan mengirimkan informasi internal seperti path absolut file model atau traceback.

Frontend menggunakan endpoint ini untuk memeriksa apakah layanan prediksi tersedia.

### 4.3 GET `/models`

**Purpose:** Mendapatkan daftar model yang didukung dan status ketersediaannya.

Response status: `200 OK`

Example response:

    {
      "models": [
        {
          "name": "xgboost",
          "display_name": "XGBoost",
          "available": true
        },
        {
          "name": "catboost",
          "display_name": "CatBoost",
          "available": true
        }
      ]
    }

Ketentuan:
- `name` digunakan sebagai identifier dalam request prediksi.
- `display_name` digunakan untuk ditampilkan pada UI.
- `available` bernilai `true` hanya jika model dapat digunakan untuk prediksi.
- Daftar model tetap dapat dikembalikan ketika salah satu model tidak tersedia.
- Frontend harus menonaktifkan pilihan model yang tidak tersedia.

Jangan mengasumsikan bahwa kedua model selalu tersedia hanya karena file model ada di repository.

### 4.4 GET `/features`

**Purpose:** Menyediakan skema fitur aktual yang diperlukan untuk formulir prediksi.

Endpoint ini sangat penting karena frontend tidak boleh menebak kolom input model.

Response status: `200 OK`

Example response berikut hanya ilustrasi struktur, bukan daftar fitur final:

    {
      "features": [
        {
          "name": "feature_a",
          "label": "Feature A",
          "type": "number",
          "required": true,
          "description": "Example numerical feature",
          "min": 0,
          "max": 100,
          "options": null
        },
        {
          "name": "feature_b",
          "label": "Feature B",
          "type": "select",
          "required": true,
          "description": "Example categorical feature",
          "min": null,
          "max": null,
          "options": [
            {
              "label": "Category One",
              "value": "category_one"
            },
            {
              "label": "Category Two",
              "value": "category_two"
            }
          ]
        }
      ]
    }

Nilai `feature_a`, `feature_b`, dan pilihan kategorinya hanyalah placeholder.

#### Supported field properties

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Nama field sesuai skema model |
| `label` | string | Yes | Label untuk frontend |
| `type` | string | Yes | Tipe input frontend |
| `required` | boolean | Yes | Apakah field wajib diisi |
| `description` | string/null | No | Keterangan tambahan |
| `min` | number/null | No | Batas minimum yang valid |
| `max` | number/null | No | Batas maksimum yang valid |
| `options` | array/null | No | Pilihan untuk fitur kategorikal |

Tipe input yang disarankan:
- `number`
- `integer`
- `text`
- `select`
- `boolean`

Ketentuan:
- Field harus berasal dari fitur final model yang sudah diverifikasi.
- Opsi kategori harus berasal dari skema preprocessing atau kategori valid yang telah ditentukan.
- `min` dan `max` hanya diisi jika batas yang valid dapat ditentukan dari spesifikasi fitur.
- `options` dapat bernilai `null` untuk fitur yang tidak membutuhkan pilihan.
- Jangan memasukkan target `Will_Buy_EV` sebagai fitur input.
- Jika XGBoost dan CatBoost memerlukan skema input berbeda, dokumentasikan perbedaannya dan sesuaikan response agar frontend dapat mengetahui skema untuk model yang dipilih.

Untuk implementasi awal, tim backend harus berusaha menyediakan satu skema input bersama jika kedua model memang menerima fitur yang kompatibel. Jangan memaksakan skema bersama jika secara teknis tidak sesuai.

### 4.5 POST `/predict`

**Purpose:** Menerima input pengguna dan mengembalikan hasil prediksi pembelian kendaraan listrik.

Request content type: `application/json`

#### Request body

Example berikut hanya menunjukkan struktur request. Nama fitur harus diganti dengan fitur aktual dari hasil audit.

    {
      "model_name": "xgboost",
      "features": {
        "feature_a": 25,
        "feature_b": "category_one"
      }
    }

#### Request schema

| Field | Type | Required | Description |
|---|---|---|---|
| `model_name` | string | Yes | Model yang dipilih: `xgboost` atau `catboost` |
| `features` | object | Yes | Seluruh fitur input yang diperlukan model |

#### Prediction process

Backend harus melakukan langkah berikut:

1. Memvalidasi `model_name`.
2. Memastikan model yang dipilih tersedia.
3. Memvalidasi nama field, tipe data, field wajib, dan nilai yang diperbolehkan.
4. Melakukan preprocessing sesuai model.
5. Menjalankan prediksi menggunakan model yang dipilih.
6. Mengubah hasil kelas menjadi label yang sesuai dengan mapping kelas aktual.
7. Menghitung probabilitas kelas positif jika model mendukungnya.
8. Mengembalikan response sesuai kontrak.

#### Success response

Response status: `200 OK`

Example response:

    {
      "model_name": "xgboost",
      "prediction": 1,
      "prediction_label": "Yes",
      "probability": 0.82
    }

Nilai di atas hanyalah ilustrasi dan bukan hasil model proyek.

#### Response fields

| Field | Type | Description |
|---|---|---|
| `model_name` | string | Model yang digunakan |
| `prediction` | number/string | Kelas prediksi aktual |
| `prediction_label` | string | Label kelas yang mudah dipahami |
| `probability` | number/null | Probabilitas kelas positif jika tersedia |

Ketentuan:
- Tipe `prediction` harus konsisten dengan kelas output aktual model.
- `prediction_label` harus menggunakan mapping kelas yang benar.
- Label `Yes` dan `No` hanya digunakan jika sesuai dengan mapping target `Will_Buy_EV`.
- `probability` harus merupakan probabilitas kelas positif, bukan sekadar confidence score yang tidak didefinisikan.
- Nilai probabilitas harus berada dalam rentang 0 sampai 1.
- Jika model tidak mendukung probabilitas yang valid, kembalikan `null`.
- Jangan membulatkan atau mengubah hasil model dengan cara yang mengubah maknanya.
- Frontend boleh mengubah probabilitas menjadi persentase untuk tampilan, tetapi response API tetap menggunakan angka 0–1.

---

## 5. Error Response Contract

Gunakan format error yang konsisten:

    {
      "detail": {
        "code": "INVALID_FEATURES",
        "message": "Input tidak sesuai dengan fitur yang dibutuhkan model."
      }
    }

### Error cases

| HTTP status | Error code | Condition |
|---|---|---|
| `400` | `INVALID_REQUEST` | Request tidak dapat diproses sesuai kontrak |
| `404` | `MODEL_NOT_FOUND` | Identifier model tidak dikenal |
| `422` | `INVALID_FEATURES` | Field wajib hilang, tipe salah, atau nilai tidak valid |
| `503` | `MODEL_UNAVAILABLE` | Model belum berhasil dimuat atau tidak siap |
| `500` | `PREDICTION_ERROR` | Terjadi kesalahan saat inference |

Contoh model tidak tersedia:

    {
      "detail": {
        "code": "MODEL_UNAVAILABLE",
        "message": "Model CatBoost sedang tidak tersedia."
      }
    }

Contoh fitur tidak valid:

    {
      "detail": {
        "code": "INVALID_FEATURES",
        "message": "Periksa kembali input yang diberikan."
      }
    }

Ketentuan:
- Error message harus aman ditampilkan di frontend.
- Jangan mengembalikan traceback atau detail internal server.
- Untuk error validasi FastAPI, sesuaikan format default menjadi format error di atas agar frontend mendapat response yang konsisten.
- Jika perlu, tambahkan detail field yang bermasalah tanpa mengirim informasi sensitif.
- Kesalahan internal tidak boleh disamarkan sebagai prediksi yang berhasil.

---

## 6. CORS Configuration

Karena frontend dan backend berjalan pada port yang berbeda saat development lokal, backend harus mengizinkan origin frontend.

Origin development yang diharapkan:

`http://localhost:5173`

Jika frontend juga dijalankan melalui:

`http://127.0.0.1:5173`

origin tersebut dapat ditambahkan secara eksplisit.

Ketentuan:
- Gunakan daftar origin yang jelas.
- Jangan menggunakan wildcard secara sembarangan apabila konfigurasi credentials diterapkan.
- Tidak diperlukan autentikasi untuk versi lokal awal, kecuali proyek kemudian menetapkan kebutuhan tersebut.

---

## 7. Model Loading and Inference Requirements

### Model artifacts

Gunakan file model yang sudah disimpan dan diverifikasi di repository.

Backend harus:
- Menentukan lokasi artefak secara konsisten.
- Memastikan model dapat dimuat pada startup.
- Menangani kegagalan pemuatan.
- Menggunakan versi library yang kompatibel dengan artefak.
- Tidak melatih ulang model ketika API berjalan.

### Preprocessing

Jika preprocessing belum disimpan sebagai pipeline:
- Gunakan kode preprocessing yang sama dengan training.
- Pisahkan logika preprocessing ke modul yang dapat digunakan kembali.
- Dokumentasikan perbedaan preprocessing jika ada antara kedua model.
- Jangan menggunakan encoding baru yang dapat menghasilkan representasi berbeda dari training.

### Prediction output

Pastikan:
- Mapping kelas diketahui.
- Probabilitas mengacu pada kelas positif yang benar.
- Model yang dipilih sesuai dengan response.
- Output tidak mengandung nilai NaN atau Infinity yang tidak valid untuk JSON.

---

## 8. Local Development Setup

Frontend:

`http://localhost:5173`

Backend:

`http://127.0.0.1:8000`

FastAPI Swagger documentation:

`http://127.0.0.1:8000/docs`

Backend harus menyediakan instruksi untuk:
1. Membuat virtual environment.
2. Menginstal dependensi.
3. Mengatur path artefak model.
4. Menjalankan server FastAPI.
5. Menguji endpoint.
6. Memastikan kedua model siap digunakan.

Jangan mewajibkan Docker untuk tahap lokal ini.

---

## 9. Acceptance Criteria

Backend dianggap memenuhi kontrak awal apabila:

1. `GET /` mengembalikan informasi API.
2. `GET /health` melaporkan status API dan setiap model secara akurat.
3. `GET /models` mengembalikan model beserta status ketersediaannya.
4. `GET /features` mengembalikan skema fitur aktual yang diperlukan frontend.
5. `POST /predict` dapat menjalankan prediksi dengan XGBoost.
6. `POST /predict` dapat menjalankan prediksi dengan CatBoost.
7. Input tidak valid menghasilkan error yang sesuai.
8. Model tidak tersedia menghasilkan error yang sesuai.
9. Response prediksi sesuai dengan kelas dan probabilitas model yang sebenarnya.
10. Preprocessing konsisten dengan proses training.
11. CORS mengizinkan frontend lokal.
12. Endpoint dapat diuji melalui Swagger atau HTTP client.
13. Tidak ada prediksi palsu atau metrik yang di-hardcode sebagai hasil model.

---

## 10. Testing Requirements

Tim backend harus menguji:

- API startup.
- Pemuatan XGBoost.
- Pemuatan CatBoost.
- Status health saat kedua model tersedia.
- Status health ketika salah satu model tidak tersedia.
- Request prediksi valid untuk setiap model.
- Field wajib yang hilang.
- Tipe data yang salah.
- Kategori yang tidak valid.
- Identifier model yang tidak dikenal.
- Model yang tidak tersedia.
- Bentuk dan tipe response.
- Konsistensi preprocessing dan output terhadap pemanggilan model langsung.

Untuk pengujian prediksi, gunakan input valid yang diketahui dan bandingkan hasil API dengan hasil inference langsung menggunakan artefak yang sama.

---

## 11. Out of Scope

Untuk tahap pertama, API tidak perlu menyediakan:
- Login dan registrasi.
- Penyimpanan akun pengguna.
- Riwayat prediksi.
- Database khusus untuk hasil prediksi.
- Endpoint training model.
- Endpoint upload dataset.
- Endpoint untuk membuat ulang seluruh grafik dashboard.
- Endpoint administrasi model.

Dashboard menggunakan file evaluasi statis yang disiapkan terpisah dari API prediksi.

---

## 12. Items to Confirm Before Final Integration

Sebelum frontend dan backend diintegrasikan, tim harus memastikan:

1. Nama dan tipe fitur final kedua model.
2. Apakah kedua model menggunakan skema input yang sama.
3. Cara preprocessing yang benar untuk setiap model.
4. Mapping kelas target ke label yang ditampilkan.
5. Apakah probabilitas kelas positif tersedia.
6. Apakah output prediksi berupa integer, string, atau tipe lainnya.
7. Daftar kategori dan batas input yang valid.
8. Lokasi artefak model dan versi dependensi.
9. Bentuk akhir response error.

Jangan mengganti placeholder contoh dengan asumsi. Gunakan hasil audit notebook, artefak model, dan kode training sebagai sumber kebenaran.

## 13. Final Instruction to Backend Team

Implement the FastAPI service according to this contract, using the existing trained XGBoost and CatBoost models.

The frontend will consume these endpoints and expects consistent request and response formats.

Prioritize correct model loading, preprocessing consistency, input validation, reliable inference, and predictable error handling.

If the actual model schema requires changes to this contract, document the differences and coordinate with the frontend team before changing the interface.
