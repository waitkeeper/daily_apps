import type { ReactElement, ReactNode } from 'react';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import dynamic from 'next/dynamic';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import type { FeedProps } from './Feed';
import Feed from './Feed';
import AuthContext from '../contexts/AuthContext';
import type { LoggedUser } from '../lib/user';
import { SharedFeedPage } from './utilities';
import {
  ANONYMOUS_FEED_QUERY,
  CUSTOM_FEED_QUERY,
  FEED_QUERY,
  FOLLOWING_FEED_QUERY,
  MOST_DISCUSSED_FEED_QUERY,
  MOST_UPVOTED_FEED_QUERY,
  SEARCH_POSTS_QUERY,
} from '../graphql/feed';
import { generateQueryKey, OtherFeedPage, RequestKey } from '../lib/query';
import SettingsContext from '../contexts/SettingsContext';
import usePersistentContext from '../hooks/usePersistentContext';
import AlertContext from '../contexts/AlertContext';
import { useFeature, useFeaturesReadyContext } from './GrowthBookProvider';
import {
  algorithms,
  DEFAULT_ALGORITHM_INDEX,
  DEFAULT_ALGORITHM_KEY,
  LayoutHeader,
  periods,
  SearchControlHeader,
} from './layout/common';
import { useFeedName } from '../hooks/feed/useFeedName';
import {
  useFeedLayout,
  useScrollRestoration,
  useViewSize,
  ViewSize,
} from '../hooks';
import { feature } from '../lib/featureManagement';
import { isDevelopment } from '../lib/constants';
import type { FeedContainerProps } from './feeds';
import { getFeedName } from '../lib/feed';
import CommentFeed from './CommentFeed';
import { COMMENT_FEED_QUERY } from '../graphql/comments';
import { ProfileEmptyScreen } from './profile/ProfileEmptyScreen';
import { Origin } from '../lib/log';
import { ExploreTabs, tabToUrl, urlToTab } from './header';
import { QueryStateKeys, useQueryState } from '../hooks/utils/useQueryState';
import { useSearchResultsLayout } from '../hooks/search/useSearchResultsLayout';
import useCustomDefaultFeed from '../hooks/feed/useCustomDefaultFeed';
import { useSearchContextProvider } from '../contexts/search/SearchContext';

const FeedExploreHeader = dynamic(
  () =>
    import(/* webpackChunkName: "feedExploreHeader" */ './header').then(
      (mod) => mod.FeedExploreHeader,
    ),
  {
    ssr: false,
  },
);

const SearchEmptyScreen = dynamic(
  () =>
    import(/* webpackChunkName: "searchEmptyScreen" */ './SearchEmptyScreen'),
);

const FeedEmptyScreen = dynamic(
  () => import(/* webpackChunkName: "feedEmptyScreen" */ './FeedEmptyScreen'),
);
const FollowingFeedEmptyScreen = dynamic(
  () =>
    import(
      /* webpackChunkName: "followingFeedEmptyScreen" */ './FollowingFeedEmptyScreen'
    ),
);

const CustomFeedEmptyScreen = dynamic(() =>
  import(
    /* webpackChunkName: "customFeedEmptyScreen" */ './CustomFeedEmptyScreen'
  ).then((mod) => mod.CustomFeedEmptyScreen),
);

type FeedQueryProps = {
  query: string;
  queryIfLogged?: string;
  variables?: Record<string, unknown>;
  requestKey?: string;
};

const propsByFeed: Record<SharedFeedPage & OtherFeedPage, FeedQueryProps> = {
  'my-feed': {
    query: ANONYMOUS_FEED_QUERY,
    queryIfLogged: FEED_QUERY,
  },
  popular: {
    query: ANONYMOUS_FEED_QUERY,
  },
  posts: {
    query: ANONYMOUS_FEED_QUERY,
  },
  search: {
    query: ANONYMOUS_FEED_QUERY,
    queryIfLogged: FEED_QUERY,
  },
  upvoted: {
    query: MOST_UPVOTED_FEED_QUERY,
  },
  discussed: {
    query: MOST_DISCUSSED_FEED_QUERY,
  },
  [OtherFeedPage.ExploreLatest]: {
    query: ANONYMOUS_FEED_QUERY,
  },
  [OtherFeedPage.ExploreUpvoted]: {
    query: MOST_UPVOTED_FEED_QUERY,
  },
  [OtherFeedPage.ExploreDiscussed]: {
    query: MOST_DISCUSSED_FEED_QUERY,
  },
  [SharedFeedPage.Custom]: {
    query: CUSTOM_FEED_QUERY,
    emptyScreen: <CustomFeedEmptyScreen />,
  },
  [SharedFeedPage.CustomForm]: {
    requestKey: SharedFeedPage.Custom,
    query: CUSTOM_FEED_QUERY,
    emptyScreen: <CustomFeedEmptyScreen />,
  },
  [OtherFeedPage.Following]: {
    query: FOLLOWING_FEED_QUERY,
    emptyScreen: <FollowingFeedEmptyScreen />,
  },
};

export interface MainFeedLayoutProps
  extends Pick<FeedContainerProps, 'shortcuts'> {
  feedName: string;
  isSearchOn: boolean;
  searchQuery?: string;
  children?: ReactNode;
  searchChildren?: ReactNode;
  navChildren?: ReactNode;
  isFinder?: boolean;
  onNavTabClick?: (tab: string) => void;
}

const getQueryBasedOnLogin = (
  tokenRefreshed: boolean,
  user: LoggedUser | null,
  query: string,
  queryIfLogged: string | null,
): string | null => {
  if (tokenRefreshed) {
    if (user && queryIfLogged) {
      return queryIfLogged;
    }
    return query;
  }
  return null;
};

const commentClassName = {
  container: 'rounded-none border-0 border-b tablet:border-x',
  commentBox: {
    container: 'relative border-0 rounded-none',
  },
};

const feedWithDateRange = [
  ExploreTabs.MostUpvoted,
  ExploreTabs.BestDiscussions,
];

export default function MainFeedLayout({
  feedName: feedNameProp,
  searchQuery,
  isSearchOn,
  children,
  searchChildren,
  shortcuts,
  navChildren,
  isFinder,
  onNavTabClick,
}: MainFeedLayoutProps): ReactElement {
  useScrollRestoration();
  const { sortingEnabled, loadedSettings } = useContext(SettingsContext);
  const { user, tokenRefreshed } = useContext(AuthContext);
  const { alerts } = useContext(AlertContext);
  const router = useRouter();
  const [tab, setTab] = useState(ExploreTabs.Popular);
  const { getFeatureValue } = useFeaturesReadyContext();
  const feedName = getFeedName(feedNameProp, {
    hasFiltered: !alerts?.filter,
    hasUser: !!user,
  });
  const { isCustomDefaultFeed, defaultFeedId } = useCustomDefaultFeed();
  const isLaptop = useViewSize(ViewSize.Laptop);
  const feedVersion = useFeature(feature.feedVersion);
  const { time, contentCurationFilter } = useSearchContextProvider();
  const {
    isUpvoted,
    isPopular,
    isAnyExplore,
    isExploreLatest,
    isSortableFeed,
    isCustomFeed,
    isSearch: isSearchPage,
  } = useFeedName({
    feedName,
  });
  const {
    shouldUseListFeedLayout,
    shouldUseCommentFeedLayout,
    FeedPageLayoutComponent,
  } = useFeedLayout();

  const { isSearchPageLaptop } = useSearchResultsLayout();

  const config = useMemo(() => {
    if (!feedName) {
      return { query: null };
    }

    const dynamicPropsByFeed: Partial<
      Record<SharedFeedPage, Partial<FeedQueryProps>>
    > = {
      [SharedFeedPage.Custom]: {
        variables: {
          feedId: router.query?.slugOrId as string,
        },
      },
      [SharedFeedPage.CustomForm]: {
        // when editing main feed load feed query
        queryIfLogged:
          router.query?.slugOrId === user?.id ? FEED_QUERY : CUSTOM_FEED_QUERY,
        variables: {
          feedId: (router.query?.slugOrId as string) || user?.id,
        },
      },
    };

    // do not show feed in background on new page
    if (router.pathname === '/feeds/new') {
      return {
        query: null,
      };
    }

    return {
      requestKey: propsByFeed[feedName].requestKey,
      query: getQueryBasedOnLogin(
        tokenRefreshed,
        user,
        dynamicPropsByFeed[feedName]?.query || propsByFeed[feedName].query,
        dynamicPropsByFeed[feedName]?.queryIfLogged ||
          propsByFeed[feedName].queryIfLogged,
      ),
      variables: {
        ...propsByFeed[feedName].variables,
        ...dynamicPropsByFeed[feedName]?.variables,
        version: isDevelopment ? 1 : feedVersion,
      },
    };
  }, [
    feedName,
    feedVersion,
    router.query?.slugOrId,
    tokenRefreshed,
    user,
    router.pathname,
  ]);

  const [selectedAlgo, setSelectedAlgo, loadedAlgo] = usePersistentContext(
    DEFAULT_ALGORITHM_KEY,
    DEFAULT_ALGORITHM_INDEX,
    [0, 1],
    DEFAULT_ALGORITHM_INDEX,
  );

  const [selectedPeriod] = useQueryState({
    key: [QueryStateKeys.FeedPeriod],
    defaultValue: 0,
  });

  const search = useMemo(
    () => (
      <LayoutHeader className={isSearchPage && 'mt-16 laptop:mt-0'}>
        {navChildren}
        {isSearchOn && searchChildren ? searchChildren : undefined}
      </LayoutHeader>
    ),
    [isSearchOn, isSearchPage, navChildren, searchChildren],
  );

  const feedProps = useMemo<FeedProps<unknown>>(() => {
    const feedWithActions =
      isUpvoted || isPopular || isSortableFeed || isCustomFeed;
    // in list search by default we do not show any results but empty state
    // so returning false so feed does not do any requests
    if (isSearchOn && !searchQuery) {
      return null;
    }

    if (feedNameProp === 'default' && isCustomDefaultFeed) {
      return {
        feedName: SharedFeedPage.Custom,
        feedQueryKey: generateQueryKey(
          SharedFeedPage.Custom,
          user,
          defaultFeedId,
        ),
        query: CUSTOM_FEED_QUERY,
        variables: {
          feedId: user.defaultFeedId,
          feedName: SharedFeedPage.Custom,
        },
        emptyScreen: propsByFeed[feedName].emptyScreen || <FeedEmptyScreen />,
        actionButtons: feedWithActions && (
          <SearchControlHeader
            algoState={[selectedAlgo, setSelectedAlgo]}
            feedName={feedName}
          />
        ),
      };
    }

    if (isSearchOn && searchQuery) {
      const searchVersion = getFeatureValue(feature.searchVersion);
      return {
        feedName: SharedFeedPage.Search,
        feedQueryKey: generateQueryKey(
          SharedFeedPage.Search,
          user,
          searchQuery,
          contentCurationFilter,
          time,
        ),
        query: SEARCH_POSTS_QUERY,
        variables: {
          query: searchQuery,
          version: searchVersion,
          contentCuration: contentCurationFilter,
          time,
        },
        emptyScreen: <SearchEmptyScreen />,
      };
    }

    if (!config.query) {
      return null;
    }

    const getVariables = () => {
      if (
        isUpvoted ||
        feedWithDateRange.includes(tab) ||
        feedWithDateRange.includes(urlToTab[router.pathname])
      ) {
        return { ...config.variables, period: periods[selectedPeriod].value };
      }

      if (isAnyExplore) {
        const laptopValue =
          tab === ExploreTabs.ByDate || isExploreLatest ? 1 : 0;
        const mobileValue =
          urlToTab[router.pathname] === ExploreTabs.ByDate ? 1 : 0;
        const finalAlgo = isLaptop ? laptopValue : mobileValue;

        return {
          ...config.variables,
          ranking: algorithms[finalAlgo].value,
        };
      }

      if (isSortableFeed) {
        return {
          ...config.variables,
          ranking: algorithms[selectedAlgo].value,
        };
      }

      return config.variables;
    };

    const variables = getVariables();

    return {
      feedName,
      feedQueryKey: generateQueryKey(
        config.requestKey || feedName,
        user,
        ...Object.values(variables ?? {}),
      ),
      query: config.query,
      variables,
      emptyScreen: propsByFeed[feedName].emptyScreen || <FeedEmptyScreen />,
      actionButtons: feedWithActions && (
        <SearchControlHeader
          algoState={[selectedAlgo, setSelectedAlgo]}
          feedName={feedName}
        />
      ),
    };
  }, [
    isUpvoted,
    isPopular,
    isSortableFeed,
    isCustomFeed,
    isSearchOn,
    searchQuery,
    feedNameProp,
    isCustomDefaultFeed,
    config.query,
    config.requestKey,
    config.variables,
    feedName,
    user,
    selectedAlgo,
    setSelectedAlgo,
    defaultFeedId,
    getFeatureValue,
    contentCurationFilter,
    time,
    tab,
    router.pathname,
    isAnyExplore,
    selectedPeriod,
    isExploreLatest,
    isLaptop,
  ]);

  useEffect(() => {
    if (!sortingEnabled && selectedAlgo > 0 && loadedSettings && loadedAlgo) {
      setSelectedAlgo(0);
    }
    // @NOTE see https://dailydotdev.atlassian.net/l/cp/dK9h1zoM
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortingEnabled, selectedAlgo, loadedSettings, loadedAlgo]);

  const disableTopPadding = isFinder || shouldUseListFeedLayout;

  const onTabChange = useCallback(
    (clickedTab: ExploreTabs) => {
      if (onNavTabClick) {
        onNavTabClick(tabToUrl[clickedTab]);
      }

      setTab(clickedTab);
    },
    [onNavTabClick],
  );

  const FeedExploreComponent = useCallback(() => {
    if (isLaptop) {
      return (
        <FeedExploreHeader
          tab={tab}
          setTab={onTabChange}
          className={{ tabWrapper: 'my-4' }}
        />
      );
    }

    return (
      <FeedExploreHeader
        tab={tab}
        setTab={onTabChange}
        showBreadcrumbs={false}
        showDropdown={false}
        className={{
          container:
            'sticky top-[7.5rem] z-header w-full border-b border-border-subtlest-tertiary bg-background-default',
          tabBarHeader: 'no-scrollbar overflow-x-auto',
          tabBarContainer: 'w-full',
        }}
      />
    );
  }, [isLaptop, onTabChange, tab]);

  return (
    <FeedPageLayoutComponent
      className={classNames('relative', disableTopPadding && '!pt-0')}
    >
      {isAnyExplore && <FeedExploreComponent />}
      {isSearchOn && !isSearchPageLaptop && search}
      {shouldUseCommentFeedLayout ? (
        <CommentFeed
          isMainFeed
          feedQueryKey={generateQueryKey(RequestKey.CommentFeed, null)}
          query={COMMENT_FEED_QUERY}
          logOrigin={Origin.CommentFeed}
          emptyScreen={
            <ProfileEmptyScreen
              title="Nobody has replied to any post yet"
              text="You could be the first you know?"
            />
          }
          commentClassName={commentClassName}
        />
      ) : (
        feedProps && (
          <Feed
            {...feedProps}
            shortcuts={shortcuts}
            className={classNames(
              shouldUseListFeedLayout && !isFinder && 'laptop:px-6',
            )}
          />
        )
      )}
      {children}
    </FeedPageLayoutComponent>
  );
}
