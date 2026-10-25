const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://evmodel.vercel.app').replace(/\/$/, '');

async function readResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
}

function getApiErrorMessage(detail, fallback) {
  if (typeof detail === 'string') return detail;
  if (!detail || typeof detail !== 'object') return fallback;

  const message = detail.message || fallback;
  const fieldErrors = Array.isArray(detail.errors)
    ? detail.errors
      .map((error) => `${error.field || 'Input'}: ${error.message || 'nilai tidak valid'}`)
      .join('\n')
    : '';
  return fieldErrors ? `${message}\n${fieldErrors}` : message;
}

/**
 * Memeriksa status kesehatan server backend dan ketersediaan model.
 */
export async function getHealth() {
  const response = await fetch(`${API_BASE_URL}/`, {
    headers: { 'Accept': 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Health check failed with status ${response.status}`);
  }
  return readResponse(response);
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
 * @param {string} modelName - API deployment ini hanya menyediakan 'xgboost'
 * @param {object} features - objek fitur formulir dalam bentuk kategori aslinya
 */
export async function postPredict(modelName, features) {
  if (modelName !== 'xgboost') {
    throw new Error('API yang terhubung saat ini hanya menyediakan model XGBoost.');
  }

  const payload = {
    ...features,
    Home_Charging_Possible: features.Home_Charging_Possible === 'Yes' ? 1 : 0,
    Subsidy_Available: features.Subsidy_Available === 'Yes' ? 1 : 0,
    Range_Anxiety_Level: {
      Low: 1,
      Medium: 2,
      High: 3,
    }[features.Range_Anxiety_Level],
  };

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        `Tidak dapat menghubungi API di ${API_BASE_URL}. Periksa koneksi dan pastikan CORS FastAPI mengizinkan origin frontend.`,
      );
    }
    throw error;
  }

  const result = await readResponse(response);
  if (!response.ok) {
    const err = new Error(getApiErrorMessage(result?.detail, 'Terjadi kesalahan saat memproses prediksi.'));
    err.status = response.status;
    throw err;
  }

  return result;
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
