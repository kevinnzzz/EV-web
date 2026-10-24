import aboutImage from '../assets/About-EV.jpg';

export default function About() {
  return (
    <section
      id='tentang-kami'
      className='mx-auto grid max-w-[1120px] items-center gap-4 px-6 py-16 text-center sm:gap-5 sm:px-8 sm:py-20 md:grid-cols-2 md:gap-x-8 md:gap-y-0 md:px-8 md:py-20 md:text-left lg:gap-x-16 lg:px-10 lg:py-24 xl:px-6'
    >
      {/* HP: wrapper dibuka (contents) agar bisa diurutkan. Tablet/desktop: satu kolom teks di kiri */}
      <div className='contents md:order-1 md:block'>
        <div className='order-1 md:order-none'>
          <p className='text-xs font-semibold uppercase tracking-[0.18em] text-muted'>Mengenal proyek kami</p>
          <h2 className='mt-3 text-3xl font-semibold tracking-tight sm:text-4xl'>Tentang Kami</h2>
        </div>

        <p className='order-3 mx-auto mt-2 max-w-xl text-justify text-sm leading-relaxed text-muted sm:text-base md:order-none md:mx-0 md:mt-5 md:text-left'>
          Kami menghadirkan cara yang lebih mudah untuk memahami minat masyarakat terhadap kendaraan listrik. Melalui data dan analisis yang disajikan secara jelas, dashboard ini membantu melihat faktor-faktor yang mendorong seseorang untuk
          beralih ke mobil listrik.
        </p>
      </div>

      <div className='order-2 mt-4 overflow-hidden rounded-3xl bg-card md:order-2 md:mt-0'>
        <img src={aboutImage} alt='Mobil listrik di dalam showroom dengan latar gedung kota' className='aspect-[4/3] w-full object-cover' />
      </div>
    </section>
  );
}
