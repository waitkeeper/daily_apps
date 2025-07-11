import { gql } from 'graphql-request';
import type { EmptyResponse } from './graphql/emptyResponse';
import { gqlClient } from './graphql/common';

export enum ReportEntity {
  Post = 'post',
  Source = 'source',
  Comment = 'comment',
  User = 'user',
}

export enum ReportReason {
  Nsfw = 'NSFW',
  Other = 'OTHER',
  Broken = 'BROKEN',
  Clickbait = 'CLICKBAIT',
  Low = 'LOW',
  Irrelevant = 'IRRELEVANT',
  Spam = 'SPAM',
  Harassment = 'HARASSMENT',
  Hateful = 'HATEFUL',
  Copyright = 'COPYRIGHT',
  Privacy = 'PRIVACY',
  Miscategorized = 'MISCATEGORIZED',
  Misinformation = 'MISINFORMATION',
  Illegal = 'ILLEGAL',
  Paywall = 'PAYWALL',
}

export const SEND_REPORT_MUTATION = gql`
  mutation SendReport(
    $type: ReportEntity!
    $id: ID!
    $reason: ReportReason!
    $comment: String
    $tags: [String]
  ) {
    sendReport(
      type: $type
      id: $id
      reason: $reason
      comment: $comment
      tags: $tags
    ) {
      _
    }
  }
`;

interface SendReportProps {
  id: string;
  reason: ReportReason;
  comment?: string;
  tags?: string[];
}

interface SendGenericReport extends SendReportProps {
  type: ReportEntity;
}

const sendReport = (params: SendGenericReport): Promise<EmptyResponse> =>
  gqlClient.request(SEND_REPORT_MUTATION, params);

export const sendSourceReport = (
  params: SendReportProps,
): Promise<EmptyResponse> =>
  sendReport({ ...params, type: ReportEntity.Source });
