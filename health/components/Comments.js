import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { db, auth } from "../firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import Icon from "react-native-vector-icons/Ionicons";

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  const [currentUserData, setCurrentUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        setCurrentUserData(userSnap.data());
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (postId) {
      const unsubscribe = onSnapshot(
        collection(db, "posts", postId, "comments"),
        (querySnapshot) => {
          const commentsList = [];
          querySnapshot.forEach((doc) => {
            commentsList.push({ ...doc.data(), id: doc.id });
          });
          setComments(commentsList);
        }
      );

      return () => {
        unsubscribe();
      };
    }
  }, [postId]);

  const sendComment = async () => {
    if (input.trim() === "") return;

    if (currentUserData) {
      await addDoc(collection(db, "posts", postId, "comments"), {
        text: input,
        createdAt: serverTimestamp(),
        userHandle: currentUserData.handle,
        profileImageUrl: currentUserData.profileImageUrl,
      });
    }

    setInput("");
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.commentContainer}>
        <Image
          source={{ uri: item.profileImageUrl }}
          style={styles.profileImage}
        />
        <View style={styles.commentTextContainer}>
          <Text style={styles.userHandle}>{item.userHandle}</Text>
          <Text style={styles.comment}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <FlatList
          data={comments}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Add a comment..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity onPress={sendComment}>
            <Icon name="paper-plane-outline" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 10,
    paddingBottom: 30,
    maxHeight: "80%",
  },
  commentContainer: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "flex-start",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentTextContainer: {
    flex: 1,
  },
  userHandle: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  comment: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    padding: 20,
  },
  input: {
    flex: 1,
    backgroundColor: "#eee",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#1da1f2",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 25,
    color: "white",
    fontWeight: "bold",
  },
});

export default Comments;
