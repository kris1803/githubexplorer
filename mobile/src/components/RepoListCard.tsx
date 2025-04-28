import { TouchableOpacity, View, Text } from "react-native";
import type { GitRepository } from "../services/types";

type Props = {
  index: number;
  item: GitRepository;
  handleClick: (name: string) => void;
};
export function RepoListCard({
  index,
  item,
  handleClick,
}: Props): React.JSX.Element {
  return (
    <>
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
        onPress={() => handleClick(item.name)}
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
    </>
  );
}
