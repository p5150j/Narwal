import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Easing,
} from "react-native";
import { RNCamera } from "react-native-camera";
import { app, db, storage, auth } from "../firebase";
import { getAuth } from "firebase/auth";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { v4 as uuidv4 } from "uuid";

const MakePostScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [videoUri, setVideoUri] = useState(null);
  const cameraRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const spinValue = new Animated.Value(0);

  const navigation = useNavigation();
  const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back);

  const handleRecordButtonPress = async () => {
    try {
      if (cameraRef.current) {
        setIsLoading(true);
        const options = {
          quality: RNCamera.Constants.VideoQuality.high,
          maxDuration: 60,
        };
        cameraRef.current
          .recordAsync(options)
          .then((data) => {
            setVideoUri(data.uri);
            setIsLoading(false);
          })
          .catch((error) => {
            console.log("Failed to record video:", error);
            setIsLoading(false);
          });
      }
    } catch (error) {
      console.log("Failed to record video:", error);
      setIsLoading(false);
    }
  };

  const handleStopButtonPress = () => {
    if (cameraRef.current && cameraRef.current.stopRecording) {
      cameraRef.current.stopRecording();
      setIsLoading(false);
    }
  };

  const handlePostButtonPress = async () => {
    try {
      setIsLoading(true);
      setIsUploading(true);
      if (videoUri && name) {
        const postId = await uploadPost(
          videoUri,
          setIsUploading,
          description,
          name
        ); // Pass description as argument

        console.log("Video URI:", videoUri);
        setName("");
        setVideoUri(null);
        setDescription("");
        navigation.navigate("Home");
      } else {
        console.log("Video or name is missing");
      }
    } catch (error) {
      console.log("Failed to upload post:", error);
      console.log("Video URI:", videoUri);
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  const toggleCameraType = () => {
    setCameraType((prevCameraType) =>
      prevCameraType === RNCamera.Constants.Type.back
        ? RNCamera.Constants.Type.front
        : RNCamera.Constants.Type.back
    );
  };

  const uploadPost = async (videoUri, setIsUploading, description, name) => {
    try {
      if (videoUri) {
        setIsUploading(true);
        const response = await fetch(videoUri);
        const blob = await response.blob();
        const storageRef = ref(storage);
        const videoRef = ref(storageRef, `videos/${uuidv4()}.mp4`);
        await uploadBytes(videoRef, blob);
        const downloadUrl = await getDownloadURL(videoRef);

        // Get the current user
        const currentUser = getAuth().currentUser;

        const videoDoc = {
          videoUrl: downloadUrl,
          description: description || "",
          name: name || "",
          createdAt: new Date().toISOString(),
          uid: currentUser.uid, // Add the user's UID to the post document
        };

        console.log(videoDoc);

        const postsCollectionRef = collection(db, "posts");
        await addDoc(postsCollectionRef, videoDoc);
        setIsUploading(false);
        setVideoUri(null);
        setDescription("");
        setName("");
      } else {
        console.log("No video URI found.");
      }
    } catch (error) {
      console.log("Failed to upload video:", error);
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.camera}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.off}
        type={cameraType}
        androidCameraPermissionOptions={{
          title: "Permission to use camera",
          message: "We need your permission to use your camera",
          buttonPositive: "Ok",
          buttonNegative: "Cancel",
        }}
      />
      <TouchableOpacity
        style={styles.switchCameraButton}
        onPress={toggleCameraType}
      >
        <Icon name="camera-reverse-outline" size={50} color="#FFF" />
      </TouchableOpacity>

      <View style={styles.controlsContainer}>
        <View style={styles.cameraControls}>
          <TouchableOpacity
            style={styles.recordButton}
            onPress={
              isLoading ? handleStopButtonPress : handleRecordButtonPress
            }
          >
            <Icon
              name={isLoading ? "stop" : "videocam"}
              size={30}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {isUploading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : (
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
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  controlsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  cameraControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  recordButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#ff0000",
    justifyContent: "center",
    alignItems: "center",
  },
  postContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
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

  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 8,
  },
  switchCameraButton: {
    position: "absolute",
    top: 100,
    right: 50,
  },
});

export default MakePostScreen;
