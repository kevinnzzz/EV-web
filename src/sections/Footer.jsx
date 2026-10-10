import Icon from '../components/Icon';
import { BRAND, REPO_URL } from '../data/stats';

export default function Footer() {
  return (
    <footer className='mx-auto max-w-[1120px] px-5 pb-8 pt-16 sm:pt-20'>
      <div className='relative overflow-hidden rounded-[28px] bg-[linear-gradient(120deg,#2c3a35,#1b2420)] p-6 text-white sm:p-10'>
        <div aria-hidden='true' className='absolute -bottom-24 -right-16 size-80 rounded-full border border-white/[0.06]' />
        <div aria-hidden='true' className='absolute -bottom-10 right-0 size-52 rounded-full border border-white/[0.06]' />

        <div className='relative grid gap-10 md:grid-cols-2'>
          <div>
            <h2 className='text-xl font-semibold tracking-tight'>Siap melihat datanya?</h2>
            <p className='mt-2 max-w-sm text-sm leading-relaxed text-white/60'>Buka dashboard untuk membandingkan kelompok dan menelusuri faktor satu per satu.</p>
            <a href='#/dashboard' className='group mt-6 inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-mist'>
              Buka dashboard
              <Icon name='arrow' className='size-4 transition-transform group-hover:translate-x-0.5' strokeWidth={2} />
            </a>
          </div>

          <div className='md:border-l md:border-white/10 md:pl-10'>
            <h3 className='text-base font-semibold'>Tentang proyek</h3>
            <ul className='mt-4 space-y-3 text-sm text-white/65'>
              <li>Sumber data: Predicting Electric Vehicle Purchases</li>
              <li>
                <a href={REPO_URL} target='_blank' rel='noreferrer' className='inline-flex items-center gap-2 transition-colors hover:text-white'>
                  Lihat kode di GitHub
                  <Icon name='external' className='size-4' />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className='relative mt-10 flex flex-col gap-2 border-t border-white/10 pt-5 text-xs text-white/45 sm:flex-row sm:justify-between'>
          <span>© 2026 {BRAND}. Semua hak dilindungi.</span>
          <span>Angka adalah statistik deskriptif, bukan bukti sebab-akibat.</span>
        </div>
      </div>
    </footer>
  );
}
