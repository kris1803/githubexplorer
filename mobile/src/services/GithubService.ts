import type { AuthService } from "./AuthService";
import type { CacheService } from "./CacheService";
import { GitProviderService, GitRepository } from "./types";

const REPOSITORIES_CACHE_EXPIRATION: number = 1000 * 60 * 10;

export class GithubService implements GitProviderService {
  private static readonly REPOSITORIES_CACHE_KEY = "repositories";
  constructor(
    private readonly authService: AuthService,
    private readonly cacheService: CacheService
  ) {}

  async getRepositories(
    abortSignal: AbortSignal,
    forceRefresh: boolean = false
  ): Promise<Array<GitRepository>> {
    const cachedRepositoriesString = await this.cacheService.getItem(
      GithubService.REPOSITORIES_CACHE_KEY
    );
    if (cachedRepositoriesString && !forceRefresh) {
      const cachedRepositories = JSON.parse(cachedRepositoriesString);
      if (
        new Date().getTime() - cachedRepositories.date <
        REPOSITORIES_CACHE_EXPIRATION
      ) {
        return cachedRepositories.repositories;
      }
    }

    const tokens = await this.authService.readStoredTokens();
    const response = await fetch("https://api.github.com/user/repos", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
      signal: abortSignal,
    });
    if (!response.ok) {
      throw new Error("Failed to fetch repositories");
    }
    const repositories = await response.json();
    if (repositories) {
      await this.cacheService.setItem(
        GithubService.REPOSITORIES_CACHE_KEY,
        JSON.stringify({
          repositories: repositories,
          date: new Date().getTime(),
        } satisfies RepositoriesCachePayload)
      );
    }
    return repositories;
  }
}

type RepositoriesCachePayload = {
  repositories: Array<GitRepository>;
  date: number;
};
