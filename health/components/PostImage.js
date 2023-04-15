import React from "react";
import { View, Image, StyleSheet } from "react-native";

const PostImage = ({ imageUrl }) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  image: {
    width: "100%",
    height: "100%",
    opacity: 0.8,
  },
});

export default PostImage;
