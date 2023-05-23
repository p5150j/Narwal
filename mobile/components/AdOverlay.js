import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Text,
} from "react-native";

const AdOverlay = ({ item }) => {
  return (
    <TouchableOpacity style={styles.absolute}>
      <ImageBackground
        source={require("../3px-tile.png")}
        resizeMode="repeat"
        style={styles.pattern}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  pattern: {
    flex: 1,
    width: null,
    height: null,
  },
});

export default AdOverlay;
