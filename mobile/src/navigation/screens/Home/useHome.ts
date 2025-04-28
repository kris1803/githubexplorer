import React from "react";
import { ServicesContext } from "../../../context/ServicesContext";
import { GitRepository } from "../../../services/types";
import { useNavigation } from "@react-navigation/native";

export function useHome() {
  const { githubService } = React.useContext(ServicesContext);
  const [repositories, setRepositories] = React.useState<GitRepository[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>("");
  const navigation = useNavigation();

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

  function onInput(text: string) {
    setSearch(text);
  }

  function onPullRefresh() {
    const abortController = new AbortController();
    setIsLoading(true);
    refreshRepositories(abortController, true).finally(() =>
      setIsLoading(false)
    );
  }

  function handleRepositoryClick(repoName: string) {
    navigation.navigate("RepoDetails", { name: repoName });
  }

  React.useEffect(() => {
    const abortController = new AbortController();
    setIsLoading(true);
    refreshRepositories(abortController).finally(() => setIsLoading(false));
    return () => {
      abortController.abort();
    };
  }, []);

  const filteredRepositories = React.useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return repositories.filter((repo) =>
      repo.name.toLowerCase().includes(lowerSearch)
    );
  }, [repositories, search]);

  return {
    repositories: filteredRepositories,
    onPullRefresh,
    isRefreshing: isLoading,
    handleRepositoryClick,
    onInput,
  };
}
