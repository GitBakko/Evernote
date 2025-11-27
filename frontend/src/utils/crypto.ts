import CryptoJS from 'crypto-js';

// Helper to hash the PIN for storage/verification
export const hashPin = (pin: string): string => {
  return CryptoJS.SHA256(pin).toString();
};

// Encrypt content using the PIN
export const encryptContent = (content: string, pin: string): string => {
  return CryptoJS.AES.encrypt(content, pin).toString();
};

// Decrypt content using the PIN
// Returns null if decryption fails (wrong PIN)
export const decryptContent = (encryptedContent: string, pin: string): string | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedContent, pin);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    if (!originalText) return null;
    return originalText;
  } catch (error) {
    return null;
  }
};
