# Backend API — EV Purchase Prediction

FastAPI yang menyajikan ensemble XGBoost + CatBoost hasil run Kaggle #2 (artefak di `model/`, kode training commit
`6b75d56`). Tiap algoritma memakai satu model, yaitu seed dengan ROC-AUC holdout terbaik dari 3 seed yang dilatih
(seed 43 untuk keduanya), sehingga satu request = satu inferensi per algoritma. Dua file: `src/ev_web/api.py` (HTTP, validasi, error) dan `src/ev_web/model.py` (preprocessing + inferensi,
modul yang sama dengan yang dipakai notebook training, jadi tidak ada training/serving skew).

## Menjalankan lokal

```bash
uv sync                                  # .venv dari uv.lock
uv run uvicorn ev_web.api:app --reload   # http://127.0.0.1:8000/docs
uv run pytest                            # uji kontrak, memakai artefak asli di model/
```

Env opsional: `MODEL_DIR` (default `model/`), `CORS_ORIGINS` (default `http://localhost:5173,http://127.0.0.1:5173`,
pisahkan dengan koma). Model dimuat sekali saat startup.

## Endpoint

| Method | Path        | Isi                                                                     |
|--------|-------------|-------------------------------------------------------------------------|
| GET    | `/`         | nama, versi, `status: running`                                          |
| GET    | `/health`   | `ok` / `degraded` + status `ready`/`unavailable` per model              |
| GET    | `/models`   | `xgboost`, `catboost`, `ensemble` + metrik holdout + info artefak       |
| GET    | `/features` | skema 13 input untuk form: label, tipe, batas, opsi kategori            |
| POST   | `/predict`  | prediksi satu calon pembeli                                             |

```http
POST /predict
{
  "model_name": "ensemble",
  "features": {
    "Age": 35, "Annual_Income_USD": 85000, "Daily_Commute_km": 30.0, "Number_of_Cars_Owned": 1,
    "Charging_Stations_Near_Home": 5, "Charging_Stations_Near_Work": 8, "Environmental_Concern_Level": 4,
    "Gender": "Female", "City_Type": "Urban", "Current_Car_Type": "Sedan",
    "Home_Charging_Possible": "Yes", "Subsidy_Available": "Yes", "Range_Anxiety_Level": "Low"
  }
}

200 OK
{"model_name": "ensemble", "prediction": 1, "prediction_label": "Yes",
 "probability": 0.4982679598754899, "threshold": 0.3519219601248307}
```

`probability` = P(Will_Buy_EV = Yes), rentang 0–1, sudah terkalibrasi. `prediction = 1` jika
`probability >= threshold`.

Error selalu berbentuk `{"detail": {"code", "message", "errors"?}}`:

| Status | `code`              | Kapan                                                                  |
|--------|---------------------|------------------------------------------------------------------------|
| 400    | `INVALID_REQUEST`   | body bukan JSON / bentuk request salah                                 |
| 404    | `MODEL_NOT_FOUND`   | `model_name` bukan `xgboost` / `catboost` / `ensemble`                 |
| 422    | `INVALID_FEATURES`  | fitur hilang, tipe salah, di luar rentang, kategori asing, field asing |
| 503    | `MODEL_UNAVAILABLE` | model gagal dimuat saat startup (`/health` = `degraded`)               |
| 500    | `PREDICTION_ERROR`  | inference gagal (detail hanya di log server)                           |

```json
{"detail": {"code": "INVALID_FEATURES", "message": "Periksa kembali input yang diberikan.",
            "errors": [{"field": "features.Number_of_Cars_Owned", "message": "Input should be greater than or equal to 1"}]}}
```

## Catatan untuk tim frontend (beda dari draft kontrak awal)

1. **Ada model ketiga, `ensemble`**: skor holdout terbaik dan default bila `model_name` tidak dikirim.
   `xgboost` dan `catboost` tetap tersedia persis seperti di kontrak.
2. **Response `/predict` punya field `threshold`**: tiap model punya ambang sendiri (XGBoost 0.3526, CatBoost 0.3551,
   ensemble 0.3519). `PredictionPage.jsx` saat ini memakai `probability >= 0.352` untuk semua model. Lebih aman
   memakai `prediction_label` dari API.
3. **Batas input = rentang data training**, nilai di luar rentang ditolak 422. Ambil dari `GET /features`, jangan dari
   `public/data/dashboard.json`, karena batas di sana lebih lebar dari data:

   | Fitur                          | API (data training) | `dashboard.json` |
   |--------------------------------|---------------------|------------------|
   | `Age`                          | 25–69               | 18–80            |
   | `Annual_Income_USD`            | 30000–188549        | 15000–250000     |
   | `Daily_Commute_km`             | 5–98.7              | 1–150            |
   | `Number_of_Cars_Owned`         | 1–4                 | 0–5              |
   | `Charging_Stations_Near_Home`  | 0–14                | 0–20             |
   | `Charging_Stations_Near_Work`  | 0–19                | 0–20             |

   `Number_of_Cars_Owned = 0` tidak pernah ada di data (fitur `Income_per_Car` jadi tak terdefinisi).
   `Annual_Income_USD` harus bilangan bulat. `Daily_Commute_km` dibulatkan ke 0,1 km.
4. **`detail` error berupa objek**. `services/api.js` saat ini menampilkan `JSON.stringify(detail)`. Pesan untuk
   pengguna ada di `detail.message`, dan field yang bermasalah ada di `detail.errors[].field`.
5. `/models` juga mengembalikan `holdout_metrics` dan `artifact` (commit + waktu training) untuk menelusuri model
   mana yang sedang di-serve.
6. **Model sekarang 1 seed per algoritma, bukan rata-rata 3 seed.** Label "3 Seeds" di `DashboardPage.jsx`, teks
   "3 random seed" di `PredictionPage.jsx`, serta `seeds` dan metrik di `public/data/dashboard.json` perlu
   disesuaikan dengan tabel di bawah (atau ambil dari `GET /models`). Grafik `Evaluation.png`, `SHAP.png`, dan
   `SHAP Proportion.png` di `model/results/` sudah dibuat ulang dari model baru; salin ulang ke
   `public/images/evaluation/`.

## Model yang di-serve

Holdout 20% stratified (133,733 baris, tidak dipakai untuk training/tuning). Skor dihitung di CPU dari data mentah
dan artefak `model/`, jadi sama persis dengan prediksi API.

| Model    | ROC-AUC (CI95 bootstrap)  | PR-AUC | F1     | Precision | Recall | Brier  | Threshold |
|----------|---------------------------|--------|--------|-----------|--------|--------|-----------|
| XGBoost  | 0.9430 [0.9417, 0.9443]   | 0.7643 | 0.7189 | 0.6530    | 0.7996 | 0.0704 | 0.3526    |
| CatBoost | 0.9429 [0.9416, 0.9441]   | 0.7638 | 0.7187 | 0.6548    | 0.7964 | 0.0705 | 0.3551    |
| Ensemble | 0.9432 [0.9419, 0.9445]   | 0.7652 | 0.7191 | 0.6526    | 0.8007 | 0.0703 | 0.3519    |

Seed dipilih per algoritma dari 3 seed yang dilatih (42, 43, 44) berdasarkan ROC-AUC holdout:

| Seed | XGBoost  | CatBoost |
|------|----------|----------|
| 42   | 0.942980 | 0.942796 |
| 43   | 0.942982 | 0.942874 |
| 44   | 0.942943 | 0.942798 |

Karena holdout ikut dipakai memilih seed, skor di atas sedikit optimistis, tetapi selisih antar-seed (< 0.0001) jauh
lebih kecil dari lebar CI. ROC-AUC ensemble sama dengan versi rata-rata 3 seed (0.9432), sementara total file model
turun dari 263 MB menjadi 98 MB.

Ensemble lebih baik dari kedua model tunggal secara konsisten (ΔAUC +0.0002, CI95 paired bootstrap [0.00014,
0.00028]), tetapi selisihnya kecil karena prediksi XGBoost dan CatBoost berkorelasi 0.996. Kalibrasi sangat baik:
ECE 0.0012, rata-rata probabilitas 0.1754 vs prevalensi aktual 0.1746.

## Deploy (Render free)

1. Push ke GitHub. File `model/cat.cbm` 91 MB: di atas ambang peringatan GitHub (50 MB), di bawah batas 100 MB.
2. Render → New → Blueprint → pilih repo. `render.yaml` membuat web service Docker `ev-web-api` (Singapore).
   Isi `CORS_ORIGINS` dengan origin frontend saat diminta, misalnya `https://ev-web.vercel.app`.
3. Di frontend, set `VITE_API_BASE_URL` ke URL Render (`https://ev-web-api.onrender.com`).

Batasan plan free: 0.1 CPU / 512 MB, tidur setelah 15 menit tanpa request (bangun ±1 menit). Memori terukur ~250 MB
setelah model dimuat (sebelumnya ~410 MB dengan 3 seed), sehingga headroom ±260 MB. Image memakai 1 worker dan tanpa scikit-learn
(XGBoost dimuat sebagai `Booster`, hasil identik). Inference 1 baris ±30 ms di laptop. Di 0.1 CPU perkirakan
beberapa ratus ms. Bila muncul OOM di log Render, naikkan ke plan dengan RAM ≥ 1 GB.

## Mengganti model

Timpa `model/` dengan output notebook baru (`ensemble.json`, `xgb.ubj`, `cat.cbm`, `sample_predictions.csv`),
lalu jalankan `uv run pytest`. Uji round-trip membandingkan prediksi API dengan `sample_predictions.csv` (toleransi
1e-6), dan uji skema gagal bila batas input di `api.py` tidak lagi sama dengan rentang data training.
