import { useState } from 'react';
import { BRAND } from '../data/stats';
import footerBg from '../assets/footer-bg.jpg'; // ganti dengan nama file gambar kamu

// Ganti dengan data kamu
const CONTACT = {
  email: 'email-ev@contoh.com', // email tujuan pesan
  phone: '+62 800-0000-0000',
  address: 'Surabaya, Jawa Timur',
  hours: 'Senin – Jumat, 09.00 – 17.00',
};

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  className: 'size-[18px] shrink-0 text-white/50',
  'aria-hidden': true,
};

const PhoneIcon = () => (
  <svg {...iconProps}>
    <path d='M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z' />
  </svg>
);
const MailIcon = () => (
  <svg {...iconProps}>
    <rect x='3' y='5' width='18' height='14' rx='2' />
    <path d='m3 7 9 6 9-6' />
  </svg>
);
const PinIcon = () => (
  <svg {...iconProps}>
    <path d='M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z' />
    <circle cx='12' cy='10' r='2.5' />
  </svg>
);
const ClockIcon = () => (
  <svg {...iconProps}>
    <circle cx='12' cy='12' r='9' />
    <path d='M12 7v5l3 2' />
  </svg>
);
const ArrowIcon = () => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' className='size-4 transition-transform group-hover:translate-x-0.5' aria-hidden='true'>
    <path d='M5 12h14M13 6l6 6-6 6' />
  </svg>
);

export default function Footer() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  // Membuka aplikasi email dengan isi pesan yang sudah terisi
  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Pesan dari ${name}`);
    const body = encodeURIComponent(`Nama: ${name}\n\n${message}`);
    window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
  };

  const inputClass = 'w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus:border-white/30';

  const contactItems = [
    { icon: <PhoneIcon />, text: CONTACT.phone, href: `tel:${CONTACT.phone.replace(/[^+\d]/g, '')}` },
    { icon: <MailIcon />, text: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { icon: <PinIcon />, text: CONTACT.address },
    { icon: <ClockIcon />, text: CONTACT.hours },
  ];

  return (
    <footer className='mx-auto max-w-[1120px] px-5 pb-8 pt-16 sm:pt-20'>
      <div className='relative overflow-hidden rounded-[28px] bg-[linear-gradient(120deg,#2c3a35,#1b2420)] p-6 text-white sm:p-10'>
        {/* Gambar latar dengan opacity (atur opacity-10 s/d opacity-40 sesuai selera) */}
        <img src={footerBg} alt='' aria-hidden='true' className='pointer-events-none absolute inset-0 size-full object-cover opacity-10' />

        {/* Dekorasi lingkaran */}
        <div aria-hidden='true' className='absolute -bottom-24 -right-16 size-80 rounded-full border border-white/[0.06]' />
        <div aria-hidden='true' className='absolute -bottom-10 right-0 size-52 rounded-full border border-white/[0.06]' />

        <div className='relative grid gap-10 md:grid-cols-2'>
          {/* Kiri: kontak */}
          <div>
            <h3 className='text-xl font-semibold tracking-tight'>Hubungi kami</h3>
            <ul className='mt-5 space-y-4 text-sm text-white/75'>
              {contactItems.map((item) => (
                <li key={item.text} className='flex items-center gap-3'>
                  {item.icon}
                  {item.href ? (
                    <a href={item.href} className='transition-colors hover:text-white'>
                      {item.text}
                    </a>
                  ) : (
                    <span>{item.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Kanan: form kirim pesan */}
          <div className='md:border-l md:border-white/10 md:pl-10'>
            <h2 className='text-xl font-semibold tracking-tight'>Kirim pesan kepada kami</h2>
            <p className='mt-2 max-w-sm text-sm leading-relaxed text-white/60'>Punya pertanyaan atau masukan tentang data ini? Tulis di bawah dan pesan akan dikirim ke email kami.</p>

            <form onSubmit={handleSubmit} className='mt-6 space-y-3'>
              <input type='text' required value={name} onChange={(e) => setName(e.target.value)} placeholder='Nama Anda' aria-label='Nama' className={inputClass} />
              <textarea required rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Tulis pesan Anda' aria-label='Pesan' className={`${inputClass} resize-none`} />
              <div className='flex justify-end'>
                <button type='submit' className='group inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-mist'>
                  Kirim pesan
                  <ArrowIcon />
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className='relative mt-10 flex justify-center border-t border-white/10 pt-5 text-center text-xs text-white/45'>
          <span>© 2026 {BRAND}. Semua hak dilindungi.</span>
        </div>
      </div>
    </footer>
  );
}
