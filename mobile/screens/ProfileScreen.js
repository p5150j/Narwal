import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Pressable,
  TextInput,
  Button,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  getAuth,
  getDoc,
  getFirestore,
  doc,
  onSnapshot,
  updateDoc,
  collection,
  where,
  query,
  writeBatch,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import Video from "react-native-video";
import { auth } from "../firebase";
import Icon from "react-native-vector-icons/Ionicons";
import { launchImageLibrary } from "react-native-image-picker";

const handleLogout = () => {
  auth.signOut();
};

// const incrementCounter = (value) => {
//   return { integerValue: value, increment: true };
// };

// const decrementCounter = (value) => {
//   return { integerValue: -value, increment: true };
// };

const ProfileHeader = ({ userData }) => {
  return (
    <View style={styles.profileHeader}>
      <Image
        source={{ uri: userData.profileImageUrl }}
        style={styles.profileImage}
      />
      <Text style={styles.profileName}>{userData.name}</Text>
      <Text style={styles.profileHandle}>@{userData.handle}</Text>
    </View>
  );
};

const ProfileStats = ({ userData, postsCount }) => {
  const getStatValue = (value) => {
    if (!value) return 0;
    return value.integerValue ? value.integerValue : value;
  };

  return (
    <View style={styles.profileStats}>
      <Text style={styles.statItem}>Posts: {postsCount}</Text>
      <Text style={styles.statItem}>
        Followers: {getStatValue(userData.followersCount)}
      </Text>
      <Text style={styles.statItem}>
        Following: {getStatValue(userData.followingCount)}
      </Text>
    </View>
  );
};

const EditButton = ({ onProfileImageChange, currentUser }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    const options = {
      mediaType: "photo",
      maxWidth: 200,
      maxHeight: 200,
      quality: 0.5,
      allowsEditing: true,
    };

    launchImageLibrary(options, async (pickerResponse) => {
      if (pickerResponse.didCancel) {
        console.log("User cancelled image picker");
      } else if (pickerResponse.error) {
        console.log("ImagePicker Error: ", pickerResponse.error);
      } else {
        const imageUri = pickerResponse.assets[0].uri;
        const fetchResponse = await fetch(imageUri);
        const blob = await fetchResponse.blob();

        const storage = getStorage();
        const imageRef = ref(storage, `profile_images/${currentUser.uid}`);
        await uploadBytes(imageRef, blob);

        const imageUrl = await getDownloadURL(imageRef);
        onProfileImageChange(imageUrl);
        setModalVisible(false);
      }
    });
  };

  return (
    <View style={styles.editButton}>
      <Pressable onPress={() => setModalVisible(true)}>
        <Text style={styles.editButtonText}>Edit</Text>
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Edit Profile</Text>
            <Button title="Change profile image" onPress={handlePress} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const FollowButton = ({ isFollowing, onFollow, onUnfollow }) => {
  return (
    <TouchableOpacity
      style={styles.editButton}
      onPress={isFollowing ? onUnfollow : onFollow}
    >
      <Text style={styles.editButtonText}>
        {isFollowing ? "Unfollow" : "Follow"}
      </Text>
    </TouchableOpacity>
  );
};

const ProfileScreen = ({ route }) => {
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loadingFollowState, setLoadingFollowState] = useState(true);

  const navigation = useNavigation();
  const db = getFirestore();
  const { userId } = route.params;
  const currentUser = auth.currentUser;

  const handleProfileImageChange = async (imageUrl) => {
    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, { profileImageUrl: imageUrl });
    setUserData((prevUserData) => ({
      ...prevUserData,
      profileImageUrl: imageUrl,
    }));
  };

  useEffect(() => {
    const userRef = doc(db, "users", userId);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      setUserData(doc.data());
    });

    return () => {
      unsubscribe();
    };
  }, [db, userId]);

  useEffect(() => {
    const fetchPosts = () => {
      const postsQuery = query(
        collection(db, "posts"),
        where("uid", "==", userId)
      );
      const unsubscribe = onSnapshot(postsQuery, (querySnapshot) => {
        const fetchedPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(fetchedPosts);
      });

      return () => {
        unsubscribe();
      };
    };

    fetchPosts();
  }, [db, userId]);

  useEffect(() => {
    const checkFollowingStatus = async () => {
      if (currentUser) {
        const followingRef = doc(
          db,
          "users",
          currentUser.uid,
          "Followings",
          userId
        );
        const followingSnap = await getDoc(followingRef);
        setIsFollowing(followingSnap.exists());
      }
      setLoadingFollowState(false);
    };

    checkFollowingStatus();
  }, [db, currentUser, userId]);

  const handleFollow = async () => {
    if (!currentUser) return;

    const batch = writeBatch(db);

    const userRef = doc(db, "users", userId);
    const currentUserRef = doc(db, "users", currentUser.uid);
    const followingRef = doc(
      db,
      "users",
      currentUser.uid,
      "Followings",
      userId
    );
    const followerRef = doc(db, "users", userId, "Followers", currentUser.uid);

    batch.set(followingRef, { userId });
    batch.set(followerRef, { userId: currentUser.uid });

    batch.update(userRef, { followersCount: increment(1) });
    batch.update(currentUserRef, { followingCount: increment(1) });

    await batch.commit();

    setIsFollowing(true);
  };

  const handleUnfollow = async () => {
    if (!currentUser) return;

    const batch = writeBatch(db);

    const userRef = doc(db, "users", userId);
    const currentUserRef = doc(db, "users", currentUser.uid);
    const followingRef = doc(
      db,
      "users",
      currentUser.uid,
      "Followings",
      userId
    );
    const followerRef = doc(db, "users", userId, "Followers", currentUser.uid);

    batch.delete(followingRef);
    batch.delete(followerRef);

    batch.update(userRef, { followersCount: increment(-1) });
    batch.update(currentUserRef, { followingCount: increment(-1) });

    await batch.commit();

    setIsFollowing(false);
  };

  const renderItem = ({ item }) => {
    const handlePress = () => {
      navigation.navigate("VideoDetail", { video: item, userId: userId });
    };

    return (
      <TouchableOpacity onPress={handlePress} style={styles.postContainer}>
        {/* <Image source={{ uri: item.videoUrl }} style={styles.postImage} /> */}
        <Video
          source={{
            uri: item.videoUrl,
          }}
          resizeMode="cover"
          style={styles.postImage}
          muted
          paused={true}
        />
        {/* Add more post details here */}
      </TouchableOpacity>
    );
  };

  if (!userData) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Icon name="settings-outline" size={30} color="white" />
      </TouchableOpacity>

      <View style={styles.container}>
        <ProfileHeader userData={userData} />
        <ProfileStats userData={userData} postsCount={posts.length} />

        {currentUser && currentUser.uid === userId && userData ? (
          <EditButton
            onProfileImageChange={handleProfileImageChange}
            currentUser={currentUser}
          />
        ) : (
          !loadingFollowState && (
            <FollowButton
              isFollowing={isFollowing}
              onFollow={handleFollow}
              onUnfollow={handleUnfollow}
            />
          )
        )}

        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={styles.postColumn}
          initialNumToRender={3}
          maxToRenderPerBatch={3}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#252526",
  },
  profileHeader: {
    marginBottom: 20,
    marginTop: 60,
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
    color: "#e9e9e9",
  },
  profileHandle: {
    fontSize: 16,
    color: "#e9e9e9",
  },
  profileStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  statItem: {
    color: "#e9e9e9",
    fontSize: 16,
  },
  editButton: {
    width: "40%",
    backgroundColor: "#505051",
    borderRadius: 34,
    padding: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  editButtonText: {
    color: "#e9e9e9",
    fontSize: 16,
  },
  postContainer: {
    width: "33.33%",
    aspectRatio: 1,
  },
  postImage: {
    width: "100%",
    height: "100%",
  },
  postColumn: {
    flexWrap: "wrap",
  },
  logout: {
    position: "absolute",
    top: 60,
    right: 30,
    zIndex: 99999,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#505051",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    // elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default ProfileScreen;
