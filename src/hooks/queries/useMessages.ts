import { fetchPosts } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useMessages(userId: number) {
  return useQuery({
    queryKey: ["messages", userId],
    queryFn: () => fetchPosts(userId),
    enabled: Boolean(userId),
  });
}
