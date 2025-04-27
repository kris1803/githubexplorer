import React from "react";
import { AuthService } from "../services/AuthService";
import { GithubService } from "../services/GithubService";
import { CacheService } from "../services/CacheService";

function createServices() {
  const authService = new AuthService(process.env.EXPO_PUBLIC_BACKEND_API_URL!);
  const cacheService = new CacheService();
  const githubService = new GithubService(authService, cacheService);
  return {
    authService,
    githubService,
    cacheService,
  };
}

const services = createServices();
export const ServicesContext = React.createContext({
  ...services,
  rerender: (id: number) => {},
  render: new Date().getTime(),
});

export function ServicesProvider({ children }: React.PropsWithChildren) {
  const [render, rerender] = React.useState<number>(new Date().getTime());
  return (
    <ServicesContext.Provider value={{ ...services, rerender, render }}>
      {children}
    </ServicesContext.Provider>
  );
}
