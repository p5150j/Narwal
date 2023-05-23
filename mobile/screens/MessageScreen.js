import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  getFirestore,
  collection,
  orderBy,
  addDoc,
  serverTimestamp,
  query,
  onSnapshot,
} from "firebase/firestore";
import { auth } from "../firebase";

const MessageScreen = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const { chatId, chatPartnerId } = route.params;
  const currentUser = auth.currentUser;
  const db = getFirestore();

  useEffect(() => {
    const fetchMessages = () => {
      const messagesQuery = query(
        collection(db, "chats", chatId, "messages"),
        orderBy("timestamp", "desc")
      );
      const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
        const fetchedMessages = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(fetchedMessages);
      });

      return () => {
        unsubscribe();
      };
    };

    fetchMessages();
  }, [db, chatId]);

  const sendMessage = async () => {
    if (input) {
      await addDoc(collection(db, "chats", chatId, "messages"), {
        text: input,
        timestamp: serverTimestamp(),
        uid: currentUser.uid,
      });
      setInput("");
    }
  };

  return (
    <View style={styles.container}>
      {messages.map((message) => (
        <View
          key={message.id}
          style={[
            styles.message,
            message.uid === currentUser.uid
              ? styles.currentUserMessage
              : styles.chatPartnerMessage,
          ]}
        >
          <Text style={styles.messageText}>{message.text}</Text>
        </View>
      ))}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={(text) => setInput(text)}
          placeholder="Type a message"
          placeholderTextColor="#e9e9e9"
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#252526",
  },
  message: {
    borderRadius: 8,
    marginBottom: 10,
    padding: 10,
  },
  currentUserMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#505051",
  },
  chatPartnerMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#7D7D7D",
  },
  messageText: {
    color: "#e9e9e9",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#505051",
    borderRadius: 8,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 8,
    paddingBottom: 8,
    color: "#e9e9e9",
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#505051",
    borderRadius: 8,
    padding: 10,
    marginLeft: 10,
  },
  sendButtonText: {
    color: "#e9e9e9",
    fontSize: 16,
  },
});

export default MessageScreen;
