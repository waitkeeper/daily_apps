import type { HTMLAttributes, ReactElement } from 'react';
import React from 'react';
import { FilterItem } from './common';
import { Button, ButtonSize, ButtonVariant } from '../buttons/Button';
import TagButton from './TagButton';
import type { TagActionArguments } from '../../hooks/useTagAndSource';
import { Tooltip } from '../tooltip/Tooltip';

type TagItemRowProps = {
  tooltip: string;
  tag: string;
  rowIcon: ReactElement;
  followedTags?: Array<string>;
  blockedTags?: Array<string>;
  onFollowTags?: ({ tags, category }: TagActionArguments) => void;
  onUnfollowTags?: ({ tags, category }: TagActionArguments) => void;
  onUnblockTags?: ({ tags }: TagActionArguments) => void;
  onClick?: (event: React.MouseEvent, tag: string) => unknown;
};

export default function TagItemRow({
  tooltip,
  tag,
  rowIcon,
  followedTags,
  blockedTags,
  onFollowTags,
  onUnfollowTags,
  onUnblockTags,
  onClick,
}: TagItemRowProps &
  Omit<HTMLAttributes<HTMLAnchorElement>, 'onClick'>): ReactElement {
  return (
    <FilterItem className="relative my-2">
      <TagButton
        className={!onFollowTags ? 'cursor-default' : ''}
        size={ButtonSize.Small}
        followedTags={followedTags}
        blockedTags={blockedTags}
        tagItem={tag}
        onFollowTags={onFollowTags}
        onUnfollowTags={onUnfollowTags}
        onUnblockTags={onUnblockTags}
      />
      <Tooltip side="left" content={tooltip}>
        <Button
          className="absolute right-4 my-auto"
          variant={ButtonVariant.Tertiary}
          onClick={(event) => onClick?.(event, tag)}
          icon={rowIcon}
        />
      </Tooltip>
    </FilterItem>
  );
}
