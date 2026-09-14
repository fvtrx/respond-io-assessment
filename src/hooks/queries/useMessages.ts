import { fetchPosts } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useMessages(userId: number) {
  return useQuery({
    queryKey: ["messages", userId],
    queryFn: async () => {
      const posts = await fetchPosts(userId);
      return posts;
    },
    enabled: !!userId,
  });
}
