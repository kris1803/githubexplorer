import { StyleSheet, View, Text, RefreshControl } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHome } from "./useHome";
import {
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native-gesture-handler";

export function Home() {
  const {
    repositories,
    onPullRefresh,
    handleRepositoryClick,
    onInput,
    isRefreshing,
  } = useHome();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Text style={{ fontSize: 20, marginTop: 10 }}>Repositories</Text>
        <TextInput
          style={{
            width: "90%",
            padding: 5,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "#ddd",
          }}
          placeholder="Search by name..."
          onChangeText={onInput}
        />
        {isRefreshing && <Text>Loading...</Text>}
        <FlatList
          style={{ flex: 1, width: "100%" }}
          data={repositories}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={{
                width: "100%",
                paddingHorizontal: 10,
                paddingVertical: 20,
                gap: 5,
                borderStyle: "solid",
                borderColor: "#ddd",
                borderTopWidth: index === 0 ? 1 : undefined,
                borderBottomWidth: 1,
              }}
              key={item.name}
              onPress={() => handleRepositoryClick(item.name)}
            >
              <Text style={{ fontSize: 20 }}>{item.name}</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text>by {item.owner.login}</Text>
                <Text style={{ fontWeight: 600 }}>
                  {item.private ? "Private" : "Public"}
                </Text>
              </View>
              <View>
                <Text>Stars: {item.stargazers_count}</Text>
                <Text>Lang: {item.language}</Text>
              </View>
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
