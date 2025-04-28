import { AuthService } from "./services/AuthService";
import { CacheService } from "./services/CacheService";
import { GithubService } from "./services/GithubService";

const envVariables = {
  EXPO_PUBLIC_BACKEND_API_URL: process.env.EXPO_PUBLIC_BACKEND_API_URL,
  EXPO_PUBLIC_GITHUB_CLIENT_ID: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID,
} satisfies Partial<NodeJS.ProcessEnv>;

export function createServices() {
  const authService = new AuthService(
    envVariables.EXPO_PUBLIC_BACKEND_API_URL,
    envVariables.EXPO_PUBLIC_GITHUB_CLIENT_ID
  );
  const cacheService = new CacheService();
  const githubService = new GithubService(authService, cacheService);

  return {
    authService,
    githubService,
    cacheService,
  };
}
