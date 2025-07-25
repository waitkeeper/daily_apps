import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import type { Post } from '../../graphql/posts';
import { generateQueryKey, RequestKey } from '../../lib/query';
import { disabledRefetch } from '../../lib/func';

type Interaction = 'upvote' | 'bookmark' | 'copy' | 'none';

type PostActionData = {
  interaction: Interaction;
  previousInteraction: Interaction;
};

type UsePostActions = PostActionData & {
  onInteract: (interaction: PostActionData['interaction']) => void;
};

export const usePostActions = ({ post }: { post: Post }): UsePostActions => {
  const client = useQueryClient();
  const key = useMemo(() => {
    return generateQueryKey(RequestKey.PostActions, { id: post?.id });
  }, [post?.id]);

  const queryFn = useCallback((): PostActionData => {
    return {
      interaction: 'none',
      previousInteraction: 'none',
    };
  }, []);

  const { data } = useQuery({
    queryKey: key,
    queryFn,
    initialData: queryFn,
    staleTime: Infinity,
    gcTime: Infinity,
    ...disabledRefetch,
  });

  const onInteract = useCallback(
    (interaction: PostActionData['interaction']) => {
      client.setQueryData<PostActionData>(key, {
        interaction,
        previousInteraction:
          data?.interaction === interaction ? 'none' : data?.interaction,
      });
    },
    [client, key, data.interaction],
  );

  return {
    interaction: data?.interaction,
    previousInteraction: data?.previousInteraction,
    onInteract,
  };
};
