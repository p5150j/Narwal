import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import Video from "react-native-video";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleRegister = async () => {
    try {
      if (email && password) {
        const auth = getAuth();
        const { user } = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log("User registered successfully!");

        // Add the user to Firestore
        const db = getFirestore();
        const userRef = doc(db, "users", user.uid);
        console.log(user.uid);
        await setDoc(userRef, {
          email: email,
          name: "",
          handle: "",
          profileImageUrl: "https://i.pravatar.cc/300",
        });
      } else {
        setErrorMessage("Please enter a valid email and password.");
      }
    } catch (error) {
      setErrorMessage(error.message);
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
        keyboardType="email-address"
        autoCapitalize="none"
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
        onPress={handleRegister}
      >
        <Text style={{ color: "black" }}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={{ marginTop: 20 }}>Already have an account? Login</Text>
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

export default RegisterScreen;
