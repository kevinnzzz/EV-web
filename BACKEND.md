# Backend API — EV Purchase Prediction

FastAPI yang menyajikan ensemble XGBoost + CatBoost hasil run Kaggle #2 (artefak di `model/`, kode training commit
`6b75d56`). Dua file: `src/ev_web/api.py` (HTTP, validasi, error) dan `src/ev_web/model.py` (preprocessing + inferensi,
modul yang sama dengan yang dipakai notebook training, jadi tidak ada training/serving skew).

## Menjalankan lokal

```bash
uv sync                                  # .venv dari uv.lock
uv run uvicorn ev_web.api:app --reload   # http://127.0.0.1:8000/docs
uv run pytest                            # uji kontrak, memakai artefak asli di model/
```

Env opsional: `MODEL_DIR` (default `model/`), `CORS_ORIGINS` (default `http://localhost:5173,http://127.0.0.1:5173`,
pisahkan dengan koma). Model dimuat sekali saat startup (~2 detik).

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
 "probability": 0.4943556342410368, "threshold": 0.3519219601248307}
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
5. `/models` juga mengembalikan `holdout_metrics` (sumber yang sama dengan `dashboard.json`) dan
   `artifact` (commit + waktu training) untuk menelusuri model mana yang sedang di-serve.

## Model yang di-serve

Holdout 20% stratified (133,733 baris, tidak dipakai untuk training/tuning). Skor ini direproduksi ulang di CPU dari
data mentah dan artefak `model/`. Split identik dan selisihnya terhadap `ensemble.json` ≤ 2e-9.

| Model    | ROC-AUC (CI95 bootstrap)  | PR-AUC | F1     | Precision | Recall | Brier  | Threshold |
|----------|---------------------------|--------|--------|-----------|--------|--------|-----------|
| XGBoost  | 0.9430 [0.9417, 0.9442]   | 0.7643 | 0.7186 | 0.6527    | 0.7995 | 0.0704 | 0.3526    |
| CatBoost | 0.9429 [0.9417, 0.9442]   | 0.7641 | 0.7181 | 0.6557    | 0.7936 | 0.0705 | 0.3551    |
| Ensemble | 0.9432 [0.9419, 0.9444]   | 0.7651 | 0.7189 | 0.6532    | 0.7994 | 0.0703 | 0.3519    |

Ensemble lebih baik dari kedua model tunggal secara konsisten (ΔAUC +0.0002, CI95 paired bootstrap tidak memuat 0),
tetapi selisihnya kecil karena prediksi XGBoost dan CatBoost berkorelasi 0.996. Kalibrasi sangat baik:
ECE 0.0013, rata-rata probabilitas 0.1751 vs prevalensi aktual 0.1746.

## Deploy (Render free)

1. Push ke GitHub. File `model/cat_*.cbm` 70–91 MB: di atas ambang peringatan GitHub (50 MB), di bawah batas 100 MB.
2. Render → New → Blueprint → pilih repo. `render.yaml` membuat web service Docker `ev-web-api` (Singapore).
   Isi `CORS_ORIGINS` dengan origin frontend saat diminta, misalnya `https://ev-web.vercel.app`.
3. Di frontend, set `VITE_API_BASE_URL` ke URL Render (`https://ev-web-api.onrender.com`).

Batasan plan free: 0.1 CPU / 512 MB, tidur setelah 15 menit tanpa request (bangun ±1 menit). RSS terukur ~410 MB
setelah model dimuat, sehingga headroom ±100 MB. Karena itu image memakai 1 worker dan tanpa scikit-learn
(XGBoost dimuat sebagai `Booster`, hasil identik). Inference 1 baris ±30 ms di laptop. Di 0.1 CPU perkirakan
beberapa ratus ms. Bila muncul OOM di log Render, naikkan ke plan dengan RAM ≥ 1 GB.

## Mengganti model

Timpa `model/` dengan output notebook baru (`ensemble.json`, `xgb_{i}.ubj`, `cat_{i}.cbm`, `sample_predictions.csv`),
lalu jalankan `uv run pytest`. Uji round-trip membandingkan prediksi API dengan `sample_predictions.csv` (toleransi
1e-6), dan uji skema gagal bila batas input di `api.py` tidak lagi sama dengan rentang data training.
