import React, { useState, useEffect } from 'react';
import { 
  Gauge, 
  Send, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Info
} from 'lucide-react';
import { postPredict, getHealth, API_BASE_URL } from '../services/api';

// Nilai default harus dalam rentang yang diterima API:
// Age 25-69, Annual_Income_USD 30000-188549, Daily_Commute_km 5-98.7,
// Number_of_Cars_Owned 1-4, Charging_Stations_Near_Home 0-14,
// Charging_Stations_Near_Work 0-19, Environmental_Concern_Level 1-5
// Home_Charging_Possible: 'Yes'|'No', Subsidy_Available: 'Yes'|'No'
// Range_Anxiety_Level: 'Low'|'Medium'|'High'
// Current_Car_Type: 'Hatchback'|'SUV'|'Sedan'|'Truck'
const DEFAULT_FORM_VALUES = {
  Age: 35,
  Annual_Income_USD: 80000,
  Daily_Commute_km: 25,
  Number_of_Cars_Owned: 1,
  Charging_Stations_Near_Home: 5,
  Charging_Stations_Near_Work: 5,
  Environmental_Concern_Level: 3,
  Gender: 'Male',
  City_Type: 'Urban',
  Current_Car_Type: 'Sedan',
  Home_Charging_Possible: 'Yes',
  Subsidy_Available: 'Yes',
  Range_Anxiety_Level: 'Medium',
};

const MODELS = [
  { name: 'ensemble', label: 'Ensemble', desc: 'XGBoost + CatBoost (akurasi terbaik)' },
  { name: 'xgboost', label: 'XGBoost', desc: 'Model gradient boosting berbasis tree' },
  { name: 'catboost', label: 'CatBoost', desc: 'Model gradient boosting Yandex' },
];

// Fields yang nilainya numerik murni (bukan string kategori)
const NUMERIC_FIELDS = new Set([
  'Age',
  'Annual_Income_USD',
  'Daily_Commute_km',
  'Number_of_Cars_Owned',
  'Charging_Stations_Near_Home',
  'Charging_Stations_Near_Work',
  'Environmental_Concern_Level',
]);

export default function PredictionPage() {
  const [formData, setFormData] = useState(DEFAULT_FORM_VALUES);
  const [selectedModel, setSelectedModel] = useState('ensemble');
  const [predictionState, setPredictionState] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [apiReady, setApiReady] = useState(null); // null (checking) | true | false

  useEffect(() => {
    let isMounted = true;
    async function checkApi() {
      try {
        await getHealth();
        if (isMounted) setApiReady(true);
      } catch {
        if (isMounted) setApiReady(false);
      }
    }
    checkApi();
    return () => { isMounted = false; };
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' || NUMERIC_FIELDS.has(name)
        ? (value === '' ? '' : Number(value))
        : value,
    }));
  };

  const handleReset = () => {
    setFormData(DEFAULT_FORM_VALUES);
    setPredictionState('idle');
    setResult(null);
    setErrorMessage('');
  };

  const handleModelSelect = (modelName) => {
    setSelectedModel(modelName);
    setPredictionState('idle');
    setResult(null);
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPredictionState('loading');
    setErrorMessage('');
    setResult(null);

    try {
      // Kirim payload sesuai kontrak API (Customer schema)
      const payload = {
        ...formData,
        Age: Number(formData.Age),
        Annual_Income_USD: Number(formData.Annual_Income_USD),
        Daily_Commute_km: Number(formData.Daily_Commute_km),
        Number_of_Cars_Owned: Number(formData.Number_of_Cars_Owned),
        Charging_Stations_Near_Home: Number(formData.Charging_Stations_Near_Home),
        Charging_Stations_Near_Work: Number(formData.Charging_Stations_Near_Work),
        Environmental_Concern_Level: Number(formData.Environmental_Concern_Level),
        // Home_Charging_Possible, Subsidy_Available → string 'Yes'|'No'
        // Range_Anxiety_Level → string 'Low'|'Medium'|'High'
        // Gender, City_Type, Current_Car_Type → string
      };

      const res = await postPredict(selectedModel, payload);
      setResult(res);
      setPredictionState('success');
    } catch (err) {
      setErrorMessage(
        err.message || 
        'API prediksi gagal memproses permintaan. Periksa koneksi, konfigurasi CORS, dan nilai input.'
      );
      setPredictionState('error');
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-[1360px] mx-auto space-y-10">
      {/* Header */}
      <div className="pb-6 border-b border-[#E5E3DE]">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#202522] tracking-tight">
          Prediksi Minat Pembelian Kendaraan Listrik
        </h1>
        <p className="text-sm text-[#6B6E6A] mt-1.5 max-w-2xl leading-relaxed">
          Masukkan parameter profil responden untuk mengestimasi kecenderungan pembelian mobil listrik. Hasil merupakan probabilitas statistik dari model yang telah dilatih.
        </p>
      </div>

      {/* Backend API Notice Banner if Offline */}
      {apiReady === false && (
        <div className="p-4 rounded-2xl bg-[#F6F5F2] border border-[#E5E3DE] flex items-start gap-3.5">
          <Info className="w-5 h-5 text-[#A97936] shrink-0 mt-0.5" />
          <div className="text-xs md:text-sm text-[#202522] leading-relaxed">
            <span className="font-semibold text-[#202522]">Informasi Layanan Backend: </span>
            API FastAPI belum dapat diakses di <code className="px-1.5 py-0.5 rounded bg-white font-mono text-xs text-[#26352F]">{API_BASE_URL}</code>. Jika aplikasi dibuka dari browser, pastikan server FastAPI sedang berjalan dan konfigurasi CORS mengizinkan origin frontend.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Column (7 Cols) */}
        <div className="lg:col-span-7 bg-[#F6F5F2] rounded-3xl p-6 sm:p-8 space-y-8">
          {/* Model Selection Bar */}
          <div>
            <label className="block text-xs font-semibold text-[#202522] uppercase tracking-wider mb-2.5">
              Pilih Model Machine Learning
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {MODELS.map((m) => {
                const isActive = selectedModel === m.name;
                return (
                  <button
                    key={m.name}
                    type="button"
                    onClick={() => handleModelSelect(m.name)}
                    aria-pressed={isActive}
                    className={`p-4 rounded-2xl border text-left transition-all btn-press ${
                      isActive
                        ? 'bg-[#26352F] text-white border-[#26352F] shadow-xs'
                        : 'bg-white text-[#202522] border-[#E5E3DE] hover:border-[#26352F]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm">{m.label}</span>
                      <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#5DB07E]' : 'bg-[#E5E3DE]'}`}></span>
                    </div>
                    <div className={`text-xs ${isActive ? 'text-[#EBEAE6]' : 'text-[#6B6E6A]'}`}>
                      {m.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Group 1: Profil & Demografi */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#E5E3DE] flex items-center justify-between">
                <span className="text-xs font-bold text-[#202522] uppercase tracking-wider">
                  1. Profil & Demografi
                </span>
                <span className="text-[11px] text-[#6B6E6A]">4 Atribut</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Age */}
                <div>
                  <label className="block text-xs font-medium text-[#202522] mb-1.5">
                    Usia Responden (Tahun)
                  </label>
                  <input
                    type="number"
                    name="Age"
                    min="25"
                    max="69"
                    required
                    value={formData.Age}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E3DE] text-sm text-[#202522] focus:outline-hidden focus:border-[#26352F] focus:ring-1 focus:ring-[#26352F] transition-all"
                  />
                  <span className="text-[11px] text-[#6B6E6A] mt-1 block">Rentang API: 25–69 tahun</span>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-medium text-[#202522] mb-1.5">
                    Jenis Kelamin
                  </label>
                  <select
                    name="Gender"
                    value={formData.Gender}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E3DE] text-sm text-[#202522] focus:outline-hidden focus:border-[#26352F] focus:ring-1 focus:ring-[#26352F] transition-all"
                  >
                    <option value="Female">Female (Perempuan)</option>
                    <option value="Male">Male (Laki-laki)</option>
                    <option value="Other">Other (Lainnya)</option>
                  </select>
                </div>

                {/* City Type */}
                <div>
                  <label className="block text-xs font-medium text-[#202522] mb-1.5">
                    Tipe Wilayah Domisili
                  </label>
                  <select
                    name="City_Type"
                    value={formData.City_Type}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E3DE] text-sm text-[#202522] focus:outline-hidden focus:border-[#26352F] focus:ring-1 focus:ring-[#26352F] transition-all"
                  >
                    <option value="Urban">Urban (Perkotaan)</option>
                    <option value="Suburban">Suburban (Pinggiran Kota)</option>
                    <option value="Rural">Rural (Pedesaan)</option>
                  </select>
                </div>

                {/* Annual Income USD */}
                <div>
                  <label className="block text-xs font-medium text-[#202522] mb-1.5">
                    Pendapatan Tahunan (USD)
                  </label>
                  <input
                    type="number"
                    name="Annual_Income_USD"
                    step="1"
                    min="30000"
                    max="188549"
                    required
                    value={formData.Annual_Income_USD}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E3DE] text-sm text-[#202522] focus:outline-hidden focus:border-[#26352F] focus:ring-1 focus:ring-[#26352F] transition-all"
                  />
                  <span className="text-[11px] text-[#6B6E6A] mt-1 block">Rentang API: $30.000–$188.549</span>
                </div>
              </div>
            </div>

            {/* Group 2: Mobilitas & Kendaraan */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#E5E3DE] flex items-center justify-between">
                <span className="text-xs font-bold text-[#202522] uppercase tracking-wider">
                  2. Mobilitas & Kendaraan Saat Ini
                </span>
                <span className="text-[11px] text-[#6B6E6A]">3 Atribut</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Daily Commute km */}
                <div>
                  <label className="block text-xs font-medium text-[#202522] mb-1.5">
                    Jarak Komuter (km)
                  </label>
                  <input
                    type="number"
                    name="Daily_Commute_km"
                    min="5"
                    max="98.7"
                    step="0.1"
                    required
                    value={formData.Daily_Commute_km}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E3DE] text-sm text-[#202522] focus:outline-hidden focus:border-[#26352F] focus:ring-1 focus:ring-[#26352F] transition-all"
                  />
                  <span className="text-[11px] text-[#6B6E6A] mt-1 block">Rentang API: 5–98.7 km/hari</span>
                </div>

                {/* Number of Cars Owned */}
                <div>
                  <label className="block text-xs font-medium text-[#202522] mb-1.5">
                    Jumlah Mobil Dimiliki
                  </label>
                  <input
                    type="number"
                    name="Number_of_Cars_Owned"
                    min="1"
                    max="4"
                    required
                    value={formData.Number_of_Cars_Owned}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E3DE] text-sm text-[#202522] focus:outline-hidden focus:border-[#26352F] focus:ring-1 focus:ring-[#26352F] transition-all"
                  />
                  <span className="text-[11px] text-[#6B6E6A] mt-1 block">Rentang API: 1–4 mobil</span>
                </div>

                {/* Current Car Type */}
                <div>
                  <label className="block text-xs font-medium text-[#202522] mb-1.5">
                    Tipe Mobil Saat Ini
                  </label>
                  <select
                    name="Current_Car_Type"
                    value={formData.Current_Car_Type}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E3DE] text-sm text-[#202522] focus:outline-hidden focus:border-[#26352F] focus:ring-1 focus:ring-[#26352F] transition-all"
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Truck">Truck / Pickup</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Group 3: Akses Infrastruktur Pengisian Daya */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#E5E3DE] flex items-center justify-between">
                <span className="text-xs font-bold text-[#202522] uppercase tracking-wider">
                  3. Infrastruktur Pengisian Daya
                </span>
                <span className="text-[11px] text-[#6B6E6A]">3 Atribut</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Stations Near Home */}
                <div>
                  <label className="block text-xs font-medium text-[#202522] mb-1.5">
                    Stasiun Dekat Rumah
                  </label>
                  <input
                    type="number"
                    name="Charging_Stations_Near_Home"
                    min="0"
                    max="14"
                    required
                    value={formData.Charging_Stations_Near_Home}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E3DE] text-sm text-[#202522] focus:outline-hidden focus:border-[#26352F] focus:ring-1 focus:ring-[#26352F] transition-all"
                  />
                  <span className="text-[11px] text-[#6B6E6A] mt-1 block">Rentang API: 0–14 stasiun</span>
                </div>

                {/* Stations Near Work */}
                <div>
                  <label className="block text-xs font-medium text-[#202522] mb-1.5">
                    Stasiun Dekat Kantor
                  </label>
                  <input
                    type="number"
                    name="Charging_Stations_Near_Work"
                    min="0"
                    max="19"
                    required
                    value={formData.Charging_Stations_Near_Work}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E3DE] text-sm text-[#202522] focus:outline-hidden focus:border-[#26352F] focus:ring-1 focus:ring-[#26352F] transition-all"
                  />
                  <span className="text-[11px] text-[#6B6E6A] mt-1 block">Rentang API: 0–19 stasiun</span>
                </div>

                {/* Home Charging Possible */}
                <div>
                  <label className="block text-xs font-medium text-[#202522] mb-1.5">
                    Pengisian di Rumah
                  </label>
                  <select
                    name="Home_Charging_Possible"
                    value={formData.Home_Charging_Possible}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E3DE] text-sm text-[#202522] focus:outline-hidden focus:border-[#26352F] focus:ring-1 focus:ring-[#26352F] transition-all"
                  >
                    <option value="Yes">Ya (Bisa Pasang Charger)</option>
                    <option value="No">Tidak Memungkinkan</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Group 4: Preferensi & Persepsi */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#E5E3DE] flex items-center justify-between">
                <span className="text-xs font-bold text-[#202522] uppercase tracking-wider">
                  4. Preferensi & Kebijakan
                </span>
                <span className="text-[11px] text-[#6B6E6A]">3 Atribut</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Environmental Concern Level */}
                <div>
                  <label className="block text-xs font-medium text-[#202522] mb-1.5">
                    Kepedulian Lingkungan
                  </label>
                  <select
                    name="Environmental_Concern_Level"
                    value={formData.Environmental_Concern_Level}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E3DE] text-sm text-[#202522] focus:outline-hidden focus:border-[#26352F] focus:ring-1 focus:ring-[#26352F] transition-all"
                  >
                    <option value={1}>1 (Sangat Rendah)</option>
                    <option value={2}>2 (Rendah)</option>
                    <option value={3}>3 (Cukup)</option>
                    <option value={4}>4 (Tinggi)</option>
                    <option value={5}>5 (Sangat Tinggi)</option>
                  </select>
                </div>

                {/* Subsidy Available */}
                <div>
                  <label className="block text-xs font-medium text-[#202522] mb-1.5">
                    Subsidi Pemerintah
                  </label>
                  <select
                    name="Subsidy_Available"
                    value={formData.Subsidy_Available}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E3DE] text-sm text-[#202522] focus:outline-hidden focus:border-[#26352F] focus:ring-1 focus:ring-[#26352F] transition-all"
                  >
                    <option value="Yes">Tersedia Insentif / Subsidi</option>
                    <option value="No">Tidak Ada Subsidi</option>
                  </select>
                </div>

                {/* Range Anxiety Level */}
                <div>
                  <label className="block text-xs font-medium text-[#202522] mb-1.5">
                    Range Anxiety
                  </label>
                  <select
                    name="Range_Anxiety_Level"
                    value={formData.Range_Anxiety_Level}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E3DE] text-sm text-[#202522] focus:outline-hidden focus:border-[#26352F] focus:ring-1 focus:ring-[#26352F] transition-all"
                  >
                    <option value="Low">Low (Rendah / Tenang)</option>
                    <option value="Medium">Medium (Sedang)</option>
                    <option value="High">High (Tinggi)</option>
                  </select>
                  <span className="text-[11px] text-[#6B6E6A] mt-1 block">
                    Kecemasan jarak tempuh EV (Low/Medium/High)
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-medium text-[#6B6E6A] hover:text-[#202522] hover:bg-white transition-colors btn-press"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Atur Ulang Nilai</span>
              </button>

              <button
                type="submit"
                disabled={predictionState === 'loading'}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#26352F] hover:bg-[#35483F] text-white text-sm font-semibold transition-all shadow-sm btn-press disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {predictionState === 'loading' ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Memproses Prediksi...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Jalankan Prediksi</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Result Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Result Card Container */}
          <div className="bg-[#FFFFFF] border border-[#E5E3DE] rounded-3xl p-6 sm:p-7 shadow-xs">
            <div className="pb-4 border-b border-[#E5E3DE] flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider uppercase text-[#6B6E6A]">
                Hasil Inferensi Model
              </span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-[#F6F5F2] text-[#202522] font-mono capitalize">
                {MODELS.find((m) => m.name === selectedModel)?.label ?? selectedModel}
              </span>
            </div>

            {/* State: Idle */}
            {predictionState === 'idle' && (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#F6F5F2] flex items-center justify-center text-[#6B6E6A] mx-auto">
                  <Gauge className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-[#202522]">Belum Ada Hasil Prediksi</h3>
                <p className="text-xs text-[#6B6E6A] max-w-xs mx-auto leading-relaxed">
                  Lengkapi seluruh isian di formulir sebelah kiri lalu klik tombol "Jalankan Prediksi" untuk melihat estimasi model.
                </p>
              </div>
            )}

            {/* State: Loading */}
            {predictionState === 'loading' && (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full border-3 border-[#E5E3DE] border-t-[#26352F] animate-spin mx-auto"></div>
                <div>
                  <h3 className="text-base font-semibold text-[#202522]">Menghitung Estimasi Probabilitas</h3>
                  <p className="text-xs text-[#6B6E6A] mt-1">Mengirimkan fitur ke endpoint inferensi...</p>
                </div>
              </div>
            )}

            {/* State: Success */}
            {predictionState === 'success' && result && (
              <div className="py-4 space-y-6">
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#397454]/10 text-[#397454] text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Prediksi Berhasil</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#202522]">
                    {result.prediction_label || (result.prediction === 1 ? 'Tertarik Membeli EV' : 'Belum Tertarik Membeli EV')}
                  </h3>
                  <p className="text-xs text-[#6B6E6A]">
                    Keputusan berdasarkan ambang batas klasifikasi model
                  </p>
                </div>

                {/* Probability Bar */}
                {result.probability !== null && result.probability !== undefined && (
                  <div className="bg-[#F6F5F2] rounded-2xl p-4 space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-[#6B6E6A]">Probabilitas Kelas Positif</span>
                      <span className="font-bold text-[#202522]">
                        {(result.probability * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-[#E5E3DE] rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-[#26352F] h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${Math.min(Math.max(result.probability * 100, 0), 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between gap-3 text-[11px] text-[#6B6E6A] pt-1">
                      <span>
                        Threshold model: {result.threshold === undefined
                          ? '—'
                          : `${(result.threshold * 100).toFixed(2)}%`}
                      </span>
                      <span>Keputusan API: {result.prediction === 1 ? 'Beli (Yes)' : 'Tidak (No)'}</span>
                    </div>
                  </div>
                )}

                {/* Parameters Reviewed */}
                <div className="pt-2 border-t border-[#E5E3DE] space-y-2 text-xs">
                  <span className="font-semibold text-[#202522] block">Ringkasan Fitur Dikirim:</span>
                  <div className="grid grid-cols-2 gap-2 text-[#6B6E6A]">
                    <div className="bg-[#F6F5F2] p-2.5 rounded-lg">
                      <span className="block text-[10px] uppercase text-[#6B6E6A]">Pendapatan:</span>
                      <span className="font-medium text-[#202522]">${formData.Annual_Income_USD.toLocaleString()}</span>
                    </div>
                    <div className="bg-[#F6F5F2] p-2.5 rounded-lg">
                      <span className="block text-[10px] uppercase text-[#6B6E6A]">Komuter:</span>
                      <span className="font-medium text-[#202522]">{formData.Daily_Commute_km} km/hari</span>
                    </div>
                    <div className="bg-[#F6F5F2] p-2.5 rounded-lg">
                      <span className="block text-[10px] uppercase text-[#6B6E6A]">Charger Rumah:</span>
                      <span className="font-medium text-[#202522]">{formData.Home_Charging_Possible}</span>
                    </div>
                    <div className="bg-[#F6F5F2] p-2.5 rounded-lg">
                      <span className="block text-[10px] uppercase text-[#6B6E6A]">Subsidi:</span>
                      <span className="font-medium text-[#202522]">{formData.Subsidy_Available}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* State: Error */}
            {predictionState === 'error' && (
              <div className="py-6 space-y-4">
                <div className="p-4 rounded-2xl bg-[#B94A42]/10 border border-[#B94A42]/20 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#B94A42] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-[#B94A42]">Prediksi Gagal</h4>
                    <p className="whitespace-pre-line text-xs text-[#202522] mt-1 leading-relaxed">
                      {errorMessage}
                    </p>
                  </div>
                </div>

                <div className="bg-[#F6F5F2] rounded-2xl p-4 text-xs text-[#6B6E6A] space-y-2">
                  <span className="font-semibold text-[#202522] block">Informasi API:</span>
                  <p>
                    Model yang dipilih: <code className="text-[#202522] font-mono">{selectedModel}</code>.<br />
                    Jika error koneksi terjadi, pastikan origin frontend diizinkan di konfigurasi CORS API.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full py-2.5 rounded-full bg-[#26352F] text-white text-xs font-semibold btn-press hover:bg-[#35483F] transition-colors"
                >
                  Coba Kirim Ulang Permintaan
                </button>
              </div>
            )}
          </div>

          {/* Model Specification & Interpretation Explainer */}
          <div className="bg-[#F6F5F2] rounded-3xl p-6 space-y-3">
            <h4 className="text-sm font-semibold text-[#202522] flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#26352F]" />
              <span>Tentang Inferensi Model</span>
            </h4>
            <p className="text-xs text-[#6B6E6A] leading-relaxed">
              Prediksi dikirim ke API FastAPI yang telah di-deploy. API mendukung tiga model: XGBoost, CatBoost, dan Ensemble (kombinasi keduanya). Threshold klasifikasi dikembalikan langsung oleh API.
            </p>
            <div className="text-[11px] text-[#6B6E6A] pt-2 border-t border-[#E5E3DE] space-y-0.5">
              <div>Target: <span className="font-mono text-[#202522]">Will_Buy_EV (Yes / No)</span></div>
              <div>Model aktif: <span className="font-mono text-[#202522]">{selectedModel}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
