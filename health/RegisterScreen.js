import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const handleRegister = async () => {
    try {
      if (email && password) {
        const auth = getAuth();
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("User registered successfully!");
      } else {
        setErrorMessage("Please enter a valid email and password.");
      }
    } catch (error) {
      setErrorMessage(error.message);
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

export default RegisterScreen;
