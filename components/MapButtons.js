import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const styles = StyleSheet.create({
  momma: {
    flexDirection: "row",
    alignSelf: "center",
    width: 150,
    height: 55,
    marginTop:(Dimensions.get('window').height) - 75,
    position:'absolute'
  },
  favs: {
    backgroundColor: "tomato",
    height: 55,
    width: 75,
    flex: 1,
    marginRight: -1,
    borderWidth: 2,
    borderColor: "gray",
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center"
  },
  all: {
    backgroundColor: "limegreen",
    height: 55,
    width: 75,
    flex: 1,
    marginLeft: -1,
    borderWidth: 2,
    borderColor: "gray",
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default (MapButtons = props => {
  return (
    <View style={styles.momma}>
      <View style={styles.favs}>
        <Ionicons name="md-heart-empty" size={53} color="whitesmoke" />
      </View>
      <View style={styles.all}>
        <Ionicons name="ios-globe" size={50} color="gold" />
      </View>
    </View>
  );
});
