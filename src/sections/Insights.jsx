import Icon from '../components/Icon';
import { insights } from '../data/stats';

export default function Insights() {
  return (
    <section id='temuan' className='mx-auto max-w-[1120px] px-1 pt-16 sm:pt-20'>
      <div className='flex items-end justify-between gap-4'>
        <h2 className='text-2xl font-semibold tracking-tight'>Temuan singkat</h2>
        <a href='#/dashboard' className='hidden shrink-0 items-center gap-2 text-[13px] text-ink/70 transition-colors hover:text-ink sm:inline-flex'>
          Lihat analisis lengkap
          <Icon name='arrow' className='size-4' />
        </a>
      </div>

      <div className='mx-auto mt-6 grid max-w-md gap-4 md:max-w-none md:grid-cols-3 md:gap-4 lg:gap-5'>
        {insights.map((it) => (
          <a
            key={it.title}
            href='#/dashboard'
            className='group relative flex min-h-52 flex-col justify-between overflow-hidden rounded-3xl bg-[linear-gradient(150deg,#34433d,#1b2420)] p-5 md:min-h-60 text-white transition-transform hover:-translate-y-0.5'
          >
            <div aria-hidden='true' className='absolute -right-16 -top-16 size-56 rounded-full border border-white/[0.07]' />
            <span className='relative w-fit rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-ink'>{it.tag}</span>
            <div className='relative mt-10 flex items-end justify-between gap-4'>
              <div>
                <h3 className='text-base font-semibold lg:text-[17px] leading-snug'>{it.title}</h3>
                <p className='mt-2 text-[13px] leading-relaxed text-white/65'>{it.text}</p>
              </div>
              <span className='grid size-9 shrink-0 place-items-center rounded-full border border-white/25 transition-colors group-hover:bg-white group-hover:text-ink'>
                <Icon name='arrow' className='size-4' />
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
