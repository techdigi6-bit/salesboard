import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  BarChart3,
  Calendar,
  Layers,
  Info,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useSales } from '../../context/SalesContext';
import { DailyTrendPoint, WeeklyTrendPoint } from '../../types';
import {
  formatRupiah,
  formatCompactRupiah,
  formatNumber,
  formatPercent,
} from '../../utils/formatters';

type ChartMode = 'daily' | 'weekly';
type MetricType = 'revenue' | 'orders' | 'aov';
type ChartStyle = 'area' | 'bar';

export const SalesTrendChart: React.FC = () => {
  const { dailyTrend, weeklyTrend, timeRange } = useSales();

  const [mode, setMode] = useState<ChartMode>('daily');
  const [metric, setMetric] = useState<MetricType>('revenue');
  const [chartStyle, setChartStyle] = useState<ChartStyle>('area');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Filter daily data based on active timeRange
  const activeDailyData = useMemo(() => {
    if (timeRange === '7d') return dailyTrend.slice(-7);
    if (timeRange === '14d') return dailyTrend.slice(-14);
    if (timeRange === 'this_month') return dailyTrend.filter((d) => d.date.startsWith('2026-10'));
    return dailyTrend; // default 30d
  }, [dailyTrend, timeRange]);

  const activeWeeklyData = useMemo(() => {
    return weeklyTrend;
  }, [weeklyTrend]);

  // Unified data points for rendering
  const dataset = mode === 'daily' ? activeDailyData : activeWeeklyData;

  const getMetricValue = (item: DailyTrendPoint | WeeklyTrendPoint) => {
    if (metric === 'revenue') return item.revenue;
    if (metric === 'orders') return item.ordersCount;
    return item.aov;
  };

  const getTargetValue = (item: DailyTrendPoint | WeeklyTrendPoint) => {
    if (metric === 'revenue') return item.target;
    if (metric === 'orders') return Math.round(item.target / 600000);
    return 620000;
  };

  // Summary calculations
  const totalValue = dataset.reduce((acc, curr) => acc + getMetricValue(curr), 0);
  const avgValue = dataset.length ? Math.round(totalValue / dataset.length) : 0;
  const maxValue = Math.max(...dataset.map((d) => Math.max(getMetricValue(d), getTargetValue(d))), 100);

  // SVG Chart Dimensions
  const svgWidth = 800;
  const svgHeight = 280;
  const paddingX = 40;
  const paddingTop = 25;
  const paddingBottom = 45;

  const chartInnerWidth = svgWidth - paddingX * 2;
  const chartInnerHeight = svgHeight - paddingTop - paddingBottom;

  // Coordinate mapper
  const points = useMemo(() => {
    if (!dataset.length) return [];
    return dataset.map((item, index) => {
      const x = paddingX + (index / (dataset.length - 1 || 1)) * chartInnerWidth;
      const y =
        paddingTop +
        chartInnerHeight -
        (getMetricValue(item) / (maxValue * 1.15 || 1)) * chartInnerHeight;
      const targetY =
        paddingTop +
        chartInnerHeight -
        (getTargetValue(item) / (maxValue * 1.15 || 1)) * chartInnerHeight;
      return { x, y, targetY, item, index };
    });
  }, [dataset, metric, maxValue, chartInnerWidth, chartInnerHeight]);

  // Construct Area / Line SVG Path
  const areaPath = useMemo(() => {
    if (points.length === 0) return '';
    const linePath = points.reduce((path, pt, idx, arr) => {
      if (idx === 0) return `M ${pt.x} ${pt.y}`;
      // Smooth cubic bezier
      const prev = arr[idx - 1];
      const cx1 = prev.x + (pt.x - prev.x) / 2;
      const cy1 = prev.y;
      const cx2 = prev.x + (pt.x - prev.x) / 2;
      const cy2 = pt.y;
      return `${path} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${pt.x} ${pt.y}`;
    }, '');

    const baselineY = paddingTop + chartInnerHeight;
    return `${linePath} L ${points[points.length - 1].x} ${baselineY} L ${points[0].x} ${baselineY} Z`;
  }, [points, paddingTop, chartInnerHeight]);

  const linePath = useMemo(() => {
    if (points.length === 0) return '';
    return points.reduce((path, pt, idx, arr) => {
      if (idx === 0) return `M ${pt.x} ${pt.y}`;
      const prev = arr[idx - 1];
      const cx1 = prev.x + (pt.x - prev.x) / 2;
      const cy1 = prev.y;
      const cx2 = prev.x + (pt.x - prev.x) / 2;
      const cy2 = pt.y;
      return `${path} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${pt.x} ${pt.y}`;
    }, '');
  }, [points]);

  const targetLinePath = useMemo(() => {
    if (points.length === 0) return '';
    return points.reduce((path, pt, idx) => {
      if (idx === 0) return `M ${pt.x} ${pt.targetY}`;
      return `${path} L ${pt.x} ${pt.targetY}`;
    }, '');
  }, [points]);

  const activePoint = hoveredIndex !== null && points[hoveredIndex] ? points[hoveredIndex] : points[points.length - 1];

  // Previous comparison
  const previousPoint = activePoint && activePoint.index > 0 ? points[activePoint.index - 1] : null;
  const growthRate =
    activePoint && previousPoint
      ? ((getMetricValue(activePoint.item) - getMetricValue(previousPoint.item)) /
          (getMetricValue(previousPoint.item) || 1)) *
        100
      : 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
      {/* Top Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900 tracking-tight">
              Visualisasi Tren Penjualan
            </h2>
            <span className="text-xs text-slate-600">·</span>
            <span className="text-xs text-slate-600 font-medium">
              {mode === 'daily' ? 'Data Harian' : 'Data Mingguan'}
            </span>
          </div>
          <div className="text-xs text-slate-600 mt-0.5">
            Menampilkan performa omzet terhadap target penjualan yang ditentukan
          </div>
        </div>

        {/* View Mode & Metric Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Daily vs Weekly Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => {
                setMode('daily');
                setHoveredIndex(null);
              }}
              className={`px-3 py-1 font-medium rounded-md transition-colors ${
                mode === 'daily'
                  ? 'bg-white text-blue-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tren Harian
            </button>
            <button
              onClick={() => {
                setMode('weekly');
                setHoveredIndex(null);
              }}
              className={`px-3 py-1 font-medium rounded-md transition-colors ${
                mode === 'weekly'
                  ? 'bg-white text-blue-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tren Mingguan
            </button>
          </div>

          {/* Metric Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setMetric('revenue')}
              className={`px-2.5 py-1 font-medium rounded-md transition-colors ${
                metric === 'revenue'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Omzet (IDR)
            </button>
            <button
              onClick={() => setMetric('orders')}
              className={`px-2.5 py-1 font-medium rounded-md transition-colors ${
                metric === 'orders'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Total Order
            </button>
            <button
              onClick={() => setMetric('aov')}
              className={`px-2.5 py-1 font-medium rounded-md transition-colors ${
                metric === 'aov'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rata-rata Order (AOV)
            </button>
          </div>

          {/* Chart Style Switcher */}
          <div className="hidden xl:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setChartStyle('area')}
              className={`p-1.5 rounded-md ${
                chartStyle === 'area' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Grafik Area Halus"
            >
              <TrendingUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartStyle('bar')}
              className={`p-1.5 rounded-md ${
                chartStyle === 'bar' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Diagram Batang"
            >
              <BarChart3 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Metric Focus Kicker */}
      {activePoint && (
        <div className="my-3 py-2 px-3 bg-slate-50 border border-slate-200/80 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-800">
                {'dayLabel' in activePoint.item
                  ? `${activePoint.item.dayLabel} (${activePoint.item.dayName})`
                  : activePoint.item.label}
              </span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">
                {metric === 'revenue'
                  ? 'Omzet:'
                  : metric === 'orders'
                  ? 'Volume:'
                  : 'Nilai Keranjang:'}
              </span>
              <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                {metric === 'revenue' || metric === 'aov'
                  ? formatRupiah(getMetricValue(activePoint.item))
                  : `${formatNumber(getMetricValue(activePoint.item))} Pesanan`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono tabular-nums">
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="text-slate-400">Target:</span>
              <span className="font-medium text-slate-700">
                {metric === 'revenue'
                  ? formatCompactRupiah(getTargetValue(activePoint.item))
                  : formatNumber(getTargetValue(activePoint.item))}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Pencapaian:</span>
              <span
                className={`font-semibold ${
                  getMetricValue(activePoint.item) >= getTargetValue(activePoint.item)
                    ? 'text-emerald-600'
                    : 'text-amber-600'
                }`}
              >
                {formatPercent(
                  (getMetricValue(activePoint.item) / (getTargetValue(activePoint.item) || 1)) * 100
                )}
              </span>
            </div>

            {previousPoint && (
              <div
                className={`flex items-center gap-0.5 font-medium ${
                  growthRate >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {growthRate >= 0 ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                )}
                <span>{growthRate >= 0 ? `+${growthRate.toFixed(1)}%` : `${growthRate.toFixed(1)}%`}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* The Interactive SVG Chart */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible"
        >
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.75" />
            </linearGradient>
          </defs>

          {/* Grid lines (horizontal) */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = paddingTop + chartInnerHeight * (1 - ratio);
            const val = Math.round(maxValue * 1.15 * ratio);
            return (
              <g key={ratio}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray={ratio === 0 ? '' : '3 3'}
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  {metric === 'revenue' || metric === 'aov'
                    ? formatCompactRupiah(val)
                    : formatNumber(val)}
                </text>
              </g>
            );
          })}

          {/* Target Reference Line (Dashed Orange) */}
          {chartStyle === 'area' && (
            <path
              d={targetLinePath}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.85"
            />
          )}

          {/* Area Mode: Fill and Stroke */}
          {chartStyle === 'area' ? (
            <>
              <path d={areaPath} fill="url(#salesGradient)" />
              <path
                d={linePath}
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          ) : (
            /* Bar Chart Mode */
            points.map((pt, i) => {
              const barWidth = Math.max(8, Math.min(28, (chartInnerWidth / points.length) * 0.65));
              const barHeight = paddingTop + chartInnerHeight - pt.y;
              return (
                <rect
                  key={i}
                  x={pt.x - barWidth / 2}
                  y={pt.y}
                  width={barWidth}
                  height={Math.max(2, barHeight)}
                  rx="3"
                  fill="url(#barGradient)"
                  className="transition-all duration-150 hover:brightness-110 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                />
              );
            })
          )}

          {/* Interactive Data Points and Invisible Hitboxes */}
          {points.map((pt, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <g key={i}>
                {/* Crosshair vertical line on hover */}
                {isHovered && (
                  <line
                    x1={pt.x}
                    y1={paddingTop}
                    x2={pt.x}
                    y2={paddingTop + chartInnerHeight}
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Point dot */}
                {chartStyle === 'area' && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 5.5 : points.length > 20 ? 2.5 : 4}
                    fill={isHovered ? '#1d4ed8' : '#2563eb'}
                    stroke="#ffffff"
                    strokeWidth={isHovered ? 2.5 : 1.5}
                    className="transition-transform duration-100"
                  />
                )}

                {/* Wide invisible click/hover target */}
                <rect
                  x={pt.x - chartInnerWidth / points.length / 2}
                  y={paddingTop}
                  width={chartInnerWidth / points.length}
                  height={chartInnerHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                />
              </g>
            );
          })}

          {/* X Axis Labels */}
          {points.map((pt, i) => {
            // Show label every N items depending on length
            const step = points.length > 20 ? 4 : points.length > 10 ? 2 : 1;
            const shouldShow = i % step === 0 || i === points.length - 1;
            if (!shouldShow) return null;

            const label =
              'dayLabel' in pt.item ? pt.item.dayLabel : pt.item.label.split(' ')[0] + ' ' + pt.item.label.split(' ')[1];

            return (
              <text
                key={i}
                x={pt.x}
                y={svgHeight - 12}
                textAnchor="middle"
                className={`text-[10px] font-mono ${
                  hoveredIndex === i ? 'fill-blue-600 font-bold' : 'fill-slate-500'
                }`}
              >
                {label}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Legend and Chart Footer */}
      <div className="pt-3 mt-1 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-xs bg-blue-600 inline-block" />
            <span className="font-medium text-slate-700">Realisasi Penjualan</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 border-b-2 border-dashed border-amber-500 inline-block" />
            <span className="font-medium text-slate-700">Garis Target</span>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] tabular-nums">
          <span>
            Total Periode:{' '}
            <strong className="text-slate-800">
              {metric === 'revenue' || metric === 'aov' ? formatRupiah(totalValue) : `${formatNumber(totalValue)} Order`}
            </strong>
          </span>
          <span className="text-slate-300">·</span>
          <span>
            Rata-rata:{' '}
            <strong className="text-slate-800">
              {metric === 'revenue' || metric === 'aov' ? formatRupiah(avgValue) : `${formatNumber(avgValue)}/periode`}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
};
