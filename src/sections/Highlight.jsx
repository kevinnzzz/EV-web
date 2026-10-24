import Icon from '../components/Icon';
import { highlight } from '../data/stats';
import subsidyImage from '../assets/Subsidy-EV.png';

export default function Highlight() {
  return (
    <section className='mx-auto max-w-[1120px] px-5 pt-16 sm:pt-20'>
      <div className='relative overflow-hidden rounded-[28px] bg-[linear-gradient(110deg,#2c3a35_0%,#1f2924_55%,#161d1a_100%)] text-white md:min-h-[260px]'>
        <div aria-hidden='true' className='absolute -right-24 -top-24 size-96 rounded-full border border-white/[0.07]' />
        <div aria-hidden='true' className='absolute -right-8 -top-8 size-64 rounded-full border border-white/[0.07]' />

        {/* Gambar untuk mobile: DI ATAS teks, memudar ke bawah */}
        <div className='relative h-44 md:hidden'>
          <img
            src={subsidyImage}
            alt='Mobil listrik melintas di jalan kota pada malam hari'
            className='size-full object-cover object-[80%_65%] [-webkit-mask-image:linear-gradient(to_top,transparent_0%,black_50%)] [mask-image:linear-gradient(to_top,transparent_0%,black_50%)]'
          />
        </div>

        {/* Gambar desktop: latar di sisi kanan */}
        <div className='pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] md:block'>
          <img
            src={subsidyImage}
            alt=''
            aria-hidden='true'
            className='size-full object-cover object-[80%_65%] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_45%)] [mask-image:linear-gradient(to_right,transparent_0%,black_45%)]'
          />
        </div>

        {/* Teks */}
        <div className='relative z-10 p-6 sm:p-10 md:w-[55%]'>
          <p className='text-sm text-white/70'>Temuan utama</p>
          <h2 className='mt-1 text-2xl font-semibold leading-snug tracking-tight sm:text-[28px]'>Subsidi mengubah hampir seluruh gambaran</h2>
          <p className='mt-3 max-w-md text-sm leading-relaxed text-white/65'>
            Bila subsidi tersedia, {String(highlight.withSubsidy).replace('.', ',')}% responden berminat membeli EV. Tanpa subsidi, hanya {String(highlight.withoutSubsidy).replace('.', ',')}%.
          </p>
          <a href='#/dashboard' className='group mt-6 inline-flex items-center gap-2.5 whitespace-nowrap rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-ink transition-colors hover:bg-mist'>
            Telusuri di dashboard
            <Icon name='arrow' className='size-4 transition-transform group-hover:translate-x-0.5' strokeWidth={2} />
          </a>
        </div>
      </div>
    </section>
  );
}
