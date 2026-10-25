import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  CarFront,
  Lightbulb,
  RotateCcw,
  SlidersHorizontal,
  TrendingUp,
  Users,
} from 'lucide-react';
import localCsvUrl from '../../data/raw/predicting-electric-vehicle-purchases.csv?url';

const NUMERIC_FIELDS = [
  'Age',
  'Annual_Income_USD',
  'Daily_Commute_km',
  'Number_of_Cars_Owned',
  'Charging_Stations_Near_Home',
  'Charging_Stations_Near_Work',
  'Environmental_Concern_Level',
];

const CATEGORY_FIELDS = [
  'Gender',
  'City_Type',
  'Current_Car_Type',
  'Home_Charging_Possible',
  'Subsidy_Available',
  'Range_Anxiety_Level',
  'Will_Buy_EV',
];

const CATEGORY_FILTER_FIELDS = [
  'City_Type',
  'Current_Car_Type',
];
const RATE_FIELDS = [
  { key: 'subsidy', field: 'Subsidy_Available', numeric: false },
  { key: 'homeCharging', field: 'Home_Charging_Possible', numeric: false },
  { key: 'rangeAnxiety', field: 'Range_Anxiety_Level', numeric: false },
  { key: 'environment', field: 'Environmental_Concern_Level', numeric: true },
  { key: 'age', field: 'Age', numeric: true },
  { key: 'income', field: 'Annual_Income_USD', numeric: true },
  { key: 'commute', field: 'Daily_Commute_km', numeric: true },
  { key: 'stations', field: 'Charging_Stations_Near_Home', numeric: true },
];

const REQUIRED_FIELDS = ['id', ...NUMERIC_FIELDS, ...CATEGORY_FIELDS];
const INITIAL_CAPACITY = 700_000;
const AGE_GROUPS = ['< 30 tahun', '30–39 tahun', '40–49 tahun', '50–59 tahun', '60+ tahun'];
const AGE_FILTERS = [
  { label: 'Semua usia', value: 'all' },
  ...AGE_GROUPS.map((label, index) => ({ label, value: String(index) })),
];

const FILTER_DEFINITIONS = [
  { key: 'age', label: 'Usia responden', options: AGE_FILTERS },
  { key: 'City_Type', label: 'Wilayah tempat tinggal' },
  { key: 'Current_Car_Type', label: 'Mobil saat ini' },
];

const CATEGORY_ORDER = {
  Range_Anxiety_Level: ['Low', 'Medium', 'High', '(Kosong)'],
  City_Type: ['Urban', 'Suburban', 'Rural', '(Kosong)'],
  Home_Charging_Possible: ['Yes', 'No', '(Kosong)'],
  Subsidy_Available: ['Yes', 'No', '(Kosong)'],
};

function parseCsvRow(line) {
  const fields = [];
  let value = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === ',' && !quoted) {
      fields.push(value);
      value = '';
    } else {
      value += character;
    }
  }

  fields.push(value);
  return fields;
}

function growTypedArray(array, minimumCapacity) {
  const capacity = Math.max(array.length * 2, minimumCapacity);
  const grown = new array.constructor(capacity);
  grown.set(array);
  return grown;
}

async function loadLocalDataset(signal) {
  const response = await fetch(localCsvUrl, { signal });
  if (!response.ok) {
    throw new Error(`CSV lokal gagal dimuat (HTTP ${response.status}).`);
  }
  if (!response.body) {
    throw new Error('Browser tidak mendukung pembacaan CSV secara streaming.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  let headers = null;
  let fieldIndexes = null;
  let rowCount = 0;
  let missingValues = 0;
  let numericColumns = null;
  let categoryColumns = null;
  let categoryValues = null;
  let categoryMaps = null;
  let capacity = INITIAL_CAPACITY;

  const processLine = (line) => {
    if (!line.trim()) return;
    const fields = parseCsvRow(line);

    if (!headers) {
      headers = fields.map((field, index) => (
        index === 0 ? field.replace(/^\uFEFF/, '').trim() : field.trim()
      ));
      const missingFields = REQUIRED_FIELDS.filter((field) => !headers.includes(field));
      if (missingFields.length > 0) {
        throw new Error(`Kolom wajib tidak ditemukan pada CSV: ${missingFields.join(', ')}.`);
      }

      fieldIndexes = Object.fromEntries(headers.map((field, index) => [field, index]));
      numericColumns = Object.fromEntries(
        NUMERIC_FIELDS.map((field) => [field, new Float32Array(capacity)]),
      );
      categoryColumns = Object.fromEntries(
        CATEGORY_FIELDS.map((field) => [field, new Uint16Array(capacity)]),
      );
      categoryValues = Object.fromEntries(CATEGORY_FIELDS.map((field) => [field, []]));
      categoryMaps = Object.fromEntries(CATEGORY_FIELDS.map((field) => [field, new Map()]));
      return;
    }

    if (fields.length !== headers.length) {
      throw new Error(`Format CSV tidak konsisten pada baris ${rowCount + 2}.`);
    }

    if (rowCount === capacity) {
      capacity *= 2;
      NUMERIC_FIELDS.forEach((field) => {
        numericColumns[field] = growTypedArray(numericColumns[field], capacity);
      });
      CATEGORY_FIELDS.forEach((field) => {
        categoryColumns[field] = growTypedArray(categoryColumns[field], capacity);
      });
    }

    NUMERIC_FIELDS.forEach((field) => {
      const rawValue = fields[fieldIndexes[field]]?.trim() ?? '';
      const value = rawValue === '' ? Number.NaN : Number(rawValue);
      numericColumns[field][rowCount] = Number.isFinite(value) ? value : Number.NaN;
      if (!Number.isFinite(value)) missingValues += 1;
    });

    CATEGORY_FIELDS.forEach((field) => {
      const rawValue = fields[fieldIndexes[field]]?.trim() ?? '';
      const value = rawValue || '(Kosong)';
      let code = categoryMaps[field].get(value);
      if (code === undefined) {
        code = categoryValues[field].length;
        categoryMaps[field].set(value, code);
        categoryValues[field].push(value);
      }
      categoryColumns[field][rowCount] = code;
      if (!rawValue) missingValues += 1;
    });

    rowCount += 1;
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() ?? '';
    lines.forEach(processLine);
  }

  buffer += decoder.decode();
  if (buffer) processLine(buffer);
  if (!headers || rowCount === 0) {
    throw new Error('CSV lokal tidak memiliki baris data.');
  }

  const validTargetLabels = ['No', 'Yes'].filter((label) => categoryMaps.Will_Buy_EV.has(label));
  if (validTargetLabels.length !== 2) {
    throw new Error('Target Will_Buy_EV harus memuat kelas aktual No dan Yes.');
  }

  const targetCodes = validTargetLabels.map((label) => categoryMaps.Will_Buy_EV.get(label));
  const validTargetCount = targetCodes.reduce(
    (total, code) => total + categoryColumns.Will_Buy_EV.subarray(0, rowCount)
      .reduce((count, value) => count + Number(value === code), 0),
    0,
  );

  return {
    numeric: Object.fromEntries(
      NUMERIC_FIELDS.map((field) => [field, numericColumns[field].subarray(0, rowCount)]),
    ),
    categories: Object.fromEntries(
      CATEGORY_FIELDS.map((field) => [field, categoryColumns[field].subarray(0, rowCount)]),
    ),
    categoryValues,
    categoryMaps,
    rowCount,
    missingValues,
    validTargetLabels,
    targetCodes,
    invalidTargetCount: rowCount - validTargetCount,
  };
}

function ageGroup(value) {
  if (value < 30) return 0;
  if (value < 40) return 1;
  if (value < 50) return 2;
  if (value < 60) return 3;
  return 4;
}

function numericGroup(field, value) {
  if (field === 'Age') return AGE_GROUPS[ageGroup(value)];
  if (field === 'Annual_Income_USD') {
    if (value < 50_000) return '< $50k';
    if (value < 75_000) return '$50k–74k';
    if (value < 100_000) return '$75k–99k';
    return '≥ $100k';
  }
  if (field === 'Daily_Commute_km') {
    if (value <= 20) return '≤ 20 km';
    if (value <= 40) return '> 20–40 km';
    if (value <= 60) return '> 40–60 km';
    return '> 60 km';
  }
  if (field === 'Environmental_Concern_Level') return `${value} dari 5`;
  if (value <= 2) return '0–2 stasiun';
  if (value <= 5) return '3–5 stasiun';
  return '6+ stasiun';
}

function formatNumber(value, maximumFractionDigits = 0) {
  return new Intl.NumberFormat('id-ID', { maximumFractionDigits }).format(value);
}

function formatPercent(value) {
  return `${formatNumber(value, 1)}%`;
}

function categoryLabel(value) {
  if (value === 'Yes') return 'Ya';
  if (value === 'No') return 'Tidak';
  if (value === '(Kosong)') return 'Kosong';
  if (value === 'Low') return 'Rendah';
  if (value === 'Medium') return 'Sedang';
  if (value === 'High') return 'Tinggi';
  return value;
}

function getSortedCategoryValues(dataset, field) {
  const values = dataset.categoryValues[field];
  const preferredOrder = CATEGORY_ORDER[field] ?? [];
  return [...values].sort((left, right) => {
    const leftIndex = preferredOrder.indexOf(left);
    const rightIndex = preferredOrder.indexOf(right);
    if (leftIndex !== -1 || rightIndex !== -1) {
      return (leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex)
        - (rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex);
    }
    return left.localeCompare(right, 'id');
  });
}

function getRateGroupOrder(dataset, field, numeric) {
  if (!numeric) return getSortedCategoryValues(dataset, field);
  if (field === 'Age') return AGE_GROUPS;
  if (field === 'Annual_Income_USD') return ['< $50k', '$50k–74k', '$75k–99k', '≥ $100k'];
  if (field === 'Daily_Commute_km') return ['≤ 20 km', '> 20–40 km', '> 40–60 km', '> 60 km'];
  if (field === 'Environmental_Concern_Level') {
    return ['1 dari 5', '2 dari 5', '3 dari 5', '4 dari 5', '5 dari 5'];
  }
  return ['0–2 stasiun', '3–5 stasiun', '6+ stasiun'];
}

function calculateAnalytics(dataset, indexes) {
  const yesCode = dataset.categoryMaps.Will_Buy_EV.get('Yes');
  const targetCounts = Object.fromEntries(dataset.validTargetLabels.map((label) => [label, 0]));
  const groupMaps = Object.fromEntries(RATE_FIELDS.map(({ key }) => [key, new Map()]));
  let yes = 0;
  let commuteSum = 0;
  let commuteCount = 0;

  for (let index = 0; index < indexes.length; index += 1) {
    const rowIndex = indexes[index];
    const isYes = dataset.categories.Will_Buy_EV[rowIndex] === yesCode;
    const targetLabel = dataset.categoryValues.Will_Buy_EV[dataset.categories.Will_Buy_EV[rowIndex]];
    targetCounts[targetLabel] += 1;
    if (isYes) yes += 1;

    const commute = dataset.numeric.Daily_Commute_km[rowIndex];
    if (Number.isFinite(commute)) {
      commuteSum += commute;
      commuteCount += 1;
    }

    for (let fieldIndex = 0; fieldIndex < RATE_FIELDS.length; fieldIndex += 1) {
      const { key, field, numeric } = RATE_FIELDS[fieldIndex];
      const value = numeric
        ? dataset.numeric[field][rowIndex]
        : dataset.categoryValues[field][dataset.categories[field][rowIndex]];
      if (numeric && !Number.isFinite(value)) continue;

      const label = numeric ? numericGroup(field, value) : value;
      const groups = groupMaps[key];
      let group = groups.get(label);
      if (!group) {
        group = { label, count: 0, yes: 0 };
        groups.set(label, group);
      }
      group.count += 1;
      if (isYes) group.yes += 1;
    }
  }

  const rates = Object.fromEntries(RATE_FIELDS.map(({ key, field, numeric }) => {
    const order = getRateGroupOrder(dataset, field, numeric);
    const groups = [...groupMaps[key].values()]
      .map((group) => ({ ...group, rate: (group.yes / group.count) * 100 }))
      .sort((left, right) => order.indexOf(left.label) - order.indexOf(right.label));
    return [key, groups];
  }));

  return {
    summary: {
      total: indexes.length,
      yes,
      yesRate: indexes.length > 0 ? (yes / indexes.length) * 100 : 0,
      averageCommute: commuteCount > 0 ? commuteSum / commuteCount : null,
      commuteCount,
    },
    targetStats: dataset.validTargetLabels.map((label) => ({
      label,
      count: targetCounts[label],
    })),
    rates,
  };
}

function getComparison(groups) {
  const sampleGroups = groups.filter((group) => group.count >= 30);
  if (sampleGroups.length < 2) return null;
  const sortedGroups = [...sampleGroups].sort((left, right) => right.rate - left.rate);
  return {
    highest: sortedGroups[0],
    lowest: sortedGroups[sortedGroups.length - 1],
    difference: sortedGroups[0].rate - sortedGroups[sortedGroups.length - 1].rate,
  };
}

function getComparisonSummary(groups, dimensionLabel) {
  const comparison = getComparison(groups);
  if (!comparison) return `Belum cukup data untuk membandingkan ${dimensionLabel} pada filter ini.`;
  return `Proporsi responden yang berminat membeli EV pada tiap kelompok. Selisih ${formatNumber(comparison.difference, 1)} poin persentase.`;
}

function InsightCard({ title, explanation, comparison, featured = false }) {
  if (!comparison) {
    return (
      <article className="rounded-2xl border border-[#E5E3DE] bg-white p-5">
        <h3 className="font-semibold text-[#202522]">{title}</h3>
        <p className="mt-2 text-sm text-[#6B6E6A]">Belum cukup data pada pilihan filter ini untuk membandingkan kelompok.</p>
      </article>
    );
  }

  const { highest, lowest, difference } = comparison;
  return (
    <article className={`rounded-2xl border p-5 ${featured
      ? 'border-[#C6D8CC] bg-[#F2F7F3] sm:p-6'
      : 'border-[#E5E3DE] bg-white'}`}
    >
      <div className="flex items-start gap-3">
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${featured ? 'bg-[#397454] text-white' : 'bg-[#F6F5F2] text-[#397454]'}`}>
          {featured
            ? <Lightbulb className="h-4 w-4" aria-hidden="true" />
            : <TrendingUp className="h-4 w-4" aria-hidden="true" />}
        </span>
        <div className="min-w-0">
          <h3 className="font-semibold leading-snug text-[#202522]">{title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-[#6B6E6A]">{explanation}</p>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {[highest, lowest].map((group, index) => (
          <div key={group.label} className={`rounded-xl p-3 ${index === 0 ? 'bg-white' : 'bg-[#F6F5F2]'}`}>
            <p className="text-[11px] leading-snug text-[#6B6E6A]">
              {index === 0 ? 'Lebih banyak yang berminat' : 'Lebih sedikit yang berminat'}
            </p>
            <p className="mt-1 text-xl font-bold tracking-tight text-[#202522]">{formatPercent(group.rate)}</p>
            <p className="mt-0.5 text-xs font-medium text-[#202522]">{categoryLabel(group.label)}</p>
            <p className="mt-1 text-[11px] text-[#6B6E6A]">{formatNumber(group.count)} responden</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs font-medium text-[#397454]">
        Selisih: {formatNumber(difference, 1)} poin persentase
      </p>
    </article>
  );
}

function MetricCard({ icon: Icon, label, value, note, accent = 'text-[#26352F]' }) {
  return (
    <article className="rounded-2xl border border-[#E5E3DE] bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-[#6B6E6A]">{label}</span>
        <Icon className={`h-5 w-5 shrink-0 ${accent}`} aria-hidden="true" />
      </div>
      <p className="text-2xl font-bold tracking-tight text-[#202522]">{value}</p>
      <p className="mt-1 text-xs leading-relaxed text-[#6B6E6A]">{note}</p>
    </article>
  );
}

function TargetDistribution({ stats, total }) {
  if (total === 0) return <ChartEmpty />;
  return (
    <div className="space-y-5">
      {stats.map((item) => {
        const percentage = (item.count / total) * 100;
        return (
          <div key={item.label}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
              <span className="font-medium text-[#202522]">{categoryLabel(item.label)}</span>
              <span className="shrink-0 font-semibold text-[#202522]">
                {formatNumber(item.count)} <span className="font-normal text-[#6B6E6A]">· {formatPercent(percentage)}</span>
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-[#EBEAE6]">
              <div
                className={`h-full rounded-full ${item.label === 'Yes' ? 'bg-[#397454]' : 'bg-[#718078]'}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RateChart({ groups }) {
  if (groups.length === 0) return <ChartEmpty />;
  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.label}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-xs">
            <span className="min-w-0 truncate font-medium text-[#202522]">{categoryLabel(group.label)}</span>
            <span className="shrink-0 text-[#6B6E6A]">
              <strong className="text-[#202522]">{formatPercent(group.rate)}</strong>
              <span className="ml-1">· {formatNumber(group.count)} responden</span>
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-[#EBEAE6]">
            <div className="h-full rounded-full bg-[#397454]" style={{ width: `${Math.min(100, Math.max(0, group.rate))}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ChartEmpty() {
  return (
    <div className="flex min-h-32 items-center justify-center rounded-xl bg-[#F6F5F2] px-4 text-center text-sm text-[#6B6E6A]">
      Tidak ada data yang cocok dengan filter aktif.
    </div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <article className="min-w-0 rounded-2xl border border-[#E5E3DE] bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-[#202522]">{title}</h3>
      <p className="mb-5 mt-1 text-xs leading-relaxed text-[#6B6E6A]">{subtitle}</p>
      {children}
    </article>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    age: 'all',
    City_Type: 'all',
    Current_Car_Type: 'all',
  });

  useEffect(() => {
    const controller = new AbortController();
    loadLocalDataset(controller.signal)
      .then(setData)
      .catch((loadError) => {
        if (loadError.name !== 'AbortError') setError(loadError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  const filteredIndexes = useMemo(() => {
    if (!data) return new Uint32Array(0);
    const indexes = new Uint32Array(data.rowCount);
    const yesCode = data.categoryMaps.Will_Buy_EV.get('Yes');
    const noCode = data.categoryMaps.Will_Buy_EV.get('No');
    const activeCategoryFilters = CATEGORY_FILTER_FIELDS.filter((field) => filters[field] !== 'all');
    const filterByAge = filters.age !== 'all';
    let count = 0;

    for (let rowIndex = 0; rowIndex < data.rowCount; rowIndex += 1) {
      const targetCode = data.categories.Will_Buy_EV[rowIndex];
      if (targetCode !== yesCode && targetCode !== noCode) continue;

      const age = data.numeric.Age[rowIndex];
      if (filterByAge && (!Number.isFinite(age) || String(ageGroup(age)) !== filters.age)) continue;

      let matchesCategories = true;
      for (let fieldIndex = 0; fieldIndex < activeCategoryFilters.length; fieldIndex += 1) {
        const field = activeCategoryFilters[fieldIndex];
        const selected = filters[field];
        if (data.categoryValues[field][data.categories[field][rowIndex]] !== selected) {
          matchesCategories = false;
          break;
        }
      }
      if (matchesCategories) indexes[count++] = rowIndex;
    }

    return indexes.subarray(0, count);
  }, [data, filters]);

  const analytics = useMemo(
    () => (data ? calculateAnalytics(data, filteredIndexes) : null),
    [data, filteredIndexes],
  );
  const summary = analytics?.summary;
  const insights = analytics ? [
    {
      key: 'environment',
      title: 'Minat berbeda menurut kepedulian terhadap lingkungan',
      explanation: getComparisonSummary(analytics.rates.environment, 'kepedulian lingkungan'),
      comparison: getComparison(analytics.rates.environment),
    },
    {
      key: 'subsidy',
      title: 'Ketersediaan subsidi juga menunjukkan perbedaan',
      explanation: getComparisonSummary(analytics.rates.subsidy, 'ketersediaan subsidi'),
      comparison: getComparison(analytics.rates.subsidy),
    },
    {
      key: 'income',
      title: 'Minat cenderung lebih tinggi pada kelompok berpendapatan tinggi',
      explanation: getComparisonSummary(analytics.rates.income, 'tingkat pendapatan'),
      comparison: getComparison(analytics.rates.income),
    },
    {
      key: 'homeCharging',
      title: 'Akses pengisian di rumah',
      explanation: getComparisonSummary(analytics.rates.homeCharging, 'pengisian di rumah'),
      comparison: getComparison(analytics.rates.homeCharging),
    },
  ] : [];

  const filterIsActive = Object.values(filters).some((value) => value !== 'all');
  const resetFilters = () => {
    setFilters({
      age: 'all',
      City_Type: 'all',
      Current_Car_Type: 'all',
    });
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-[1360px] space-y-8 p-5 md:p-10" aria-live="polite">
        <div className="h-9 w-2/3 animate-pulse rounded-xl bg-[#F6F5F2]" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-32 animate-pulse rounded-2xl bg-[#F6F5F2]" />
          ))}
        </div>
        <p className="text-sm text-[#6B6E6A]">Memuat dan memproses dataset lokal...</p>
      </div>
    );
  }

  if (error || !data || !analytics || !summary) {
    return (
      <div className="p-5 md:p-10">
        <div className="mx-auto max-w-lg rounded-2xl border border-[#E5E3DE] bg-[#F6F5F2] p-8 text-center">
          <AlertCircle className="mx-auto mb-3 h-10 w-10 text-[#B94A42]" aria-hidden="true" />
          <h1 className="mb-1 text-lg font-semibold text-[#202522]">Gagal Memuat Dataset</h1>
          <p className="text-sm text-[#6B6E6A]">
            {error || 'Data dashboard tidak tersedia saat ini.'}
          </p>
          <p className="mt-3 text-xs text-[#6B6E6A]">
            Pastikan berkas CSV lokal tersedia pada data/raw di proyek.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1360px] space-y-8 p-5 md:space-y-10 md:p-10">
      <header className="flex flex-col gap-4 border-b border-[#E5E3DE] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#397454]">
            Temuan utama · data lokal
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-[#202522] md:text-3xl">
            Apa yang berkaitan dengan minat membeli EV?
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#6B6E6A]">
            Ringkasan sederhana dari {formatNumber(data.rowCount)} responden. Angka menunjukkan pola dalam data, bukan bukti sebab-akibat.
          </p>
        </div>
        <Link
          to="/prediksi"
          className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-[#26352F] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#35483F]"
        >
          <span>Uji Form Prediksi</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </header>

      <section className="space-y-4" aria-labelledby="insights-title">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-[#397454]" aria-hidden="true" />
          <h2 id="insights-title" className="text-lg font-semibold text-[#202522]">Hal penting yang terlihat dari data</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {insights.map((insight, index) => (
            <InsightCard
              key={insight.key}
              title={insight.title}
              explanation={insight.explanation}
              comparison={insight.comparison}
              featured={index === 0}
            />
          ))}
        </div>
        <p className="text-xs leading-relaxed text-[#6B6E6A]">
          Perbandingan ini menunjukkan perbedaan di dalam data, bukan bukti bahwa suatu faktor menyebabkan seseorang membeli EV.
        </p>
      </section>

      <section className="space-y-3" aria-labelledby="summary-title">
        <h2 id="summary-title" className="text-sm font-semibold text-[#515752]">Gambaran singkat data</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <MetricCard
            icon={Users}
            label="Orang dalam tampilan"
            value={formatNumber(summary.total)}
            note={filterIsActive ? 'Jumlah setelah filter yang dipilih' : 'Seluruh responden dengan jawaban valid'}
          />
          <MetricCard
            icon={CarFront}
            label="Berminat membeli EV"
            value={`${formatPercent(summary.yesRate)} · ${formatNumber(summary.yes)} orang`}
            note={`Dari ${formatNumber(summary.total)} responden pada tampilan`}
            accent="text-[#397454]"
          />
        </div>
      </section>

      <details className="rounded-2xl border border-[#E5E3DE] bg-white">
        <summary className="flex cursor-pointer list-none items-center gap-2 p-4 text-sm font-semibold text-[#26352F] marker:hidden">
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Sesuaikan temuan (opsional)
        </summary>
        <div className="space-y-4 border-t border-[#E5E3DE] p-4">
          <button
            type="button"
            onClick={resetFilters}
            disabled={!filterIsActive}
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-[#E5E3DE] px-3 py-2 text-xs font-medium text-[#26352F] transition-colors hover:bg-[#F6F5F2] disabled:cursor-not-allowed disabled:opacity-45"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset filter
          </button>
          <div className="grid grid-cols-1 gap-3 rounded-xl bg-[#F6F5F2] p-4 sm:grid-cols-2 lg:grid-cols-3">
            {FILTER_DEFINITIONS.map((definition) => {
            const options = definition.options ?? [
              { label: 'Semua', value: 'all' },
              ...getSortedCategoryValues(data, definition.key)
                .map((value) => ({ label: categoryLabel(value), value })),
            ];
            return (
              <label key={definition.key} className="min-w-0 space-y-1.5">
                <span className="text-xs font-medium text-[#515752]">{definition.label}</span>
                <select
                  value={filters[definition.key]}
                  onChange={(event) => setFilters((current) => ({
                    ...current,
                    [definition.key]: event.target.value,
                  }))}
                  className="w-full rounded-lg border border-[#D9D7D1] bg-white px-3 py-2.5 text-sm text-[#202522] outline-none focus:border-[#397454] focus:ring-2 focus:ring-[#397454]/15"
                >
                  {options.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
            );
            })}
          </div>
          {filterIsActive && (
            <p className="text-xs text-[#6B6E6A]" role="status">
              Filter aktif · hasil analisis menggunakan {formatNumber(summary.total)} responden.
            </p>
          )}
        </div>
      </details>

      <details className="rounded-2xl border border-[#E5E3DE] bg-white">
        <summary className="flex cursor-pointer list-none items-center gap-2 p-4 text-sm font-semibold text-[#26352F] marker:hidden">
          Lihat grafik dan rincian lainnya
        </summary>
        <div className="space-y-6 border-t border-[#E5E3DE] p-4 sm:p-6">
      <section className="space-y-4" aria-labelledby="target-title">
        <div>
          <h2 id="target-title" className="text-lg font-semibold text-[#202522]">Distribusi Target Pembelian EV</h2>
          <p className="text-xs text-[#6B6E6A]">
            Kelas target mengikuti nilai aktual pada kolom Will_Buy_EV; warna hijau menandai Yes.
          </p>
        </div>
        <ChartCard
          title="Berapa responden yang bersedia membeli EV?"
          subtitle="Jumlah dan persentase setiap kelas dari total responden pada filter aktif."
        >
          <TargetDistribution stats={analytics.targetStats} total={summary.total} />
        </ChartCard>
        {summary.total > 0 && summary.yesRate < 30 && (
          <p className="rounded-xl border border-[#E8DDC8] bg-[#FBF7EF] p-4 text-xs leading-relaxed text-[#6B5B3D]">
            Hanya {formatPercent(summary.yesRate)} responden pada tampilan ini yang berminat membeli EV.
            Perbedaan ukuran kelas perlu dipertimbangkan saat membandingkan frekuensi dan mengevaluasi model.
          </p>
        )}
      </section>

      <section className="space-y-4" aria-labelledby="relationship-title">
        <div>
          <h2 id="relationship-title" className="text-lg font-semibold text-[#202522]">
            Faktor yang Berhubungan dengan Keputusan Pembelian
          </h2>
          <p className="text-xs text-[#6B6E6A]">
            Grafik membandingkan proporsi kelas Yes di dalam tiap kelompok, bukan jumlah absolut.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <ChartCard
            title="Apakah fasilitas pengisian di rumah berkaitan dengan minat membeli?"
            subtitle="Proporsi Yes menurut kemungkinan pengisian daya di rumah."
          >
            <RateChart groups={analytics.rates.homeCharging} />
          </ChartCard>
          <ChartCard
            title="Bagaimana proporsi berbeda menurut ketersediaan subsidi?"
            subtitle="Perbandingan Yes/No dalam setiap kelompok ketersediaan subsidi."
          >
            <RateChart groups={analytics.rates.subsidy} />
          </ChartCard>
          <ChartCard
            title="Apakah proporsi berbeda pada tingkat range anxiety?"
            subtitle="Kategori rendah, sedang, dan tinggi sesuai nilai pada dataset."
          >
            <RateChart groups={analytics.rates.rangeAnxiety} />
          </ChartCard>
          <ChartCard
            title="Bagaimana proporsi menurut kepedulian lingkungan?"
            subtitle="Skala 1–5 ditampilkan sebagai kelompok diskret, bukan korelasi numerik."
          >
            <RateChart groups={analytics.rates.environment} />
          </ChartCard>
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="profile-title">
        <div>
          <h2 id="profile-title" className="text-lg font-semibold text-[#202522]">Karakteristik Responden</h2>
          <p className="text-xs text-[#6B6E6A]">
            Tingkat pembelian EV per kelompok membantu membandingkan distribusi yang memiliki ukuran sampel berbeda.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <ChartCard
            title="Proporsi pembelian menurut kelompok usia"
            subtitle="Kelompok umur dalam tahun; setiap baris mencantumkan jumlah sampel."
          >
            <RateChart groups={analytics.rates.age} />
          </ChartCard>
          <ChartCard
            title="Proporsi pembelian menurut pendapatan"
            subtitle="Rentang pendapatan tahunan dalam USD; kelompok berbasis ambang untuk perbandingan."
          >
            <RateChart groups={analytics.rates.income} />
          </ChartCard>
          <ChartCard
            title="Proporsi pembelian menurut jarak komuter"
            subtitle="Jarak perjalanan harian dalam km, dikelompokkan agar tren mudah dibandingkan."
          >
            <RateChart groups={analytics.rates.commute} />
          </ChartCard>
          <ChartCard
            title="Proporsi pembelian menurut stasiun dekat rumah"
            subtitle="Jumlah stasiun pengisian publik di sekitar rumah, dalam kelompok 0–2, 3–5, dan 6+."
          >
            <RateChart groups={analytics.rates.stations} />
          </ChartCard>
        </div>
      </section>
          <p className="text-xs leading-relaxed text-[#6B6E6A]">
            Nilai membandingkan persentase orang yang berminat membeli EV pada tiap kelompok. Perbedaan ini bersifat deskriptif, bukan bukti sebab-akibat.
          </p>
        </div>
      </details>
    </div>
  );
}
