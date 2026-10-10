const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

/**
 * Memeriksa status kesehatan server backend dan ketersediaan model.
 */
export async function getHealth() {
  const response = await fetch(`${API_BASE_URL}/health`, {
    headers: { 'Accept': 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Health check failed with status ${response.status}`);
  }
  return response.json();
}

/**
 * Mendapatkan daftar model machine learning yang didukung dan status ketersediaannya.
 */
export async function getModels() {
  const response = await fetch(`${API_BASE_URL}/models`, {
    headers: { 'Accept': 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch models with status ${response.status}`);
  }
  return response.json();
}

/**
 * Mendapatkan skema fitur input untuk formulir prediksi dari backend.
 */
export async function getFeatures() {
  const response = await fetch(`${API_BASE_URL}/features`, {
    headers: { 'Accept': 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch features with status ${response.status}`);
  }
  return response.json();
}

/**
 * Mengirimkan fitur ke model untuk mendapatkan hasil prediksi.
 * @param {string} modelName - 'xgboost' atau 'catboost'
 * @param {object} features - objek fitur sesuai skema input model
 */
export async function postPredict(modelName, features) {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      model_name: modelName,
      features: features,
    }),
  });

  if (!response.ok) {
    let errorDetail = 'Terjadi kesalahan saat memproses prediksi.';
    try {
      const errorJson = await response.json();
      if (errorJson.detail) {
        errorDetail = typeof errorJson.detail === 'string'
          ? errorJson.detail
          : JSON.stringify(errorJson.detail);
      }
    } catch {
      // Abaikan jika respons bukan JSON
    }
    const err = new Error(errorDetail);
    err.status = response.status;
    throw err;
  }

  return response.json();
}

/**
 * Mengambil data evaluasi dashboard statis dari public/data/dashboard.json.
 * Memungkinkan dashboard tetap berfungsi saat backend prediksi belum aktif.
 */
export async function getDashboardData() {
  const response = await fetch('/data/dashboard.json', {
    headers: { 'Accept': 'application/json' },
  });
  if (!response.ok) {
    throw new Error('Gagal memuat data dashboard lokal.');
  }
  return response.json();
}

export { API_BASE_URL };
