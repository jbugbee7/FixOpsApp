
// This service is now disabled for testing purposes
// All functions return success to maintain compatibility

export const generateVerificationCode = (): string => {
  return '123456'; // Mock code for testing
};

export const storeVerificationCode = async (userId: string, code: string) => {
  // Mock implementation - no actual storage needed for testing
  console.log('Phone verification disabled for testing');
};

export const verifyPhoneCode = async (userId: string, enteredCode: string) => {
  // Mock verification - always succeeds for testing
  console.log('Phone verification disabled for testing');
  return true;
};

export const sendVerificationSMS = async (code: string) => {
  // Mock SMS sending for testing
  console.log('SMS sending disabled for testing');
  return { success: true, message: 'Phone verification disabled for testing' };
};

export const getFixedPhoneNumber = (): string => {
  return '+1234567890'; // Mock phone number
};
