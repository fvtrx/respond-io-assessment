import { ApiPost, Message } from "@/lib/types";

export function mapMessages(posts: ApiPost[]): Message[] {
  return posts.map((post) => ({
    ...post,
    direction: post.isOutgoing ? ("outgoing" as const) : ("incoming" as const),
  }));
}
