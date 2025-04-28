import React from "react";
import { ServicesContext } from "../../../context/ServicesContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { GitRepository, WeeklyCommitCount } from "../../../services/types";

export type RepoDetailsProps = NativeStackScreenProps<
  ReactNavigation.RootParamList,
  "RepoDetails"
>;

export function useRepoDetails(props: RepoDetailsProps) {
  const { githubService } = React.useContext(ServicesContext);
  const [weeklyCommitCount, setWeeklyCommitCount] =
    React.useState<WeeklyCommitCount | null>(null);
  const [repo, setRepo] = React.useState<GitRepository | null>(null);

  React.useEffect(() => {
    const controller = new AbortController();
    githubService
      .getRepositories(controller.signal)
      .then((repos) => {
        const foundRepo = repos.find(
          (repo) => repo.name === props.route.params.name
        );
        if (!foundRepo) {
          throw new Error("Wrong repo name passed");
        }
        setRepo(foundRepo);
        return githubService
          .getWeeklyCommitCount(
            controller.signal,
            foundRepo.owner.login,
            foundRepo.name
          )
          .then(setWeeklyCommitCount);
      })
      .catch((error) => {
        alert(`Unexpected error: ${error?.message}`);
      });

    return () => {
      controller.abort();
    };
  }, [props.route.params.name]);

  return { weeklyCommitCount, repo };
}
