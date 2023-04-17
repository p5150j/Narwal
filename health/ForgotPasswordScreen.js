import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  // Function to handle password reset button press
  const handlePasswordReset = async () => {
    const auth = getAuth();
    try {
      // Check if email is not empty
      if (email) {
        // Call Firebase authentication sendPasswordResetEmail method
        await sendPasswordResetEmail(auth, email);
        console.log("Password reset email sent successfully!");
      } else {
        // Set error message if email is empty
        setErrorMessage("Please enter a valid email.");
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
      <TouchableOpacity
        style={{ padding: 10, marginTop: 20 }}
        onPress={handlePasswordReset}
      >
        <Text style={{ color: "black" }}>Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPasswordScreen;
