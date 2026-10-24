import Icon from '../components/Icon';

const items = [
  {
    icon: 'database',
    title: 'Data berskala besar',
    text: 'Berangkat dari ratusan ribu profil calon pembeli, bukan dari dugaan atau contoh kecil.',
  },
  {
    icon: 'sliders',
    title: 'Faktor yang terbuka',
    text: 'Dari pendapatan sampai akses pengisian daya, setiap faktor ditampilkan apa adanya.',
  },
  {
    icon: 'chart',
    title: 'Mudah dibandingkan',
    text: 'Bandingkan kelompok menurut subsidi, tipe wilayah, atau tingkat kecemasan jarak tempuh.',
  },
  {
    icon: 'plug',
    title: 'Fokus pada dampak',
    text: 'Membantu melihat di mana insentif dan infrastruktur pengisian paling berpengaruh.',
  },
];

export default function Why() {
  return (
    <section id='mengapa' className='mx-auto max-w-[1120px] px-5 pt-6'>
      <h2 className='text-[22px] font-semibold tracking-tight sm:text-2xl'>Mengapa dashboard ini berguna</h2>
      <div className='mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {items.map((it) => (
          <article key={it.title} className='rounded-3xl border border-line bg-card p-5 transition-shadow hover:shadow-[0_14px_34px_-18px_rgba(27,36,32,0.25)]'>
            <div className='flex items-center gap-3'>
              <span className='grid size-9 shrink-0 place-items-center rounded-full bg-forest text-white'>
                <Icon name={it.icon} className='size-[18px]' />
              </span>
              <h3 className='text-[15px] font-semibold leading-snug'>{it.title}</h3>
            </div>
            <p className='mt-4 text-[13px] leading-relaxed text-muted'>{it.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
