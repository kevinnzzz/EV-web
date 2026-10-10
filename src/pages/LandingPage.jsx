import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Database, 
  BarChart3, 
  Zap, 
  GitCompare, 
  ChevronRight,
  TrendingUp,
  Cpu,
  Menu,
  X
} from 'lucide-react';
import heroImage from '../assets/hero-section.jpeg';

export default function LandingPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const previewCards = [
    {
      title: 'Kurva ROC-AUC',
      category: 'Evaluasi Model',
      meta: 'XGBoost & CatBoost > 0.94 ROC-AUC',
      image: '/images/evaluation/roc-auc.png',
      link: '/dashboard#evaluasi'
    },
    {
      title: 'Confusion Matrix',
      category: 'Evaluasi Model',
      meta: 'Distribusi akurasi pada threshold optimal',
      image: '/images/evaluation/confusion matrix.png',
      link: '/dashboard#evaluasi'
    },
    {
      title: 'Distribusi Target',
      category: 'Eksplorasi Data',
      meta: '116.779 berniat (17.5%), 551.886 tidak (82.5%)',
      image: '/images/evaluation/Target Distribution.png',
      link: '/dashboard#eda'
    },
    {
      title: 'Distribusi Fitur',
      category: 'Eksplorasi Data',
      meta: 'Sebaran 13 variabel demografi & mobilitas',
      image: '/images/evaluation/features dsitribution.png',
      link: '/dashboard#eda'
    },
    {
      title: 'Minat EV per Fitur',
      category: 'Analisis EDA',
      meta: 'Korelasi subsidi & pengisian daya rumah',
      image: '/images/evaluation/buy ev percentage by feature.png',
      link: '/dashboard#eda'
    },
    {
      title: 'Feature Importance',
      category: 'Interpretabilitas',
      meta: 'Pengaruh variabel terhadap prediksi model',
      image: '/images/evaluation/xgb hyperparameter features importance.png',
      link: '/dashboard#evaluasi'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#202522]">
      {/* Floating Translucent Capsule Header */}
      <div className="fixed top-4 left-0 right-0 z-50 px-4 flex justify-center">
        <header className="w-full max-w-[1260px] bg-white/90 backdrop-blur-md border border-[#E5E3DE] rounded-full px-5 py-3 shadow-xs flex items-center justify-between transition-all">
          {/* Left: Brand Identity */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#26352F] flex items-center justify-center text-white">
              <Zap className="w-4 h-4" />
            </div>
            <span className="font-semibold text-sm md:text-base tracking-tight text-[#202522]">
              EV Predictor
            </span>
          </Link>

          {/* Center: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#6B6E6A]">
            <a href="#hero" className="hover:text-[#202522] transition-colors">Beranda</a>
            <a href="#tentang-proyek" className="hover:text-[#202522] transition-colors">Tentang Proyek</a>
            <Link to="/dashboard" className="hover:text-[#202522] transition-colors">Dashboard</Link>
            <Link to="/prediksi" className="hover:text-[#202522] transition-colors">Prediksi</Link>
          </nav>

          {/* Right: Primary CTA Button & Mobile Toggle */}
          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-4 md:px-5 py-2 rounded-full bg-[#26352F] hover:bg-[#35483F] text-white text-xs md:text-sm font-medium transition-colors btn-press shadow-xs"
            >
              <span>Coba Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden p-2 rounded-full text-[#202522] hover:bg-[#F6F5F2] btn-press"
              aria-label="Toggle menu"
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>
      </div>

      {/* Mobile Nav Overlay Menu */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 bg-white/95 backdrop-blur-md pt-24 px-6 md:hidden flex flex-col justify-between pb-8">
          <div className="space-y-4 text-lg font-medium text-[#202522]">
            <a 
              href="#hero" 
              onClick={() => setMobileNavOpen(false)}
              className="block py-2 border-b border-[#E5E3DE]"
            >
              Beranda
            </a>
            <a 
              href="#tentang-proyek" 
              onClick={() => setMobileNavOpen(false)}
              className="block py-2 border-b border-[#E5E3DE]"
            >
              Tentang Proyek
            </a>
            <Link 
              to="/dashboard" 
              onClick={() => setMobileNavOpen(false)}
              className="block py-2 border-b border-[#E5E3DE]"
            >
              Dashboard
            </Link>
            <Link 
              to="/prediksi" 
              onClick={() => setMobileNavOpen(false)}
              className="block py-2 border-b border-[#E5E3DE]"
            >
              Prediksi
            </Link>
          </div>
          <Link
            to="/dashboard"
            onClick={() => setMobileNavOpen(false)}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#26352F] text-white text-sm font-medium btn-press"
          >
            <span>Buka Dashboard Analisis</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Hero Section */}
      <section id="hero" className="relative min-h-[600px] md:min-h-[660px] pt-28 md:pt-32 pb-16 flex items-center overflow-hidden border-b border-[#E5E3DE]">
        {/* Hero Background Image with Responsive Automotive Cover & Fade */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        {/* Soft Linear Gradient Fade Overlay ensuring high contrast readable typography */}
        <div className="absolute inset-0 z-1 bg-gradient-to-r from-white via-white/90 md:via-white/80 to-white/20 md:to-transparent" />

        <div className="relative z-10 w-full max-w-[1260px] mx-auto px-5 md:px-8">
          <div className="max-w-xl md:max-w-2xl">
            {/* Project Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F6F5F2] border border-[#E5E3DE] text-xs font-medium text-[#26352F] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#397454]"></span>
              <span>Machine Learning untuk Mobilitas Berkelanjutan</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-semibold tracking-tight text-[#202522] leading-[1.12] mb-5">
              Prediksi Minat Pembelian Kendaraan Listrik
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#6B6E6A] leading-relaxed max-w-xl mb-8">
              Analisis berbasis data terhadap 668.000 responden untuk memahami faktor kunci adopsi mobil listrik melalui model XGBoost dan CatBoost yang telah dioptimasi.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-12">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#26352F] hover:bg-[#35483F] text-white text-sm font-medium transition-colors shadow-sm btn-press"
              >
                <span>Coba Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/90 hover:bg-[#F6F5F2] text-[#202522] border border-[#E5E3DE] text-sm font-medium transition-colors btn-press"
              >
                <span>Lihat Dashboard</span>
              </Link>
            </div>

            {/* Three Hero Indicators (Verified Project Facts) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#E5E3DE]/80">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/80 border border-[#E5E3DE] flex items-center justify-center text-[#26352F] shrink-0">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-bold text-[#202522] leading-tight">668.665</div>
                  <div className="text-xs text-[#6B6E6A]">Data Observasi</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/80 border border-[#E5E3DE] flex items-center justify-center text-[#26352F] shrink-0">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-bold text-[#202522] leading-tight">2 Model</div>
                  <div className="text-xs text-[#6B6E6A]">XGBoost & CatBoost</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/80 border border-[#E5E3DE] flex items-center justify-center text-[#26352F] shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-bold text-[#202522] leading-tight">&gt; 94.3%</div>
                  <div className="text-xs text-[#6B6E6A]">Skor ROC-AUC Validasi</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Tentang Proyek (4 Cards Surface) */}
      <section id="tentang-proyek" className="py-16 md:py-20 bg-[#FFFFFF]">
        <div className="w-full max-w-[1160px] mx-auto px-5 md:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-[#E5E3DE]">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#6B6E6A]">Fondasi Analitis</span>
              <h2 className="text-2xl md:text-3xl font-semibold text-[#202522] mt-1">Tentang Proyek</h2>
            </div>
            <Link 
              to="/dashboard" 
              className="mt-3 md:mt-0 inline-flex items-center gap-1.5 text-xs md:text-sm font-medium text-[#26352F] hover:text-[#35483F] group"
            >
              <span>Pelajari hasil evaluasi</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-[#F6F5F2] rounded-2xl p-6 transition-transform hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#26352F] flex items-center justify-center text-white shrink-0">
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-[#202522] leading-tight">Analisis Data EV</h3>
              </div>
              <p className="text-xs md:text-sm text-[#6B6E6A] leading-relaxed">
                Eksplorasi terhadap 13 atribut profil responden mencakup pendapatan, jarak tempuh, hingga infrastruktur pengisian daya.
              </p>
            </div>

            <div className="bg-[#F6F5F2] rounded-2xl p-6 transition-transform hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#26352F] flex items-center justify-center text-white shrink-0">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-[#202522] leading-tight">Evaluasi Model</h3>
              </div>
              <p className="text-xs md:text-sm text-[#6B6E6A] leading-relaxed">
                Uji performa terstandar menggunakan kurva ROC, Precision-Recall, Confusion Matrix, dan metrik Brier Score pada data holdout.
              </p>
            </div>

            <div className="bg-[#F6F5F2] rounded-2xl p-6 transition-transform hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#26352F] flex items-center justify-center text-white shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-[#202522] leading-tight">Prediksi Minat</h3>
              </div>
              <p className="text-xs md:text-sm text-[#6B6E6A] leading-relaxed">
                Antarmuka formulir interaktif untuk menguji probabilitas kecenderungan pembelian kendaraan listrik berdasarkan skema model.
              </p>
            </div>

            <div className="bg-[#F6F5F2] rounded-2xl p-6 transition-transform hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#26352F] flex items-center justify-center text-white shrink-0">
                  <GitCompare className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-[#202522] leading-tight">Komparasi Model</h3>
              </div>
              <p className="text-xs md:text-sm text-[#6B6E6A] leading-relaxed">
                Perbandingan objektif antara pendekatan Gradient Boosting pohon keputusan XGBoost dan CatBoost dengan optimasi parameter.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Preview Analisis (3 x 2 Catalog Replacement) */}
      <section className="py-16 bg-[#FFFFFF]">
        <div className="w-full max-w-[1160px] mx-auto px-5 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-[#E5E3DE]">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#6B6E6A]">Artefak Eksperimen</span>
              <h2 className="text-2xl md:text-3xl font-semibold text-[#202522] mt-1">Preview Analisis & Visualisasi</h2>
            </div>
            <Link 
              to="/dashboard" 
              className="mt-3 md:mt-0 inline-flex items-center gap-1.5 text-xs md:text-sm font-medium text-[#26352F] hover:text-[#35483F] group"
            >
              <span>Buka seluruh grafik di Dashboard</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* 3x2 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {previewCards.map((card, idx) => (
              <div 
                key={idx}
                className="bg-[#F6F5F2] rounded-2xl overflow-hidden flex flex-col group transition-all duration-200 hover:shadow-xs"
              >
                {/* Image Container with Badge */}
                <div className="relative h-48 bg-[#EBEAE6] overflow-hidden flex items-center justify-center p-2">
                  <img 
                    src={card.image} 
                    alt={card.title}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-102 transition-transform duration-250" 
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#26352F] text-white text-[11px] font-medium tracking-wide">
                    {card.category}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-[#202522] mb-1">{card.title}</h3>
                    <p className="text-xs text-[#6B6E6A] leading-relaxed">{card.meta}</p>
                  </div>
                  <div className="pt-4 mt-3 border-t border-[#E5E3DE] flex items-center justify-between">
                    <span className="text-xs font-medium text-[#26352F]">Hasil Validasi Terverifikasi</span>
                    <Link
                      to={card.link}
                      className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-[#E5E3DE] flex items-center justify-center text-[#202522] group-hover:bg-[#26352F] group-hover:text-white transition-colors btn-press"
                      aria-label={`Lihat detail ${card.title}`}
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Banner CTA (Container ~1210px in Deep Green) */}
      <section className="py-12 px-4 flex justify-center">
        <div className="w-full max-w-[1210px] bg-[#26352F] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-sm">
          {/* Subtle background decoration */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-15 pointer-events-none hidden md:block">
            <div className="w-full h-full bg-gradient-to-l from-white/20 to-transparent"></div>
          </div>

          <div className="max-w-xl relative z-10">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#EBEAE6] mb-2 block">
              Uji Coba Langsung
            </span>
            <h2 className="text-2xl md:text-3xl font-semibold text-white leading-tight mb-4">
              Ingin Mengetahui Estimasi Minat Pembelian EV?
            </h2>
            <p className="text-sm md:text-base text-[#EBEAE6] leading-relaxed mb-8">
              Gunakan formulir inferensi untuk memasukkan profil responden dan amati probabilitas prediksi menggunakan model XGBoost atau CatBoost.
            </p>
            <Link
              to="/prediksi"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white text-[#26352F] hover:bg-[#F6F5F2] text-sm font-semibold transition-colors btn-press shadow-sm"
            >
              <span>Mulai Uji Prediksi</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 4: Alur Proyek (3 Step Cards) */}
      <section className="py-16 bg-[#FFFFFF]">
        <div className="w-full max-w-[1160px] mx-auto px-5 md:px-8">
          <div className="mb-10 pb-4 border-b border-[#E5E3DE]">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#6B6E6A]">Metodologi</span>
            <h2 className="text-2xl md:text-3xl font-semibold text-[#202522] mt-1">Alur Eksperimen Machine Learning</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#F6F5F2] rounded-2xl p-6 relative">
              <div className="text-xs font-bold text-[#6B6E6A] tracking-wider mb-3">LANGKAH 01</div>
              <h3 className="text-lg font-semibold text-[#202522] mb-2">Eksplorasi & Preprocessing Data</h3>
              <p className="text-xs md:text-sm text-[#6B6E6A] leading-relaxed">
                Pembersihan 668.665 data observasi, identifikasi nilai kosong, rekayasa fitur interaksi, dan encoding variabel kategorikal.
              </p>
            </div>

            <div className="bg-[#F6F5F2] rounded-2xl p-6 relative">
              <div className="text-xs font-bold text-[#6B6E6A] tracking-wider mb-3">LANGKAH 02</div>
              <h3 className="text-lg font-semibold text-[#202522] mb-2">Pelatihan & Validasi Model</h3>
              <p className="text-xs md:text-sm text-[#6B6E6A] leading-relaxed">
                Optimasi hyperparameter XGBoost dan CatBoost dengan evaluasi k-fold cross validation dan penanganan ketidakseimbangan kelas.
              </p>
            </div>

            <div className="bg-[#F6F5F2] rounded-2xl p-6 relative">
              <div className="text-xs font-bold text-[#6B6E6A] tracking-wider mb-3">LANGKAH 03</div>
              <h3 className="text-lg font-semibold text-[#202522] mb-2">Inferensi & Analisis Keputusan</h3>
              <p className="text-xs md:text-sm text-[#6B6E6A] leading-relaxed">
                Penerapan ensemble soft voting, penentuan threshold probabilitas optimal, serta penafsiran kontribusi fitur menggunakan SHAP.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Catatan Proyek (3 Dark Cards) */}
      <section className="py-16 bg-[#FFFFFF]">
        <div className="w-full max-w-[1160px] mx-auto px-5 md:px-8">
          <div className="mb-10 pb-4 border-b border-[#E5E3DE]">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#6B6E6A]">Wawasan Teknis</span>
            <h2 className="text-2xl md:text-3xl font-semibold text-[#202522] mt-1">Catatan Analisis & Panduan</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#202522] rounded-2xl p-6 text-white flex flex-col justify-between">
              <div>
                <span className="inline-block px-2.5 py-1 rounded-md bg-[#26352F] text-[#EBEAE6] text-xs font-medium mb-3">
                  Metrik Evaluasi
                </span>
                <h3 className="text-base font-semibold mb-2">Mengapa ROC-AUC Menjadi Acuan</h3>
                <p className="text-xs text-[#EBEAE6] leading-relaxed mb-4">
                  Pada dataset dengan distribusi target 17.5% positif, ROC-AUC memberikan ukuran kemampuan pemisahan kelas yang objektif di berbagai variasi ambang batas.
                </p>
              </div>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs text-white hover:text-[#EBEAE6] font-medium"
              >
                <span>Lihat grafik ROC</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-[#202522] rounded-2xl p-6 text-white flex flex-col justify-between">
              <div>
                <span className="inline-block px-2.5 py-1 rounded-md bg-[#26352F] text-[#EBEAE6] text-xs font-medium mb-3">
                  Penyelarasan Probabilitas
                </span>
                <h3 className="text-base font-semibold mb-2">Optimalisasi Threshold Klasifikasi</h3>
                <p className="text-xs text-[#EBEAE6] leading-relaxed mb-4">
                  Ambang batas keputusan disesuaikan mendekati ~0.352 untuk menyeimbangkan metrik precision dan recall secara optimal dalam pendeteksian minat EV.
                </p>
              </div>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs text-white hover:text-[#EBEAE6] font-medium"
              >
                <span>Lihat metrik threshold</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-[#202522] rounded-2xl p-6 text-white flex flex-col justify-between">
              <div>
                <span className="inline-block px-2.5 py-1 rounded-md bg-[#26352F] text-[#EBEAE6] text-xs font-medium mb-3">
                  Interpretabilitas Model
                </span>
                <h3 className="text-base font-semibold mb-2">Transparansi Kontribusi Fitur</h3>
                <p className="text-xs text-[#EBEAE6] leading-relaxed mb-4">
                  Nilai SHAP digunakan untuk memvalidasi bahwa faktor seperti ketersediaan subsidi dan stasiun pengisian benar-benar mendorong keputusan secara logis.
                </p>
              </div>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs text-white hover:text-[#EBEAE6] font-medium"
              >
                <span>Lihat sebaran SHAP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Floating Footer Container (~1210px in Deep Green) */}
      <footer className="py-12 px-4 flex justify-center">
        <div className="w-full max-w-[1210px] bg-[#26352F] rounded-3xl p-8 md:p-12 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-white/10">
            {/* Left: Project identity */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-full bg-white text-[#26352F] flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="font-semibold text-lg tracking-tight">EV Predictor</span>
              </div>
              <p className="text-xs md:text-sm text-[#EBEAE6] leading-relaxed max-w-lg mb-4">
                Aplikasi antarmuka analitis untuk eksplorasi dataset dan prediksi minat adopsi kendaraan listrik menggunakan model klasifikasi XGBoost dan CatBoost.
              </p>
              <div className="text-xs text-[#6B6E6A] text-white/60">
                Dataset: Kaggle Predicting Electric Vehicle Purchases (668.665 observasi).
              </div>
            </div>

            {/* Right: Quick Navigation */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-white/80 mb-3">Navigasi</div>
              <ul className="space-y-2 text-xs md:text-sm text-[#EBEAE6]">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">Beranda</Link>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard Analisis</Link>
                </li>
                <li>
                  <Link to="/prediksi" className="hover:text-white transition-colors">Uji Prediksi</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Legal / Disclaimer Bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-3">
            <div>
              &copy; {new Date().getFullYear()} EV Purchase Prediction Web. Seluruh hak cipta dilindungi.
            </div>
            <div className="text-center sm:text-right">
              Hasil prediksi bersifat estimasi model statistik dan bukan jaminan keputusan riil.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
