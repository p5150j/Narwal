import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import FeedScreen from "./screens/FeedScreen";
import ForYouScreen from "./screens/ForYouScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ProfileScreen from "./ProfileScreen";

import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import Icon from "react-native-vector-icons/Ionicons";
import { app, auth } from "./firebase";
import AuthScreen from "./screens/AuthScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import MakePostScreen from "./screens/MakePostScreen";

import Constants from "expo-constants";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const authListener = () => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    authListener();
  }, []);

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;

              if (route.name === "Home") {
                iconName = "home-outline";
              } else if (route.name === "Feed") {
                iconName = "newspaper-outline";
              } else if (route.name === "ForYou") {
                iconName = "heart-outline";
              } else if (route.name === "Settings") {
                iconName = "settings-outline";
              } else if (route.name === "MakePost") {
                // Add a new tab for "Make Post"
                iconName = "create-outline";
              } else if (route.name === "Profile") {
                // Add a new tab for "Make Post"
                iconName = "person-circle-outline";
              }

              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "white",
            tabBarInactiveTintColor: "gray",
            tabBarStyle: {
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              borderTopWidth: 0,
              padding: 10,
              height: 90,
            },
            headerShown: false,
            tabBarShowLabel: false,
          })}
        >
          <Tab.Screen name="Home" component={HomeStack} />
          <Tab.Screen name="Feed" component={FeedScreen} />
          <Tab.Screen name="MakePost" component={MakePostScreen} />
          <Tab.Screen name="ForYou" component={ForYouScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

export default App;
