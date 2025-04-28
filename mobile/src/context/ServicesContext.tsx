import React from "react";
import { createServices } from "../configuration";

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
