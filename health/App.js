import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  useWindowDimensions,
  Button,
  TouchableOpacity,
} from "react-native";
import { db } from "./firebase";
import { collection, onSnapshot } from "firebase/firestore";
import HTML from "react-native-render-html";
import { Video, ResizeMode } from "expo-av";

const App = () => {
  const [posts, setPosts] = useState([]);

  const postsRef = collection(db, "posts");
  const { width } = useWindowDimensions();

  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});

  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handleVideoPress = () => {
    console.log("videoRef", videoRef.current);
    console.log("isPlaying", isPlaying);
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pauseAsync();
      } else {
        videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(postsRef, (querySnapshot) => {
      const postList = [];
      querySnapshot.forEach((doc) => {
        postList.push({ ...doc.data(), id: doc.id });
      });
      setPosts(postList);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.postContainer}>
      <View style={styles.postInfo}>
        <Text style={styles.postName}>{item.name}</Text>
        {/* <Text style={styles.postDescription}>{item.description}</Text> */}
        <HTML contentWidth={width} source={{ html: item.description }} />

        {item.imageUrl && (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.postImage}
            resizeMode="contain"
          />
        )}

        {item.videoUrl && (
          <TouchableOpacity onPress={handleVideoPress}>
            <Video
              ref={videoRef}
              source={{ uri: item.videoUrl }}
              style={styles.postVideo}
              resizeMode="contain"
              useNativeControls={true}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 60,
  },
  postContainer: {},
  postInfo: {
    flex: 1,
  },
  postName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  postDescription: {
    marginBottom: 8,
  },
  postImage: {
    width: 400,
    height: 400,

    // resizeMode: "contain",
    marginBottom: 8,
  },
  postVideo: {
    width: 400,
    height: 225,
  },
});

export default App;
