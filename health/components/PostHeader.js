import React from "react";
import { View, Text, StyleSheet } from "react-native";

const PostHeader = ({ title }) => {
  return (
    <View style={styles.postHeader}>
      {/* <Text style={styles.title}>{title}</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  postHeader: {
    padding: 10,
    position: "absolute",
    // bottom: 130,
    // left: 10,
    // right: 10,
    zIndex: 999,
  },
  title: {
    fontWeight: "bold",
    fontSize: 36,
    color: "white",
  },
});

export default PostHeader;
