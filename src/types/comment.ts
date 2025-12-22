export interface CommentReply {
  id: string;
  review_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user_name?: string | null;
  user_avatar?: string | null;
}

export interface Comment {
  id: string;
  content_id: string;
  user_id: string;
  content: string;
  rating: number;
  user_email?: string;
  user_name?: string | null;
  user_avatar?: string | null;
  created_at: string;
  updated_at: string;
  // Client-side computed fields
  like_count?: number;
  user_has_liked?: boolean;
  replies?: CommentReply[];
}

export interface CommentInsert {
  content_id: string;
  user_id: string;
  content: string;
  rating: number;
}

export interface CommentUpdate {
  content: string;
}

export interface ReviewLike {
  id: string;
  review_id: string;
  user_id: string;
  created_at: string;
}
