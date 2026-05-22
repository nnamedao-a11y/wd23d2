/**
 * AdminPageHeader & AdminCard — canonical primitives for every admin page.
 *
 * Why this exists:
 *   Different admin pages used different header/card patterns (blue gradient
 *   bars, gray icons, double-bordered "card-in-card" wrappers, mismatched
 *   paddings & fonts). This file is the single source of truth.
 *
 * Use them like:
 *   <AdminPageHeader
 *     icon={Funnel}
 *     title="Customer Journey & Funnel"
 *     subtitle="Conversion analytics across the lifecycle."
 *     actions={(
 *       <>
 *         <WhiteSelect ... />
 *         <button>Refresh</button>
 *       </>
 *     )}
 *   />
 *
 *   <AdminCard padding="md">…body…</AdminCard>
 *
 * Both inherit Mazzard and the platform's #18181B / #FAFAFA palette.
 */
import React from 'react';

function cn(...xs) {
  return xs.filter(Boolean).join(' ');
}

/**
 * Page header — icon + title (single row), subtitle as its own full-width
 * row below, action controls flow into their own row on small screens so
 * dropdowns never get squeezed into a vertical "30 days" ribbon.
 */
export function AdminPageHeader({
  icon: Icon,
  title,
  subtitle,
  actions,
  className = '',
  testId = 'admin-page-header',
}) {
  return (
    <header
      className={cn(
        'bg-white border border-[#E4E4E7] rounded-2xl p-4 sm:p-5',
        className,
      )}
      data-testid={testId}
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-[#18181B] text-white flex items-center justify-center shrink-0">
            <Icon size={18} weight="duotone" />
          </div>
        )}
        <h1 className="text-[17px] sm:text-[19px] font-semibold tracking-tight text-[#18181B] leading-tight truncate flex-1 min-w-0">
          {title}
        </h1>
      </div>
      {subtitle && (
        <p className="mt-2 text-[12.5px] sm:text-[13px] text-[#71717A] leading-relaxed">
          {subtitle}
        </p>
      )}
      {actions && (
        <div
          className="mt-3 flex flex-wrap items-center gap-2 sm:gap-3"
          data-testid={`${testId}-actions`}
        >
          {actions}
        </div>
      )}
    </header>
  );
}

/**
 * Card — the only acceptable wrapper for content sections on admin pages.
 *
 * Rules:
 *   • A child of <AdminCard> must NEVER be another <AdminCard>. Use
 *     `<AdminSection>` (no border, just spacing) for sub-sections inside.
 *   • Padding is calibrated for mobile (`p-4`) and tablet+ (`sm:p-5`).
 *   • Hover/clickable variants share the same outer geometry to avoid
 *     subtle border/shadow drift between pages.
 */
export function AdminCard({
  children,
  className = '',
  padding = 'md',          // 'none' | 'sm' | 'md' | 'lg'
  as: Tag = 'div',
  testId,
  ...rest
}) {
  const padClass =
    padding === 'none' ? '' :
    padding === 'sm'   ? 'p-3 sm:p-4' :
    padding === 'lg'   ? 'p-5 sm:p-6' :
                         'p-4 sm:p-5';
  return (
    <Tag
      className={cn(
        'bg-white border border-[#E4E4E7] rounded-2xl',
        padClass,
        className,
      )}
      data-testid={testId}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/**
 * Section — borderless wrapper used inside a card to group sub-content
 * with consistent vertical rhythm.  This is what you reach for when you
 * would otherwise have nested <AdminCard>'s — i.e. "card-in-card".
 */
export function AdminSection({
  children,
  title,
  description,
  className = '',
  titleClassName = '',
  actions,
}) {
  return (
    <section className={cn('space-y-3', className)}>
      {(title || actions) && (
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {title && (
              <h3
                className={cn(
                  'text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#71717A]',
                  titleClassName,
                )}
              >
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-1 text-[12px] text-[#71717A]">{description}</p>
            )}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

/**
 * Metric/KPI tile — used on dashboards to show a single number with label.
 * Uses subtle gray inside-card variant to avoid double-bordering when sitting
 * INSIDE an <AdminCard>, but switches to bordered variant when standalone.
 */
export function AdminStat({
  label,
  value,
  delta,
  icon: Icon,
  tone = 'default', // 'default' | 'positive' | 'negative' | 'warning'
  inside = false,
  className = '',
}) {
  const valueColor =
    tone === 'positive' ? 'text-emerald-600' :
    tone === 'negative' ? 'text-rose-600' :
    tone === 'warning'  ? 'text-amber-600' :
                          'text-[#18181B]';
  const base = inside
    ? 'bg-[#FAFAFA] rounded-xl p-3 sm:p-4'
    : 'bg-white border border-[#E4E4E7] rounded-2xl p-4 sm:p-5';
  return (
    <div className={cn(base, className)}>
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-[0.12em] text-[#71717A]">
          {label}
        </span>
        {Icon && <Icon size={14} className="text-[#A1A1AA]" />}
      </div>
      <div className={cn('text-[22px] sm:text-[26px] font-semibold tabular-nums leading-tight', valueColor)}>
        {value}
      </div>
      {delta && (
        <div className="mt-1 text-[11.5px] text-[#71717A]">{delta}</div>
      )}
    </div>
  );
}

export default AdminPageHeader;
