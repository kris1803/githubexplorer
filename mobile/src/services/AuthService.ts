import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import * as AuthSession from "expo-auth-session";

export class AuthService {
  private static ACCESS_TOKEN_KEY = "access_token";
  private static REFRESH_TOKEN_KEY = "refresh_token";
  private static EXPIRES_AT = "expires_at";
  private static REFRESH_TOKEN_EXPIRES_AT = "refresh_token_expires_at";
  public readonly GithubDiscovery: AuthSession.DiscoveryDocument;

  public isSignedIn: boolean = false;

  constructor(
    private readonly backendUrl: string,
    public readonly GITHUB_CLIENT_ID: string
  ) {
    this.GithubDiscovery = getGithubDiscovery(GITHUB_CLIENT_ID);
  }

  async exchangeGithubCode(code: string) {
    try {
      const rawResponse = await fetch(
        `${this.backendUrl}/exchange-code-github`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: code,
          }),
        }
      );
      if (!rawResponse.ok) {
        throw new Error("Failed to exchange code");
      }
      const receivedPayload: ReceivedTokenPayload = await rawResponse.json();
      if (receivedPayload.error) {
        throw new Error(receivedPayload.error);
      }
      if (Platform.OS !== "web") {
        await SecureStore.setItemAsync(
          AuthService.ACCESS_TOKEN_KEY,
          receivedPayload.access_token
        );
        await SecureStore.setItemAsync(
          AuthService.REFRESH_TOKEN_KEY,
          receivedPayload.refresh_token
        );
        await SecureStore.setItemAsync(
          AuthService.EXPIRES_AT,
          `${new Date().getTime() + receivedPayload.expires_in * 1000}`
        );
        await SecureStore.setItemAsync(
          AuthService.REFRESH_TOKEN_EXPIRES_AT,
          `${
            new Date().getTime() +
            receivedPayload.refresh_token_expires_in * 1000
          }`
        );
      }
    } catch (error) {
      console.error("Error exchanging code:", error);
      throw new Error("Failed to exchange code");
    }
  }

  async readStoredTokens(): Promise<TokenPayload> {
    const access_token = await SecureStore.getItemAsync(
      AuthService.ACCESS_TOKEN_KEY
    );
    const refresh_token = await SecureStore.getItemAsync(
      AuthService.REFRESH_TOKEN_KEY
    );
    if (!access_token || !refresh_token) {
      throw new Error("No tokens found");
    }
    const expiresAt = await SecureStore.getItemAsync(AuthService.EXPIRES_AT);
    const refreshTokenExpiresAt = await SecureStore.getItemAsync(
      AuthService.REFRESH_TOKEN_EXPIRES_AT
    );
    if (expiresAt && new Date().getTime() > parseInt(expiresAt)) {
      await SecureStore.deleteItemAsync(AuthService.ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(AuthService.EXPIRES_AT);
      throw new Error("Access token expired");
    }
    if (
      refreshTokenExpiresAt &&
      new Date().getTime() > parseInt(refreshTokenExpiresAt)
    ) {
      await SecureStore.deleteItemAsync(AuthService.REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(AuthService.REFRESH_TOKEN_EXPIRES_AT);
      throw new Error("Refresh token expired");
    }

    return {
      access_token,
      refresh_token,
      expiresAt: expiresAt || "",
      refreshTokenExpiresAt: refreshTokenExpiresAt || "",
    };
  }

  async updateIsSignedIn(): Promise<boolean> {
    const tokens = await this.readStoredTokens().catch(() => null);
    if (!tokens || !tokens.access_token) {
      this.isSignedIn = false;
      return this.isSignedIn;
    }
    this.isSignedIn = true;
    return this.isSignedIn;
  }

  async signOut(): Promise<void> {
    await SecureStore.deleteItemAsync(AuthService.ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(AuthService.REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(AuthService.EXPIRES_AT);
    await SecureStore.deleteItemAsync(AuthService.REFRESH_TOKEN_EXPIRES_AT);
    this.isSignedIn = false;
  }
}

function getGithubDiscovery(clientId: string) {
  return {
    authorizationEndpoint: "https://github.com/login/oauth/authorize",
    tokenEndpoint: "https://github.com/login/oauth/access_token",
    revocationEndpoint: `https://github.com/settings/connections/applications/${clientId}`,
  };
}

type ReceivedTokenPayload = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  error?: string;
  refresh_token_expires_in: number;
};

type TokenPayload = {
  access_token: string;
  refresh_token: string;
  expiresAt: string;
  refreshTokenExpiresAt: string;
};
