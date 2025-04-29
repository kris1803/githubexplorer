import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image } from "react-native";
import bell from "../assets/bell.png";
import newspaper from "../assets/newspaper.png";
import { Home } from "./screens/Home/Home";
import { Settings } from "./screens/Settings/Settings";
import { NotFound } from "./screens/NotFound";
import { LoginScreen } from "./screens/Login/Login";
import React from "react";
import { ServicesContext } from "../context/ServicesContext";
import * as SplashScreen from "expo-splash-screen";
import { RepoDetailsScreen } from "./screens/RepoDetails/RepoDetails";

const HomeTabsNavigator = createBottomTabNavigator();

function HomeTabs() {
  return (
    <HomeTabsNavigator.Navigator screenOptions={{ headerShown: false }}>
      <HomeTabsNavigator.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={newspaper}
              tintColor={color}
              style={{
                width: size,
                height: size,
              }}
            />
          ),
          tabBarAccessibilityLabel: "Home",
        }}
      />
      <HomeTabsNavigator.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={bell}
              tintColor={color}
              style={{
                width: size,
                height: size,
              }}
            />
          ),
          tabBarAccessibilityLabel: "Settings",
        }}
      />
    </HomeTabsNavigator.Navigator>
  );
}

type RootStackParamList = {
  Auth: undefined;
  HomeTabs: undefined;
  RepoDetails: { name: string };
  "*": undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export const Navigation = () => {
  const { authService } = React.useContext(ServicesContext);
  const signedIn = authService.isSignedIn;

  return (
    <NavigationContainer
      linking={{
        prefixes: ["githubexplorer://"],
      }}
      onReady={() => {
        SplashScreen.hideAsync();
      }}
    >
      <RootStack.Navigator
        initialRouteName="Auth"
        screenOptions={{
          headerShown: false,
        }}
      >
        {!signedIn && <RootStack.Screen name="Auth" component={LoginScreen} />}
        {signedIn && (
          <>
            <RootStack.Screen name="HomeTabs" component={HomeTabs} />
            <RootStack.Screen
              name="RepoDetails"
              component={RepoDetailsScreen}
              options={{ headerShown: true }}
            />
            <RootStack.Screen
              name="*"
              options={{ title: "Not Found", headerShown: true }}
              component={NotFound}
            />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
