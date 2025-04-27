import React from "react";
import { ServicesContext } from "../../../context/ServicesContext";

export function useSettings() {
  const { authService, rerender, cacheService } =
    React.useContext(ServicesContext);

  async function handleLogout() {
    await authService.signOut();
    await cacheService.clear();
    rerender(new Date().getTime());
  }

  return { handleLogout };
}
