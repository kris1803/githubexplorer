import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthService } from "./services/AuthService";
import { CacheService } from "./services/CacheService";
import { GithubService } from "./services/GithubService";
import * as SecureStore from "expo-secure-store";

// keep all env variables here, but declare them in types.d.ts
const envVariables = {
  EXPO_PUBLIC_BACKEND_API_URL: process.env.EXPO_PUBLIC_BACKEND_API_URL,
  EXPO_PUBLIC_GITHUB_CLIENT_ID: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID,
} satisfies Partial<NodeJS.ProcessEnv>;

export function createServices() {
  const authService = new AuthService(
    envVariables.EXPO_PUBLIC_BACKEND_API_URL,
    envVariables.EXPO_PUBLIC_GITHUB_CLIENT_ID,
    SecureStore
  );
  const cacheService = new CacheService(AsyncStorage);
  const githubService = new GithubService(authService, cacheService);

  return {
    authService,
    githubService,
    cacheService,
  };
}
