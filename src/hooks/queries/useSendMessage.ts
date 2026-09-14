import { sendPost } from "@/lib/api";
import { ApiPost } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const OPTIMISTIC_ID = -1;

export function useSendMessage(userId: number) {
  const queryClient = useQueryClient();
  const queryKey = ["messages", userId];

  return useMutation({
    mutationFn: (body: string) => sendPost(userId, body),
    onMutate: async (body: string) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<ApiPost[]>(queryKey);

      const optimisticMessage: ApiPost = {
        id: OPTIMISTIC_ID,
        userId,
        title: "Message",
        body,
        createdAt: new Date().toISOString(),
        isOutgoing: true,
      };

      queryClient.setQueryData<ApiPost[]>(queryKey, (old = []) => [
        ...old,
        optimisticMessage,
      ]);

      return { previous };
    },
    onError: (_err, _body, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSuccess: (newPost) => {
      queryClient.setQueryData<ApiPost[]>(queryKey, (old = []) => {
        const withoutOptimistic = old.filter((m) => m.id !== OPTIMISTIC_ID);
        return [...withoutOptimistic, newPost];
      });
    },
  });
}
