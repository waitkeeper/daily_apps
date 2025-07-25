import type { HTMLAttributes, ReactElement, ReactNode, Ref } from 'react';
import React, { forwardRef, useState } from 'react';
import classNames from 'classnames';
import type { IconProps } from '../Icon';
import { Loader } from '../Loader';
import { combinedClicks } from '../../lib/click';

import { ColorName as ButtonColor } from '../../styles/colors';
import {
  ButtonSize,
  ButtonVariant,
  ButtonIconPosition,
  useGetIconWithSize,
  IconOnlySizeToClassName,
  SizeToClassName,
  VariantColorToClassName,
  VariantToClassName,
} from './common';
import { isNullOrUndefined } from '../../lib/func';
import classed from '../../lib/classed';

export type IconType = React.ReactElement<IconProps>;

export { ButtonColor, ButtonSize, ButtonVariant, ButtonIconPosition };

export const ButtonGroup = classed(
  'div',
  'flex gap-1 rounded-12 border border-border-subtlest-tertiary p-1',
);

interface CommonButtonProps {
  size?: ButtonSize;
  loading?: boolean;
  pressed?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  tag?: React.ElementType & AllowedTags;
}

// when color is present, variant is required
type ColorButtonProps =
  | { color: ButtonColor; variant: ButtonVariant }
  | { color?: never; variant?: ButtonVariant };

// when iconPosition is present, icon is required
type IconButtonProps =
  | {
      iconPosition: ButtonIconPosition;
      icon: IconType;
      iconSecondaryOnHover?: boolean;
    }
  | { iconPosition?: never; icon?: IconType; iconSecondaryOnHover?: boolean };

type BaseButtonProps = CommonButtonProps & ColorButtonProps & IconButtonProps;

export type AllowedTags = keyof Pick<JSX.IntrinsicElements, 'a' | 'button'>;
export type AllowedElements = HTMLButtonElement | HTMLAnchorElement;
export type ButtonElementType<Tag extends AllowedTags> = Tag extends 'a'
  ? HTMLAnchorElement
  : HTMLButtonElement;

export type ButtonProps<T extends AllowedTags> = BaseButtonProps &
  HTMLAttributes<AllowedElements> &
  JSX.IntrinsicElements[T] & {
    ref?: Ref<ButtonElementType<T>>;
  };

function ButtonComponent<TagName extends AllowedTags>(
  {
    variant,
    size = ButtonSize.Medium,
    color,
    className,
    icon,
    iconPosition = ButtonIconPosition.Left,
    iconSecondaryOnHover = false,
    loading,
    pressed,
    children,
    onClick,
    tag: Tag = 'button',
    ...props
  }: ButtonProps<TagName>,
  ref?: Ref<ButtonElementType<TagName>>,
): ReactElement {
  const iconOnly = icon && isNullOrUndefined(children);
  const getIconWithSize = useGetIconWithSize(size, iconOnly, iconPosition);
  const isAnchor = Tag === 'a';
  const [isHovering, setIsHovering] = useState(false);

  return (
    <Tag
      {...props}
      {...(isAnchor ? combinedClicks(onClick) : { onClick })}
      aria-busy={loading}
      aria-pressed={pressed}
      ref={ref}
      className={classNames(
        `btn focus-outline inline-flex cursor-pointer select-none flex-row
        items-center border no-underline shadow-none transition
        duration-200 ease-in-out typo-callout`,
        ![ButtonVariant.Option, ButtonVariant.Quiz].includes(variant) &&
          'justify-center font-bold',
        { iconOnly },
        iconOnly ? IconOnlySizeToClassName[size] : SizeToClassName[size],
        iconPosition === ButtonIconPosition.Top && `flex-col !px-2`,
        !color && VariantToClassName[variant],
        VariantColorToClassName[variant]?.[color],
        className,
      )}
      onMouseEnter={(e) => {
        props.onMouseEnter?.(e);
        setIsHovering(true);
      }}
      onMouseLeave={(e) => {
        props.onMouseLeave?.(e);
        setIsHovering(false);
      }}
    >
      {icon &&
        [ButtonIconPosition.Left, ButtonIconPosition.Top].includes(
          iconPosition,
        ) &&
        getIconWithSize(icon, iconSecondaryOnHover ? isHovering : false)}
      {loading ? <span className="invisible">{children}</span> : children}
      {icon &&
        iconPosition === ButtonIconPosition.Right &&
        getIconWithSize(icon, iconSecondaryOnHover ? isHovering : false)}
      {loading && (
        <Loader
          data-testid="buttonLoader"
          className="btn-loader absolute m-auto"
        />
      )}
    </Tag>
  );
}

export const Button = forwardRef(ButtonComponent);
