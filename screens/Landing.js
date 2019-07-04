import React from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  AsyncStorage
} from "react-native";

import { connect } from "react-redux";
import Logo from "../assets/images/Logo.png";
import LogoText from "../assets/images/LogoTextUser.png";

const styles = StyleSheet.create({
  logo: {
    height: 80
  },
  logoText: {
    width: 50
  },
  bigBlue: {
    color: "gray",
    fontWeight: "bold",
    textDecorationLine: "underline",
    fontSize: 20,
    paddingTop: 40,
    paddingBottom: 8
  },
  inputs: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 3,
    padding: 4,
    margin: 8,
    width: "56%",
  },
  MommaDiv: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    fontWeight: "bold",
    fontSize: 30,
    borderColor: "black",
    borderWidth: 1,
    padding: 50
  },
  subButton: {
    backgroundColor: "palevioletred",
    borderRadius: 3,
    marginTop: 26
  },
  switch: {
    backgroundColor: "yellow"
  }
});

class Landing extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: null
  });

  constructor(props){
    super(props)
    this.state={ username:"", password:"", confirmPassword:"", loginText:"New User?", newUser:false, mapRegion: null,
    lastLat: null,
    lastLong: null }
  }

  componentDidMount() {
    this.watchID = navigator.geolocation.getCurrentPosition((position) => {
      // Create the object to update this.state.mapRegion through the onRegionChange function
      let region = {
        latitude:       position.coords.latitude,
        longitude:      position.coords.longitude,
        latitudeDelta:  0.00922*1.5,
        longitudeDelta: 0.00421*1.5
      }
      console.log("region::", region)
      this.onRegionChange(region, region.latitude, region.longitude);
    }, (error)=>console.log("error:",error),
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 });
  }

  onRegionChange(region, lastLat, lastLong) {
    this.setState({
      mapRegion: region,
      // If there are no new values set the current ones
      lastLat: lastLat || this.state.lastLat,
      lastLong: lastLong || this.state.lastLong
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  onSubmitPressed(){
    const {username, password, confirmPassword, loginText} = this.state;
    if(loginText === "New User?"){      
      if(username.length === 0){
        console.log('Enter Username')
      }else if(password.length === 0){
        console.log('Enter Password')
      }else{
        this.callLoginApi(username, password)
      }
    }else{
      if(username.length === 0){
        console.log('Enter Username')
      }else if(password.length === 0){
        console.log('Enter Password')
      }else if(confirmPassword.length === 0){
        console.log('Enter Confirm Password')
      }else if(password !== confirmPassword){
        console.log('Password does not match!')
      }else{
        console.log("state::", this.state)
        const location = {"coordinates": [this.state.lastLat, this.state.lastLong]}
         this.callSignUpApi(username, password, location)
      }
    }
  }

  callLoginApi(username, password){
    fetch("https://evening-brushlands-53491.herokuapp.com/api/eaters/login", {method: "POST", headers: {
        'Content-Type': 'application/json',
        },
        body:JSON.stringify({
          "username": username,
          "password": password
        })})
        .then((response) => {
          console.log("result:--", response.status);
          if(response.status === 200){
            this.moveToNextScreen(response);
          }
        }) 
  }

  callSignUpApi(username, password, location){
    fetch("https://evening-brushlands-53491.herokuapp.com/api/eaters/signup", {method: "POST", headers: {
        'Content-Type': 'application/json',
        },
        body:JSON.stringify({
          "username": username,
          "password": password,
          "location": location
        })})
        .then((response) => {
          console.log("result:--", response);
          if(response.status === 200){
            this.moveToNextScreen(response);
          }
        });
    }

    moveToNextScreen(response){
      AsyncStorage.setItem('user_id', (JSON.stringify(JSON.parse(response._bodyInit)._id)), () => {
        AsyncStorage.setItem('user_name', (JSON.stringify(JSON.parse(response._bodyInit).username)), () => {
          this.props.navigation.navigate("Home");
        });
      });
    }

  onUsernameChanges(text){
    this.setState({username: text})
  }

  onPasswordChanges(text){
    this.setState({password: text})
  }

  onConfirmPasswordChanges(text){
    this.setState({confirmPassword: text})
  }

  renderConfirmPassword(){
    if(this.state.newUser){
      return <TextInput style={styles.inputs} 
          placeholder="Confirm Password"
          secureTextEntry={true}
          value={this.state.confirmPassword}
          onChangeText={this.onConfirmPasswordChanges.bind(this)}
        />;
    }
  }

  onLoginTextPressed(){
    if(this.state.newUser === false){
      this.setState({loginText:"Already User?", newUser: true})
    }else{
      this.setState({loginText:"New User?", newUser: false})
    }
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#ffbd59"
        }}
      >
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("Code")}>
          <Image
            style={{ width: 150, height: 150, marginTop: 60, marginBottom: 8 }}
            source={Logo}
            alt="nope"
          />
        </TouchableOpacity>

        <Image
          style={{ width: "80%", height: 80, marginBottom: 40 }}
          source={LogoText}
          alt="nope"
        />

        <Text style={styles.bigBlue}>Login Below!</Text>

        <TextInput style={styles.inputs} 
          placeholder="Username"
          value={this.state.username}
          onChangeText={this.onUsernameChanges.bind(this)} 
        />

        <TextInput style={styles.inputs} 
          placeholder="Password"
          secureTextEntry={true}
          value={this.state.password}
          onChangeText={this.onPasswordChanges.bind(this)}
        />

        {this.renderConfirmPassword()}

        <TouchableOpacity
          onPress={() => this.onLoginTextPressed()}>
        <Text>{this.state.loginText}</Text>
        </TouchableOpacity>

        <View style={styles.subButton}>
          <Button
            style={{ color: "#ff0000" }}
            title="Submit"
            onPress={() => this.onSubmitPressed()}
          />
        </View>

      </View>
    );
  }
}

export default connect()(Landing);
