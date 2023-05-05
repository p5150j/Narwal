import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import Video from "react-native-video";

const UserListScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  const db = getFirestore();

  useEffect(() => {
    const usersRef = collection(db, "users");
    const usersQuery = query(usersRef, orderBy("handle"));
    const unsubscribe = onSnapshot(usersQuery, (querySnapshot) => {
      const fetchedUsers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(fetchedUsers);
    });

    return () => {
      unsubscribe();
    };
  }, [db]);

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.handle.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchText, users]);

  useEffect(() => {
    const postsRef = collection(db, "posts");
    const postsQuery = query(postsRef, orderBy("name"));
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
  }, [db]);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.userContainer}
        onPress={() => navigation.navigate("Profile", { userId: item.id })}
      >
        <Image
          source={{ uri: item.profileImageUrl }}
          style={styles.profileImage}
        />
        <View style={styles.userInfo}>
          {/* <Text style={styles.name}>{item.name}</Text> */}
          <Text style={styles.handle}>@{item.handle}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderPostItem = ({ item }) => {
    return (
      <View style={styles.postContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Profile", { userId: item.uid })}
        >
          <Video
            source={{
              uri: item.videoUrl,
            }}
            resizeMode="cover"
            style={styles.postVideo}
            muted
            paused={true}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.trendingText}>Discover</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id}
        style={styles.postList}
      />
      <TextInput
        style={styles.searchInput}
        placeholder="Search users"
        placeholderTextColor="#7c7c7c"
        value={searchText}
        onChangeText={setSearchText}
      />
      <FlatList
        data={filteredUsers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0, // Change this value to 0
    paddingTop: 50, // Add this line
    flex: 1,
    backgroundColor: "#252526",
  },
  trendingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e9e9e9",
    paddingLeft: 10,
    paddingTop: 10,
  },
  postList: {
    paddingHorizontal: 10,
    marginBottom: -400,
  },
  postContainer: {
    width: 250,
    height: 150,
    marginRight: 10,
    marginTop: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  postVideo: {
    width: "100%",
    height: "100%",
  },
  searchInput: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#3a3a3b",
    borderRadius: 5,
    color: "#e9e9e9",
    margin: 10,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#505051",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e9e9e9",
  },
  handle: {
    fontSize: 14,
    color: "#7c7c7c",
  },
});

export default UserListScreen;
