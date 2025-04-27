import { useIsFocused, useNavigation } from "@react-navigation/native";
import { ServicesContext } from "../../../context/ServicesContext";
import React from "react";
import * as AuthSession from "expo-auth-session";
import { AuthService, GithubDiscovery } from "../../../services/AuthService";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();
const scopes: Array<string> = ["read:user"];

export function useLogin() {
  const isFocused = useIsFocused();
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "com.githubexplorer",
    path: "login",
  });
  const { authService, rerender } = React.useContext(ServicesContext);
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: AuthService.GITHUB_CLIENT_ID,
      scopes: scopes,
      redirectUri: redirectUri,
    },
    GithubDiscovery
  );

  React.useEffect(() => {
    if (response?.type === "success" && isFocused) {
      authService
        .exchangeGithubCode(response.params.code)
        .then(() => {
          authService.updateIsSignedIn().then(() => {
            rerender(new Date().getTime());
          });
        })
        .catch((error) => {
          alert(`Login failed. Please try again. ${error?.message || ""}`);
        });
    }
  }, [response, isFocused]);

  React.useEffect(() => {
    authService.updateIsSignedIn().then(() => {
      rerender(new Date().getTime());
    });
    WebBrowser.warmUpAsync();
    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  return {
    request,
    promptAsync,
  };
}
