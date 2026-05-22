/**
 * Shared horizontal sub-navigation for the Admin → Control section.
 *
 * Renders 5 pill-style tabs that link to every Control page:
 *   • Business Metrics      /admin/business-metrics
 *   • Provider Pressure     /admin/provider-health
 *   • Routing Rules         /admin/routing-rules
 *   • Cadences              /admin/cadences
 *   • Score Rules           /admin/score-rules
 *
 * Behaviour:
 *   - Horizontal-scroll on mobile (no wrap, no broken layout)
 *   - Larger touch-friendly pills with generous vertical padding
 *   - Active state is derived from `useLocation()` so works without a prop
 *   - Sticky just below the main app header so it acts as a section header
 *
 * Usage:  <ControlSubNav /> at the very top of every Control page.
 */
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  ChartLine,
  Gauge,
  Path,
  Timer,
  ChartLineUp,
} from '@phosphor-icons/react';
import { useLang } from '../../i18n';

const ControlSubNav = () => {
  const { t } = useLang();
  const { pathname } = useLocation();

  const tabs = [
    {
      to: '/admin/business-metrics',
      icon: ChartLine,
      label: t('adm_business_metrics') || 'Business Metrics',
    },
    {
      to: '/admin/provider-health',
      icon: Gauge,
      label: 'Provider Pressure',
    },
    {
      to: '/admin/routing-rules',
      icon: Path,
      label: t('routingRules') || 'Routing Rules',
    },
    {
      to: '/admin/cadences',
      icon: Timer,
      label: t('cadences') || 'Cadences',
    },
    {
      to: '/admin/score-rules',
      icon: ChartLineUp,
      label: t('scoreRules') || 'Score Rules',
    },
  ];

  return (
    <div
      className="-mx-4 md:-mx-6 lg:-mx-[50px] -mt-5 md:-mt-6 lg:-mt-8 mb-7 sm:mb-8 bg-white border-b border-[#E4E4E7]"
      data-testid="control-subnav"
    >
      <div className="px-4 md:px-6 lg:px-[50px] py-3.5 sm:py-4 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 min-w-max">
          {tabs.map(({ to, icon: Icon, label }) => {
            const active = pathname === to;
            return (
              <NavLink
                key={to}
                to={to}
                className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2 rounded-full text-[13px] sm:text-sm font-medium whitespace-nowrap transition-all ${
                  active
                    ? 'bg-[#18181B] text-white shadow-sm'
                    : 'text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#18181B]'
                }`}
                data-testid={`control-tab-${to.split('/').pop()}`}
              >
                <Icon size={15} weight={active ? 'fill' : 'duotone'} />
                {label}
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ControlSubNav;
