import React from "react";
import { View, StyleSheet, Text } from "react-native";

const PostFooter = ({ createdAt, description, contentWidth, title }) => {
  return (
    <View style={styles.postFooter}>
      <Text style={styles.captionHeader}>{title}</Text>
      <Text style={styles.date}> {createdAt}</Text>
      <Text style={styles.caption}> {description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  postFooter: {
    width: 300,
    padding: 10,
    position: "absolute",
    bottom: 30,
    left: 10,
    right: 10,
    color: "white",
    zIndex: 999,
  },
  caption: {
    fontSize: 15,
    marginBottom: 80,
    color: "white",
  },
  date: {
    fontSize: 12,
    marginBottom: 10,
    color: "white",
  },
  captionHeader: {
    fontWeight: "bold",
    fontSize: 26,
    color: "white",
    marginBottom: 10,
  },
});

export default PostFooter;
