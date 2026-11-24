/* eslint-env jest */

// Variable names prefixed with `mock` are allowed in jest.mock factory
const mockStorageCache = {};

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn((key, value) => {
    mockStorageCache[key] = value;
    return Promise.resolve(null);
  }),
  getItem: jest.fn((key) => {
    return Promise.resolve(mockStorageCache[key] || null);
  }),
  removeItem: jest.fn((key) => {
    delete mockStorageCache[key];
    return Promise.resolve(null);
  }),
  clear: jest.fn(() => {
    Object.keys(mockStorageCache).forEach((k) => delete mockStorageCache[k]);
    return Promise.resolve(null);
  }),
  getAllKeys: jest.fn(() => {
    return Promise.resolve(Object.keys(mockStorageCache));
  }),
}));

jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn().mockResolvedValue(true),
  getGenericPassword: jest.fn().mockResolvedValue(null),
  resetGenericPassword: jest.fn().mockResolvedValue(true),
  ACCESSIBLE: {
    WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'AccessibleWhenUnlockedThisDeviceOnly',
  },
}));

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => jest.fn()),
  fetch: jest.fn().mockResolvedValue({
    isConnected: true,
    isInternetReachable: true,
    type: 'wifi',
  }),
}));

jest.mock('react-native-vector-icons/Feather', () => 'Feather');
