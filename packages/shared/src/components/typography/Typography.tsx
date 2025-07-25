import type { ReactElement, RefAttributes } from 'react';
import React, { forwardRef } from 'react';
import classNames from 'classnames';
import classed from '../../lib/classed';
import { truncateTextClassNames } from '../utilities/common';

export enum TypographyTag {
  Time = 'time',
  P = 'p',
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
  H5 = 'h5',
  H6 = 'h6',
  Span = 'span',
  Label = 'label',
  Link = 'a',
  Button = 'button',
  Ul = 'ul',
  Del = 'del',
}

export enum TypographyType {
  Caption2 = 'typo-caption2',
  Caption1 = 'typo-caption1',
  Footnote = 'typo-footnote',
  Subhead = 'typo-subhead',
  Callout = 'typo-callout',
  Body = 'typo-body',
  Title4 = 'typo-title4',
  Title3 = 'typo-title3',
  Title2 = 'typo-title2',
  Title1 = 'typo-title1',
  LargeTitle = 'typo-large-title',
  Mega3 = 'typo-mega3',
  Mega2 = 'typo-mega2',
  Mega1 = 'typo-mega1',
  Giga3 = 'typo-giga3',
  Giga2 = 'typo-giga2',
  Giga1 = 'typo-giga1',
  Tera = 'typo-tera',
}

export enum TypographyColor {
  Primary = 'text-text-primary',
  Secondary = 'text-text-secondary',
  Tertiary = 'text-text-tertiary',
  Quaternary = 'text-text-quaternary',
  Disabled = 'text-text-disabled',
  Link = 'text-text-link',
  StatusSuccess = 'text-status-success',
  StatusHelp = 'text-status-help',
  StatusError = 'text-status-error',
  Plus = 'text-action-plus-default',
  Brand = 'text-brand-default',
  Credit = 'text-text-credit',
}

export type AllowedTags = keyof Pick<JSX.IntrinsicElements, TypographyTag>;
type AllowedElements = HTMLTimeElement | HTMLParagraphElement;

export type TypographyProps<Tag extends AllowedTags> = {
  tag?: TypographyTag;
  type?: TypographyType;
  color?: TypographyColor;
  bold?: boolean;
  center?: boolean;
  truncate?: boolean;
} & JSX.IntrinsicElements[Tag];

const tagToColor = {
  [TypographyTag.Link]: TypographyColor.Link,
};

function BaseTypography<TagName extends AllowedTags>(
  {
    tag = TypographyTag.P,
    type,
    color,
    bold = false,
    center = false,
    children,
    className,
    truncate = false,
    ...props
  }: TypographyProps<TagName>,
  ref?: RefAttributes<AllowedElements>['ref'],
): ReactElement {
  const classes = classNames(
    className,
    type,
    { 'font-bold': bold, 'text-center': center },
    color ?? tagToColor[tag],
    truncate && truncateTextClassNames,
  );
  const Tag = classed(tag, classes);

  return (
    <Tag {...props} ref={ref}>
      {children}
    </Tag>
  );
}

export const Typography = forwardRef(BaseTypography) as typeof BaseTypography;
