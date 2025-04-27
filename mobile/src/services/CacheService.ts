import AsyncStorage from "@react-native-async-storage/async-storage";

export class CacheService {
  async getItem(key: string): Promise<string | null> {
    return await AsyncStorage.getItem(key);
  }

  async setItem(key: string, data: string): Promise<void> {
    await AsyncStorage.setItem(key, data);
  }

  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }

  async clear(): Promise<void> {
    await AsyncStorage.clear();
  }
}
