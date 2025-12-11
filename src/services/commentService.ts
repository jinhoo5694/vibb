import { createClient } from '@/lib/supabase';
import type { Comment, CommentInsert, CommentLike } from '@/types/comment';

export class CommentService {
  private supabase = createClient();

  // Get all comments for a specific skill with likes data
  async getCommentsBySkillId(skillId: string, userId?: string): Promise<Comment[]> {
    const { data, error } = await this.supabase
      .from('comments')
      .select('*')
      .eq('skill_id', skillId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }

    if (!data) return [];

    // Fetch likes for all comments
    const commentIds = data.map(c => c.id);
    const { data: likes } = await this.supabase
      .from('comment_likes')
      .select('*')
      .in('comment_id', commentIds);

    // Attach like counts and user_has_liked to each comment
    const commentsWithLikes = data.map(comment => ({
      ...comment,
      like_count: likes?.filter(l => l.comment_id === comment.id).length || 0,
      user_has_liked: userId ? likes?.some(l => l.comment_id === comment.id && l.user_id === userId) || false : false,
      replies: [] as Comment[],
    }));

    // Build threaded structure
    const commentMap = new Map<string, Comment>();
    const rootComments: Comment[] = [];

    commentsWithLikes.forEach(comment => {
      commentMap.set(comment.id, comment);
    });

    commentsWithLikes.forEach(comment => {
      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id);
        if (parent) {
          parent.replies = parent.replies || [];
          parent.replies.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    });

    // Sort replies by creation date
    rootComments.forEach(comment => {
      if (comment.replies) {
        comment.replies.sort((a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }
    });

    return rootComments;
  }

  // Add a new comment or reply
  async addComment(comment: CommentInsert): Promise<Comment> {
    const { data, error } = await this.supabase
      .from('comments')
      .insert(comment)
      .select('*')
      .single();

    if (error) {
      console.error('Error adding comment:', error);
      throw error;
    }

    return {
      ...data,
      like_count: 0,
      user_has_liked: false,
      replies: [],
    };
  }

  // Update a comment
  async updateComment(commentId: string, content: string): Promise<Comment> {
    const { data, error } = await this.supabase
      .from('comments')
      .update({
        content,
        updated_at: new Date().toISOString()
      })
      .eq('id', commentId)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating comment:', error);
      throw error;
    }

    return data;
  }

  // Delete a comment
  async deleteComment(commentId: string): Promise<void> {
    const { error } = await this.supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }

  // Like a comment
  async likeComment(commentId: string, userId: string): Promise<CommentLike> {
    const { data, error } = await this.supabase
      .from('comment_likes')
      .insert({ comment_id: commentId, user_id: userId })
      .select('*')
      .single();

    if (error) {
      console.error('Error liking comment:', error);
      throw error;
    }

    return data;
  }

  // Unlike a comment
  async unlikeComment(commentId: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('comment_likes')
      .delete()
      .eq('comment_id', commentId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error unliking comment:', error);
      throw error;
    }
  }

  // Check if user already has a root comment for this skill
  async userHasCommented(skillId: string, userId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('comments')
      .select('id')
      .eq('skill_id', skillId)
      .eq('user_id', userId)
      .is('parent_id', null)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking user comment:', error);
      throw error;
    }

    return !!data;
  }

  // Subscribe to real-time comment updates for a skill
  subscribeToComments(skillId: string, callback: (payload: any) => void) {
    return this.supabase
      .channel(`comments:skill_id=eq.${skillId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `skill_id=eq.${skillId}`,
        },
        callback
      )
      .subscribe();
  }

  // Subscribe to real-time like updates
  subscribeToLikes(callback: (payload: any) => void) {
    return this.supabase
      .channel('comment_likes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comment_likes',
        },
        callback
      )
      .subscribe();
  }
}

export const commentService = new CommentService();
