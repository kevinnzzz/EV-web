import React, { useState, useEffect } from 'react';
import { 
  Database, 
  TrendingUp, 
  CheckCircle2, 
  Layers, 
  Maximize2, 
  X, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDashboardData } from '../services/api';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeModalImage, setActiveModalImage] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const res = await getDashboardData();
        if (isMounted) {
          setData(res);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Gagal memuat data evaluasi dashboard.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="p-6 md:p-10 space-y-8 animate-pulse">
        <div className="h-10 bg-[#F6F5F2] rounded-xl w-1/3"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-[#F6F5F2] rounded-2xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-[#F6F5F2] rounded-2xl"></div>
          <div className="h-80 bg-[#F6F5F2] rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 md:p-10">
        <div className="p-8 rounded-2xl bg-[#F6F5F2] border border-[#E5E3DE] text-center max-w-lg mx-auto">
          <AlertCircle className="w-10 h-10 text-[#B94A42] mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-[#202522] mb-1">Gagal Memuat Data</h2>
          <p className="text-sm text-[#6B6E6A] mb-5">{error || 'Data dashboard tidak tersedia saat ini.'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-full bg-[#26352F] text-white text-sm font-medium btn-press"
          >
            Muat Ulang Halaman
          </button>
        </div>
      </div>
    );
  }

  const { dataset, models, artifacts } = data;

  return (
    <div className="p-6 md:p-10 max-w-[1360px] mx-auto space-y-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E5E3DE]">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#202522] tracking-tight">
            Dashboard Analisis & Evaluasi Model
          </h1>
          <p className="text-sm text-[#6B6E6A] mt-1.5 max-w-2xl leading-relaxed">
            Eksplorasi komprehensif dataset adopsi kendaraan listrik dan perbandingan performa model klasifikasi XGBoost serta CatBoost pada data pengujian.
          </p>
        </div>

        <Link
          to="/prediksi"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#26352F] hover:bg-[#35483F] text-white text-sm font-medium transition-colors btn-press self-start md:self-auto shrink-0 shadow-xs"
        >
          <span>Uji Form Prediksi</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* SECTION A: Dataset Overview (Summary Cards) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#202522]">Ringkasan Dataset</h2>
          <span className="text-xs text-[#6B6E6A]">Sumber: Kaggle Predicting EV Purchases</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Observations */}
          <div className="bg-[#F6F5F2] rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#6B6E6A] mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Total Observasi</span>
              <Database className="w-4 h-4 text-[#26352F]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#202522]">
                {dataset.total_observations.toLocaleString('id-ID')}
              </div>
              <div className="text-xs text-[#6B6E6A] mt-1">Baris data responden valid</div>
            </div>
          </div>

          {/* Features Count */}
          <div className="bg-[#F6F5F2] rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#6B6E6A] mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Jumlah Fitur Asli</span>
              <Layers className="w-4 h-4 text-[#26352F]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#202522]">{dataset.total_features} Fitur</div>
              <div className="text-xs text-[#6B6E6A] mt-1">7 numerik, 6 kategorikal/biner</div>
            </div>
          </div>

          {/* Missing Values */}
          <div className="bg-[#F6F5F2] rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#6B6E6A] mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Nilai Kosong</span>
              <CheckCircle2 className="w-4 h-4 text-[#397454]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#397454]">0 (0,00%)</div>
              <div className="text-xs text-[#6B6E6A] mt-1">Kualitas data lengkap tanpa missing</div>
            </div>
          </div>

          {/* Target Balance */}
          <div className="bg-[#F6F5F2] rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#6B6E6A] mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Target Positif (Beli)</span>
              <TrendingUp className="w-4 h-4 text-[#26352F]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#202522]">17,46%</div>
              <div className="text-xs text-[#6B6E6A] mt-1">
                {dataset.target_distribution.Yes.count.toLocaleString('id-ID')} dari {dataset.total_observations.toLocaleString('id-ID')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION B: Model Comparison Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-[#202522]">Perbandingan Metrik Evaluasi Model</h2>
            <p className="text-xs text-[#6B6E6A] mt-0.5">
              Diuji pada data pengujian (holdout set) menggunakan threshold probabilitas optimal masing-masing model.
            </p>
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-[#EBEAE6] text-xs font-medium text-[#202522]">
            Data Holdout Test
          </span>
        </div>

        {/* Comparison Table */}
        <div className="bg-[#FFFFFF] border border-[#E5E3DE] rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F6F5F2] border-b border-[#E5E3DE] text-xs font-semibold text-[#202522]">
                <tr>
                  <th className="py-3.5 px-5">Model</th>
                  <th className="py-3.5 px-4 text-center">ROC-AUC</th>
                  <th className="py-3.5 px-4 text-center">PR-AUC</th>
                  <th className="py-3.5 px-4 text-center">Akurasi</th>
                  <th className="py-3.5 px-4 text-center">Presisi</th>
                  <th className="py-3.5 px-4 text-center">Recall</th>
                  <th className="py-3.5 px-4 text-center">F1-Score</th>
                  <th className="py-3.5 px-4 text-center">Brier Score</th>
                  <th className="py-3.5 px-4 text-center">Threshold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E3DE]">
                {/* XGBoost */}
                <tr className="hover:bg-[#F6F5F2]/50 transition-colors">
                  <td className="py-4 px-5 font-semibold text-[#202522] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#26352F]"></span>
                    <span>XGBoost</span>
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-[#202522]">0,94299</td>
                  <td className="py-4 px-4 text-center text-[#6B6E6A]">0,76431</td>
                  <td className="py-4 px-4 text-center text-[#6B6E6A]">89,07%</td>
                  <td className="py-4 px-4 text-center text-[#6B6E6A]">65,27%</td>
                  <td className="py-4 px-4 text-center text-[#6B6E6A]">79,95%</td>
                  <td className="py-4 px-4 text-center font-medium text-[#202522]">0,7186</td>
                  <td className="py-4 px-4 text-center text-[#6B6E6A]">0,0704</td>
                  <td className="py-4 px-4 text-center font-mono text-xs text-[#6B6E6A]">0,3526</td>
                </tr>

                {/* CatBoost */}
                <tr className="hover:bg-[#F6F5F2]/50 transition-colors">
                  <td className="py-4 px-5 font-semibold text-[#202522] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#397454]"></span>
                    <span>CatBoost</span>
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-[#202522]">0,94294</td>
                  <td className="py-4 px-4 text-center text-[#6B6E6A]">0,76406</td>
                  <td className="py-4 px-4 text-center text-[#6B6E6A]">89,12%</td>
                  <td className="py-4 px-4 text-center text-[#6B6E6A]">65,57%</td>
                  <td className="py-4 px-4 text-center text-[#6B6E6A]">79,36%</td>
                  <td className="py-4 px-4 text-center font-medium text-[#202522]">0,7181</td>
                  <td className="py-4 px-4 text-center text-[#6B6E6A]">0,0705</td>
                  <td className="py-4 px-4 text-center font-mono text-xs text-[#6B6E6A]">0,3551</td>
                </tr>

                {/* Ensemble */}
                <tr className="bg-[#F6F5F2]/70 font-medium">
                  <td className="py-4 px-5 font-bold text-[#202522] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#A97936]"></span>
                    <span>Ensemble (Soft Voting)</span>
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-[#397454]">0,94319</td>
                  <td className="py-4 px-4 text-center font-semibold text-[#202522]">0,76513</td>
                  <td className="py-4 px-4 text-center text-[#202522]">89,08%</td>
                  <td className="py-4 px-4 text-center text-[#202522]">65,32%</td>
                  <td className="py-4 px-4 text-center text-[#202522]">79,94%</td>
                  <td className="py-4 px-4 text-center font-bold text-[#397454]">0,7189</td>
                  <td className="py-4 px-4 text-center text-[#397454]">0,0703</td>
                  <td className="py-4 px-4 text-center font-mono text-xs text-[#202522]">0,3519</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-[#FFFFFF] border-t border-[#E5E3DE] text-xs text-[#6B6E6A]">
            Catatan: Skor ensemble menggabungkan prediksi probabilitas XGBoost (bobot 65%) dan CatBoost (bobot 35%) dengan penyesuaian prior scale rasio kelas.
          </div>
        </div>
      </section>

      {/* SECTION C: Exploratory Data Analysis (EDA) */}
      <section id="eda" className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-[#202522]">Visualisasi Eksplorasi Data (EDA)</h2>
          <p className="text-xs text-[#6B6E6A] mt-0.5">
            Analisis pola demografi, kebiasaan berkendara, dan faktor infrastruktur terhadap minat pembelian EV.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {artifacts
            .filter((a) => a.category.includes('Eksplorasi') || a.category.includes('EDA'))
            .map((art) => (
              <div 
                key={art.id} 
                className="bg-[#F6F5F2] rounded-2xl overflow-hidden flex flex-col justify-between group"
              >
                <div className="p-4 pb-2">
                  <span className="text-[11px] font-semibold tracking-wider text-[#6B6E6A] uppercase block mb-1">
                    {art.category}
                  </span>
                  <h3 className="text-base font-semibold text-[#202522]">{art.title}</h3>
                </div>

                <div 
                  className="relative bg-[#EBEAE6] p-2 cursor-pointer flex items-center justify-center min-h-[220px]"
                  onClick={() => setActiveModalImage(art)}
                >
                  <img 
                    src={art.image} 
                    alt={art.title} 
                    className="max-h-52 w-auto object-contain mix-blend-multiply group-hover:scale-102 transition-transform duration-250"
                  />
                  <div className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/80 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4 text-[#202522]" />
                  </div>
                </div>

                <div className="p-4 text-xs text-[#6B6E6A] leading-relaxed border-t border-[#E5E3DE]">
                  {art.description}
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* SECTION D: Model Evaluation & Interpretability Artifacts */}
      <section id="evaluasi" className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-[#202522]">Evaluasi Model & Interpretabilitas</h2>
          <p className="text-xs text-[#6B6E6A] mt-0.5">
            Grafik evaluasi diagnostik, matriks konfusi, kurva performa, serta signifikansi fitur SHAP.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artifacts
            .filter((a) => a.category.includes('Evaluasi') || a.category.includes('Interpretabilitas'))
            .map((art) => (
              <div 
                key={art.id} 
                className="bg-[#F6F5F2] rounded-2xl overflow-hidden flex flex-col justify-between group"
              >
                <div className="p-4 pb-2">
                  <span className="text-[11px] font-semibold tracking-wider text-[#6B6E6A] uppercase block mb-1">
                    {art.category}
                  </span>
                  <h3 className="text-base font-semibold text-[#202522]">{art.title}</h3>
                </div>

                <div 
                  className="relative bg-[#EBEAE6] p-2 cursor-pointer flex items-center justify-center min-h-[220px]"
                  onClick={() => setActiveModalImage(art)}
                >
                  <img 
                    src={art.image} 
                    alt={art.title} 
                    className="max-h-52 w-auto object-contain mix-blend-multiply group-hover:scale-102 transition-transform duration-250"
                  />
                  <div className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/80 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4 text-[#202522]" />
                  </div>
                </div>

                <div className="p-4 text-xs text-[#6B6E6A] leading-relaxed border-t border-[#E5E3DE]">
                  {art.description}
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* SECTION E: Model Architecture & Parameter Details */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[#202522]">Spesifikasi Teknis Model</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* XGBoost Spec */}
          <div className="bg-[#FFFFFF] border border-[#E5E3DE] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E3DE]">
              <div>
                <h3 className="font-semibold text-base text-[#202522]">XGBoost Architecture</h3>
                <span className="text-xs text-[#6B6E6A]">Extreme Gradient Boosting (3 Seeds)</span>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-[#26352F] text-white text-xs font-medium">
                Bobot: 65%
              </span>
            </div>

            <p className="text-xs text-[#6B6E6A] leading-relaxed">
              Model memanfaatkan 16 fitur terpilih dengan rekayasa interaksi domain (misal pendapatan per mobil, interaksi subsidi dan kepedulian lingkungan).
            </p>

            <div className="bg-[#F6F5F2] rounded-xl p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#6B6E6A]">Learning Rate:</span>
                <span className="font-mono font-medium text-[#202522]">{models.xgboost.params.learning_rate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6E6A]">Max Depth:</span>
                <span className="font-mono font-medium text-[#202522]">{models.xgboost.params.max_depth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6E6A]">Scale Pos Weight:</span>
                <span className="font-mono font-medium text-[#202522]">{models.xgboost.params.scale_pos_weight}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6E6A]">CV AUC Out-of-Fold:</span>
                <span className="font-mono font-medium text-[#397454]">{models.xgboost.cv_auc_oof}</span>
              </div>
            </div>
          </div>

          {/* CatBoost Spec */}
          <div className="bg-[#FFFFFF] border border-[#E5E3DE] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E3DE]">
              <div>
                <h3 className="font-semibold text-base text-[#202522]">CatBoost Architecture</h3>
                <span className="text-xs text-[#6B6E6A]">Categorical Gradient Boosting (3 Seeds)</span>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-[#397454] text-white text-xs font-medium">
                Bobot: 35%
              </span>
            </div>

            <p className="text-xs text-[#6B6E6A] leading-relaxed">
              Model menangani fitur kategorikal secara native serta 35 fitur lengkap termasuk encoding frekuensi nilai numerik dan interaksi domain stasiun pengisian.
            </p>

            <div className="bg-[#F6F5F2] rounded-xl p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#6B6E6A]">Learning Rate:</span>
                <span className="font-mono font-medium text-[#202522]">{models.catboost.params.learning_rate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6E6A]">Tree Depth:</span>
                <span className="font-mono font-medium text-[#202522]">{models.catboost.params.depth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6E6A]">Class Weights:</span>
                <span className="font-mono font-medium text-[#202522]">{models.catboost.params.auto_class_weights}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6E6A]">CV AUC Out-of-Fold:</span>
                <span className="font-mono font-medium text-[#397454]">{models.catboost.cv_auc_oof}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Lightbox for High-Resolution Artifact Inspection */}
      {activeModalImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveModalImage(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-4xl w-full p-6 space-y-4 shadow-xl border border-[#E5E3DE]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E3DE]">
              <div>
                <span className="text-xs text-[#6B6E6A] uppercase font-semibold">{activeModalImage.category}</span>
                <h3 className="text-lg font-semibold text-[#202522]">{activeModalImage.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalImage(null)}
                className="p-2 rounded-full hover:bg-[#F6F5F2] text-[#202522] btn-press"
                aria-label="Tutup pratinjau"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#EBEAE6] rounded-2xl p-4 flex items-center justify-center max-h-[70vh] overflow-hidden">
              <img 
                src={activeModalImage.image} 
                alt={activeModalImage.title}
                className="max-h-[65vh] w-auto object-contain mix-blend-multiply" 
              />
            </div>

            <p className="text-xs md:text-sm text-[#6B6E6A]">
              {activeModalImage.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
