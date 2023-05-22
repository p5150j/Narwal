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

  const handlePasswordReset = async () => {
    const auth = getAuth();
    try {
      if (email) {
        await sendPasswordResetEmail(auth, email);
        console.log("Password reset email sent successfully!");
      } else {
        setErrorMessage("Please enter a valid email.");
      }
    } catch (error) {
      console.error(error);
    }
  };

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
            uri: "https://cdn.midjourney.com/0f6c8ea5-e20d-4e18-981a-6cca5928deda/0_3.png",
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
          onPress={handlePasswordReset}
        >
          <Text style={{ color: "white" }}>Reset Password</Text>
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

export default ForgotPasswordScreen;
