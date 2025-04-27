import { Assets as NavigationAssets } from "@react-navigation/elements";
import { Asset } from "expo-asset";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import { Navigation } from "./navigation";
import { ServicesProvider } from "./context/ServicesContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

Asset.loadAsync([
  ...NavigationAssets,
  require("./assets/newspaper.png"),
  require("./assets/bell.png"),
]);

SplashScreen.preventAutoHideAsync();

export function App() {
  return (
    <GestureHandlerRootView>
      <ServicesProvider>
        <Navigation />
      </ServicesProvider>
    </GestureHandlerRootView>
  );
}
