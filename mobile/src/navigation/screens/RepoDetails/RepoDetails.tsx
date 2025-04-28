import { View, StyleSheet, Text, Dimensions } from "react-native";
import { RepoDetailsProps, useRepoDetails } from "./useRepoDetails";
import { LineChart } from "react-native-gifted-charts";

export function RepoDetailsScreen(props: RepoDetailsProps) {
  const { repo, weeklyCommitCount } = useRepoDetails(props);
  const dim = Dimensions.get("window");

  return (
    <View style={styles.container}>
      {!repo && !weeklyCommitCount ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <Text>Repository {repo?.name}</Text>
          {!!weeklyCommitCount && (
            <>
              <LineChart
                data={weeklyCommitCount.all.map((value) => ({ value }))}
                width={dim.width}
                spacing={(dim.width - 50) / weeklyCommitCount.all.length}
                initialSpacing={0}
                thickness={1}
                color="red"
              />
              <Text>Commit count per week during 52 weeks (approx year)</Text>
            </>
          )}
          <Text style={{ marginTop: 20 }}>
            {"Last pushed at "}
            {repo ? new Date(repo.pushed_at).toLocaleDateString() : "..."}
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
    paddingTop: 10,
  },
});
