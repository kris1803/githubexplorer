import { StyleSheet, View, Text, RefreshControl } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHome } from "./useHome";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";

export function Home() {
  const { repositories, onPullRefresh } = useHome();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Text>Repositories</Text>
        <FlatList
          style={{ flex: 1, width: "100%" }}
          data={repositories}
          renderItem={(data) => (
            <TouchableOpacity
              style={{
                width: "100%",
                padding: 10,
                gap: 8,
              }}
              onPress={() => {}}
            >
              <Text style={{ fontSize: 20 }}>{data.item.name}</Text>
              <Text>by {data.item.owner.login}</Text>
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={onPullRefresh} />
          }
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
  },
});
