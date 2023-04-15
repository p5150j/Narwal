import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

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

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
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
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={{ marginTop: 20 }}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
