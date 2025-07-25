import React from 'react';
import type { ReactElement } from 'react';
import type { GetServerSideProps } from 'next';
import type { Post, PostData } from '@dailydotdev/shared/src/graphql/posts';
import { POST_BY_ID_STATIC_FIELDS_QUERY } from '@dailydotdev/shared/src/graphql/posts';
import { ApiError, gqlClient } from '@dailydotdev/shared/src/graphql/common';
import type { ClientError } from 'graphql-request';
import type { NextSeoProps } from 'next-seo';
import { webappUrl } from '@dailydotdev/shared/src/lib/constants';
import CustomAuthBanner from '@dailydotdev/shared/src/components/auth/CustomAuthBanner';
import type { PublicProfile } from '@dailydotdev/shared/src/lib/user';
import { useUserShortByIdQuery } from '@dailydotdev/shared/src/hooks/user/useUserShortByIdQuery';
import { USER_SHORT_BY_ID } from '@dailydotdev/shared/src/graphql/users';
import { getPathnameWithQuery } from '@dailydotdev/shared/src/lib';
import { StaleTime } from '@dailydotdev/shared/src/lib/query';
import { getTemplatedTitle } from '../../../../components/layouts/utils';
import { getSeoDescription } from '../../../../components/PostSEOSchema';
import type { Props } from '../index';
import { PostPage, seoTitle } from '../index';
import { getLayout } from '../../../../components/layouts/MainLayout';

export type SharePostPageProps = Props & {
  shareUserId?: string;
  shareUser?: PublicProfile;
};

const SharePostPage = ({
  shareUserId,
  shareUser,
  ...props
}: SharePostPageProps): ReactElement => {
  useUserShortByIdQuery({ id: shareUserId, initialData: shareUser });

  return <PostPage {...props} />;
};

export const getServerSideProps: GetServerSideProps<
  SharePostPageProps | { redirect: { destination: string } }
> = async ({ params, res, query }) => {
  const { id } = params;
  try {
    const promises: [Promise<PostData>, Promise<PublicProfile>?] = [
      gqlClient.request<PostData>(POST_BY_ID_STATIC_FIELDS_QUERY, { id }),
    ];

    if (query.userid) {
      promises.push(
        gqlClient
          .request(USER_SHORT_BY_ID, {
            id: query.userid as string,
          })
          .then((data) => data.user)
          .catch(() => undefined),
      );
    }

    const [initialData, shareUser] = await Promise.all(promises);

    if (shareUser && query.userid !== shareUser.id) {
      const { id: queryId, userid, ...restQuery } = query;

      return {
        redirect: {
          destination: getPathnameWithQuery(
            `/posts/${id}`,
            new URLSearchParams(restQuery as Record<string, string>),
          ),
        },
        props: { id: initialData.post.id },
      };
    }

    const post = initialData.post as Post;
    const seo: NextSeoProps = {
      canonical: post?.slug ? `${webappUrl}posts/${post.slug}` : undefined,
      title: getTemplatedTitle(seoTitle(post)),
      description: getSeoDescription(post),
      openGraph: {
        images: [
          {
            url: `https://og.daily.dev/api/posts/${post?.id}?userid=${shareUser.id}`,
          },
        ],
        article: {
          publishedTime: post?.createdAt,
          tags: post?.tags,
        },
      },
    };

    res.setHeader(
      'Cache-Control',
      `public, max-age=0, must-revalidate, s-maxage=${StaleTime.OneHour}`,
    );

    return {
      props: {
        id: initialData.post.id,
        initialData,
        seo,
        shareUser: shareUser || null,
        shareUserId: shareUser ? (query.userid as string) : null,
      },
    };
  } catch (err) {
    const clientError = err as ClientError;
    const errors = Object.values(ApiError);
    if (errors.includes(clientError?.response?.errors?.[0]?.extensions?.code)) {
      const { postId } = clientError.response.errors[0].extensions;

      return {
        props: { id: postId || id },
      };
    }
    throw err;
  }
};

SharePostPage.getLayout = getLayout;
SharePostPage.layoutProps = {
  screenCentered: false,
  customBanner: <CustomAuthBanner />,
};

export default SharePostPage;
