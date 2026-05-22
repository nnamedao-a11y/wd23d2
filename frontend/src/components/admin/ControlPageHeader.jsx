/**
 * Shared compact header used at the top of every Control page.
 *
 * Layout:
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  ⚡ Title                                              [ Action btn ]│
 *   │     Description (1-2 lines, truncated nicely on mobile)             │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 * Touch-friendly: title row has comfortable top breathing room, action
 * buttons get a 40px min hit area so fingers don't fat-finger the wrong
 * control.
 */
import React from 'react';

const ControlPageHeader = ({
  icon: Icon,
  title,
  subtitle,
  action,
  iconColor = 'text-indigo-600',
  testId,
}) => {
  return (
    <div
      className="flex items-start justify-between gap-3 sm:gap-4 pt-4 sm:pt-5 pb-2"
      data-testid={testId || 'control-page-header'}
    >
      <div className="min-w-0 flex-1">
        <h1
          className="text-lg sm:text-xl lg:text-2xl font-bold text-[#18181B] flex items-center gap-2 leading-tight"
          style={{
            fontFamily:
              'Mazzard, Mazzard H, Mazzard M, system-ui, sans-serif',
          }}
        >
          {Icon && (
            <Icon
              size={22}
              weight="bold"
              className={`${iconColor} flex-shrink-0`}
            />
          )}
          <span className="truncate">{title}</span>
        </h1>
        {subtitle && (
          <p className="text-[12px] sm:text-sm text-[#71717A] mt-1.5 line-clamp-2 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div className="flex items-center gap-2 flex-shrink-0">{action}</div>
      )}
    </div>
  );
};

export default ControlPageHeader;
