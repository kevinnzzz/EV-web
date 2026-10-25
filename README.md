# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

---

# Backend: model dan API prediksi

Bagian ini khusus backend, yaitu model ensemble XGBoost + CatBoost yang memprediksi `Will_Buy_EV` (apakah calon
pembeli akan membeli kendaraan listrik) dan FastAPI yang menyajikannya. Kontrak endpoint, format error, dan metrik
model ada di [BACKEND.md](BACKEND.md).

## Prasyarat

- [uv](https://docs.astral.sh/uv/) untuk Python, virtualenv, dan dependency. Python 3.14.5 tidak perlu dipasang
  manual karena uv mengunduhnya sesuai `.python-version`.
- Git. File model (`model/cat.cbm` 91 MB, `model/xgb.ubj` 7 MB) ikut ter-clone karena disimpan di git biasa, tanpa
  LFS.
- Docker, hanya bila ingin menjalankan image yang sama dengan server.

Pasang uv, lalu cek dengan `uv --version`:

```bash
# macOS / Linux
curl -LsSf https://astral.sh/uv/install.sh | sh
```

```powershell
# Windows
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

## Setup

```bash
git clone https://github.com/kevinnzzz/EV-web.git
cd EV-web
uv sync
```

`uv sync` membuat `.venv` dari `uv.lock`, termasuk grup `dev` (Jupyter, Optuna, scikit-learn, pytest) untuk notebook
dan test. `uv sync --no-dev` memasang paket runtime saja, sama dengan isi image server; notebook dan `pytest` tidak
bisa dijalankan di environment itu.

Semua perintah Python dijalankan lewat `uv run`, jadi venv tidak perlu diaktifkan. Bila tetap ingin mengaktifkan:
`source .venv/bin/activate` (macOS/Linux) atau `.venv\Scripts\activate` (Windows). Untuk notebook di VS Code, pilih
kernel `.venv` milik repo ini.

Pastikan artefak model utuh dan cocok dengan hasil training:

```bash
uv run pytest
```

Ada 18 test, selesai sekitar 7 detik. Salah satunya membandingkan prediksi dengan `model/sample_predictions.csv`
(1000 baris holdout beserta probabilitas yang diharapkan) dengan toleransi 1e-6.

## Menjalankan API

```bash
uv run uvicorn ev_web.api:app --reload
```

| URL                            | Isi                                                       |
|--------------------------------|-----------------------------------------------------------|
| http://127.0.0.1:8000/docs     | Swagger UI, bisa mencoba `/predict` langsung dari browser |
| http://127.0.0.1:8000/redoc    | dokumentasi ReDoc                                         |
| http://127.0.0.1:8000/health   | status tiap model                                         |
| http://127.0.0.1:8000/features | skema 13 input beserta batas nilai dan opsi kategori      |

Model dimuat sekali saat startup. API siap setelah log `Model xgb dimuat` dan `Model cat dimuat` muncul. `--reload` me-restart server setiap file Python berubah, jadi hanya untuk
development.

Contoh request:

```bash
curl -s http://127.0.0.1:8000/predict -H "Content-Type: application/json" -d '{
  "model_name": "ensemble",
  "features": {
    "Age": 35, "Annual_Income_USD": 85000, "Daily_Commute_km": 30.0, "Number_of_Cars_Owned": 1,
    "Charging_Stations_Near_Home": 5, "Charging_Stations_Near_Work": 8, "Environmental_Concern_Level": 4,
    "Gender": "Female", "City_Type": "Urban", "Current_Car_Type": "Sedan",
    "Home_Charging_Possible": "Yes", "Subsidy_Available": "Yes", "Range_Anxiety_Level": "Low"
  }
}'
```

```powershell
$body = @'
{
  "model_name": "ensemble",
  "features": {
    "Age": 35, "Annual_Income_USD": 85000, "Daily_Commute_km": 30.0, "Number_of_Cars_Owned": 1,
    "Charging_Stations_Near_Home": 5, "Charging_Stations_Near_Work": 8, "Environmental_Concern_Level": 4,
    "Gender": "Female", "City_Type": "Urban", "Current_Car_Type": "Sedan",
    "Home_Charging_Possible": "Yes", "Subsidy_Available": "Yes", "Range_Anxiety_Level": "Low"
  }
}
'@
Invoke-RestMethod http://127.0.0.1:8000/predict -Method Post -ContentType "application/json" -Body $body
```

Response:

```json
{"model_name": "ensemble", "prediction": 1, "prediction_label": "Yes",
 "probability": 0.4982679598754899, "threshold": 0.3519219601248307}
```

`model_name` bisa `ensemble` (default), `xgboost`, atau `catboost`. Nilai di luar rentang data training ditolak
dengan status 422; rentang tiap fitur bisa dilihat di `GET /features`.

## Konfigurasi

| Variable       | Default                                       | Fungsi                                                             |
|----------------|-----------------------------------------------|--------------------------------------------------------------------|
| `MODEL_DIR`    | `model/` di root repo                         | folder artefak model                                               |
| `CORS_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` | origin browser yang boleh memanggil API, pisahkan dengan koma      |
| `PORT`         | `8000`                                        | port server, hanya dibaca image Docker (Render mengisinya sendiri) |

Origin di `CORS_ORIGINS` harus sama persis dengan yang dikirim browser: skema, domain, dan port, tanpa `/` di akhir.
`https://ev-web.vercel.app/` tidak cocok dengan `https://ev-web.vercel.app`.

```bash
CORS_ORIGINS="https://ev-web.vercel.app" uv run uvicorn ev_web.api:app
```

```powershell
$env:CORS_ORIGINS = "https://ev-web.vercel.app"; uv run uvicorn ev_web.api:app
Remove-Item Env:CORS_ORIGINS   # kembali ke default
```

## Test

```bash
uv run pytest                  # semua test
uv run pytest -k invalid -v    # test yang namanya mengandung "invalid"
```

`tests/test_api.py` memakai artefak asli di `model/`, bukan mock. Yang diuji: round-trip artefak, isi `/health`,
`/models`, dan `/features`, prediksi ketiga model, validasi input (tipe salah, di luar rentang, kategori asing, field
hilang atau tidak dikenal), body JSON rusak, mode degraded saat satu model gagal dimuat, error inference yang tidak
membocorkan detail internal, dan CORS. Test skema juga gagal bila batas input di `api.py` tidak lagi sama dengan
rentang data training.

## Docker

```bash
docker build -t ev-web-api .
docker run --rm -p 8000:8000 -e CORS_ORIGINS="http://localhost:5173" ev-web-api
```

Image berbasis `python:3.14-slim`. Dependency runtime dipasang dari `uv.lock` (`uv sync --locked`, tanpa grup dev),
lalu `src/ev_web` dan artefak model disalin. `.dockerignore` berupa allowlist sehingga file frontend, data mentah,
dan notebook tidak masuk image. Di Linux, `xgboost` diganti `xgboost-cpu` lewat marker di `pyproject.toml` agar
library NCCL untuk GPU tidak ikut terpasang. Server berjalan dengan 1 worker sebagai user non-root.

## Deploy ke Render

`render.yaml` mendefinisikan web service Docker `ev-web-api` (plan free, region Singapore, health check `/health`).

1. Push ke GitHub.
2. Render Dashboard > New > Blueprint, pilih repo ini.
3. Isi `CORS_ORIGINS` dengan origin frontend saat diminta.
4. Setelah build selesai, buka `https://<nama-service>.onrender.com/health`.

Render hanya me-rebuild bila ada perubahan di `src/ev_web/`, `model/`, `pyproject.toml`, `uv.lock`, `Dockerfile`, atau
`.dockerignore` (`buildFilter`). Push yang hanya mengubah frontend tidak me-redeploy backend.

Plan free punya RAM 512 MB dan 0.1 CPU, sementara API memakai sekitar 250 MB setelah model dimuat. Service tidur
setelah 15 menit tanpa request, dan request pertama sesudahnya menunggu sekitar 1 menit. Penanganan OOM ada di
[BACKEND.md](BACKEND.md#deploy-render-free).

## Melatih ulang model

Seluruh training ada di `notebook/main.ipynb`: EDA, feature engineering, seleksi fitur (null importance lalu
konfirmasi 10-fold), tuning Optuna, training 10-fold, ensemble, refit 3 seed lalu pemilihan seed terbaik per
algoritma, evaluasi holdout, dan penyimpanan artefak ke
`models/`. Preprocessing memakai `src/ev_web/model.py`, modul yang juga dipakai API, sehingga fitur saat training
dan saat serving dihitung dengan kode yang sama.

Smoke test di laptop memakai sampel 30 ribu baris dan budget tuning kecil (sekitar 3 menit di CPU). Artefaknya
ditulis ke folder sementara, jadi `models/` tidak tertimpa.

```bash
EV_SMOKE=1 uv run jupyter nbconvert --to notebook --execute notebook/main.ipynb --output-dir /tmp/ev-smoke
```

```powershell
$env:EV_SMOKE = "1"; uv run jupyter nbconvert --to notebook --execute notebook/main.ipynb --output-dir $env:TEMP\ev-smoke
Remove-Item Env:EV_SMOKE
```

Training penuh dijalankan di Kaggle dengan GPU T4 ×2 dan memakan sekitar 8 jam (Optuna CatBoost saja 4 jam):

1. Push perubahan ke `main`. Notebook meng-clone repo ini saat runtime untuk mengambil `src/ev_web` dan data, jadi
   dataset tidak perlu di-upload ke Kaggle.
2. Kaggle > New Notebook > File > Import Notebook > GitHub, isi
   `https://github.com/kevinnzzz/EV-web/blob/main/notebook/main.ipynb`. Hasil import adalah salinan, jadi ulangi
   langkah ini setiap notebook berubah.
3. Settings: Accelerator GPU T4 ×2, Internet ON.
4. Save Version > Save & Run All (Commit).
5. Setelah selesai, unduh folder `models/` dari tab Output.

## Mengganti model yang di-serve

API membaca `model/`, sedangkan notebook menulis ke `models/`. Setelah training:

1. Timpa isi `model/` dengan isi `models/` hasil notebook (`ensemble.json`, `xgb.ubj`, `cat.cbm`,
   `sample_predictions.csv`, `results/`).
2. Jalankan `uv run pytest`. Test round-trip memastikan model terbaca dan prediksinya sama dengan hasil di Kaggle.
   Bila test skema gagal, sesuaikan `Field(ge=..., le=...)` di class `Customer` (`src/ev_web/api.py`) dengan rentang
   data yang baru.
3. Cek ukuran file sebelum push. GitHub menolak file di atas 100 MB, dan `cat.cbm` saat ini 91 MB.
4. Commit dan push. Render me-redeploy otomatis karena `model/**` termasuk `buildFilter`.

## Mengelola dependency

- `uv add <paket>` untuk dependency runtime, yang ikut masuk image. Khusus paket yang diimpor `src/ev_web`.
- `uv add --dev <paket>` untuk paket yang hanya dipakai notebook atau test.
- `uv remove <paket>` (atau `uv remove --dev <paket>`) untuk menghapus.
- Bila `pyproject.toml` diedit manual, jalankan `uv lock`. Build Docker memakai `uv sync --locked` dan gagal bila
  `uv.lock` tidak sinkron dengan `pyproject.toml`.

scikit-learn sengaja hanya ada di grup dev. Bila terpasang, xgboost ikut mengimpornya dan memori API naik sekitar
50 MB, padahal RAM plan free Render hanya 512 MB. Karena itu XGBoost dimuat sebagai `xgboost.Booster`,
bukan `XGBClassifier` yang membutuhkan scikit-learn. Prediksi keduanya identik.

## Struktur backend

```
data/raw/predicting-electric-vehicle-purchases.csv   data mentah, 668.665 baris
notebook/main.ipynb                                   training end-to-end sampai artefak model
src/ev_web/model.py                                   preprocessing + inferensi, dipakai notebook dan API
src/ev_web/api.py                                     FastAPI: validasi input, endpoint, error
tests/test_api.py                                     uji kontrak API dan round-trip artefak
model/                                                artefak yang di-serve + grafik evaluasi (results/)
pyproject.toml, uv.lock                               dependency: runtime untuk API, grup dev untuk notebook dan test
Dockerfile, .dockerignore, render.yaml                image dan konfigurasi deploy
BACKEND.md                                            kontrak API, error, metrik model, catatan deploy
```

## Masalah yang sering muncul

| Gejala                                                 | Penyebab dan solusi                                                                  |
|--------------------------------------------------------|--------------------------------------------------------------------------------------|
| `python` tidak dikenal atau versinya salah             | jalankan lewat `uv run ...`, yang selalu memakai Python di `.venv`                    |
| startup gagal dengan `FileNotFoundError` `ensemble.json` | `MODEL_DIR` salah atau folder `model/` kosong                                      |
| `/health` berstatus `degraded`                         | satu model gagal dimuat, lihat log `Gagal memuat model ...` saat startup. Model lain tetap melayani; model yang gagal dan `ensemble` mengembalikan 503 |
| browser menampilkan error CORS                         | origin frontend belum ada di `CORS_ORIGINS`; cek skema, port, dan `/` di akhir       |
| `/predict` mengembalikan 422                           | nilai di luar rentang data training atau kategori tidak dikenal; lihat `detail.errors` dan `GET /features` |
| port 8000 sudah dipakai                                | `uv run uvicorn ev_web.api:app --port 8001`                                          |
| request pertama ke Render lambat                       | service sedang bangun dari sleep (plan free), tunggu sekitar 1 menit                  |
