import Icon from '../components/Icon';

// Placeholder: tujuan tombol "Buka dashboard". Isi dashboard menyusul.
export default function Dashboard() {
  return (
    <main className='grid min-h-screen place-items-center px-5'>
      <div className='max-w-md rounded-[28px] border border-line bg-card p-10 text-center'>
        <span className='mx-auto grid size-11 place-items-center rounded-full bg-forest text-white'>
          <Icon name='chart' className='size-5' />
        </span>
        <h1 className='mt-5 text-2xl font-semibold tracking-tight'>Dashboard sedang disiapkan</h1>
        <p className='mt-2 text-sm leading-relaxed text-muted'>Halaman ini akan menampilkan perbandingan kelompok dan faktor-faktor yang memengaruhi minat membeli mobil listrik.</p>
        <a href='#/' className='mt-6 inline-flex rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-forest-deep'>
          Kembali ke beranda
        </a>
      </div>
    </main>
  );
}
