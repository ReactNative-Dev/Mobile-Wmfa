import React from "react";
import { Button, Image, Text, TouchableOpacity, View } from "react-native";
import { MapView } from "expo";
import R from "ramda";
import TruckModal from "../components/TruckModal";

let icons = R.map(source => <Image source={source} />, {
  markerDefault: require("../assets/images/truck-all.png"),
  markerFavorite: require("../assets/images/truck-fav.png")
});

// let iconz = R.map(
//   source => <Image source={source} style={{ width: 30, height: 30 }} />,
//   {
//     addFavorite: require("../assets/images/heart-gray.png"),
//     removeFavorite: require("../assets/images/heart-red.png")
//   }
// );

export default (TruckMarker = props => {
  let { truck, isFavorite, toggleFavorite } = props,
    [longitude, latitude] = truck.location.coordinates;

  return (
    <MapView.Marker
      coordinate={{ longitude, latitude }}
      title={truck.title}
      tracksInfoWindowChanges={true}
    >
      {icons[isFavorite ? "markerFavorite" : "markerDefault"]}
      <MapView.Callout
        tooltip={true}
        // onPress={toggleFavorite}

        style={{
          padding: 10,
          borderWidth: 0.1,
          width: 50,
          backgroundColor: "#ffde59",
          flexDirection: "row",
          borderRadius: 11,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text style={{ paddingRight: 13 }}>{truck.title}</Text>
        <TouchableOpacity>
          <TruckModal onPress={props._toggleModal} />
        </TouchableOpacity>
        {/* {iconz[isFavorite ? "removeFavorite" : "addFavorite"]} */}
      </MapView.Callout>
    </MapView.Marker>
  );
});
