import CarArt from '../components/CarArt';
import Icon from '../components/Icon';
import { cars } from '../data/stats';

export default function Cars() {
  return (
    <section id='mobil' className='mx-auto max-w-[1120px] px-1 pt-16 sm:pt-20'>
      <div className='flex items-end justify-between gap-4'>
        <div>
          <h2 className='text-[22px] font-semibold tracking-tight sm:text-2xl'>Pilih mobil listrik impianmu</h2>
          <p className='mt-2 max-w-xl text-sm leading-relaxed text-muted'>Mulai dari tipe bodi yang paling cocok dengan kebutuhanmu. Angka di tiap kartu menunjukkan minat beralih ke EV di antara pemilik tipe tersebut.</p>
        </div>
        <a href='#/dashboard' className='hidden shrink-0 items-center gap-2 text-[13px] text-ink/70 transition-colors hover:text-ink md:inline-flex'>
          Lihat di dashboard
          <Icon name='arrow' className='size-4' />
        </a>
      </div>

      <div className='mx-auto mt-6 grid max-w-md gap-5 md:max-w-none md:grid-cols-3 md:gap-4 lg:gap-5'>
        {cars.map((c) => (
          <article key={c.id} className='group flex flex-col overflow-hidden rounded-3xl border border-line bg-card transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-22px_rgba(27,36,32,0.35)]'>
            <div className='relative grid h-48 place-items-center bg-[linear-gradient(160deg,#eceeea,#d4dad5)] px-4 sm:h-52 md:h-44 lg:h-52'>
              {c.tag && <span className='absolute left-3 top-3 rounded-full bg-forest px-3 py-1 text-[11px] font-medium text-white'>{c.tag}</span>}
              <CarArt variant={c.variant} className='w-full max-w-[300px] drop-shadow-[0_14px_14px_rgba(27,36,32,0.2)] transition-transform duration-300 group-hover:scale-[1.03]' />
            </div>

            <div className='flex flex-1 flex-col p-4 sm:p-5 md:p-4 lg:p-5'>
              <h3 className='text-base font-semibold'>{c.name}</h3>
              <p className='mt-1 text-xs text-muted'>{c.traits}</p>
              <p className='mt-3 text-[13px] leading-relaxed text-ink/70'>{c.text}</p>

              <div className='mt-auto flex items-end justify-between gap-3 border-t border-line pt-4'>
                <div className='min-w-0'>
                  <span className='block text-xl font-bold tabular-nums'>{c.stat}</span>
                  <span className='mt-0.5 block text-[11px] leading-snug text-muted'>{c.statNote}</span>
                </div>
                <a href='#/dashboard' aria-label={`Lihat ${c.name} di dashboard`} className='grid size-11 shrink-0 place-items-center rounded-full bg-forest text-white transition-colors hover:bg-forest-deep'>
                  <Icon name='arrow' className='size-4' strokeWidth={2} />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
