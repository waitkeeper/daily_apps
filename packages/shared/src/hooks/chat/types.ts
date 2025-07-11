import type { QueryKey } from '@tanstack/react-query';
import type { Search } from '../../graphql/search';

export interface UseChatProps {
  id?: string;
}

export enum UseChatMessageType {
  SessionCreated = 'session_created',
  WebSearchFinished = 'web_search_finished',
  WebResultsFiltered = 'web_results_filtered',
  StatusUpdated = 'status_updated',
  NewTokenReceived = 'new_token_received',
  Completed = 'completed',
  Error = 'error',
  SessionFound = 'session_found',
}

export interface UseChatMessage<Payload = unknown> {
  type: UseChatMessageType;
  status?: string;
  timestamp: number;
  payload: Payload;
}

export interface UseChat {
  queryKey: QueryKey;
  data: Search;
  isLoading: boolean;
  handleSubmit(prompt: string, event?: MouseEvent): Promise<void>;
}

export interface CreatePayload {
  id: string;
  steps: number;
  chunk_id: string;
}

export interface TokenPayload {
  token: string;
}
