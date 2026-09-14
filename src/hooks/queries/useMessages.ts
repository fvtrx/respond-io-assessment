import { fetchPosts } from "@/lib/api";
import { ApiPost } from "@/lib/types";
import { useAuthStore } from "@/store/authStore";
import { getSentMessages } from "@/utils/sentMessages";
import { useQuery } from "@tanstack/react-query";

function sentMessagesToPosts(accountId: string, contactId: number): ApiPost[] {
  return getSentMessages(accountId, contactId).map((m) => ({
    id: m.id,
    userId: m.userId,
    title: "Message",
    body: m.body,
    createdAt: m.createdAt,
    isOutgoing: true,
  }));
}

export function useMessages(userId: number) {
  return useQuery({
    queryKey: ["messages", userId],
    queryFn: async () => {
      const posts = await fetchPosts(userId);
      const accountId = useAuthStore.getState().user?.id ?? "anon";
      const sent = sentMessagesToPosts(accountId, userId);
      return [...posts, ...sent];
    },
    enabled: !!userId,
  });
}
