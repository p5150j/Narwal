import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";

const AuthScreen = () => {
  const navigation = useNavigation();

  const [backgroundScale] = useState(new Animated.Value(1));

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

  useEffect(() => {
    startZoomAnimation();
  }, []);

  const handleLoginPress = () => {
    navigation.navigate("Login");
  };

  const handleRegisterPress = () => {
    navigation.navigate("Register");
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
            uri: "https://cdn.midjourney.com/6dc91c6b-292b-44fd-815a-4b7850cbeed7/0_1.png",
          }}
          resizeMode="cover"
          style={styles.backgroundImage}
        />
      </Animated.View>

      <Text style={styles.title}>Welcome....</Text>
      {/* <Image // Add the Image component with your logo
        source={{
          uri: "https://cdn.midjourney.com/557d8e04-c588-4f54-8ac8-2e58c37ca0d9/0_3.png",
        }}
        style={styles.logo}
      /> */}

      <TouchableOpacity style={styles.button} onPress={handleLoginPress}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleRegisterPress}>
        <Text style={styles.buttonText}>Register</Text>
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
    color: "white",
    // marginBottom: 200,
  },
  button: {
    width: "70%",
    backgroundColor: "#252526",
    borderRadius: 34,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    // fontWeight: "bold",
  },
  backgroundImageContainer: {
    ...StyleSheet.absoluteFillObject,
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
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50, // Make the logo circular
    marginBottom: 20, // Add a margin below the logo
  },
});

export default AuthScreen;
