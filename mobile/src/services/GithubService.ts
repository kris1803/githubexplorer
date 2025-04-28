import type { AuthService } from "./AuthService";
import type { CacheService } from "./CacheService";
import { GitProviderService, GitRepository, WeeklyCommitCount } from "./types";

const REPOSITORIES_CACHE_EXPIRATION: number = 1000 * 60 * 10;

export class GithubService implements GitProviderService {
  private static readonly REPOSITORIES_CACHE_KEY = "repositories";
  private static readonly WEEKLY_COMMIT_COUNT_CACHE_KEY = "weekly_commit_count";

  constructor(
    private readonly authService: AuthService,
    private readonly cacheService: CacheService
  ) {}

  async getRepositories(
    abortSignal: AbortSignal,
    forceRefresh: boolean = false
  ): Promise<Array<GitRepository>> {
    const cachedRepositoriesSerialized = await this.cacheService.getItem(
      GithubService.REPOSITORIES_CACHE_KEY
    );
    if (cachedRepositoriesSerialized && !forceRefresh) {
      const cachedRepositories = JSON.parse(
        cachedRepositoriesSerialized
      ) as RepositoriesCachePayload;
      if (
        new Date().getTime() - cachedRepositories.date <
          REPOSITORIES_CACHE_EXPIRATION &&
        cachedRepositories.repositories
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
    if (!repositories) {
      throw new Error("Failed to parse repositories");
    }
    await this.cacheService.setItem(
      GithubService.REPOSITORIES_CACHE_KEY,
      JSON.stringify({
        repositories: repositories,
        date: new Date().getTime(),
      } satisfies RepositoriesCachePayload)
    );
    return repositories;
  }

  async getWeeklyCommitCount(
    abortSignal: AbortSignal,
    repoOwner: string,
    repoName: string
  ): Promise<WeeklyCommitCount> {
    const cachedCountSerialized = await this.cacheService.getItem(
      GithubService.WEEKLY_COMMIT_COUNT_CACHE_KEY
    );
    if (cachedCountSerialized) {
      const cachedCount = JSON.parse(
        cachedCountSerialized
      ) satisfies CommitCountCachePayload;
      if (
        new Date().getTime() - cachedCount.date <
        REPOSITORIES_CACHE_EXPIRATION
      ) {
        return cachedCount.repositories;
      }
    }

    const tokens = await this.authService.readStoredTokens();
    const response = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/stats/participation`,
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
        signal: abortSignal,
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch weekly commit count");
    }
    const weeklyCount = await response.json();
    if (!weeklyCount) {
      throw new Error("Failed to parse received repositories");
    }
    await this.cacheService.setItem(
      GithubService.REPOSITORIES_CACHE_KEY,
      JSON.stringify({
        data: weeklyCount,
        date: new Date().getTime(),
      } satisfies CommitCountCachePayload)
    );
    return weeklyCount;
  }
}

type RepositoriesCachePayload = {
  repositories: Array<GitRepository>;
  date: number;
};

type CommitCountCachePayload = {
  data: any;
  date: number;
};
