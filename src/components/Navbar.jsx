import { useEffect, useState } from 'react';
import Icon from './Icon';
import { BRAND } from '../data/stats';

const links = [
  ['Beranda', '#/'],
  ['Mengapa', '#mengapa'],
  ['Mobil', '#mobil'],
  ['Temuan', '#temuan'],
  ['Cara kerja', '#cara-kerja'],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Tutup menu dengan Escape; kunci scroll saat menu terbuka di layar kecil.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className='fixed inset-x-0 top-3 z-50 px-3 pt-[env(safe-area-inset-top)] sm:top-4 sm:px-4'>
      <nav
        aria-label='Navigasi utama'
        className='relative mx-auto flex h-14 max-w-[1120px] items-center justify-between rounded-full border border-white/70 bg-white/85 pl-4 pr-1.5 shadow-[0_8px_30px_-12px_rgba(27,36,32,0.18)] backdrop-blur-md sm:pl-5 sm:pr-2'
      >
        <a href='#/' onClick={close} className='flex items-center gap-2.5'>
          <span className='grid size-8 place-items-center rounded-full bg-forest text-white'>
            <Icon name='bolt' className='size-4' strokeWidth={2} />
          </span>
          <span className='text-[12px] font-bold uppercase tracking-[0.14em] sm:text-[13px]'>{BRAND}</span>
        </a>

        <ul className='hidden items-center gap-8 lg:flex'>
          {links.map(([label, href]) => (
            <li key={href}>
              <a href={href} className='text-[13px] text-ink/70 transition-colors hover:text-ink'>
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className='flex items-center gap-1.5'>
          <a href='#/dashboard' className='inline-flex min-h-11 items-center rounded-full bg-forest px-4 text-[13px] font-semibold text-white transition-colors hover:bg-forest-deep sm:px-5'>
            <span className='sm:hidden'>Dashboard</span>
            <span className='hidden sm:inline'>Buka dashboard</span>
          </a>
          <button
            type='button'
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls='menu-mobile'
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            className='grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5 lg:hidden'
          >
            <Icon name={open ? 'close' : 'menu'} className='size-5' />
          </button>
        </div>

        {open && (
          <div id='menu-mobile' className='absolute inset-x-0 top-[calc(100%+8px)] rounded-3xl border border-line bg-white p-2 shadow-[0_18px_40px_-18px_rgba(27,36,32,0.3)] lg:hidden'>
            <ul>
              {links.map(([label, href]) => (
                <li key={href}>
                  <a href={href} onClick={close} className='flex min-h-12 items-center rounded-2xl px-4 text-[15px] font-medium text-ink/80 transition-colors hover:bg-card hover:text-ink'>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
