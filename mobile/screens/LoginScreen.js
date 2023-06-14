import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Animated,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const navigation = useNavigation(); // Navigation instance

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
    // console.log("Forgot Password button pressed");
    navigation.navigate("ForgotPassword");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
              uri: "https://cdn.midjourney.com/abbe3e25-f891-461a-a354-56afa58c2f93/0_2.png",
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
            placeholder="Email"
            style={styles.input}
            placeholderTextColor="gray"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            placeholderTextColor="gray"
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={{
              width: "100%",
              backgroundColor: "#252526",
              borderRadius: 34,
              padding: 24,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 0,
              marginTop: 20,
            }}
            onPress={handleLogin}
          >
            <Text style={{ color: "white" }}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={{ marginTop: 20, color: "white" }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={{ marginTop: 20, color: "white" }}>
              Don't have an account? Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
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
    marginTop: 50,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  backButton: {
    backgroundColor: "#252526",
    borderRadius: 40,
    padding: 24,
    position: "absolute",
    top: 80, // Adjust the value according to your preference
    left: 20, // Adjust the value according to your preference
  },

  backgroundImageContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  formContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LoginScreen;
