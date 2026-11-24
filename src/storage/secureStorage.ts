import * as Keychain from 'react-native-keychain';

export interface StoredTokens {
  accessToken: string;
  refreshToken?: string;
}

const KEYCHAIN_SERVICE = 'com.scoreline.auth.tokens';

/**
 * Securely store authentication tokens in Keychain/Keystore.
 * Confidentiality & Integrity: Tokens are stored encrypted in platform secure hardware.
 */
export const saveSecureTokens = async (
  accessToken: string,
  refreshToken?: string
): Promise<boolean> => {
  try {
    const payload = JSON.stringify({ accessToken, refreshToken: refreshToken || '' });
    await Keychain.setGenericPassword('auth_session', payload, {
      service: KEYCHAIN_SERVICE,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
    return true;
  } catch {
    return false;
  }
};

/**
 * Retrieve securely stored tokens from Keychain/Keystore.
 */
export const getSecureTokens = async (): Promise<StoredTokens | null> => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: KEYCHAIN_SERVICE,
    });
    if (credentials && credentials.password) {
      const parsed = JSON.parse(credentials.password);
      return {
        accessToken: parsed.accessToken,
        refreshToken: parsed.refreshToken || undefined,
      };
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Clear stored tokens on logout.
 */
export const clearSecureTokens = async (): Promise<boolean> => {
  try {
    await Keychain.resetGenericPassword({
      service: KEYCHAIN_SERVICE,
    });
    return true;
  } catch {
    return false;
  }
};
