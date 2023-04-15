import React from "react";
import { View, Text, StyleSheet } from "react-native";

const PostHeader = ({ title }) => {
  return (
    <View style={styles.postHeader}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  postHeader: {
    alignItems: "center",
    padding: 10,
    position: "absolute",
    top: 100,
    left: 10,
    right: 10,
    zIndex: 999,
  },
  title: {
    fontWeight: "bold",
    fontSize: 36,
    color: "white",
  },
});

export default PostHeader;
