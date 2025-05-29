
import { fetchUserProfile, updateUserProfileData } from './profileService';
import { signUpWithEmail, signInWithEmail, signOutUser as signOut } from './authenticationService';

// Re-export for backward compatibility
export const fetchProfile = fetchUserProfile;
export const signUpUser = signUpWithEmail;
export const signInUser = signInWithEmail;
export const signOutUser = signOut;
export const updateUserProfile = updateUserProfileData;
