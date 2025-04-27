import { Button, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { useSettings } from "./useSettings";

export function Settings() {
  const { handleLogout } = useSettings();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safearea}>
        <Button title="Logout" onPress={handleLogout} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safearea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
});
