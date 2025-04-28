export interface GitProviderService {
  getRepositories(abortSignal: AbortSignal): Promise<Array<GitRepository>>;
  getWeeklyCommitCount(
    abortSignal: AbortSignal,
    repoOwner: string,
    repoName: string
  ): Promise<any>;
}

export type GitRepository = {
  name: string;
  allow_forking: boolean;
  archived: boolean;
  has_discussions: boolean;
  has_downloads: boolean;
  has_issues: boolean;
  has_pages: boolean;
  has_projects: boolean;
  has_wiki: boolean;
  html_url: string;
  fork: boolean;
  forks: number;
  forks_count: number;
  disabled: boolean;
  language: string;
  pushed_at: string;
  stargazers_count: number;
  private: boolean;
  updated_at: string;
  url: string;
  owner: {
    avatar_url: string;
    html_url: string;
    id: number;
    login: string;
    organizations_url: string;
    received_events_url: string;
    repos_url: string;
    site_admin: boolean;
    starred_url: string;
    subscriptions_url: string;
    type: "User";
    url: string;
    user_view_type: "public";
  };
};

export type WeeklyCommitCount = {
  all: number[];
  owner: number[];
};
