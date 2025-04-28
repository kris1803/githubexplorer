import { StyleProp, TextStyle } from "react-native";
import { TextInput } from "react-native-gesture-handler";

type Props = {
  onInput: (text: string) => void;
  placeholder: string;
  style?: TextStyle;
};

export function SearchInput({
  onInput,
  placeholder,
  style,
}: Props): React.JSX.Element {
  return (
    <TextInput
      style={{
        width: "90%",
        padding: 5,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#ddd",
        ...style,
      }}
      placeholder={placeholder}
      onChangeText={onInput}
    />
  );
}
