import { StyleSheet, View, Text, RefreshControl } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHome } from "./useHome";
import {
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { RepoListCard } from "../../../components/RepoListCard";
import { SearchInput } from "../../../components/SearchInput";

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
        <SearchInput onInput={onInput} placeholder="Search by name..." />
        {isRefreshing && <Text>Loading...</Text>}
        <FlatList
          style={{ flex: 1, width: "100%" }}
          data={repositories}
          renderItem={({ item, index }) => (
            <RepoListCard
              handleClick={handleRepositoryClick}
              index={index}
              item={item}
            />
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
