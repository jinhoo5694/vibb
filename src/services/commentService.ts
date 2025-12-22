import { supabase } from '@/services/supabase';
import type { Comment, CommentReply } from '@/types/comment';

export class CommentService {
  // Get all comments (reviews) for a specific content with likes and replies
  async getCommentsByContentId(contentId: string, userId?: string): Promise<Comment[]> {
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select(`
        id,
        content_id,
        user_id,
        rating,
        content,
        created_at,
        user:user_id (id, nickname, avatar_url, email)
      `)
      .eq('content_id', contentId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }

    if (!reviews || reviews.length === 0) return [];

    // Fetch replies for all reviews
    const reviewIds = reviews.map(r => r.id);
    const { data: replies } = await supabase
      .from('review_replies')
      .select(`
        id,
        review_id,
        user_id,
        content,
        created_at,
        user:user_id (id, nickname, avatar_url, email)
      `)
      .in('review_id', reviewIds)
      .order('created_at', { ascending: true });

    // Fetch likes for all reviews
    const { data: likes } = await supabase
      .from('review_likes')
      .select('review_id, user_id')
      .in('review_id', reviewIds);

    // Build comments with likes and replies
    const comments: Comment[] = reviews.map(review => {
      const reviewReplies = (replies || [])
        .filter(r => r.review_id === review.id)
        .map(reply => ({
          id: reply.id,
          review_id: reply.review_id,
          user_id: reply.user_id,
          content: reply.content,
          created_at: reply.created_at,
          user_name: (reply.user as { nickname?: string })?.nickname || null,
          user_avatar: (reply.user as { avatar_url?: string })?.avatar_url || null,
        }));

      const reviewLikes = (likes || []).filter(l => l.review_id === review.id);

      return {
        id: review.id,
        content_id: review.content_id,
        user_id: review.user_id,
        rating: review.rating,
        content: review.content,
        created_at: review.created_at,
        updated_at: review.created_at, // reviews table doesn't have updated_at
        user_name: (review.user as { nickname?: string })?.nickname || null,
        user_avatar: (review.user as { avatar_url?: string })?.avatar_url || null,
        user_email: (review.user as { email?: string })?.email || undefined,
        like_count: reviewLikes.length,
        user_has_liked: userId ? reviewLikes.some(l => l.user_id === userId) : false,
        replies: reviewReplies,
      };
    });

    return comments;
  }

  // Add a new comment (review)
  async addComment(data: {
    content_id: string;
    user_id: string;
    content: string;
    rating: number;
  }): Promise<Comment> {
    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        content_id: data.content_id,
        user_id: data.user_id,
        content: data.content,
        rating: data.rating,
      })
      .select(`
        id,
        content_id,
        user_id,
        rating,
        content,
        created_at,
        user:user_id (id, nickname, avatar_url, email)
      `)
      .single();

    if (error) {
      console.error('Error adding comment:', error);
      throw error;
    }

    return {
      id: review.id,
      content_id: review.content_id,
      user_id: review.user_id,
      rating: review.rating,
      content: review.content,
      created_at: review.created_at,
      updated_at: review.created_at,
      user_name: (review.user as { nickname?: string })?.nickname || null,
      user_avatar: (review.user as { avatar_url?: string })?.avatar_url || null,
      user_email: (review.user as { email?: string })?.email || undefined,
      like_count: 0,
      user_has_liked: false,
      replies: [],
    };
  }

  // Add a reply to a comment
  async addReply(data: {
    review_id: string;
    user_id: string;
    content: string;
  }): Promise<CommentReply> {
    const { data: reply, error } = await supabase
      .from('review_replies')
      .insert({
        review_id: data.review_id,
        user_id: data.user_id,
        content: data.content,
      })
      .select(`
        id,
        review_id,
        user_id,
        content,
        created_at,
        user:user_id (id, nickname, avatar_url)
      `)
      .single();

    if (error) {
      console.error('Error adding reply:', error);
      throw error;
    }

    return {
      id: reply.id,
      review_id: reply.review_id,
      user_id: reply.user_id,
      content: reply.content,
      created_at: reply.created_at,
      user_name: (reply.user as { nickname?: string })?.nickname || null,
      user_avatar: (reply.user as { avatar_url?: string })?.avatar_url || null,
    };
  }

  // Update a comment (review)
  async updateComment(reviewId: string, content: string): Promise<void> {
    const { error } = await supabase
      .from('reviews')
      .update({ content })
      .eq('id', reviewId);

    if (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  }

  // Delete a comment (review) - also deletes replies
  async deleteComment(reviewId: string): Promise<void> {
    // First delete all replies
    await supabase
      .from('review_replies')
      .delete()
      .eq('review_id', reviewId);

    // Then delete the review
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }

  // Delete a reply
  async deleteReply(replyId: string): Promise<void> {
    const { error } = await supabase
      .from('review_replies')
      .delete()
      .eq('id', replyId);

    if (error) {
      console.error('Error deleting reply:', error);
      throw error;
    }
  }

  // Toggle like on a comment using RPC
  async toggleLike(reviewId: string): Promise<{ action: 'liked' | 'unliked' }> {
    const { data, error } = await supabase.rpc('toggle_review_like', {
      target_review_id: reviewId,
    });

    if (error) {
      console.error('Error toggling like:', error);
      throw error;
    }

    return {
      action: data?.action || 'liked',
    };
  }

  // Check if user already has a comment for this content
  async userHasCommented(contentId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('reviews')
      .select('id')
      .eq('content_id', contentId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking user comment:', error);
      throw error;
    }

    return !!data;
  }

  // Subscribe to real-time comment updates
  subscribeToComments(contentId: string, callback: (payload: unknown) => void) {
    return supabase
      .channel(`reviews:content_id=eq.${contentId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews',
          filter: `content_id=eq.${contentId}`,
        },
        callback
      )
      .subscribe();
  }

  // Subscribe to real-time reply updates
  subscribeToReplies(callback: (payload: unknown) => void) {
    return supabase
      .channel('review_replies')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'review_replies',
        },
        callback
      )
      .subscribe();
  }

  // Subscribe to real-time like updates
  subscribeToLikes(callback: (payload: unknown) => void) {
    return supabase
      .channel('review_likes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'review_likes',
        },
        callback
      )
      .subscribe();
  }
}

export const commentService = new CommentService();
