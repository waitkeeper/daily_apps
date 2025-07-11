import type { ReactElement } from 'react';
import React from 'react';
import classNames from 'classnames';
import { Button, ButtonVariant } from '../buttons/Button';
import { ArrowIcon } from '../icons';
import { PostHeaderActions } from './PostHeaderActions';
import { PostPosition } from '../../hooks/usePostModalNavigation';
import type { PostNavigationProps } from './common';
import { Tooltip } from '../tooltip/Tooltip';

function PostNavigation({
  postPosition,
  onPreviousPost,
  onNextPost,
  className = {},
  contextMenuId = 'post-navigation-context',
  post,
  ...props
}: PostNavigationProps): ReactElement {
  return (
    <div
      className={classNames(
        'flex h-10 w-full flex-row items-center gap-2 bg-background-subtle',
        className?.container,
      )}
      role="navigation"
    >
      {onPreviousPost && (
        <Tooltip content="Previous">
          <Button
            className="-rotate-90"
            icon={<ArrowIcon />}
            variant={ButtonVariant.Tertiary}
            onClick={onPreviousPost}
            disabled={[PostPosition.First, PostPosition.Only].includes(
              postPosition,
            )}
          />
        </Tooltip>
      )}
      {onNextPost && (
        <Tooltip content="Next">
          <Button
            className="rotate-90"
            icon={<ArrowIcon />}
            variant={ButtonVariant.Tertiary}
            onClick={onNextPost}
            disabled={[PostPosition.Last, PostPosition.Only].includes(
              postPosition,
            )}
          />
        </Tooltip>
      )}
      {post && (
        <PostHeaderActions
          {...props}
          className={classNames('ml-auto flex', className?.actions)}
          notificationClassName="ml-4"
          contextMenuId={contextMenuId}
          post={post}
        />
      )}
    </div>
  );
}

export default PostNavigation;
