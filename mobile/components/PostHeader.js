import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";

const PostHeader = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Want to remove Ads?</Text>
      <Text style={styles.description}>
        Subscribe to our premium service to remove ads.
      </Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Remove Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 99999,
    top: 250,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "rgba(30,	30,	30, 0.8)",
    paddingTop: 50,
    paddingBottom: 50,
    margin: 15,
    borderRadius: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "white",
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 40,
    color: "white",
  },
  button: {
    backgroundColor: "tomato",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "300",
  },
});

export default PostHeader;
