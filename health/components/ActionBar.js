import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  getDocs,
  orderBy,
  where,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  increment,
} from "firebase/firestore";

const ActionBar = ({
  onCommentPress,
  onLikePress,
  onAvatarPress,
  avatarUrl,
  postId,
  userId,
  navigation,
  authorId,
}) => {
  // console.log("Author ID:", authorId);
  const [commentsCount, setCommentsCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const fetchUserLikeStatus = async (postId, userId) => {
    const likesRef = collection(db, "posts", postId, "likes");
    const q = query(likesRef, where("userId", "==", userId));

    const snapshot = await getDocs(q);
    setIsLiked(!snapshot.empty);
  };

  useEffect(() => {
    if (postId && userId) {
      fetchUserLikeStatus(postId, userId);
    }
  }, [postId, userId]);

  const fetchCommentsCount = (postId) => {
    const commentsRef = collection(db, "posts", postId, "comments");
    const q = query(commentsRef);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setCommentsCount(querySnapshot.size);
    });

    return unsubscribe;
  };

  useEffect(() => {
    if (postId) {
      const unsubscribe = fetchCommentsCount(postId);
      return () => unsubscribe();
    }
  }, [postId]);

  const fetchLikesCount = (postId) => {
    const likesRef = collection(db, "posts", postId, "likes");
    const q = query(likesRef);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setLikesCount(querySnapshot.size);
    });

    return unsubscribe;
  };

  useEffect(() => {
    if (postId) {
      const unsubscribe = fetchLikesCount(postId);
      return () => unsubscribe();
    }
  }, [postId]);

  const handleLikePress = async () => {
    const likeRef = doc(db, "posts", postId, "likes", userId);
    const postRef = doc(db, "posts", postId);
    const likeSnapshot = await getDoc(likeRef);

    if (likeSnapshot.exists()) {
      // If the user has already liked the post, then we remove the like
      await deleteDoc(likeRef);

      // And decrement the likesCount field in the post
      await updateDoc(postRef, { likesCount: increment(-1) });
    } else {
      // If the user hasn't liked the post yet, then we add a new like
      await setDoc(likeRef, { createdAt: new Date() });

      // And increment the likesCount field in the post
      await updateDoc(postRef, { likesCount: increment(1) });
    }
  };

  const handleAvatarClick = () => {
    navigation.navigate("OtherProfile", { userId: authorId }); // Use authorId instead of userId
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => handleAvatarClick(userId)}
        style={styles.iconContainer}
      >
        <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLikePress} style={styles.iconContainer}>
        <Icon
          name={isLiked ? "heart" : "heart-outline"}
          size={35}
          color="#FFF"
        />
        <Text style={styles.iconText}>{likesCount}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onCommentPress} style={styles.iconContainer}>
        <Icon name="chatbubble-outline" size={35} color="#FFF" />
        <Text style={styles.iconText}>{commentsCount}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 15,
    bottom: 200,
    alignItems: "center",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 25,
  },
  iconText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: "#FFF",
    borderWidth: 2,
  },
});

export default ActionBar;
