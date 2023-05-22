import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Video from "react-native-video";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const VideoDetailScreen = ({ route }) => {
  const { video, post } = route.params;
  const selectedPost = post || video;
  const navigation = useNavigation();

  const handleBackButton = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackButton}>
        <Icon name="arrow-back" size={30} color="white" />
      </TouchableOpacity>
      <Video
        source={{
          uri: selectedPost.videoUrl,
        }}
        resizeMode="cover"
        style={styles.video}
        repeat
        muted
      />
      <Text style={styles.title}>{selectedPost.name}</Text>
      <Text style={styles.description}>{selectedPost.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#252526",
    alignItems: "center",
  },
  backButton: {
    backgroundColor: "#252526",
    borderRadius: 40,
    padding: 24,
    zIndex: 99,
    position: "absolute",
    top: 80, // Adjust the value according to your preference
    left: 20, // Adjust the value according to your preference
  },
  video: {
    width: "100%",
    height: "100%",
    opacity: 0.8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e9e9e9",
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: "#e9e9e9",
    textAlign: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },
});

export default VideoDetailScreen;
