export function Ring({ value, label }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox='0 0 180 180' className='size-full' role='img' aria-label={`${label}: ${value}%`}>
      <circle cx='90' cy='90' r={r} fill='none' stroke='#fff' strokeOpacity='0.12' strokeWidth='12' />
      <circle cx='90' cy='90' r={r} fill='none' stroke='#9fd0b8' strokeWidth='12' strokeLinecap='round' strokeDasharray={`${(value / 100) * c} ${c}`} transform='rotate(-90 90 90)' />
      <text x='90' y='92' textAnchor='middle' fill='#fff' fontSize='30' fontWeight='600'>
        {value.toLocaleString('id-ID', { minimumFractionDigits: 1 })}%
      </text>
      <text x='90' y='114' textAnchor='middle' fill='#fff' fillOpacity='0.6' fontSize='11'>
        {label}
      </text>
    </svg>
  );
}
