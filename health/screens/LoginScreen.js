import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import Video from "react-native-video";
import Icon from "react-native-vector-icons/Ionicons";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const navigation = useNavigation(); // Navigation instance

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleLogin = async () => {
    try {
      if (email && password) {
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in successfully!");
      } else {
        setErrorMessage("Please enter a valid email and password.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleForgotPassword = () => {
    // Navigate to ForgotPasswordScreen
    console.log("Forgot Password button pressed");
    navigation.navigate("ForgotPassword");
  };

  return (
    <View style={styles.container}>
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
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={{ padding: 10, borderBottomWidth: 1, width: "80%" }}
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={{ padding: 10, marginTop: 20 }}
        onPress={handleLogin}
      >
        <Text style={{ color: "black" }}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={{ marginTop: 20 }}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={{ marginTop: 20 }}>Don't have an account? Register</Text>
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

export default LoginScreen;
