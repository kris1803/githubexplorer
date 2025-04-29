import { Text } from "@react-navigation/elements";
import { Button, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { useLogin } from "./useLogin";

export function LoginScreen() {
  const { promptAsync, request } = useLogin();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safearea}>
        <Text style={{ fontSize: 20 }}>Github Explorer</Text>
        <Button
          title="Login"
          accessibilityLabel="Login"
          onPress={() => promptAsync()}
          disabled={!request}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safearea: {
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
});
