import type { ReactElement } from 'react';
import React from 'react';
import { FilterItem } from './common';
import type { Source } from '../../graphql/sources';
import { LazyImage } from '../LazyImage';
import { Button, ButtonVariant } from '../buttons/Button';
import { BlockIcon } from '../icons';
import { Tooltip } from '../tooltip/Tooltip';

export default function SourceItemRow({
  source,
  onSourceClick,
  blocked,
}: {
  source: Source;
  onSourceClick?: (source: Source) => unknown;
  blocked?: boolean;
}): ReactElement {
  return (
    <FilterItem className="relative">
      <a className="flex h-12 flex-1 cursor-default items-center rounded-6 py-2 pr-14">
        <LazyImage
          imgSrc={source.image}
          imgAlt={`${source.name} logo`}
          className="h-8 w-8 rounded-6"
        />
        <span className="ml-3 flex-1 truncate text-left text-text-tertiary typo-callout">
          {source.name}
        </span>
      </a>
      <Tooltip
        side="left"
        content={blocked ? 'Unblock source' : 'Block source'}
      >
        <Button
          className="absolute right-4 my-auto"
          variant={ButtonVariant.Tertiary}
          onClick={() => onSourceClick?.(source)}
          icon={<BlockIcon />}
        />
      </Tooltip>
    </FilterItem>
  );
}
