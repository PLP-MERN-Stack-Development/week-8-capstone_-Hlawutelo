import { supabase } from '../lib/supabase';
import { User } from '../types';

export class AuthService {
  // Sign up new user
  static async signUp(email: string, password: string, name: string): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Wait for trigger to create profile, then verify
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Verify profile was created
        const profile = await this.getUserProfile(data.user, 3);

        return {
          user: {
            id: profile.id,
            email: profile.email,
            name: profile.name,
            createdAt: new Date(profile.created_at)
          },
          error: null
        };
      }

      return { user: null, error: 'Failed to create user' };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { user: null, error: error.message };
    }
  }

  // Sign in user
  static async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        const profile = await this.getUserProfile(data.user);

        return {
          user: {
            id: profile.id,
            email: profile.email,
            name: profile.name,
            createdAt: new Date(profile.created_at)
          },
          error: null
        };
      }

      return { user: null, error: 'Failed to sign in' };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { user: null, error: error.message };
    }
  }

  // Helper method to get user profile with retry logic
  private static async getUserProfile(authUser: any, retries = 3): Promise<any> {
    for (let i = 0; i < retries; i++) {
      try {
        const { data: profile, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id);

        if (!error && profile && profile.length > 0) {
          return profile[0];
        }

        // If profile doesn't exist, try to create it
        if (i === 0) {
          const { data: newProfile, error: insertError } = await supabase
            .from('users')
            .insert({
              id: authUser.id,
              email: authUser.email,
              name: authUser.user_metadata?.name || authUser.email.split('@')[0]
            })
            .select()
            .single();

          if (!insertError && newProfile) {
            return newProfile;
          }
        }

        if (profile && profile.length > 0) {
          return profile;
        }

        // Wait and retry
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      } catch (error) {
        console.warn(`Profile fetch attempt ${i + 1} failed:`, error);
      }
    }

    // Fallback to auth user data
    return {
      id: authUser.id,
      email: authUser.email,
      name: authUser.user_metadata?.name || authUser.email.split('@')[0],
      created_at: authUser.created_at,
      updated_at: authUser.updated_at
    };
  }

  // Sign out user
  static async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      const profile = await this.getUserProfile(user);

      return {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        createdAt: new Date(profile.created_at)
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Listen to auth changes
  static onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = await this.getCurrentUser();
        callback(user);
      } else {
        callback(null);
      }
    });
  }
}