import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Video from "react-native-video";

const ReviewPostScreen = ({ navigation, route }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { videoUri, uploadPost } = route.params;

  const handlePostButtonPress = async () => {
    try {
      setIsLoading(true);
      if (videoUri && name) {
        await uploadPost(videoUri, description, name);
        setName("");
        setDescription("");
        navigation.navigate("Home");
      } else {
        console.log("Video or name is missing");
      }
    } catch (error) {
      console.log("Failed to upload post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: videoUri }}
        style={styles.video}
        resizeMode="contain"
        repeat={true}
        paused={false}
      />
      <View style={styles.postContainer}>
        <Text style={styles.inputLabel}>Name</Text>
        <TextInput
          style={styles.nameInput}
          placeholder="Enter name"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <Text style={styles.inputLabel}>Description</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="Enter description"
          placeholderTextColor="#aaa"
          value={description}
          onChangeText={(text) => setDescription(text)}
        />
        <TouchableOpacity
          style={styles.postButton}
          onPress={handlePostButtonPress}
        >
          <Text style={styles.postButtonText}>Upload Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "100%",
    height: 300,
  },
  postContainer: {
    width: "90%",
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 16,
  },
  inputLabel: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  nameInput: {
    width: "100%",
    height: 40,
    borderRadius: 8,
    borderColor: "#000",
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 12,
    color: "#000",
  },
  descriptionInput: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    borderColor: "#000",
    borderWidth: 1,
    paddingHorizontal: 8,
    textAlignVertical: "top",
    marginBottom: 16,
    color: "#000",
  },
  postButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  postButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ReviewPostScreen;
