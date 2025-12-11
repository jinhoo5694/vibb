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

  // Likes
  toggleLike,
  hasUserLikedSkill,

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
  votePost,
  getPostById,
  deletePost,
} from './posts';

// Search functions
export {
  searchAll,
  quickSearch,
} from './search';
export type { SearchResult } from './search';

// Re-export client for direct access if needed
export { supabase } from './client';
