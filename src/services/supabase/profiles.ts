import { createClient } from '@/lib/supabase';
import { AppRole } from '@/types/database';

export interface UserProfile {
  id: string;
  nickname: string | null;
  avatar_url: string | null;
  role: AppRole;
}

// Get user profile with role
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('id, nickname, avatar_url, role')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data as UserProfile;
}

// Check if user is admin
export async function isUserAdmin(userId: string): Promise<boolean> {
  const profile = await getUserProfile(userId);
  return profile?.role === 'admin';
}
