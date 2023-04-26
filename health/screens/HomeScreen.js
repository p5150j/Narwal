import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import PostHeader from "../components/PostHeader";
import PostImage from "../components/PostImage";
import PostFooter from "../components/PostFooter";
import Purchases from "react-native-purchases";
import Video from "react-native-video";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import HapticFeedback from "react-native-haptic-feedback";
import ActionBar from "../components/ActionBar";

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const postsRef = collection(db, "posts");
  const { width, height } = useWindowDimensions();
  const [viewableItems, setViewableItems] = useState([]);

  const setupPurchases = async () => {
    try {
      await Purchases.setup("sk_OdEGBmHNqfqMfimPHzlkgHQTWFXvf");
      console.log("Purchases SDK initialized successfully");
    } catch (e) {
      console.log("Error initializing Purchases SDK", e);
    }
  };
  const triggerHapticFeedback = () => {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    };
    HapticFeedback.trigger("rigid", options);
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

  const PostVideo = ({ videoUrl, id }) => {
    const isFocused = useIsFocused();
    const isInView = viewableItems.includes(id);
    const [loading, setLoading] = useState(true);

    const handleLoadStart = () => {
      setLoading(true);
    };

    const handleLoad = () => {
      setLoading(false);
    };

    return (
      <View style={styles.container}>
        <Video
          source={{ uri: videoUrl }}
          style={styles.video}
          resizeMode="cover"
          paused={!isInView || !isFocused}
          repeat={true}
          onLoadStart={handleLoadStart}
          onLoad={handleLoad}
        />
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFF" />
          </View>
        )}
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <View style={[styles.postContainer, { width, height }]} key={item.id}>
      <PostHeader title={item.name} />
      {item.imageUrl && <PostImage imageUrl={item.imageUrl} />}
      {item.videoUrl && <PostVideo videoUrl={item.videoUrl} id={item.id} />}
      <PostFooter
        description={item.description}
        contentWidth={width}
        createdAt={item.createdAt}
        title={item.name}
      />
      <ActionBar
        avatarUrl="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50"
        onCommentPress={() => console.log("Comment Pressed")}
        onLikePress={() => console.log("Like Pressed")}
        onAvatarPress={() => console.log("Avatar Pressed")}
      />
    </View>
  );

  const onViewableItemsChanged = React.useRef(({ viewableItems, changed }) => {
    const ids = viewableItems.map((item) => item.item.id);
    setViewableItems(ids);

    if (changed && changed.length > 0) {
      changed.forEach((change) => {
        if (change.isViewable) {
          triggerHapticFeedback();
        }
      });
    }
  }).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        snapToAlignment="start"
        decelerationRate={"fast"}
        removeClippedSubviews={true}
        snapToInterval={Dimensions.get("window").height}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        initialNumToRender={10}
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
  video: {
    width: "100%",
    height: "100%",
    opacity: 0.8,
  },
  videoContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
});

export default HomeScreen;
