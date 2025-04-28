import type { AsyncStorageStatic } from "@react-native-async-storage/async-storage";

export type CustomStorage = Pick<
  AsyncStorageStatic,
  "getItem" | "setItem" | "removeItem" | "clear"
>;

export class CacheService {
  constructor(private readonly storage: CustomStorage) {}

  async getItem(key: string): Promise<string | null> {
    return await this.storage.getItem(key);
  }

  async setItem(key: string, data: string): Promise<void> {
    await this.storage.setItem(key, data);
  }

  async removeItem(key: string): Promise<void> {
    await this.storage.removeItem(key);
  }

  async clear(): Promise<void> {
    await this.storage.clear();
  }
}
