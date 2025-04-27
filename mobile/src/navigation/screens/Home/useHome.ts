import React from "react";
import { ServicesContext } from "../../../context/ServicesContext";
import { GitRepository } from "../../../services/types";

export function useHome() {
  const { githubService } = React.useContext(ServicesContext);
  const [repositories, setRepositories] = React.useState<GitRepository[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  function refreshRepositories(
    abortController: AbortController,
    forceRefresh?: boolean
  ) {
    return githubService
      .getRepositories(abortController.signal, forceRefresh)
      .then(setRepositories)
      .catch((error) => {
        alert(`Error fetching repositories: ${error?.message || ""}`);
        console.error("Error fetching repositories:", error);
      });
  }

  function onPullRefresh() {
    const abortController = new AbortController();
    setIsLoading(true);
    refreshRepositories(abortController, true).finally(() =>
      setIsLoading(false)
    );
  }

  React.useEffect(() => {
    const abortController = new AbortController();
    refreshRepositories(abortController);
    return () => {
      abortController.abort();
    };
  }, []);

  return { repositories, onPullRefresh, isRefreshing: isLoading };
}
