import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  onSnapshot,
  updateDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
import Video from "react-native-video";
import { auth } from "./firebase";
import Icon from "react-native-vector-icons/Ionicons";

const handleLogout = () => {
  auth.signOut();
};

const ProfileHeader = ({
  userData,
  isEditing,
  handleEdit,
  newHandle,
  setNewHandle,
}) => {
  return (
    <View>
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: userData.profileImageUrl }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{userData.name}</Text>
        <Text style={styles.profileHandle}>{userData.handle}</Text>

        {/* {isEditing ? (
        <TextInput
          style={styles.handleInput}
          value={newHandle}
          onChangeText={setNewHandle}
        />
      ) : (
        <Text style={styles.profileHandle}>{userData.handle}</Text>
      )}
      <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
        <Text>{isEditing ? "Save" : "Edit"}</Text>
      </TouchableOpacity> */}
      </View>
    </View>
  );
};

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newHandle, setNewHandle] = useState("");
  const [posts, setPosts] = useState([]);

  const navigation = useNavigation();
  const auth = getAuth();
  const db = getFirestore();
  const userId = auth.currentUser.uid;

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

  const renderItem = ({ item }) => {
    return (
      <View style={styles.postContainer}>
        <Image source={{ uri: item.videoUrl }} style={styles.postImage} />

        <Video
          source={{
            uri: item.videoUrl,
          }}
          resizeMode="cover"
          style={styles.postImage}
          repeat
          muted
        />

        {/* Add more post details here */}
      </View>
    );
  };

  const handleEdit = async () => {
    if (!isEditing) {
      setIsEditing(true);
      setNewHandle(userData.handle);
    } else {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { handle: newHandle });
      setIsEditing(false);
    }
  };

  if (!userData) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Icon name="settings-outline" size={30} color="gray" />
      </TouchableOpacity>

      <View style={styles.container}>
        <ProfileHeader
          userData={userData}
          isEditing={isEditing}
          handleEdit={handleEdit}
          newHandle={newHandle}
          setNewHandle={setNewHandle}
        />
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.postColumn}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    flex: 1,
    alignItems: "center",
  },
  profileHeader: {
    marginBottom: -150,
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
  },
  profileHandle: {
    fontSize: 16,
    color: "gray",
  },
  //   handleInput: {
  //     padding: 10,
  //     borderBottomWidth: 1,
  //     borderColor: "gray",
  //     width: "80%",
  //   },
  //   editButton: {
  //     padding: 10,
  //     borderRadius: 5,
  //     marginTop: 10,
  //   },
  postContainer: {
    width: "50%",
    aspectRatio: 1,
    padding: 2,
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
    top: 40,
    right: 20,
  },
});

export default ProfileScreen;
