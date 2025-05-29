
import { UserProfile } from '@/types/auth';
import { updateUserProfileData } from './profileService';

export const saveProfileChanges = async (userId: string, profileData: Partial<UserProfile>) => {
  try {
    const updatedProfile = await updateUserProfileData(userId, profileData);
    return { success: true, data: updatedProfile };
  } catch (error) {
    console.error('Error saving profile changes:', error);
    return { success: false, error };
  }
};

export const validateProfileData = (profileData: Partial<UserProfile>) => {
  const errors: string[] = [];
  
  if (profileData.full_name && profileData.full_name.trim().length < 2) {
    errors.push('Full name must be at least 2 characters long');
  }
  
  return errors;
};
