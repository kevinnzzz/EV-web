import { useId } from 'react';

// Ilustrasi mobil listrik tampak samping, tiga tipe bodi. Sengaja generik:
// tanpa logo, grille, atau elemen khas merek tertentu.

const variants = {
  sedan: {
    wheels: [210, 600],
    body: 'M40 252V228C40 204 62 192 108 184C190 170 262 152 332 138C384 100 452 76 540 74C604 73 656 92 694 126C734 150 758 172 760 208V246C760 256 752 262 740 262H60C48 262 40 258 40 252Z',
    glass: 'M350 138C392 108 452 92 522 90C588 90 640 104 676 130L350 138Z',
    pillar: 'M528 90 524 138',
    seams: ['M352 140 362 236', 'M526 138 522 238', 'M690 132 698 236'],
    beltline: 'M70 202C210 190 420 160 700 170',
    roofLight: 'M392 104C450 80 520 74 566 76',
    head: 'M46 206C70 200 100 198 126 196L124 204C98 206 70 210 48 214Z',
    tail: 'M758 186C762 196 762 206 760 214L738 206C744 198 750 192 758 186Z',
    port: [704, 176],
    sill: [118, 692],
  },
  suv: {
    wheels: [210, 600],
    body: 'M40 252V226C40 204 58 192 100 184C170 174 250 160 316 142C340 100 366 52 420 44C520 38 628 38 688 44C724 50 746 90 752 140C758 178 760 204 760 226V246C760 256 752 262 740 262H60C48 262 40 258 40 252Z',
    glass: 'M332 138C356 100 376 60 424 54L674 54C700 58 718 96 728 138L332 138Z',
    pillar: 'M524 54 520 138',
    seams: ['M334 140 346 236', 'M520 138 518 238', 'M650 138 660 236'],
    beltline: 'M70 202C210 192 420 166 730 170',
    roofLight: 'M430 42C520 36 630 36 684 42',
    head: 'M46 206C70 200 100 198 126 196L124 204C98 206 70 210 48 214Z',
    tail: 'M752 130C760 160 760 196 760 214L740 208C742 180 746 154 752 130Z',
    port: [706, 168],
    sill: [118, 692],
  },
  hatch: {
    wheels: [232, 568],
    body: 'M100 252V228C100 208 116 196 152 190C214 180 268 164 322 146C350 104 392 74 456 70C534 66 604 70 650 98C682 120 698 152 700 194V246C700 256 692 262 680 262H118C106 262 100 258 100 252Z',
    glass: 'M334 142C362 108 400 86 458 82C526 78 590 82 634 108L334 142Z',
    pillar: 'M492 82 488 142',
    seams: ['M336 144 344 238', 'M490 142 486 240', 'M654 108 664 238'],
    beltline: 'M122 206C230 196 410 166 678 172',
    roofLight: 'M396 98C440 78 500 70 560 70',
    head: 'M106 210C124 204 146 202 164 200L162 208C144 210 124 214 108 218Z',
    tail: 'M694 160C698 176 700 194 700 212L682 206C684 190 688 174 694 160Z',
    port: [660, 168],
    sill: [150, 650],
  },
};

function Wheel({ cx, cy, rimId }) {
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <circle r='58' fill='#0e1412' />
      <circle r='47' fill='#151b19' />
      <circle r='45' fill='none' stroke='#2a332f' strokeWidth='2' />
      <circle r='33' fill={`url(#${rimId})`} />
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} x='-2' y='-30' width='4' height='19' rx='2' fill='#c9d1cc' opacity='0.8' transform={`rotate(${i * 36})`} />
      ))}
      <circle r='9' fill='#232c28' />
      <circle r='3' fill='#9aa8a1' />
    </g>
  );
}

const labels = {
  sedan: 'Ilustrasi sedan listrik',
  suv: 'Ilustrasi SUV listrik',
  hatch: 'Ilustrasi hatchback listrik',
};

export default function CarArt({ variant = 'sedan', className = '' }) {
  const uid = useId().replace(/:/g, '');
  const body = `body-${uid}`;
  const rim = `rim-${uid}`;
  const glass = `glass-${uid}`;
  const floor = `floor-${uid}`;
  const blur = `blur-${uid}`;
  const v = variants[variant];

  return (
    <svg viewBox='0 0 800 330' className={className} role='img' aria-label={labels[variant]}>
      <defs>
        <linearGradient id={body} x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0' stopColor='#5d6b64' />
          <stop offset='0.45' stopColor='#3a4642' />
          <stop offset='1' stopColor='#1d2421' />
        </linearGradient>
        <linearGradient id={glass} x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0' stopColor='#20292a' />
          <stop offset='1' stopColor='#0f1516' />
        </linearGradient>
        <radialGradient id={rim} cx='0.4' cy='0.35' r='0.8'>
          <stop offset='0' stopColor='#58645e' />
          <stop offset='1' stopColor='#1c2320' />
        </radialGradient>
        <radialGradient id={floor} cx='0.5' cy='0.5' r='0.5'>
          <stop offset='0' stopColor='#000' stopOpacity='0.38' />
          <stop offset='1' stopColor='#000' stopOpacity='0' />
        </radialGradient>
        <filter id={blur} x='-10%' y='-50%' width='120%' height='200%'>
          <feGaussianBlur stdDeviation='3' />
        </filter>
      </defs>

      {/* bayangan lantai */}
      <ellipse cx='400' cy='296' rx='380' ry='20' fill={`url(#${floor})`} />

      {/* bodi */}
      <path d={v.body} fill={`url(#${body})`} />

      {/* lekuk roda */}
      {v.wheels.map((x) => (
        <circle key={x} cx={x} cy='252' r='58' fill='#0e1412' />
      ))}

      {/* kaca */}
      <path d={v.glass} fill={`url(#${glass})`} />
      <path d={v.pillar} stroke='#3a4642' strokeWidth='8' />

      {/* garis bodi dan pantulan */}
      <path d={v.beltline} stroke='#fff' strokeOpacity='0.14' strokeWidth='2' fill='none' />
      <path d={v.roofLight} stroke='#fff' strokeOpacity='0.28' strokeWidth='2.5' strokeLinecap='round' fill='none' />
      {v.seams.map((d) => (
        <path key={d} d={d} stroke='#000' strokeOpacity='0.26' strokeWidth='1.5' />
      ))}

      {/* lampu depan dan belakang */}
      <path d={v.head} fill='#e9f0ea' />
      <path d={v.tail} fill='#c4584d' />

      {/* aksen lampu bawah bodi */}
      <path d={`M${v.sill[0]} 258H${v.sill[1]}`} stroke='#86c3a8' strokeOpacity='0.55' strokeWidth='2' strokeLinecap='round' filter={`url(#${blur})`} />
      <circle cx={v.port[0]} cy={v.port[1]} r='3' fill='#86c3a8' />

      {v.wheels.map((x) => (
        <Wheel key={x} cx={x} cy={252} rimId={rim} />
      ))}
    </svg>
  );
}
