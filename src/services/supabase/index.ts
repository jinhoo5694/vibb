// Main exports from skills.ts which contains all skill-related functions
export {
  // Skills
  getSkills,
  getSkillById,
  getSkillsByCategory,
  getSkillContents,
  getSkillLicense,
  searchSkills,

  // Categories (Tags)
  getCategories,

  // View counts
  incrementViewCount,

  // Likes/Votes
  toggleLike,
  hasUserLikedSkill,
  toggleVote,
  getUserVote,

  // Reviews (Comments)
  getSkillComments,
  addComment,
  deleteComment,
  getSkillAverageRating,

  // Bookmarks
  toggleBookmark,
  hasUserBookmarked,
} from './skills';

// Post/Community board functions
export {
  getPosts,
  getBoardPosts,
  createPost,
  updatePost,
  votePost,
  getPostById,
  deletePost,
  getPostComments,
  addPostComment,
  deletePostComment,
  addReply,
  deleteReply,
  toggleReviewLike,
  hasUserLikedReview,
  getUserDrafts,
} from './posts';

// Search functions
export {
  searchAll,
  quickSearch,
} from './search';
export type { SearchResult } from './search';

// Plugin/Marketplace functions
export {
  getPlugins,
  getPluginById,
  searchPlugins,
  getPluginsByTag,
  getPluginContents,
  getPluginLicense,
  incrementPluginViewCount,
  getPluginAverageRating,
} from './plugins';

// Prompt functions
export {
  getPrompts,
  getPromptById,
  getPendingPrompts,
  createPrompt,
  approvePrompt,
  rejectPrompt,
  deletePrompt,
} from './prompts';
export type { Prompt } from './prompts';

// Profile functions
export {
  getUserProfile,
  isUserAdmin,
} from './profiles';
export type { UserProfile } from './profiles';

// Re-export client for direct access if needed
export { supabase } from './client';
