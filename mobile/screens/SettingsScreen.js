import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { auth } from "../firebase";

const SettingsScreen = () => {
  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <TouchableOpacity style={{ padding: 10 }} onPress={handleLogout}>
        <Text style={{ color: "black" }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsScreen;
