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
import Icon from "react-native-vector-icons/Ionicons"; // Add this import

const UserListScreen = ({ navigation }) => {
  const renderDivider = () => {
    if (searchText !== "" && filteredPosts.length > 0) {
      return <View style={styles.divider} />;
    }
    return null;
  };

  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
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

  useEffect(() => {
    const filteredUserResults = users.filter((user) =>
      user.handle.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredUsers(filteredUserResults);

    const filteredPostResults = posts.filter(
      (post) =>
        post.name.toLowerCase().includes(searchText.toLowerCase()) ||
        post.description.toLowerCase().includes(searchText.toLowerCase()) ||
        (Array.isArray(post.labels) &&
          post.labels.some((label) =>
            label.description.toLowerCase().includes(searchText.toLowerCase())
          ))
    );
    setFilteredPosts(filteredPostResults);
  }, [searchText, users, posts]);

  const renderItem = ({ item }) => {
    if (item.type === "user") {
      return renderUser(item);
    } else if (item.type === "post") {
      return renderPost(item);
    }
  };

  const renderUser = (item) => {
    return (
      <TouchableOpacity
        style={styles.userContainer}
        onPress={() => navigation.navigate("OtherProfile", { userId: item.id })}
      >
        <Image
          source={{ uri: item.profileImageUrl }}
          style={styles.profileImage}
        />
        <View style={styles.userInfo}>
          <Text style={styles.handle}>@{item.handle}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderPost = (item) => {
    return (
      <TouchableOpacity
        style={styles.postContainer}
        onPress={() => navigation.navigate("VideoDetail", { post: item })}
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
        <Text style={styles.postName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()} // Replace this with your desired action
        style={{
          position: "absolute",
          top: 60,
          right: 30,
          zIndex: 999,
        }}
      >
        <Icon name="close" size={30} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.trendingText}>Discover</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search users and posts"
        placeholderTextColor="#7c7c7c"
        value={searchText}
        onChangeText={setSearchText}
      />
      <FlatList
        data={[
          ...filteredUsers.map((u) => ({ ...u, type: "user" })),
          ...(searchText !== ""
            ? filteredPosts.map((p) => ({ ...p, type: "post" }))
            : []),
        ]}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderDivider}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    paddingTop: 50,
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
  handle: {
    fontSize: 14,
    color: "#7c7c7c",
  },
  postContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#505051",
  },
  postVideo: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  postName: {
    fontSize: 14,
    color: "#7c7c7c",
    marginLeft: 10,
  },

  divider: {
    height: 1,
    backgroundColor: "#7c7c7c",
    marginHorizontal: 10,
    marginVertical: 5,
  },
});

export default UserListScreen;
