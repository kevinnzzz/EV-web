import Icon from '../components/Icon';
import { dataset } from '../data/stats';
import heroImage from '../assets/Hero-EV.jpg';

const quickStats = [
  { icon: 'database', value: dataset.rows, label: 'profil responden' },
  { icon: 'sliders', value: dataset.features, label: 'faktor diamati' },
  { icon: 'bolt', value: dataset.buyRate, label: 'berminat membeli EV' },
];

export default function Hero() {
  return (
    <section id='beranda' className='relative isolate min-h-screen overflow-hidden bg-[#10211c] text-white'>
      <div
        aria-hidden='true'
        className='absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat'
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      />
      <div aria-hidden='true' className='absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(8,22,18,0.84)_0%,rgba(8,22,18,0.66)_36%,rgba(8,22,18,0.16)_75%,rgba(8,22,18,0.12)_100%)]' />
      <div className='mx-auto flex min-h-screen max-w-[1120px] items-stretch px-5 pb-8 pt-28 sm:items-center sm:pb-24 sm:pt-32 lg:pb-28 lg:pt-40'>
        <div className='relative z-10 flex w-full flex-col sm:block'>
          <h1 className='max-w-2xl text-[clamp(2.25rem,13vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-[clamp(2.1rem,4.4vw,3.4rem)] sm:leading-[1.1] sm:tracking-[-0.025em]'>
            <span className='sr-only'>Pahami siapa yang siap beralih ke mobil listrik</span>

            {/* HP: 4 baris */}
            <span aria-hidden='true' className='sm:hidden'>
              <span className='block'>Pahami siapa</span>
              <span className='block'>yang siap</span>
              <span className='block'>beralih ke</span>
              <span className='block'>mobil listrik</span>
            </span>

            {/* Tablet dan desktop: 3 baris */}
            <span aria-hidden='true' className='hidden sm:block'>
              <span className='block'>Pahami siapa yang</span>
              <span className='block'>siap beralih ke</span>
              <span className='block'>mobil listrik</span>
            </span>
          </h1>
          <p className='mt-6 max-w-md text-[15px] leading-relaxed text-white/80'>
            Dashboard yang membaca pola minat beli kendaraan listrik dari ratusan ribu profil, mulai dari subsidi dan akses pengisian daya sampai kepedulian lingkungan.
          </p>

          <div className='mt-8 flex flex-wrap items-center gap-3'>
            <a href='#/dashboard' className='group inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#b8f2d0] px-6 py-3.5 text-sm font-semibold text-[#10211c] transition-colors hover:bg-[#d2ffe4] sm:w-auto'>
              Buka dashboard
              <Icon name='arrow' className='size-4 transition-transform group-hover:translate-x-0.5' strokeWidth={2} />
            </a>
            <a href='#cara-kerja' className='w-full rounded-full border border-white/35 bg-white/10 px-6 py-3.5 text-center text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:w-auto'>
              Lihat cara kerja
            </a>
          </div>

          <dl className='mt-auto grid grid-cols-3 gap-2 border-t border-white/15 pt-10 sm:mt-10 sm:flex sm:flex-wrap sm:gap-x-5 sm:gap-y-4 sm:whitespace-nowrap sm:border-0 sm:pt-0'>
            {quickStats.map((s) => (
              <div key={s.label} className='flex items-start gap-2 sm:items-center sm:gap-2.5'>
                <Icon name={s.icon} className='mt-0.5 size-5 shrink-0 text-[#b8f2d0] sm:mt-0' />
                <div className='min-w-0'>
                  <dt className='sr-only'>{s.label}</dt>
                  <dd className='leading-tight'>
                    <span className='block text-sm font-semibold text-white'>{s.value}</span>
                    <span className='block text-[11px] text-white/70 sm:text-xs'>{s.label}</span>
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
