import type { ReactElement, ReactNode } from 'react';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import type { QueryKey } from '@tanstack/react-query';
import type { PostItem, UseFeedOptionalParams } from '../hooks/useFeed';
import useFeed from '../hooks/useFeed';
import type { Ad, Post } from '../graphql/posts';
import { PostType } from '../graphql/posts';
import AuthContext from '../contexts/AuthContext';
import FeedContext from '../contexts/FeedContext';
import SettingsContext from '../contexts/SettingsContext';
import useCommentPopup from '../hooks/feed/useCommentPopup';
import useFeedOnPostClick from '../hooks/feed/useFeedOnPostClick';
import useFeedContextMenu from '../hooks/feed/useFeedContextMenu';
import type { PostLocation } from '../hooks/feed/useFeedContextMenu';
import useFeedInfiniteScroll, {
  InfiniteScrollScreenOffset,
} from '../hooks/feed/useFeedInfiniteScroll';
import FeedItemComponent, { getFeedItemKey } from './FeedItemComponent';
import LogContext from '../contexts/LogContext';
import { adLogEvent, feedLogExtra, postLogEvent } from '../lib/feed';
import { usePostModalNavigation } from '../hooks/usePostModalNavigation';
import { useSharePost } from '../hooks/useSharePost';
import { Origin } from '../lib/log';
import { SharedFeedPage } from './utilities';
import type { FeedContainerProps } from './feeds/FeedContainer';
import { FeedContainer } from './feeds/FeedContainer';
import { ActiveFeedContext } from '../contexts';
import { useBoot, useFeedLayout, useFeedVotePost } from '../hooks';
import type { AllFeedPages } from '../lib/query';
import { OtherFeedPage, RequestKey } from '../lib/query';

import { MarketingCtaVariant } from './marketingCta/common';
import { isNullOrUndefined } from '../lib/func';
import { useSearchResultsLayout } from '../hooks/search/useSearchResultsLayout';
import { SearchResultsLayout } from './search/SearchResults/SearchResultsLayout';
import { acquisitionKey } from './cards/AcquisitionForm/common/common';
import type { PostClick } from '../lib/click';

import { useFeedContentPreferenceMutationSubscription } from './feeds/useFeedContentPreferenceMutationSubscription';
import { useFeedBookmarkPost } from '../hooks/bookmark/useFeedBookmarkPost';
import type { AdActions } from '../lib/ads';
import usePlusEntry from '../hooks/usePlusEntry';

const FeedErrorScreen = dynamic(
  () => import(/* webpackChunkName: "feedErrorScreen" */ './FeedErrorScreen'),
);

export interface FeedProps<T>
  extends Pick<UseFeedOptionalParams<T>, 'options'>,
    Pick<FeedContainerProps, 'shortcuts'> {
  feedName: AllFeedPages;
  feedQueryKey: QueryKey;
  query?: string;
  variables?: T;
  className?: string;
  onEmptyFeed?: () => unknown;
  emptyScreen?: ReactNode;
  header?: ReactNode;
  inlineHeader?: boolean;
  allowPin?: boolean;
  showSearch?: boolean;
  actionButtons?: ReactNode;
  disableAds?: boolean;
  allowFetchMore?: boolean;
  pageSize?: number;
  isHorizontal?: boolean;
  feedContainerRef?: React.Ref<HTMLDivElement>;
}

interface RankVariables {
  ranking?: string;
}

const ArticlePostModal = dynamic(
  () =>
    import(
      /* webpackChunkName: "articlePostModal" */ './modals/ArticlePostModal'
    ),
);
const SharePostModal = dynamic(
  () =>
    import(/* webpackChunkName: "sharePostModal" */ './modals/SharePostModal'),
);
const CollectionPostModal = dynamic(
  () =>
    import(
      /* webpackChunkName: "collectionPostModal" */ './modals/CollectionPostModal'
    ),
);

const calculateRow = (index: number, numCards: number): number =>
  Math.floor(index / numCards);
const calculateColumn = (index: number, numCards: number): number =>
  index % numCards;

const PostModalMap: Record<PostType, typeof ArticlePostModal> = {
  [PostType.Article]: ArticlePostModal,
  [PostType.Share]: SharePostModal,
  [PostType.Welcome]: SharePostModal,
  [PostType.Freeform]: SharePostModal,
  [PostType.VideoYouTube]: ArticlePostModal,
  [PostType.Collection]: CollectionPostModal,
};

export default function Feed<T>({
  feedName,
  feedQueryKey,
  query,
  variables,
  className,
  header,
  inlineHeader,
  onEmptyFeed,
  emptyScreen,
  options,
  allowPin,
  showSearch = true,
  shortcuts,
  actionButtons,
  disableAds,
  allowFetchMore,
  pageSize,
  isHorizontal = false,
  feedContainerRef,
}: FeedProps<T>): ReactElement {
  const origin = Origin.Feed;
  const { logEvent } = useContext(LogContext);
  const currentSettings = useContext(FeedContext);
  const { user } = useContext(AuthContext);
  const { isFallback, query: routerQuery } = useRouter();
  const { openNewTab, spaciness, loadedSettings } = useContext(SettingsContext);
  const { isListMode } = useFeedLayout();
  const numCards = currentSettings.numCards[spaciness ?? 'eco'];
  const isSquadFeed = feedName === OtherFeedPage.Squad;
  const { shouldUseListFeedLayout } = useFeedLayout();
  const showAcquisitionForm =
    feedName === SharedFeedPage.MyFeed &&
    (routerQuery?.[acquisitionKey] as string)?.toLocaleLowerCase() === 'true' &&
    !user?.acquisitionChannel;
  const { getMarketingCta } = useBoot();
  const marketingCta = getMarketingCta(MarketingCtaVariant.Card);
  const { plusEntryFeed } = usePlusEntry();
  const showMarketingCta = !!marketingCta;
  const { isSearchPageLaptop } = useSearchResultsLayout();

  const {
    items,
    updatePost,
    removePost,
    fetchPage,
    canFetchMore: queryCanFetchMore,
    emptyFeed,
    isFetching,
    isInitialLoading,
    isError,
  } = useFeed(
    feedQueryKey,
    pageSize ?? currentSettings.pageSize,
    isSquadFeed || shouldUseListFeedLayout
      ? {
          ...currentSettings.adTemplate,
          adStart: 2, // always make adStart 2 for squads due to welcome and pinned posts
        }
      : currentSettings.adTemplate,
    numCards,
    {
      onEmptyFeed,
      query,
      variables,
      options,
      settings: {
        disableAds,
        adPostLength: isSquadFeed ? 2 : undefined,
        showAcquisitionForm,
        ...(showMarketingCta && { marketingCta }),
        ...(plusEntryFeed && { plusEntry: plusEntryFeed }),
        feedName,
      },
    },
  );
  const canFetchMore = allowFetchMore ?? queryCanFetchMore;
  const contextId = `post-context-${feedName}`;

  const [postModalIndex, setPostModalIndex] = useState<PostLocation>(null);
  const { onMenuClick, postMenuIndex, postMenuLocation } = useFeedContextMenu({
    contextId,
  });
  const useList = isListMode && numCards > 1;
  const virtualizedNumCards = useList ? 1 : numCards;
  const logOpts = useMemo(() => {
    return {
      columns: virtualizedNumCards,
      row: !isNullOrUndefined(postModalIndex?.row)
        ? postModalIndex.row
        : postMenuLocation?.row,
      column: !isNullOrUndefined(postModalIndex?.column)
        ? postModalIndex.column
        : postMenuLocation?.column,
    };
  }, [postMenuLocation, virtualizedNumCards, postModalIndex]);

  const onRemovePost = useCallback(
    async (removePostIndex: number) => {
      const item = items[removePostIndex] as PostItem;
      removePost(item.page, item.index);
    },
    [items, removePost],
  );

  const feedContextValue = useMemo(() => {
    return {
      queryKey: feedQueryKey,
      items,
      logOpts,
      allowPin,
      origin,
      onRemovePost,
    };
  }, [feedQueryKey, items, logOpts, allowPin, origin, onRemovePost]);

  const { ranking } = (variables as RankVariables) || {};
  const {
    onOpenModal,
    onCloseModal,
    onPrevious,
    onNext,
    postPosition,
    selectedPost,
  } = usePostModalNavigation({
    items,
    fetchPage,
    updatePost,
    canFetchMore,
    feedName,
  });

  const infiniteScrollRef = useFeedInfiniteScroll({
    fetchPage,
    canFetchMore: canFetchMore && feedQueryKey?.[0] !== RequestKey.FeedPreview,
  });

  const {
    showCommentPopupId,
    setShowCommentPopupId,
    comment,
    isSendingComment,
  } = useCommentPopup(feedName);

  const { toggleUpvote, toggleDownvote } = useFeedVotePost({
    feedName,
    ranking,
    items,
    updatePost,
  });

  const { toggleBookmark } = useFeedBookmarkPost({
    feedName,
    feedQueryKey,
    ranking,
    items,
    updatePost,
  });

  useFeedContentPreferenceMutationSubscription({ feedQueryKey });

  const onPostClick = useFeedOnPostClick(
    items,
    updatePost,
    virtualizedNumCards,
    feedName,
    ranking,
  );

  const onReadArticleClick = useFeedOnPostClick(
    items,
    updatePost,
    virtualizedNumCards,
    feedName,
    ranking,
    'go to link',
  );

  const { openSharePost, copyLink } = useSharePost(origin);

  useEffect(() => {
    return () => {
      document.body.classList.remove('hidden-scrollbar');
    };
  }, []);

  useEffect(() => {
    if (!selectedPost) {
      document.body.classList.remove('hidden-scrollbar');
    }
  }, [selectedPost]);

  const onShareClick = useCallback(
    (post: Post, row?: number, column?: number) =>
      openSharePost({ post, columns: virtualizedNumCards, column, row }),
    [openSharePost, virtualizedNumCards],
  );

  if (!loadedSettings || isFallback) {
    return <></>;
  }

  const onPostModalOpen = ({
    index,
    callback,
    row,
    column,
  }: {
    index: number;
    callback?: () => unknown;
    row?: number;
    column?: number;
  }) => {
    document.body.classList.add('hidden-scrollbar');
    callback?.();
    setPostModalIndex({ index, row, column });
    onOpenModal(index);
  };

  const onPostModalClose = () => {
    setPostModalIndex(null);
    onCloseModal(false);
  };

  const onPostCardClick: PostClick = async (
    post,
    index,
    row,
    column,
    isAuxClick,
  ) => {
    await onPostClick(post, index, row, column, {
      skipPostUpdate: true,
    });
    if (!isAuxClick && !shouldUseListFeedLayout) {
      onPostModalOpen({ index, row, column });
    }
  };

  const onCopyLinkClickLogged = (
    e: React.MouseEvent,
    post: Post,
    index: number,
    row: number,
    column: number,
  ) => {
    copyLink({ post, columns: virtualizedNumCards, row, column });
  };

  const onCommentClick = (
    post: Post,
    index: number,
    row: number,
    column: number,
  ): void => {
    logEvent(
      postLogEvent('comments click', post, {
        columns: virtualizedNumCards,
        column,
        row,
        ...feedLogExtra(feedName, ranking),
      }),
    );
    if (!shouldUseListFeedLayout) {
      onPostModalOpen({ index, row, column });
    }
  };

  const onAdAction = (
    action: Exclude<AdActions, AdActions.Impression>,
    ad: Ad,
    row: number,
    column: number,
  ) => {
    logEvent(
      adLogEvent(action, ad, {
        columns: virtualizedNumCards,
        column,
        row,
        ...feedLogExtra(feedName, ranking),
      }),
    );
  };

  const PostModal = PostModalMap[selectedPost?.type];

  if (isError) {
    return <FeedErrorScreen />;
  }

  if (emptyScreen && emptyFeed && !isSearchPageLaptop) {
    return <>{emptyScreen}</>;
  }

  const isValidFeed = Object.values(SharedFeedPage).includes(
    feedName as SharedFeedPage,
  );

  const FeedWrapperComponent = isSearchPageLaptop
    ? SearchResultsLayout
    : FeedContainer;
  const containerProps = isSearchPageLaptop
    ? {}
    : {
        header,
        inlineHeader,
        className,
        showSearch: showSearch && isValidFeed,
        shortcuts,
        actionButtons,
        isHorizontal,
        feedContainerRef,
      };

  return (
    <ActiveFeedContext.Provider value={feedContextValue}>
      <FeedWrapperComponent {...containerProps}>
        {isSearchPageLaptop && emptyScreen && emptyFeed ? (
          <>{emptyScreen}</>
        ) : (
          <>
            {items.map((item, index) => (
              <FeedItemComponent
                item={item}
                index={index}
                row={calculateRow(index, virtualizedNumCards)}
                column={calculateColumn(index, virtualizedNumCards)}
                columns={virtualizedNumCards}
                key={getFeedItemKey(item, index)}
                openNewTab={openNewTab}
                postMenuIndex={postMenuIndex}
                showCommentPopupId={showCommentPopupId}
                setShowCommentPopupId={setShowCommentPopupId}
                isSendingComment={isSendingComment}
                comment={comment}
                user={user}
                feedName={feedName}
                ranking={ranking}
                toggleBookmark={toggleBookmark}
                toggleUpvote={toggleUpvote}
                toggleDownvote={toggleDownvote}
                onPostClick={onPostCardClick}
                onShare={onShareClick}
                onMenuClick={onMenuClick}
                onCopyLinkClick={onCopyLinkClickLogged}
                onCommentClick={onCommentClick}
                onAdAction={onAdAction}
                onReadArticleClick={onReadArticleClick}
              />
            ))}
            {!isFetching && !isInitialLoading && !isHorizontal && (
              <InfiniteScrollScreenOffset ref={infiniteScrollRef} />
            )}
            {!shouldUseListFeedLayout && selectedPost && PostModal && (
              <PostModal
                isOpen={!!selectedPost}
                id={selectedPost.id}
                onRequestClose={onPostModalClose}
                onPreviousPost={onPrevious}
                onNextPost={onNext}
                postPosition={postPosition}
                post={selectedPost}
              />
            )}
          </>
        )}
      </FeedWrapperComponent>
    </ActiveFeedContext.Provider>
  );
}
