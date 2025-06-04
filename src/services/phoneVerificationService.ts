
import { supabase } from '@/integrations/supabase/client';

// Fixed phone number that will be used for all signups
const FIXED_PHONE_NUMBER = '+18283182617'; // Replace with your actual phone number

// Generate a 6-digit verification code
export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store verification code in database with fixed phone number
export const storeVerificationCode = async (userId: string, code: string) => {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 minute expiry

  const { error } = await supabase
    .from('profiles')
    .update({
      phone_number: FIXED_PHONE_NUMBER,
      verification_code: code,
      verification_code_expires_at: expiresAt.toISOString(),
      phone_verified: false
    })
    .eq('id', userId);

  if (error) throw error;
};

// Verify the code entered by user
export const verifyPhoneCode = async (userId: string, enteredCode: string) => {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('verification_code, verification_code_expires_at')
    .eq('id', userId)
    .single();

  if (error) throw error;

  if (!profile.verification_code) {
    throw new Error('No verification code found');
  }

  if (new Date() > new Date(profile.verification_code_expires_at)) {
    throw new Error('Verification code has expired');
  }

  if (profile.verification_code !== enteredCode) {
    throw new Error('Invalid verification code');
  }

  // Mark phone as verified and clear the code
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      phone_verified: true,
      verification_code: null,
      verification_code_expires_at: null
    })
    .eq('id', userId);

  if (updateError) throw updateError;

  return true;
};

// Send SMS notification to admin (you) - in production, integrate with your SMS provider
export const sendVerificationSMS = async (code: string) => {
  // Mock SMS sending - in production, this would send to YOUR phone number
  console.log(`Sending SMS to ${FIXED_PHONE_NUMBER}: New user signup - Verification code: ${code}`);
  
  // For demo purposes, we'll show the code in a toast
  return { success: true, message: `Verification code generated: ${code}` };
};

// Get the fixed phone number
export const getFixedPhoneNumber = (): string => {
  return FIXED_PHONE_NUMBER;
};
