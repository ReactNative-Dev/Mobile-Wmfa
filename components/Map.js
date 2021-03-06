import React from "react";
import { connect } from "react-redux";
import { Image, View } from "react-native";
import { MapView } from "expo";
import R from "ramda";
import circle from "@turf/circle";
import distance from "@turf/distance";

import TruckMarker from "../components/TruckMarker";
import locationInUseGranted from "../util/locationInUseGranted";
import { toggleFavorite, set, update } from "../actions";

let invisible = require("../assets/images/truck-all.png");

let toLatLng = ([lon, lat]) => ({
  latitude: Math.max(-90, Math.min(90, lat)),
  longitude: Math.max(-180, Math.min(180, lon))
});

let toPoint = ({ latitude, longitude }) => [longitude, latitude];

let toBoundary = ({ latitude, longitude, latitudeDelta, longitudeDelta }) => {
  let latTop = latitude + 3 * latitudeDelta,
    latBottom = latitude - 3 * latitudeDelta,
    lonLeft = longitude + 3 * longitudeDelta,
    lonRight = longitude - 3 * longitudeDelta;

  return [
    [lonLeft, latTop],
    [lonLeft, latBottom],
    [lonRight, latBottom],
    [lonRight, latTop],
    [lonLeft, latTop]
  ].map(toLatLng);
};

let toCircle = (center, radius) =>
  circle(toPoint(center), radius / 1000, {
    steps: 100,
    units: "kilometers"
  }).geometry.coordinates[0].map(toLatLng);

class NotificationCircle extends React.Component {
  constructor(props) {
    super(props);

    props.setThis(this);
  }
  state = {
    notificationDistance: this.props.notificationDistance
  };
  render = () => (
    <MapView.Polygon
      coordinates={toBoundary(this.props.region)}
      holes={[toCircle(this.props.location, this.state.notificationDistance)]}
      strokeWidth={0}
      fillColor={"rgba(0,0,0,0.05)"}
    />
  );
}

class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      region: props.region,
      nearbyTrucks: []
    };
    this.updateTrucksArray = this.updateTrucksArray.bind(this);

    this.circleThis = null;
  }

  componentDidMount(){
    this.updateTrucksArray();
  }

  updateTrucksArray = () => {
    fetch("https://evening-brushlands-53491.herokuapp.com/api/truckers/", {method: "GET", headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }}).then((response) => response.json())
    .then((responseJson) => {
      let truckDBArray = responseJson;
      this.setState({
        nearbyTrucks: truckDBArray
      });
    })
    //alert();
  }


  renderMarker(){
    if(this.state.nearbyTrucks.length >0){
      this.state.nearbyTrucks.map((truck, key) => {
        if(truck.location !== undefined){
        return <MapView.Marker
            coordinate={{
              latitude:truck.location.coordinates[0],
              longitude:truck.location.coordinates[1]
            }}
            title="a"
            description="a"
          >   
        <Image source={invisible} />
        </MapView.Marker>;
        }
      })     
  }}

  render() {
    
    let notificationCircle = this.state.region &&
      this.props.locationEnabled &&
      this.props.location &&
      this.props.notificationDistance && (
        <NotificationCircle
          region={this.state.region}
          location={this.props.location.coords}
          notificationDistance={this.props.notificationDistance}
          setThis={that => (this.circleThis = that)}
        />
      );

    let dragDistance = ({ nativeEvent: { coordinate } }) =>
      distance(toPoint(coordinate), toPoint(this.props.location.coords)) * 1000;

    let onDrag = e =>
      this.circleThis.setState({ notificationDistance: dragDistance(e) });

    let onDragEnd = e =>
      this.props.update([
        ["user", "local", "notificationDistance"],
        () => dragDistance(e)
      ]);

    // let markers =
    //   this.props.locationEnabled &&
    //   this.props.location &&
    //   this.props.notificationDistance &&
    //   toCircle(this.props.location.coords, this.props.notificationDistance)
    //     .slice(1)
    //     .map(coordinate => (
    //       <MapView.Marker
    //         {...{ coordinate, onDrag, onDragEnd }}
    //         draggable={true}
    //         key={JSON.stringify(coordinate)}
    //       >
    //         <Image source={invisible} />
    //       </MapView.Marker>
    //     ));
    
    var nearbyTrucks= [];
    this.state.nearbyTrucks.map((truck, key) => {
      if(truck.location !== undefined){
        if(truck.location.coordinates[0] !== null)
          nearbyTrucks.push(truck)
      }
    })

    let markers = nearbyTrucks.map((truck, key) => (
        <MapView.Marker
            coordinate={{
              latitude:truck.location.coordinates[0],
              longitude:truck.location.coordinates[1]
            }}
            title={truck.title}
            description={truck.summary}
          >   
        <Image source={invisible} />
        </MapView.Marker>

      ))     
   
    return (
      <MapView
        provider={"google"}
        style={{ flex: 1 }}
        showsUserLocation={this.props.locationEnabled}
        showsMyLocationButton={this.props.locationEnabled}
        loadingEnabled={true}
        initialRegion={this.props.region}
        onRegionChange={region => this.setState({ region })}
        onRegionChangeComplete={region => this.props.set({ region })}
      >
    {markers}
    {Object.entries(nearbyTrucks)
          .filter(([id, truck]) => truck.status === "open")
          .map(([id, truck]) => (
            <TruckMarker
              truck={truck}
              isFavorite={R.contains(id, this.props.favorites)}
              toggleFavorite={() => this.props.toggleFavorite(id)}
              showModal={this.props.showModal}
              key={id}
            />
          ))}
        {notificationCircle}
      </MapView>
    );
  }
}

let mapStateToProps = state => ({
  ...R.pick(
    ["location", "favorites", "notificationDistance"],
    state.user.local
  ),
  ...R.pick(["region", "trucks"], state),
  locationEnabled: locationInUseGranted(state.permissions)
});

let mapDispatchToProps = { toggleFavorite, set, update };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Map);
