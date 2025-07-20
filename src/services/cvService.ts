import { supabase } from '../lib/supabase';
import { CV } from '../types';

export class CVService {
  // Get user's CVs
  static async getUserCVs(userId: string): Promise<CV[]> {
    try {
      const { data, error } = await supabase
        .from('cvs')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return data?.map(cv => ({
        id: cv.id,
        userId: cv.user_id,
        personalInfo: cv.personal_info || {},
        summary: cv.summary || '',
        experience: cv.experience || [],
        education: cv.education || [],
        skills: cv.skills || [],
        template: cv.template || 'modern',
        createdAt: new Date(cv.created_at),
        updatedAt: new Date(cv.updated_at)
      })) || [];
    } catch (error) {
      console.error('Error fetching CVs:', error);
      return [];
    }
  }

  // Save or update CV
  static async saveCV(userId: string, cvData: Partial<CV>): Promise<CV | null> {
    try {
      const cvPayload = {
        user_id: userId,
        personal_info: cvData.personalInfo || {},
        summary: cvData.summary || '',
        experience: cvData.experience || [],
        education: cvData.education || [],
        skills: cvData.skills || [],
        template: cvData.template || 'modern',
        updated_at: new Date().toISOString()
      };

      let result;
      
      if (cvData.id) {
        // Update existing CV
        result = await supabase
          .from('cvs')
          .update(cvPayload)
          .eq('id', cvData.id)
          .eq('user_id', userId)
          .select()
          .single();
      } else {
        // Create new CV
        result = await supabase
          .from('cvs')
          .insert(cvPayload)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      const cv = result.data;
      return {
        id: cv.id,
        userId: cv.user_id,
        personalInfo: cv.personal_info,
        summary: cv.summary,
        experience: cv.experience,
        education: cv.education,
        skills: cv.skills,
        template: cv.template,
        createdAt: new Date(cv.created_at),
        updatedAt: new Date(cv.updated_at)
      };
    } catch (error) {
      console.error('Error saving CV:', error);
      return null;
    }
  }

  // Delete CV
  static async deleteCV(userId: string, cvId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cvs')
        .delete()
        .eq('id', cvId)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting CV:', error);
      return false;
    }
  }

  // Get specific CV
  static async getCV(userId: string, cvId: string): Promise<CV | null> {
    try {
      const { data, error } = await supabase
        .from('cvs')
        .select('*')
        .eq('id', cvId)
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        userId: data.user_id,
        personalInfo: data.personal_info,
        summary: data.summary,
        experience: data.experience,
        education: data.education,
        skills: data.skills,
        template: data.template,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Error fetching CV:', error);
      return null;
    }
  }
}