import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  Dimensions,
} from "react-native";
import { db } from "./firebase";
import { collection, onSnapshot } from "firebase/firestore";
import Purchases from "react-native-purchases";
import PostHeader from "./components/PostHeader";
import PostImage from "./components/PostImage";
import PostVideo from "./components/PostVideo";
import PostFooter from "./components/PostFooter";

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const postsRef = collection(db, "posts");
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);
  const { width, height } = useWindowDimensions();

  const handleVideoPress = () => {
    console.log("videoRef", videoRef.current);
    console.log("isPlaying", isPlaying);
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const setupPurchases = async () => {
    try {
      await Purchases.setup("sk_OdEGBmHNqfqMfimPHzlkgHQTWFXvf");
      console.log("Purchases SDK initialized successfully");
    } catch (e) {
      console.log("Error initializing Purchases SDK", e);
    }
  };

  useEffect(() => {
    setupPurchases();
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
    <View style={[styles.postContainer, { width, height }]} key={item.id}>
      <PostHeader title={item.name} />
      {item.imageUrl && <PostImage imageUrl={item.imageUrl} />}
      {item.videoUrl && (
        <PostVideo
          videoUrl={item.videoUrl}
          isPlaying={isPlaying}
          videoRef={videoRef}
          handleVideoPress={handleVideoPress}
        />
      )}

      <PostFooter
        description={item.description}
        contentWidth={width}
        createdAt={item.createdAt}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black ",
  },
  postContainer: {
    marginBottom: 0,

    overflow: "hidden",
  },
});

export default HomeScreen;
