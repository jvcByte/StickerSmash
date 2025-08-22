import { Text, View, StyleSheet } from "react-native";

export default function AboutScreen() {
  return (
    <View style={styles.container} >
      <Text style={styles.text}>About Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(235, 255, 230)",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
