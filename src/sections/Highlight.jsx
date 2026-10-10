import Icon from '../components/Icon';
import { Ring } from '../components/Charts';
import { highlight } from '../data/stats';

export default function Highlight() {
  return (
    <section className='mx-auto max-w-[1120px] px-1 pt-16 sm:pt-20'>
      <div className='relative overflow-hidden rounded-[28px] bg-[linear-gradient(110deg,#2c3a35_0%,#1f2924_55%,#161d1a_100%)] p-6 text-white sm:p-10'>
        <div aria-hidden='true' className='absolute -right-24 -top-24 size-96 rounded-full border border-white/[0.07]' />
        <div aria-hidden='true' className='absolute -right-8 -top-8 size-64 rounded-full border border-white/[0.07]' />

        <div className='relative grid items-center gap-8 md:grid-cols-[1fr_auto]'>
          <div className='max-w-lg'>
            <p className='text-sm text-white/70'>Temuan utama</p>
            <h2 className='mt-1 text-2xl font-semibold leading-snug tracking-tight sm:text-[28px]'>Subsidi mengubah hampir seluruh gambaran</h2>
            <p className='mt-3 text-sm leading-relaxed text-white/65'>
              Bila subsidi tersedia, {String(highlight.withSubsidy).replace('.', ',')}% responden berminat membeli EV. Tanpa subsidi, hanya {String(highlight.withoutSubsidy).replace('.', ',')}%.
            </p>
            <a href='#/dashboard' className='group mt-6 inline-flex items-center gap-2.5 rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-ink transition-colors hover:bg-mist'>
              Telusuri di dashboard
              <Icon name='arrow' className='size-4 transition-transform group-hover:translate-x-0.5' strokeWidth={2} />
            </a>
          </div>

          <div className='mx-auto size-44 sm:size-52'>
            <Ring value={highlight.withSubsidy} label='berminat dengan subsidi' />
          </div>
        </div>
      </div>
    </section>
  );
}
