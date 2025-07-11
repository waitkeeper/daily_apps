import type { ReactElement } from 'react';
import React from 'react';
import type { ModalProps } from './common/Modal';
import { Modal } from './common/Modal';
import BasePostModal from './BasePostModal';
import { NotificationPromptSource, Origin } from '../../lib/log';
import usePostNavigationPosition from '../../hooks/usePostNavigationPosition';
import type { PassedPostNavigationProps } from '../post/common';
import type { Post } from '../../graphql/posts';
import { PostType } from '../../graphql/posts';
import EnableNotification from '../notifications/EnableNotification';
import { SquadPostContent } from '../post/SquadPostContent';

interface PostModalProps extends ModalProps, PassedPostNavigationProps {
  id: string;
  post: Post;
}

export default function PostModal({
  id,
  className,
  onRequestClose,
  onPreviousPost,
  onNextPost,
  postPosition,
  post,
  ...props
}: PostModalProps): ReactElement {
  const { position, onLoad } = usePostNavigationPosition({
    isDisplayed: props.isOpen,
    offset: 0,
  });

  return (
    <BasePostModal
      {...props}
      onAfterOpen={onLoad}
      size={Modal.Size.XLarge}
      onRequestClose={onRequestClose}
      postType={PostType.Share}
      source={post.source}
      loadingClassName="!pb-2 tablet:pb-0"
      postPosition={postPosition}
      onPreviousPost={onPreviousPost}
      onNextPost={onNextPost}
    >
      <EnableNotification
        source={NotificationPromptSource.SquadPostModal}
        label={post?.source?.handle}
      />
      <SquadPostContent
        position={position}
        post={post}
        onPreviousPost={onPreviousPost}
        onNextPost={onNextPost}
        postPosition={postPosition}
        inlineActions
        onClose={onRequestClose}
        origin={Origin.ArticleModal}
        className={{
          fixedNavigation: { container: '!w-[inherit]', actions: 'ml-auto' },
          navigation: { actions: 'ml-auto tablet:hidden' },
          onboarding: 'mb-0 mt-8',
        }}
      />
    </BasePostModal>
  );
}
