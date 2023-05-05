import React from "react";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const SearchHeader = ({ navigation }) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("UserList")}
      style={{
        position: "absolute",
        top: 60,
        left: 30,
        zIndex: 999,
      }}
    >
      <Icon name="search" size={30} color="#fff" />
    </TouchableOpacity>
  );
};

export default SearchHeader;
