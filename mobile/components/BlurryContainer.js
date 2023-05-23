import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const BlurryContainer = ({ item, onPress }) => {
  const { inappropriate, inappropriateVideo } = item;

  const shouldBlur =
    inappropriate ||
    inappropriateVideo === "POSSIBLE" ||
    // inappropriateVideo === "LIKELY" ||
    inappropriateVideo === "VERY_LIKELY";

  if (!shouldBlur) return null;

  return (
    <View style={styles.absolute}>
      <ImageBackground
        source={require("../3px-tile.png")}
        style={styles.blurContainer}
        resizeMode="repeat"
      >
        <Icon name="warning" size={80} color="#FFA726" />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.98)",
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 99999,
  },
  icon: {
    width: 50,
    height: 50,
  },
});

export default BlurryContainer;
