import { StyleSheet } from "react-native";
import { Image } from "expo-image";

type ImageViewerProps = {
  imageSrc: string;
};

export default function ImageViewer({ imageSrc }: ImageViewerProps) {
  return <Image source={imageSrc} style={styles.image} />;
}

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
});