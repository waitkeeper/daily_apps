import { gql } from 'graphql-request';
import { apiUrl } from '../lib/config';
import { isNullOrUndefined } from '../lib/func';
import { webappUrl } from '../lib/constants';
import type { Post } from './posts';
import { labels } from '../lib';
import type { ContentPreference } from './contentPreference';

export enum SearchTime {
  AllTime = 'All Time',
  Today = 'Today',
  Yesterday = 'Yesterday',
  LastSevenDays = 'Last 7 Days',
  LastThirtyDays = 'Last 30 Days',
  LastMonth = 'Last Month',
  ThisYear = 'This Year',
  LastYear = 'Last Year',
}

export enum SearchProviderEnum {
  Posts = 'posts',
  Tags = 'tags',
  Google = 'google',
  Sources = 'sources',
  Users = 'users',
}

const searchPageUrl = `${webappUrl}search`;

export enum SearchChunkErrorCode {
  StoppedGenerating = '-2',
  Unexpected = '-1',
  Common = '0',
  Bragi = '1',
  Search = '2',
  RateLimit = '3',
}

export const searchErrorCodeToMessage: Partial<
  Record<SearchChunkErrorCode, string>
> = {
  [SearchChunkErrorCode.RateLimit]: labels.search.rateLimitExceeded,
  [SearchChunkErrorCode.Unexpected]: labels.search.unexpectedError,
  [SearchChunkErrorCode.StoppedGenerating]: labels.search.stoppedGenerating,
};

export interface SearchChunkError {
  message: string;
  code: SearchChunkErrorCode;
}

export interface SearchChunkSource {
  id: string;
  name: string;
  snippet: string;
  url: string;
}

export interface SearchChunk {
  id: string;
  prompt: string;
  response: string; // markdown
  error: SearchChunkError;
  createdAt: Date;
  completedAt: Date;
  feedback: number;
  sources: SearchChunkSource[];
  steps?: number;
  progress?: number;
  status?: string;
}

export interface Search {
  id: string;
  createdAt: Date;
  chunks: SearchChunk[];
}

// Search control version suggestions
export const SEARCH_POST_SUGGESTIONS = gql`
  query SearchPostSuggestions($query: String!, $version: Int) {
    searchPostSuggestions(query: $query, version: $version) {
      hits {
        id
        title
      }
    }
  }
`;

export const SEARCH_TAG_SUGGESTIONS = gql`
  query SearchTagSuggestions($query: String!, $version: Int, $limit: Int) {
    searchTagSuggestions(query: $query, version: $version, limit: $limit) {
      hits {
        id
        title
      }
    }
  }
`;

export const SEARCH_SOURCE_SUGGESTIONS = gql`
  query SearchSourceSuggestions(
    $query: String!
    $version: Int
    $limit: Int
    $includeContentPreference: Boolean
    $feedId: String
  ) {
    searchSourceSuggestions(
      query: $query
      version: $version
      limit: $limit
      includeContentPreference: $includeContentPreference
      feedId: $feedId
    ) {
      hits {
        id
        title
        subtitle
        image
        contentPreference {
          status
        }
      }
    }
  }
`;

export const SEARCH_USER_SUGGESTIONS = gql`
  query SearchUserSuggestions(
    $query: String!
    $version: Int
    $limit: Int
    $includeContentPreference: Boolean
    $feedId: String
  ) {
    searchUserSuggestions(
      query: $query
      version: $version
      limit: $limit
      includeContentPreference: $includeContentPreference
      feedId: $feedId
    ) {
      hits {
        id
        title
        subtitle
        image
        contentPreference {
          status
        }
      }
    }
  }
`;

type DeepPartial<T> = T extends unknown
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

interface InitializePayload extends Pick<Search, 'id' | 'createdAt'> {
  chunk_id: string;
  steps: number;
  status: string;
  prompt: string;
}

export const initializeSearchSession = ({
  prompt,
  ...param
}: InitializePayload): DeepPartial<Search> => {
  const { status, steps } = param;

  return {
    ...param,
    chunks: [
      {
        id: param.chunk_id,
        prompt,
        response: '',
        createdAt: param.createdAt,
        sources: [],
        status,
        steps,
        progress: 0,
      },
    ],
  };
};

export const updateSearchData = (
  previous: Search,
  chunk: Partial<SearchChunk>,
): Search => {
  if (!chunk) {
    return null;
  }

  const updated = {
    ...previous,
    chunks: [{ ...previous?.chunks?.[0], ...chunk }],
  };

  if (chunk.error) {
    return updated;
  }

  if (chunk.status) {
    updated.chunks[0].progress += 1;
  }

  if (chunk.completedAt) {
    updated.chunks[0].progress = updated.chunks[0].steps;
  }

  if (isNullOrUndefined(chunk.response)) {
    return updated;
  }

  updated.chunks[0].response = previous.chunks[0].response + chunk.response;

  return updated;
};

interface SearchUrlParams {
  id?: string;
  query?: string;
  provider: SearchProviderEnum;
}

const externalSearchProviders: Partial<
  Record<SearchProviderEnum, { url: URL }>
> = {
  [SearchProviderEnum.Google]: {
    url: new URL('https://www.google.com/search'),
  },
};

export const getSearchUrl = (params: SearchUrlParams): string => {
  const { id, query, provider = SearchProviderEnum.Posts } = params;
  const searchParams = new URLSearchParams();

  if (!provider) {
    throw new Error('provider is required');
  }

  const externalSearchProvider = externalSearchProviders[provider];

  if (provider !== SearchProviderEnum.Posts && !externalSearchProvider) {
    searchParams.append('provider', provider);
  }

  if (id) {
    searchParams.append('id', id);
  } else if (query) {
    searchParams.append('q', query);
  }

  const searchUrl = externalSearchProvider?.url || searchPageUrl;
  const searchParamsString = searchParams.toString();

  return `${searchUrl}${searchParamsString ? `?${searchParamsString}` : ''}`;
};

export const smartPromptQueryUrl = `${apiUrl}/search/prompts`;
export const searchQueryUrl = `${apiUrl}/search/query`;

export const sendPrompt = async (
  params: URLSearchParams,
  url?: string,
): Promise<EventSource> => {
  return new EventSource(`${url || searchQueryUrl}?${params}`);
};

export const sendSmartPromptQuery = async ({
  query,
  token,
  post,
}: {
  query: string;
  token: string;
  post: Post;
}): Promise<EventSource> => {
  const params = new URLSearchParams({
    prompt: query,
    token,
    post_id: post.id,
  });

  return sendPrompt(params, smartPromptQueryUrl);
};

export type SearchSuggestion = {
  id?: string;
  title: string;
  subtitle?: string;
  image?: string;
  contentPreference?: ContentPreference;
};

export type SearchSuggestionResult = {
  hits: SearchSuggestion[];
};

export const minSearchQueryLength = 1;

export const sanitizeSearchTitleMatch = /<(\/?)strong>/g;

export const defaultSearchSuggestionsLimit = 3;
