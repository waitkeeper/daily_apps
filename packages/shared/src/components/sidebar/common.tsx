import type {
  ReactNode,
  ReactElement,
  HTMLAttributeAnchorTarget,
  MutableRefObject,
} from 'react';
import React, { forwardRef } from 'react';
import classNames from 'classnames';
import classed from '../../lib/classed';
import { SimpleTooltip } from '../tooltips/SimpleTooltip';
import type { TooltipProps } from '../tooltips/BaseTooltip';

export interface SidebarMenuItem {
  icon: ((active: boolean) => ReactElement) | ReactNode;
  title: string;
  rightIcon?: (active: boolean) => ReactElement;
  path?: string;
  onClick?: () => unknown;
  target?: HTMLAttributeAnchorTarget | undefined;
  isForcedLink?: boolean;
  action?: (
    event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) => unknown;
  alert?: ReactElement;
  active?: boolean;
  hideOnMobile?: boolean;
  requiresLogin?: boolean;
  tooltip?: TooltipProps;
  className?: {
    text?: string;
  };
  navItemRef?: MutableRefObject<HTMLElement>;
  color?: string;
}

interface ListIconProps {
  Icon: React.ComponentType<{ className }>;
}

export interface ItemInnerProps {
  item: SidebarMenuItem;
  shouldShowLabel: boolean;
  active?: boolean;
}
interface NavItemProps {
  color?: string;
  active?: boolean;
  children?: ReactNode;
  className?: string;
}

export const navBtnClass =
  'flex flex-1 items-center pl-2 laptop:pl-0 pr-5 laptop:pr-3 h-10 laptop:h-8';
export const SidebarAside = classed(
  'aside',
  'flex flex-col z-sidebarOverlay laptop:z-sidebar laptop:-translate-x-0 left-0 bg-background-default border-r border-border-subtlest-tertiary transition-[width,transform] duration-300 ease-in-out group fixed top-0  h-full ',
);
export const SidebarScrollWrapper = classed(
  'div',
  'flex overflow-x-hidden overflow-y-auto flex-col h-full no-scrollbar',
);
export const Nav = classed('nav', 'mb-4');
export const NavSection = classed('ul', 'mt-0 laptop:mt-4');
export const NavHeader = classed(
  'li',
  'typo-callout text-text-quaternary h-8 flex items-center font-bold transition-opacity',
);

const RawNavItem = classed(
  'li',
  'flex items-center typo-callout hover:bg-theme-active',
);

export const ListIcon = ({ Icon }: ListIconProps): ReactElement => (
  <Icon className="pointer-events-none h-5 w-5" />
);

type ItemInnerIconProps = Pick<SidebarMenuItem, 'alert' | 'icon' | 'active'> & {
  iconClassName?: string;
};
const ItemInnerIcon = ({
  alert,
  icon,
  active,
  iconClassName = 'relative px-3',
}: ItemInnerIconProps) => {
  return (
    <span className={iconClassName}>
      {alert}
      {icon instanceof Function ? icon(active) : icon}
    </span>
  );
};

const ItemInnerIconTooltip = ({
  alert,
  icon,
  title,
  tooltip = {},
  active,
}: SidebarMenuItem) => (
  <SimpleTooltip {...tooltip} content={title} placement="right">
    <span
      className={classNames(
        'relative px-3',
        tooltip.visible !== undefined && 'pointer-events-none',
      )}
    >
      {alert}
      {icon instanceof Function ? icon(active) : icon}
    </span>
  </SimpleTooltip>
);

const isFontIcon = (icon: SidebarMenuItem['icon']): icon is string =>
  typeof icon === 'string';

export const ItemInner = ({
  item,
  shouldShowLabel,
  active,
}: ItemInnerProps): ReactElement => {
  const Icon = shouldShowLabel ? ItemInnerIcon : ItemInnerIconTooltip;

  return (
    <>
      {isFontIcon(item.icon) ? (
        <ItemInnerIcon
          icon={
            <span className="inline-block w-5 text-center">{item.icon}</span>
          }
        />
      ) : (
        <Icon {...item} active={active} />
      )}
      <span
        className={classNames(
          'flex-1 truncate text-left transition-opacity',
          shouldShowLabel ? 'opacity-100 delay-150' : 'opacity-0',
          item?.className?.text,
        )}
        title={item.title}
      >
        {item.title}
      </span>
      {item.rightIcon && (
        <ItemInnerIcon
          {...item}
          icon={item.rightIcon}
          iconClassName="relative"
        />
      )}
    </>
  );
};

export const NavItem = forwardRef<HTMLElement, NavItemProps>(
  ({ className, color, active, children }, ref): ReactElement => {
    const baseClasses = active
      ? 'text-text-primary'
      : 'hover:text-text-primary text-text-tertiary';

    return (
      <RawNavItem
        ref={ref}
        className={classNames(
          className,
          color || baseClasses,
          active && 'bg-theme-active',
        )}
      >
        {children}
      </RawNavItem>
    );
  },
);
NavItem.displayName = 'NavItem';
