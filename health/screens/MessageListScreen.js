import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth } from "../firebase";

const MessageListScreen = ({ navigation, route }) => {
  const [chats, setChats] = useState([]);
  const currentUser = auth.currentUser;
  const db = getFirestore();
  const { userId } = route.params;

  console.log("This is the userId that is being passed", userId);

  useEffect(() => {
    const fetchChats = async () => {
      const chatQuery = query(
        collection(db, "chats"),
        where("users", "array-contains-any", [currentUser.uid, userId])
      );
      const querySnapshot = await getDocs(chatQuery);
      const fetchedChats = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(
          (chat) =>
            chat.users.includes(currentUser.uid) && chat.users.includes(userId)
        );

      setChats(fetchedChats);
    };

    fetchChats();
  }, [db, currentUser, userId]);

  const renderItem = ({ item }) => {
    const chatPartnerId = item.users.find((uid) => uid !== currentUser.uid);

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() =>
          navigation.navigate("MessageScreen", {
            chatId: item.id,
            chatPartnerId: chatPartnerId,
          })
        }
      >
        <Text style={styles.chatPartner}>{chatPartnerId}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#252526",
  },
  chatItem: {
    flexDirection: "row",
    padding: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  chatPartner: {
    fontSize: 18,
    color: "#e9e9e9",
  },
});

export default MessageListScreen;
