const paths = {
  arrow: (
    <>
      <path d='M5 12h14' />
      <path d='m12 5 7 7-7 7' />
    </>
  ),
  database: (
    <>
      <ellipse cx='12' cy='5' rx='9' ry='3' />
      <path d='M3 5v14a9 3 0 0 0 18 0V5' />
      <path d='M3 12a9 3 0 0 0 18 0' />
    </>
  ),
  bolt: <path d='M13 2 3 14h9l-1 8 10-12h-9l1-8z' />,
  leaf: (
    <>
      <path d='M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z' />
      <path d='M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12' />
    </>
  ),
  plug: (
    <>
      <path d='M12 22v-5' />
      <path d='M9 8V2' />
      <path d='M15 8V2' />
      <path d='M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z' />
    </>
  ),
  shield: (
    <>
      <path d='M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z' />
      <path d='m9 12 2 2 4-4' />
    </>
  ),
  chart: (
    <>
      <path d='M3 3v16a2 2 0 0 0 2 2h16' />
      <path d='M18 17V9' />
      <path d='M13 17V5' />
      <path d='M8 17v-3' />
    </>
  ),
  sliders: (
    <>
      <path d='M21 4h-7' />
      <path d='M10 4H3' />
      <path d='M21 12h-9' />
      <path d='M8 12H3' />
      <path d='M21 20h-5' />
      <path d='M12 20H3' />
      <path d='M14 2v4' />
      <path d='M8 10v4' />
      <path d='M16 18v4' />
    </>
  ),
  menu: (
    <>
      <path d='M4 7h16' />
      <path d='M4 12h16' />
      <path d='M4 17h16' />
    </>
  ),
  close: (
    <>
      <path d='M18 6 6 18' />
      <path d='m6 6 12 12' />
    </>
  ),
  external: (
    <>
      <path d='M15 3h6v6' />
      <path d='M10 14 21 3' />
      <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' />
    </>
  ),
};

export default function Icon({ name, className = 'size-5', strokeWidth = 1.75 }) {
  return (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={strokeWidth} strokeLinecap='round' strokeLinejoin='round' className={className} aria-hidden='true'>
      {paths[name]}
    </svg>
  );
}
