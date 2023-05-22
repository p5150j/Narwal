import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Animated,
} from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [handle, setHandle] = useState("");
  const [name, setName] = useState("");

  // Add an Animated.Value to the state
  const [backgroundScale] = useState(new Animated.Value(1));

  // Create a function that starts the zoom animation loop
  const startZoomAnimation = () => {
    Animated.sequence([
      Animated.timing(backgroundScale, {
        toValue: 1.2,
        duration: 10000,
        useNativeDriver: true,
      }),
      Animated.timing(backgroundScale, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      }),
    ]).start(() => startZoomAnimation());
  };

  // Start the zoom animation loop when the component mounts
  useEffect(() => {
    startZoomAnimation();
  }, []);

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
          name: name,
          handle: handle,
          followersCount: 0,
          followingCount: 0,
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
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.backgroundImageContainer,
          {
            transform: [
              {
                scale: backgroundScale,
              },
            ],
          },
        ]}
      >
        <ImageBackground
          source={{
            uri: "https://cdn.midjourney.com/b24c5210-e262-4bec-a952-e09b58784c18/0_0.png",
          }}
          resizeMode="cover"
          style={styles.backgroundImage}
        />
      </Animated.View>
      <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
        <Icon name="arrow-back" size={30} color="white" />
      </TouchableOpacity>
      <View style={styles.formContainer}>
        {errorMessage && <Text style={{ color: "red" }}>{errorMessage}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="gray"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput // Add a new TextInput field for the name
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="gray"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
        <TextInput // Add a new TextInput field for the handle
          style={styles.input}
          placeholder="@Handle"
          placeholderTextColor="gray"
          value={handle}
          onChangeText={setHandle}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          placeholderTextColor="gray"
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
        >
          <Text style={{ color: "white" }}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={{ marginTop: 20, color: "white" }}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    padding: 24,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 34,
    width: "100%",
    marginBottom: 15,
    color: "black",
    marginTop: 20,
  },
  backgroundImageContainer: {
    ...StyleSheet.absoluteFillObject, // Add the absoluteFill style to backgroundImageContainer
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    opacity: 0.9,
  },
  backButton: {
    backgroundColor: "#252526",
    borderRadius: 40,
    padding: 24,
    position: "absolute",
    top: 80, // Adjust the value according to your preference
    left: 20, // Adjust the value according to your preference
  },
  formContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  registerButton: {
    width: "100%",
    backgroundColor: "#252526",
    borderRadius: 34,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
    marginTop: 20,
  },
});

export default RegisterScreen;
