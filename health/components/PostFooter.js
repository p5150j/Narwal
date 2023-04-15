import React from "react";
import { View, StyleSheet, Text } from "react-native";
import HTML from "react-native-render-html";

const PostFooter = ({ createdAt, description, contentWidth }) => {
  return (
    <View style={styles.postFooter}>
      <Text style={styles.caption}>
        {" "}
        {createdAt.toDate().toLocaleDateString()}
      </Text>
      <Text style={styles.caption}> {description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  postFooter: {
    padding: 10,
    position: "absolute",
    bottom: 70,
    left: 10,
    right: 10,
    color: "white",
  },
  caption: {
    fontSize: 16,
    marginBottom: 10,
    color: "white",
  },
});

export default PostFooter;
