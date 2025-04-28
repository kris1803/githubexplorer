import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import { RepoListCard } from "../../src/components/RepoListCard";
import type { GitRepository } from "../../src/services/types";

const fixture: GitRepository = {
  name: "",
  allow_forking: false,
  archived: false,
  has_discussions: false,
  has_downloads: false,
  has_issues: false,
  has_pages: false,
  has_projects: false,
  has_wiki: false,
  html_url: "",
  fork: false,
  forks: 0,
  forks_count: 0,
  disabled: false,
  language: "",
  pushed_at: "",
  stargazers_count: 0,
  private: false,
  updated_at: "",
  url: "",
  owner: {
    avatar_url: "",
    html_url: "",
    id: 0,
    login: "",
    organizations_url: "",
    received_events_url: "",
    repos_url: "",
    site_admin: false,
    starred_url: "",
    subscriptions_url: "",
    type: "User",
    url: "",
    user_view_type: "public",
  },
} as const;

describe("<RepoListCard />", () => {
  let clickMock: jest.Mock;

  it("renders correctly", () => {
    clickMock = jest.fn();

    render(<RepoListCard index={0} item={fixture} handleClick={clickMock} />);

    fireEvent.press(screen.getByText(fixture.name));

    waitFor(() => expect(clickMock.mock.calls.length).toBe(1));
  });
});
