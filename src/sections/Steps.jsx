const steps = [
  {
    n: '01',
    title: 'Pilih faktor',
    text: 'Mulai dari satu faktor, misalnya subsidi, tipe wilayah, atau akses pengisian daya di rumah.',
  },
  {
    n: '02',
    title: 'Bandingkan kelompok',
    text: 'Lihat berapa persen tiap kelompok yang berminat membeli, berdampingan dalam satu tampilan.',
  },
  {
    n: '03',
    title: 'Baca polanya',
    text: 'Temukan faktor yang benar-benar membedakan, dan mana yang hanya tampak penting.',
  },
];

export default function Steps() {
  return (
    <section id='cara-kerja' className='mx-auto max-w-[1120px] px-1 pt-16 sm:pt-20'>
      <h2 className='text-2xl font-semibold tracking-tight'>Cara kerja</h2>
      <div className='mt-6 grid gap-4 lg:grid-cols-3'>
        {steps.map((s) => (
          <article key={s.n} className='flex gap-4 rounded-3xl border border-line bg-card p-3 pr-5'>
            <div className='grid w-20 shrink-0 sm:w-24 place-items-center rounded-2xl bg-forest text-2xl font-semibold tabular-nums text-white/90'>{s.n}</div>
            <div className='py-2'>
              <h3 className='text-[15px] font-semibold'>{s.title}</h3>
              <p className='mt-2 text-[13px] leading-relaxed text-muted'>{s.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
