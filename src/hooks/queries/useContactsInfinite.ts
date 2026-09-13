import { fetchUsers } from "@/lib/api";
import { useInfiniteQuery } from "@tanstack/react-query";

const USERS_PER_PAGE = 20;

export function useContactsInfinite() {
  return useInfiniteQuery({
    queryKey: ["contacts"],
    queryFn: ({ pageParam }) => fetchUsers(pageParam, USERS_PER_PAGE),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.offset + lastPage.results.length;
      return nextOffset < lastPage.total ? nextOffset : undefined;
    },
  });
}
