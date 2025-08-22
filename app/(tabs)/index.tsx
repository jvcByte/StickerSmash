import { View, StyleSheet } from "react-native";
import { useState } from "react";
import ImageViewer from "../../components/ImageViewer";
import Button from "../../components/Button";
import * as ImagePicker from "expo-image-picker";

const icon = require("../../assets/images/icon.png");

export default function Index() {
  const [image, setImage] = useState<string | undefined>(
    undefined
  );

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    } else {
      alert("No image selected");
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer imageSrc={image || icon} />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          label="Choose a Photo"
          theme="primary"
          onPress={pickImageAsync}
        />
        <Button
          label="Share this photo"
          theme="secondary"
          onPress={() => alert("Share this photo")}
        />
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
    marginBottom: 10,
  },

  buttonContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
