import { testimonials } from '../data/stats';

import foto1 from '../assets/orang1.jpg';
import foto2 from '../assets/orang2.jpg';
import foto3 from '../assets/orang3.jpg';
import cardBg from '../assets/Hero-EV.jpg';

// key = id testimoni di data/stats.js
const photos = {
  t1: foto1,
  t2: foto2,
  t3: foto3,
};

function Stars({ count = 5 }) {
  return (
    <div className='flex gap-0.5' role='img' aria-label={`Rating ${count} dari 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox='0 0 20 20' className={`size-4 ${i < count ? 'text-white' : 'text-white/25'}`} fill='currentColor' aria-hidden='true'>
          <path d='M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6L10 15l-5.4 3 1.2-6L1.3 7.8l6.1-.7L10 1.5z' />
        </svg>
      ))}
    </div>
  );
}

export default function Insights() {
  return (
    <section id='temuan' className='mx-auto max-w-[1120px] px-5 pt-16 sm:pt-20'>
      <div className='flex items-end justify-between gap-4'>
        <h2 className='text-2xl font-semibold tracking-tight'>Apa kata mereka?</h2>
      </div>

      <div className='mx-auto mt-6 grid max-w-md gap-4 md:max-w-none md:grid-cols-3 md:gap-4 lg:gap-5'>
        {testimonials.map((t) => (
          <article key={t.id} className='relative isolate flex gap-4 overflow-hidden rounded-3xl bg-[linear-gradient(150deg,#34433d,#1b2420)] p-3 text-white transition-transform hover:-translate-y-0.5 md:gap-3 lg:gap-4'>
            {/* Gambar latar (opacity rendah) */}
            <img src={cardBg} alt='' aria-hidden='true' loading='lazy' className='absolute inset-0 -z-10 h-full w-full object-cover opacity-50' />
            {/* Lapisan hijau gelap tipis agar teks tetap terbaca */}
            <div aria-hidden='true' className='absolute inset-0 -z-10 bg-[linear-gradient(150deg,rgba(52,67,61,0.55),rgba(27,36,32,0.75))]' />

            <div className='w-28 shrink-0 overflow-hidden rounded-2xl bg-[#14352a] sm:w-32 md:w-24 lg:w-32'>
              {photos[t.id] ? (
                <img src={photos[t.id]} alt={t.name} loading='lazy' className='h-full min-h-40 w-full object-cover' />
              ) : (
                <div className='grid h-full min-h-40 place-items-center text-3xl font-semibold text-white'>{t.name.charAt(0)}</div>
              )}
            </div>

            <div className='flex min-w-0 flex-1 flex-col py-1 pr-1'>
              <p className='text-[13px] leading-relaxed text-white'>“{t.quote}”</p>
              <div className='mt-auto pt-4'>
                <p className='text-sm font-semibold text-white'>{t.name}</p>
                <div className='mt-1 flex flex-wrap items-center gap-x-3 gap-y-1'>
                  <span className='text-xs text-white/80'>{t.car}</span>
                  <Stars count={t.rating} />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
