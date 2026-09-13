import { fetchUser } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useContact(userId: number) {
  return useQuery({
    queryKey: ["contact", userId],
    queryFn: () => fetchUser(userId),
    enabled: Boolean(userId),
  });
}
