export type ApiUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  avatar: string;
  phone: string;
  website?: string;
  address?: {
    street?: string;
    city?: string;
    zipcode?: string;
  };
};

export type ApiPost = {
  id: number;
  userId: number;
  title: string;
  body: string;
  tags?: string[];
  category?: string;
  createdAt?: string;
  isOutgoing?: boolean;
};

export type Message = ApiPost & {
  direction: "incoming" | "outgoing";
};

export type PaginatedResponse<T> = {
  total: number;
  limit: number;
  offset: number;
  results: T[];
};

export type BlockedContact = {
  id: number;
  user_id: string;
  contact_id: number;
  contact_name: string;
  contact_avatar: string | null;
  created_at: string;
};
