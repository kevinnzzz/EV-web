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
      <div className='mx-auto flex min-h-screen max-w-[1120px] items-center px-1 pb-20 pt-28 sm:pb-24 sm:pt-32 lg:pb-28 lg:pt-40'>
        <div className='relative z-10'>
          <h1 className='max-w-2xl text-[clamp(2.1rem,4.4vw,3.4rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-white'>Pahami siapa yang siap beralih ke mobil listrik</h1>
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

          <dl className='mt-10 flex flex-wrap gap-x-5 gap-y-4 whitespace-nowrap'>
            {quickStats.map((s) => (
              <div key={s.label} className='flex items-center gap-2.5'>
                <Icon name={s.icon} className='size-5 text-[#b8f2d0]' />
                <div>
                  <dt className='sr-only'>{s.label}</dt>
                  <dd className='text-xs leading-tight'>
                    <span className='block text-sm font-semibold text-white'>{s.value}</span>
                    <span className='text-white/70'>{s.label}</span>
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
