import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Video from "react-native-video";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const VideoDetailScreen = ({ route }) => {
  const { video, userId } = route.params;
  const navigation = useNavigation();

  const handleBackButton = () => {
    navigation.navigate("Profile", { userId: userId });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackButton}>
        <Icon name="arrow-back" size={30} color="white" />
      </TouchableOpacity>
      <Video
        source={{
          uri: video.videoUrl,
        }}
        resizeMode="cover"
        style={styles.video}
        repeat
        muted
      />
      <Text style={styles.title}>{video.name}</Text>
      <Text style={styles.description}>{video.description}</Text>
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
    position: "absolute",
    top: 60,
    left: 30,
    zIndex: 99999,
  },
  video: {
    width: "100%",
    height: 300,
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
