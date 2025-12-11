export interface Comment {
  id: string;
  skill_id: string;
  user_id: string;
  parent_id: string | null; // For threaded replies
  content: string;
  rating: number | null; // 1-5 stars, null for replies
  user_email?: string;
  user_name?: string | null;
  user_avatar?: string | null;
  created_at: string;
  updated_at: string;
  // Client-side computed fields
  like_count?: number;
  user_has_liked?: boolean;
  replies?: Comment[]; // Nested replies
}

export interface CommentInsert {
  skill_id: string;
  user_id: string;
  parent_id?: string | null;
  content: string;
  rating?: number | null;
  user_email?: string;
  user_name?: string | null;
  user_avatar?: string | null;
}

export interface CommentUpdate {
  content: string;
  updated_at: string;
}

export interface CommentLike {
  id: string;
  comment_id: string;
  user_id: string;
  created_at: string;
}
