import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import Video from "react-native-video";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const handleGoBack = () => {
    navigation.goBack();
  };

  // Function to handle password reset button press
  const handlePasswordReset = async () => {
    const auth = getAuth();
    try {
      // Check if email is not empty
      if (email) {
        // Call Firebase authentication sendPasswordResetEmail method
        await sendPasswordResetEmail(auth, email);
        console.log("Password reset email sent successfully!");
      } else {
        // Set error message if email is empty
        setErrorMessage("Please enter a valid email.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Video
        source={{
          uri: "https://arusimagesforsite.s3.us-west-2.amazonaws.com/dji_fly_20230320_161050_292_1679365586817_video.MP4",
        }}
        resizeMode="cover"
        style={styles.backgroundVideo}
        repeat
        muted
      />
      <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
        <Icon name="arrow-back" size={30} color="white" />
      </TouchableOpacity>
      {errorMessage && <Text style={{ color: "red" }}>{errorMessage}</Text>}
      <TextInput
        placeholder="Email"
        style={{ padding: 10, borderBottomWidth: 1, width: "80%" }}
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity
        style={{ padding: 10, marginTop: 20 }}
        onPress={handlePasswordReset}
      >
        <Text style={{ color: "black" }}>Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    // backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    // color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    opacity: 0.4,
  },
  backButton: {
    position: "absolute",
    top: 80, // Adjust the value according to your preference
    left: 20, // Adjust the value according to your preference
  },
});

export default ForgotPasswordScreen;
