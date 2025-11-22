import { supabase } from '@/lib/supabaseClient';

interface BiometricCredential {
  email: string;
  credentialId: string;
}

// Check if WebAuthn is supported
export const isBiometricSupported = (): boolean => {
  return window.PublicKeyCredential !== undefined && 
         navigator.credentials !== undefined;
};

// Register biometric credential
export const registerBiometric = async (email: string): Promise<boolean> => {
  if (!isBiometricSupported()) {
    throw new Error('Biometric authentication is not supported on this device');
  }

  try {
    // Create a unique challenge
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
      challenge,
      rp: {
        name: 'FixOps',
        id: window.location.hostname,
      },
      user: {
        id: new TextEncoder().encode(email),
        name: email,
        displayName: email,
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' },  // ES256
        { alg: -257, type: 'public-key' }, // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform', // Use device biometrics
        userVerification: 'required',
      },
      timeout: 60000,
      attestation: 'direct',
    };

    const credential = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions,
    }) as PublicKeyCredential;

    if (credential) {
      // Store the credential ID associated with the email
      const biometricData: BiometricCredential = {
        email,
        credentialId: btoa(String.fromCharCode(...new Uint8Array(credential.rawId))),
      };
      
      localStorage.setItem('biometric_credential', JSON.stringify(biometricData));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Biometric registration failed:', error);
    throw error;
  }
};

// Authenticate using biometric
export const authenticateWithBiometric = async (): Promise<string | null> => {
  if (!isBiometricSupported()) {
    throw new Error('Biometric authentication is not supported on this device');
  }

  try {
    // Get stored credential
    const storedData = localStorage.getItem('biometric_credential');
    if (!storedData) {
      throw new Error('No biometric credential found. Please set up biometric login first.');
    }

    const biometricData: BiometricCredential = JSON.parse(storedData);
    
    // Create challenge
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    // Convert base64 credential ID back to ArrayBuffer
    const credentialIdStr = atob(biometricData.credentialId);
    const credentialId = new Uint8Array(credentialIdStr.length);
    for (let i = 0; i < credentialIdStr.length; i++) {
      credentialId[i] = credentialIdStr.charCodeAt(i);
    }

    const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
      challenge,
      allowCredentials: [{
        id: credentialId,
        type: 'public-key',
        transports: ['internal'],
      }],
      timeout: 60000,
      userVerification: 'required',
    };

    const assertion = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    });

    if (assertion) {
      // Return the email associated with this credential
      return biometricData.email;
    }

    return null;
  } catch (error) {
    console.error('Biometric authentication failed:', error);
    throw error;
  }
};

// Check if biometric is set up for the current device
export const isBiometricSetup = (): boolean => {
  return localStorage.getItem('biometric_credential') !== null;
};

// Remove biometric credential
export const removeBiometric = (): void => {
  localStorage.removeItem('biometric_credential');
};

// Save credentials for auto-fill
export const saveCredentials = (email: string, password: string): void => {
  const credentials = {
    email,
    password: btoa(password), // Basic encoding (not fully secure, but better than plain text)
    timestamp: Date.now(),
  };
  localStorage.setItem('saved_credentials', JSON.stringify(credentials));
};

// Get saved credentials
export const getSavedCredentials = (): { email: string; password: string } | null => {
  const saved = localStorage.getItem('saved_credentials');
  if (!saved) return null;
  
  try {
    const credentials = JSON.parse(saved);
    return {
      email: credentials.email,
      password: atob(credentials.password),
    };
  } catch {
    return null;
  }
};

// Clear saved credentials
export const clearSavedCredentials = (): void => {
  localStorage.removeItem('saved_credentials');
};
