/**
 * Admin Business Metrics
 *
 *   /admin/business-metrics
 *
 * Shows exactly 3 KPIs requested by product spec:
 *   - conversion     (paid invoices / sent invoices)
 *   - avg_order_time (avg hours between order created_at → completedAt)
 *   - repeat_rate    (customers with 2+ orders / total customers)
 *
 * Data comes from GET /api/admin/metrics.
 */
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useLang } from '../../i18n';
import ControlSubNav from '../../components/admin/ControlSubNav';
import ControlPageHeader from '../../components/admin/ControlPageHeader';
import {
  ChartLine,
  CurrencyCircleDollar,
  Clock,
  UsersThree,
  ArrowClockwise,
} from '@phosphor-icons/react';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const fmtPct = (v) =>
  v === null || v === undefined ? '—' : `${(v * 100).toFixed(1)}%`;

const MetricCard = ({ icon: Icon, title, value, subtitle, color = 'indigo' }) => {
  const palette = {
    indigo: 'bg-indigo-50 text-indigo-600 ring-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    amber: 'bg-amber-50 text-amber-600 ring-amber-100',
  }[color];
  return (
    <div
      className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm flex items-center gap-3.5 min-w-0"
      data-testid={`metric-card-${color}`}
    >
      <div
        className={`p-2.5 rounded-xl ring-1 ${palette} flex-shrink-0`}
      >
        <Icon size={22} weight="bold" />
      </div>
      <div className="min-w-0 flex-1">
        <h3
          className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight leading-none"
          data-testid={`metric-value-${color}`}
        >
          {value}
        </h3>
        <p className="text-xs sm:text-sm font-medium text-zinc-600 mt-1.5 truncate">
          {title}
        </p>
        {subtitle && (
          <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5 truncate">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

const FormulaCard = ({ title, body }) => (
  <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-xs text-zinc-600 leading-relaxed min-w-0">
    <div className="font-semibold text-zinc-800 mb-1.5">{title}</div>
    <div className="text-zinc-500">{body}</div>
  </div>
);

export default function AdminBusinessMetricsPage() {
  const { t } = useLang();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const r = await axios.get(`${API_URL}/api/admin/metrics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(r.data);
    } catch (e) {
      console.error(e);
      toast.error(t('metricsLoadFail'));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchMetrics();
    const id = setInterval(fetchMetrics, 60 * 1000);
    return () => clearInterval(id);
  }, [fetchMetrics]);

  // fmtHours uses t() so it must be defined inside the component scope
  const fmtHours = (v) => {
    if (v === null || v === undefined) return '—';
    if (v < 1) return `${Math.round(v * 60)} ${t('r9_min_short')}`;
    if (v < 24) return `${v.toFixed(1)} ${t('r9_h_short')}`;
    return `${(v / 24).toFixed(1)} ${t('r9_days_short')}`;
  };

  const m = data?.metrics;

  return (
    <div data-testid="admin-business-metrics-page">
      <ControlSubNav />

      <div className="space-y-5 sm:space-y-6">
        <ControlPageHeader
          icon={ChartLine}
          title={t('adm_business_metrics')}
          subtitle={t('adm_three_key_management_metrics_conversion_execution')}
          action={
            <button
              onClick={fetchMetrics}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 h-10 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs sm:text-sm font-medium text-zinc-700 disabled:opacity-50 whitespace-nowrap shadow-sm"
              data-testid="metrics-refresh-btn"
              aria-label={t('adm_refresh_3')}
            >
              <ArrowClockwise size={16} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">{t('adm_refresh_3')}</span>
            </button>
          }
        />

        {loading && !data && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-zinc-200 p-5 h-24 animate-pulse"
              />
            ))}
          </div>
        )}

        {m && (
          <>
            {/* 3 KPIs — always side-by-side on >=sm, never wraps awkwardly */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <MetricCard
                icon={CurrencyCircleDollar}
                title={t('invoiceConv')}
                value={fmtPct(m.conversion?.value)}
                subtitle={`${m.conversion?.paid ?? 0} ${t('adm_paid_of')} ${m.conversion?.sent ?? 0} ${t('adm_sent')}`}
                color="emerald"
              />
              <MetricCard
                icon={Clock}
                title={t('avgCompletionTime')}
                value={fmtHours(m.avg_order_time?.value_hours)}
                subtitle={`${t('adm_over')} ${m.avg_order_time?.completed_orders ?? 0} ${t('adm_completed_orders')}`}
                color="indigo"
              />
              <MetricCard
                icon={UsersThree}
                title={t('clientRepeat')}
                value={fmtPct(m.repeat_rate?.value)}
                subtitle={`${m.repeat_rate?.repeat_customers ?? 0} ${t('adm_repeat_of')} ${m.repeat_rate?.total_customers ?? 0} ${t('adm_customers')}`}
                color="amber"
              />
            </div>

            {/* Formula footer — 3-column grid mirrors the cards above, no empty space */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <FormulaCard
                title={t('conversion')}
                body={t('adm2_paid_invoices_sent_invo_17ac8c0000')}
              />
              <FormulaCard
                title={t('avgOrderTime')}
                body={t('adm2_completedat_created_at_685e4b6248')}
              />
              <FormulaCard
                title={t('repeatRate')}
                body={t('adm2_2_67b5fa1733')}
              />
            </div>

            <div className="text-[11px] text-zinc-400">
              {t('updated')}: {new Date(data.generated_at).toLocaleString()}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
