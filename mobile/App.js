import React, { useEffect, useState, useCallback, memo } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Ionicons";
import { auth } from "./firebase";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SearchHeader from "./SearchHeader";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import AuthScreen from "./screens/AuthScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import MakePostScreen from "./screens/MakePostScreen";
import UserListScreen from "./screens/UserListScreen";
import VideoDetailScreen from "./screens/VideoDetailScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainAppTab = memo(({ userId }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBarStyle,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "MakePost") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return (
            <View style={styles.iconContainer}>
              <Icon name={iconName} size={size} color={color} />
            </View>
          );
        },
      })}
      tabBarOptions={{
        activeTintColor: "tomato",
        inactiveTintColor: "gray",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="MakePost"
        component={MakePostScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
        initialParams={{ userId: userId }}
      />
      <Tab.Screen
        name="OtherProfile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarButton: () => null,
        }}
        initialParams={{ userId: userId }}
      />
    </Tab.Navigator>
  );
});

const MainAppStack = memo(({ userId }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainAppTab"
        options={({ navigation }) => ({
          header: () => <SearchHeader navigation={navigation} />,
        })}
      >
        {(props) => <MainAppTab {...props} userId={userId} />}
      </Stack.Screen>
      <Stack.Screen
        name="UserList"
        component={UserListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VideoDetail"
        component={VideoDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
});

const AuthStack = memo(() => {
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
});

const App = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const authListener = useCallback(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (user) => {
        setUser(user || null);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        // handle error...
      }
    );

    return unsubscribe; // returning the unsubscribe function
  }, []); // useCallback to create the listener only once

  useEffect(() => {
    const unsubscribe = authListener(); // calling the function to start listening
    return () => unsubscribe(); // calling the returned function to stop listening
  }, [authListener]); // passing the function as a dependency

  if (loading) {
    // using ActivityIndicator instead of Text
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainAppStack userId={user.uid} /> : <AuthStack />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabBarStyle: {
    position: "absolute",
    bottom: 25,
    left: 20,
    right: 20,
    elevation: 0,
    backgroundColor: "#1e1e1e",
    borderRadius: 15,
    borderTopWidth: 0,
    height: 90,
    justifyContent: "center",
  },
});

export default App;
