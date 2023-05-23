import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Easing,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { RNCamera } from "react-native-camera";
import { app, db, storage, auth } from "../firebase";
import { getAuth } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { v4 as uuidv4 } from "uuid";
import Video from "react-native-video";
import HapticFeedback from "react-native-haptic-feedback";
import { launchImageLibrary } from "react-native-image-picker";

const { height: screenHeight } = Dimensions.get("window");

const MakePostScreen = () => {
  const pickVideo = () => {
    const options = {
      mediaType: "video",
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      console.log(response); // printing the whole response

      if (response.didCancel) {
        console.log("User cancelled video picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.assets && response.assets.length > 0) {
        // Video was selected
        const source = response.assets[0].uri;
        if (source && source !== "") {
          setVideoUri(source); // using the existing setVideoUri
          setShowVideoPreview(true);
        } else {
          console.warn("Video source is empty");
        }
      }
    });
  };

  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [videoUri, setVideoUri] = useState(null);
  const cameraRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const [showFormOverlay, setShowFormOverlay] = useState(false);
  const spinValue = new Animated.Value(0);
  const navigation = useNavigation();
  const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back);
  const [uploadProgress, setUploadProgress] = useState(0);
  const postContainerAnim = useRef(new Animated.Value(-screenHeight)).current;

  const scale = useRef(new Animated.Value(1)).current;

  const [isLoadingSelected, setIsLoadingSelected] = useState(false);

  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.4,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
        { iterations: -1 }
      ).start();
    } else {
      Animated.timing(scale, {
        toValue: 1,
        duration: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [isLoading]);

  const handleRecordButtonPress = async () => {
    try {
      if (cameraRef.current) {
        setIsLoading(true);
        HapticFeedback.trigger("impactLight");
        const options = {
          quality: RNCamera.Constants.VideoQuality.high,
          maxDuration: 60,
        };
        cameraRef.current
          .recordAsync(options)
          .then((data) => {
            setVideoUri(data.uri);
            console.log(data.uri);
            setIsLoading(false);
            setShowVideoPreview(true);
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
      console.log("stopped");
    }
  };

  const handlePostButtonPress = async () => {
    try {
      setIsLoading(true);
      console.log("videoUri:", videoUri);
      console.log("name:", name);
      console.log("description:", description);
      if (videoUri && name && description) {
        const downloadUrl = await uploadVideo(videoUri);
        await createPost(downloadUrl, name, description);
        setName("");
        setVideoUri(null);
        setDescription("");
        setShowFormOverlay(false);
        setShowVideoPreview(false);
      } else {
        console.log("Video, name, or description is missing");
      }
    } catch (error) {
      console.log("Failed to upload post:", error);
      console.log("Video URI:", videoUri);
    } finally {
      setIsLoading(false);
      navigation.navigate("Home");
    }
  };

  const uploadVideo = async (videoUri) => {
    setIsUploading(true);
    const videoFileName = videoUri.substring(videoUri.lastIndexOf("/") + 1);
    const storageInstance = getStorage(app);
    const reference = ref(
      storageInstance,
      `videos/${videoFileName}${uuidv4()}.mp4`
    );

    const response = await fetch(videoUri);
    const blob = await response.blob();
    const task = uploadBytesResumable(reference, blob);
    task.on("state_changed", (taskSnapshot) => {
      const progress =
        (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100;
      setUploadProgress(progress);
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`
      );
    });

    try {
      await task;
      const url = await getDownloadURL(reference);
      console.log("Video URL:", url);
      setIsUploading(false);
      return url;
    } catch (error) {
      console.error("Failed to upload video:", error);
      setIsUploading(false);
      throw error;
    }
  };

  const createPost = async (videoUrl, name, description) => {
    const uid = getAuth().currentUser.uid;
    const newPost = {
      videoUrl,
      name,
      description,
      createdAt: new Date().toISOString(),
      uid,
    };
    const postsCollectionRef = collection(db, "posts");
    const docRef = await addDoc(postsCollectionRef, newPost); // Now docRef is the reference to the new document

    // Create a "likes" sub-collection for the new post
    const likesCollectionRef = collection(docRef, "likes");
    console.log('Created a "likes" sub-collection for the post', docRef.id);
  };

  const toggleCameraType = () => {
    setCameraType((prevCameraType) =>
      prevCameraType === RNCamera.Constants.Type.back
        ? RNCamera.Constants.Type.front
        : RNCamera.Constants.Type.back
    );
  };

  const handleDiscard = () => {
    setShowVideoPreview(false);
    setVideoUri(null);
  };

  const handleAccept = () => {
    setShowFormOverlay(true);
  };

  const handleCloseForm = () => {
    setShowFormOverlay(false);
  };

  return (
    <View style={styles.container}>
      {!showVideoPreview && (
        <>
          <RNCamera
            ref={cameraRef}
            style={styles.camera}
            // type={RNCamera.Constants.Type.back}
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
            <Icon name="camera-reverse-outline" size={40} color="#FFF" />
          </TouchableOpacity>
        </>
      )}

      {showVideoPreview && (
        <View style={styles.videoPreview}>
          <Video
            source={{ uri: videoUri }}
            style={styles.video}
            resizeMode="contain"
            controls={true}
            autoplay={true}
            loop={true}
            style={{ width: "100%", aspectRatio: 9 / 16 }}
          />
          {!showFormOverlay && (
            <View style={styles.previewControls}>
              <TouchableOpacity
                style={styles.discardButton}
                onPress={handleDiscard}
              >
                <Icon name="close-outline" size={40} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={handleAccept}
              >
                <Icon name="checkmark-circle-outline" size={40} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
      <View style={styles.controlsContainer}>
        {!showVideoPreview && (
          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={styles.pickVideoButton}
              onPress={pickVideo}
            >
              {/* <Text style={styles.buttonText}>Pick Video</Text> */}
              <Icon name="albums-outline" size={60} color="#fff" />
            </TouchableOpacity>
            <Animated.View style={{ transform: [{ scale }] }}>
              <TouchableOpacity
                style={[
                  styles.recordButton,
                  isLoading ? styles.recording : styles.notRecording,
                ]}
                onPress={
                  isLoading ? handleStopButtonPress : handleRecordButtonPress
                }
              >
                {isLoading && <Icon name="stop" size={30} color="#fff" />}
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}

        {isUploading ? (
          <View style={styles.loadingWrapper}>
            <View style={styles.loadingContainer}>
              <Text style={styles.uploadLabel}>
                {uploadProgress.toFixed(1)}%
              </Text>
            </View>
          </View>
        ) : (
          showFormOverlay && (
            <View style={styles.postContainer}>
              <TouchableOpacity
                style={styles.discardButton}
                onPress={handleCloseForm}
              >
                <Icon name="close-outline" size={40} color="#fff" />
              </TouchableOpacity>
              {/* <Text style={styles.inputLabel}>Name</Text> */}
              <TextInput
                style={styles.nameInput}
                placeholder="Enter name"
                placeholderTextColor="#aaa"
                value={name}
                onChangeText={(text) => setName(text)}
              />
              {/* <Text style={styles.inputLabel}>Description</Text> */}
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
                <Text style={styles.postButtonText}>Upload</Text>
              </TouchableOpacity>
            </View>
          )
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
  videoPreview: {
    flex: 1,
    width: "100%",
    top: 100,
    position: "absolute", // Add this line
  },

  previewControls: {
    position: "absolute",
    bottom: 100,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%", // Add this line
  },

  controlsContainer: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    // padding: 12,
  },
  cameraControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 46,
  },
  recordButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#ff0000",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.8,
  },

  notRecording: {
    backgroundColor: "#ff0000",
    borderWidth: 2,
    borderColor: "#fff",
  },
  recording: {
    backgroundColor: "#ff0000",
    // borderWidth: 2,
    // borderColor: "#fff",
  },

  postContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 22,

    backgroundColor: "#d3d3d3",
    // backgroundColor: "#3a3a3b",
    borderRadius: 34,
    padding: 16,
  },
  inputLabel: {
    color: "#bdbdbd",
    // fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
    padding: 15,
  },
  nameInput: {
    padding: 24,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 34,
    width: "100%",
    marginBottom: 15,
    color: "black",
    marginTop: 50,
  },
  descriptionInput: {
    padding: 24,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 34,
    width: "100%",
    marginBottom: 15,
    color: "black",
    marginTop: 50,
  },
  postButton: {
    backgroundColor: "#252526",
    borderRadius: 34,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 120,
    marginTop: 50,
    width: "100%",
  },
  postButtonText: {
    color: "#bdbdbd",
    fontSize: 16,
  },
  switchCameraButton: {
    position: "absolute",
    top: 55,
    right: 30,
  },

  pickVideoButton: {
    position: "absolute",
    top: 0,
    right: 30,
  },
  discardButton: {
    marginRight: 16,
    padding: 10,
    backgroundColor: "#BB000E",
    borderRadius: 30,
  },
  acceptButton: {
    marginLeft: 16,
    padding: 10,
    backgroundColor: "#009200",
    borderRadius: 30,
  },
  videoControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#1e1e1e",
    borderRadius: 84,
  },
  loadingWrapper: {
    position: "absolute",
    top: -600,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadLabel: {
    color: "tomato",
    fontSize: 20,
  },
});

export default MakePostScreen;
