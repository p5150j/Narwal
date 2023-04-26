import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const ActionBar = ({
  onCommentPress,
  onLikePress,
  onAvatarPress,
  avatarUrl,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onAvatarPress} style={styles.iconContainer}>
        <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onLikePress} style={styles.iconContainer}>
        <Icon name="heart-outline" size={35} color="#FFF" />
        <Text style={styles.iconText}>123</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onCommentPress} style={styles.iconContainer}>
        <Icon name="chatbubble-outline" size={35} color="#FFF" />
        <Text style={styles.iconText}>42</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 15,
    bottom: 200,
    alignItems: "center",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 25,
  },
  iconText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: "#FFF",
    borderWidth: 2,
  },
});

export default ActionBar;
