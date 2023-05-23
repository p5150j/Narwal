import React from "react";
import { View, Text } from "react-native";
import PostHeader from "../components/PostHeader";

const FeedScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <PostHeader />
    </View>
  );
};

export default FeedScreen;
