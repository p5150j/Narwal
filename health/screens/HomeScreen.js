import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  getDocs,
  orderBy,
  where,
} from "firebase/firestore";
import PostHeader from "../components/PostHeader";
import AdOverlay from "../components/AdOverlay";
import PostImage from "../components/PostImage";
import PostFooter from "../components/PostFooter";
import Purchases from "react-native-purchases";
import Video from "react-native-video";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import HapticFeedback from "react-native-haptic-feedback";
import ActionBar from "../components/ActionBar";
import BlurryContainer from "../components/BlurryContainer";

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  // const postsRef = collection(db, "posts");
  const postsQuery = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc")
  );

  const { width, height } = useWindowDimensions();
  const [viewableItems, setViewableItems] = useState([]);
  const [ads, setAds] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const flatListRef = useRef(null);
  const [adPlaying, setAdPlaying] = useState(false);
  const [dataWithAds, setDataWithAds] = useState([]);
  const [adPlayedIds, setAdPlayedIds] = useState([]);

  const enableScrolling = () => {
    if (flatListRef.current) {
      flatListRef.current.setNativeProps({ scrollEnabled: true });
    }
  };
  const setupPurchases = async () => {
    try {
      await Purchases.setup("sk_OdEGBmHNqfqMfimPHzlkgHQTWFXvf");
      // console.log("Purchases SDK initialized successfully");
    } catch (e) {
      // console.log("Error initializing Purchases SDK", e);
    }
  };
  const triggerHapticFeedback = () => {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    };
    HapticFeedback.trigger("rigid", options);
  };

  const prepareDataWithAds = (data, ads) => {
    const newData = [...data];
    let adIndex = 0;
    for (let i = 1; i <= newData.length; i++) {
      if (i % 4 === 0 && ads.length > 0) {
        newData.splice(i, 0, { ...ads[adIndex % ads.length], isAd: true });
        adIndex++;
      }
    }
    return newData;
  };

  useEffect(() => {
    setupPurchases();
    const unsubscribe = onSnapshot(postsQuery, (querySnapshot) => {
      const postList = [];
      querySnapshot.forEach((doc) => {
        postList.push({ ...doc.data(), id: doc.id });
      });
      setPosts(postList);
    });

    const adsRef = collection(db, "advertisements");
    const unsubscribeAds = onSnapshot(adsRef, (querySnapshot) => {
      const adsList = [];
      querySnapshot.forEach((doc) => {
        adsList.push({ ...doc.data(), id: doc.id });
      });
      setAds(adsList);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (posts.length > 0 && ads.length > 0) {
      setDataWithAds(prepareDataWithAds(posts, ads));
    } else {
      setDataWithAds(posts);
    }
  }, [posts, ads]);

  const handleAdEnd = (adId) => {
    setIsAdPlaying(false);
    setCurrentAdIndex((prevIndex) => prevIndex + 1);
    setAdPlayedIds((prevAdPlayedIds) => [...prevAdPlayedIds, adId]);
    setDataWithAds((prevData) =>
      prevData.filter((item) => !item.isAd || item.id !== adId)
    );
  };

  useEffect(() => {
    setIsAdPlaying(false);
  }, [currentAdIndex]);

  const PostVideo = ({
    videoUrl,
    id,
    autoplay,
    isAd,
    isInView,
    flatListRef,
    handleAdEnd,
  }) => {
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(true);
    const [adPlayed, setAdPlayed] = useState(false);

    const handleLoadStart = () => {
      setLoading(true);
    };

    const handleLoad = () => {
      setLoading(false);
    };

    const handleProgress = () => {
      setLoading(false);
    };

    const handleEnd = () => {
      // console.log("Ad video has ended");
      if (isAd) {
        if (typeof handleAdEnd === "function") {
          handleAdEnd(id); // Pass the adId as a parameter
        }
      }
    };

    return (
      <View style={styles.container}>
        <Video
          source={{ uri: videoUrl }}
          style={styles.video}
          resizeMode="cover"
          paused={!isInView || !isFocused || (isAd && adPlayedIds.includes(id))}
          repeat={!isAd}
          onLoadStart={handleLoadStart}
          onLoad={handleLoad}
          onProgress={handleProgress}
          onEnd={handleEnd}
        />
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFF" />
          </View>
        )}
      </View>
    );
  };

  const renderItem = ({ item, index }) => {
    const isInView = viewableItems.includes(item.id);
    const isAd = item.isAd;

    if (item.isAd) {
      return (
        <View style={[styles.postContainer, { width, height }]} key={item.id}>
          <PostHeader />
          <PostVideo
            videoUrl={item.videoUrl}
            id={item.id}
            isInView={isInView}
            isAd={true}
            flatListRef={flatListRef}
            handleAdEnd={handleAdEnd} // Add this line
          />
          <AdOverlay />
        </View>
      );
    } else {
      return (
        <View style={[styles.postContainer, { width, height }]} key={item.id}>
          {item.imageUrl && <PostImage imageUrl={item.imageUrl} />}
          {item.videoUrl && (
            <PostVideo
              videoUrl={item.videoUrl}
              id={item.id}
              isInView={isInView}
              isAd={false}
              flatListRef={flatListRef}
              enableScrolling={enableScrolling}
            />
          )}
          <PostFooter
            description={item.description}
            contentWidth={width}
            createdAt={item.createdAt}
            title={item.name}
          />
          <ActionBar
            avatarUrl="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50"
            // onCommentPress={() => console.log("Comment Pressed")}
            // onLikePress={() => console.log("Like Pressed")}
            // onAvatarPress={() => console.log("Avatar Pressed")}
          />
          <BlurryContainer
            item={item}
            onPress={() => console.log("BlurryContainer Pressed")}
          />
        </View>
      );
    }
  };

  const onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
    const ids = viewableItems.map((item) => item.item.id);
    setViewableItems(ids);

    if (changed && changed.length > 0) {
      changed.forEach((change) => {
        if (change.isViewable) {
          triggerHapticFeedback();
          if (change.item.isAd) {
            setIsAdPlaying(true);
          }
        }
      });
    }
    // console.log("Viewable items:", viewableItems); // Keep this line
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={dataWithAds}
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
        scrollEnabled={!isAdPlaying}
        maxToRenderPerBatch={10}
        // keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
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
