import React from "react";
import { View, StyleSheet } from "react-native";
import VideoPlayer from "react-native-video-controls";

const PostVideo = ({
  videoUrl,
  isPlaying,
  videoRef,
  handleVideoPress,
  autoPlay,
}) => {
  return (
    <View style={styles.container}>
      <VideoPlayer
        ref={videoRef}
        source={{ uri: videoUrl }}
        style={styles.video}
        paused={!autoPlay && !isPlaying}
        resizeMode="cover"
        tapAnywhereToPause={true}
        repeat={true}
        autoPlay={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: "100%",
    opacity: 0.8,
  },
});

export default PostVideo;
