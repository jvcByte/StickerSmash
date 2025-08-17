import { View, StyleSheet } from "react-native";
import ImageViewer from "../../components/ImageViewer";
import Button from "../../components/Button";

const icon = require("../../assets/images/icon.png");

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer imageSrc={icon} />
      </View>

      <View style={styles.buttonContainer}>
        <Button label="Choose a Photo" theme="primary" />
        <Button label="Share this photo" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(235, 255, 230)",
  },

  imageContainer: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 18,
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },

  buttonContainer: {
    flex: 1 / 3,
    alignItems: "center",
    justifyContent: "center",
  },
});
