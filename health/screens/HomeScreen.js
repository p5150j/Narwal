import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  Dimensions,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
} from "react-native";
import { db, auth } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  getDocs,
  orderBy,
  where,
  getDoc,
  doc,
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
import Comments from "../components/Comments";

const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  // const postsRef = collection(db, "posts");
  const postsQuery = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc")
  );

  // const postsQuery = query(
  //   collection(db, "posts"),
  //   orderBy("likesCount", "asc")
  // );

  const [followedUsers, setFollowedUsers] = useState([]);
  const currentUser = auth.currentUser;

  const fetchFollowedUsers = async () => {
    const userId = auth.currentUser ? auth.currentUser.uid : "";
    const followingsRef = collection(db, "users", userId, "Followings");
    const followingsSnapshot = await getDocs(followingsRef);
    const users = followingsSnapshot.docs.map((doc) => doc.id);
    // console.log(users);

    setFollowedUsers(users);
    fetchFeedVideos(users);
  };

  const [feedVideos, setFeedVideos] = useState([]);
  const fetchFeedVideos = async (followedUsers) => {
    // console.log("fetchFeedVideos called with:", followedUsers);
    const FollowedPosts = [];

    for (const userId of followedUsers) {
      const userPostsRef = collection(db, "posts");
      const q = query(userPostsRef, where("uid", "==", userId));

      const userPostsSnapshot = await getDocs(q);

      const userDoc = await getDoc(doc(db, "users", userId));
      const userData = userDoc.data();

      // userPostsSnapshot.docs.forEach((doc) => {
      //   const postData = { id: doc.id, ...doc.data() };
      //   // console.log("Post Data:", postData);
      //   FollowedPosts.push(postData);
      // });

      userPostsSnapshot.docs.forEach((doc) => {
        const postData = { id: doc.id, ...doc.data(), user: userData };
        FollowedPosts.push(postData);
      });
    }

    // console.log("All Followed posts:", FollowedPosts);
    if (FollowedPosts.length > 0 && ads.length > 0) {
      setFeedVideos(prepareDataWithAds(FollowedPosts, ads));
    } else {
      setFeedVideos(FollowedPosts);
    }
  };

  useEffect(() => {
    fetchFollowedUsers();
  }, []);

  const [isFollowingFeed, setIsFollowingFeed] = useState(true);

  const handleFeedSwitch = () => {
    setIsFollowingFeed((prevState) => !prevState);
  };

  const { width, height } = useWindowDimensions();
  const [viewableItems, setViewableItems] = useState([]);
  const [ads, setAds] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const flatListRef = useRef(null);
  const [adPlaying, setAdPlaying] = useState(false);
  const [dataWithAds, setDataWithAds] = useState([]);
  const [adPlayedIds, setAdPlayedIds] = useState([]);

  const [selectedPost, setSelectedPost] = useState(null);

  const handleCommentPress = (postId) => {
    setSelectedPost(postId);
  };

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

    HapticFeedback.trigger("impactLight");
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
    const unsubscribe = onSnapshot(postsQuery, async (querySnapshot) => {
      const postList = [];
      for (const docSnapshot of querySnapshot.docs) {
        const postData = docSnapshot.data();
        const userDocRef = doc(db, "users", postData.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        const userData = userDocSnapshot.data();
        postList.push({ id: docSnapshot.id, ...postData, user: userData });
      }
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
    if (posts && ads && posts.length > 0 && ads.length > 0) {
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
    // console.log("Item:", item);

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
            avatarUrl={item.user.profileImageUrl}
            onCommentPress={() => handleCommentPress(item.id)}
            postId={item.id}
            userId={currentUser.uid}
            navigation={navigation}
            authorId={item.uid}
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
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.headerButton,
            isFollowingFeed ? styles.headerButtonActive : {},
          ]}
          onPress={handleFeedSwitch}
        >
          <Text style={styles.headerButtonText}>Curated</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.headerButton,
            !isFollowingFeed ? styles.headerButtonActive : {},
          ]}
          onPress={handleFeedSwitch}
        >
          <Text style={styles.headerButtonText}>Discover</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={isFollowingFeed ? feedVideos : dataWithAds}
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={selectedPost !== null}
        onRequestClose={() => setSelectedPost(null)}
      >
        <TouchableWithoutFeedback onPress={() => setSelectedPost(null)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <Comments postId={selectedPost} />
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  header: {
    marginTop: 50,
    zIndex: 999999,
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
  },

  headerButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
  },
  headerButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#FFF",
  },
  headerButtonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default HomeScreen;
