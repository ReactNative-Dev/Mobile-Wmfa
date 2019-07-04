import React, {Component} from "react";

import {
  Button,
  Dimensions,
  Image,
  View, Text, StyleSheet,
  ScrollView, TouchableOpacity,
  AsyncStorage
} from "react-native";

let logo = require("../assets/images/BlueLogo.png");

export default class TruckHome extends Component {
  static navigationOptions = {
    header: null
  };
  state = {
    laPos: 'unknown',
    loPos: 'unknown',
    backcolor: 'palevioletred',
    firstswitchval:false,
    secondswitchval:false,
    thirdswitchval:false,
    isTrucker: false,
    password: '',
    counter: null,
    trucker_id:''
 }

 componentDidMount = () => {
    navigator.geolocation.getCurrentPosition(
       (position) => {
          const laPos = JSON.stringify(position.coords.latitude);
          const loPos = JSON.stringify(position.coords.longitude);

          this.setState({ laPos });
          this.setState({ loPos });

       },
       (error) => alert(error.message),
       { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );

    AsyncStorage.getItem('trucker_id', (err, result) => {
      console.log("trucker_id", JSON.stringify(result));
      this.setState({trucker_id: result.replace(/\"/g,"") });
    });
    
 }
  // findTrucker = () => {
  //   fetch("https://evening-brushlands-53491.herokuapp.com/api/truckers/5c6ded53fb6fc01c4ce8fc5c", {method: "GET", headers: {
  //     'Accept': 'application/json',
  //     'Content-Type': 'application/json',}
  //     })
  //   .then((response) => {
  //     console.log(response);
  //   })
  // }
  // componentDidMount = () => {
    
  // }
  updateForDriving(){
    // alert(this.state.laPos);
    //alert(this.state.laPos+"/"+this.state.loPos);
    // setInterval( () => {

      this.interval = setInterval(() => {
        this.setState({counter: this.state.counter + 1});
        console.log(this.state.counter);
        fetch(`https://evening-brushlands-53491.herokuapp.com/api/truckers/${this.state.trucker_id}`, {method: "PUT", headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        },
        body:JSON.stringify({
          "status": "driving",
          "location": {
            "coordinates": [Number(this.state.laPos), Number(this.state.loPos)]
          }
        })})
        .then((response) => {
          console.log("result:--", response);
        }) 
    }, 5000);
  }
  updateForServing (){
      fetch(`https://evening-brushlands-53491.herokuapp.com/api/truckers/${this.state.trucker_id}`, {method: "PUT", headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      },
      body:JSON.stringify({
        "status": "serving",
        "location": {
          "coordinates": [Number(this.state.laPos), Number(this.state.loPos)]
        }
      })})
      .then((response) => {
        console.log(response);
      }) 
  }

  updateForDone () {
    fetch(`https://evening-brushlands-53491.herokuapp.com/api/truckers/${this.state.trucker_id}`, {method: "PUT", headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    },
    body:JSON.stringify({
      "status": "closed",
      "location": {
        "coordinates": [Number(this.state.laPos), Number(this.state.loPos)]
      }
    })})
    .then((response) => {
      console.log(response);
    }) 
}

  handlebackcolor1(){
      this.setState({backcolor:'yellow'});
      this.updateForDriving();
  }
  handlebackcolor2() {
      this.setState({backcolor:'green'});
      this.updateForServing();
  }

  handlebackcolor3 () {
      this.setState({backcolor:'red'});
      this.updateForDone();
  }

  // submit = () => {
  //   console.log(this.state.password);
  //   if(this.state.password != "sd")
  //   {
  //     if(this.state.backcolor == 'red')
  //     {
  //       this.updateForDone();
  //     }
  //     else if(this.state.backcolor == 'yellow')
  //     {
  //       this.updateForDriving();
  //     }
  //     else if(this.state.backcolor == 'green')
  //     {
  //       this.updateForServing();
  //     }
  //   }
  //   else
  //   {
  //     alert("login error!");
  //   }
  // }

  signout=()=>{
    this.updateForDone() 
    this.props.navigation.navigate("Landing")
  }


  render = () => (
    <ScrollView  style={{
      flex: 1,
      backgroundColor: "#38b6ff",
      }}> 
    <View
      style={{
        flex: 1,
        backgroundColor: "#38b6ff",
        justifyContent: "space-between"
      }}
    >
      <View
        style={{
          width: Dimensions.get("window").width,
          paddingTop: 30,
          backgroundColor: "#38b6ff",
          alignSelf: "center"
        }}
      >
        <Image
          source={logo}
          style={{
            width: 300,
            height: 70,
            paddingTop: 15,
            backgroundColor: "#38b6ff",
            alignSelf: "center"
          }}
        />
      </View>

      <View>
        <Text
          style={{
            marginTop:32,
            paddingBottom: 20,
            backgroundColor: "#38b6ff",
            alignSelf: "center",
            textDecorationLine: "underline",
            fontSize: 20
          }}
        >
          Truck Status
        </Text>
        <View
          style={{
            paddingBottom: 20,
            backgroundColor: this.state.backcolor,
            alignSelf: "center",
            width: 70,
            height: 70,
            borderRadius: 35
          }}
        />
      </View>
      <View>

        {/* <Text
          style={{
            paddingBottom: 20,
            backgroundColor: "#38b6ff",
            alignSelf: "center",
            textDecorationLine: "underline",
            fontSize: 35
          }}
        >
          Driving?
        </Text> */}
        <TouchableOpacity onPress = {() => this.handlebackcolor1()} >
        <View style={{backgroundColor:'yellow',alignSelf:'center',borderRadius:2,
                      alignItems:'center', width:160, marginTop:40, padding:3}}>
          <Text style={{fontSize: 30}}>
            Driving
          </Text>
        </View>
        </TouchableOpacity>

        {/* <Button
          style={{
            backgroundColor: "#38b6ff",
            alignSelf: "center",
          }}
          title="Driving"
          onPress={}
          onValueChange={this.handlebackcolor1}
          value = {this.state.firstswitchval}

        /> */}
      </View>

      <View>
        {/* <Text
          style={{
            paddingBottom: 20,
            backgroundColor: "#38b6ff",
            alignSelf: "center",
            textDecorationLine: "underline",
            fontSize: 35
          }}
        >
          Serving!
        </Text>
        <Switch
          style={{
            backgroundColor: "#38b6ff",
            alignSelf: "center",
          }}
          onValueChange={this.handlebackcolor2}
          value = {this.state.secondswitchval}

        /> */}
        <TouchableOpacity onPress = {() => this.handlebackcolor2()} >
        <View style={{backgroundColor:'green',alignSelf:'center',borderRadius:2,
                      alignItems:'center', width:160, marginTop:20, padding:3}}>
          <Text style={{fontSize: 30}}>
            Serving
          </Text>
        </View>
        </TouchableOpacity>

      </View>

      <View>
        {/* <Text
          style={{
            paddingBottom: 20,
            backgroundColor: "#38b6ff",
            alignSelf: "center",
            textDecorationLine: "underline",
            fontSize: 35
          }}
        >
          Done!
        </Text>
        <Switch
          style={{
            backgroundColor: "#38b6ff",
            alignSelf: "center",
          }}
          onValueChange={this.handlebackcolor3}
          value = {this.state.thirdswitchval}

        /> */}
        <TouchableOpacity onPress = {() => this.handlebackcolor3()} >
        <View style={{backgroundColor:'red',alignSelf:'center',borderRadius:2,
                      alignItems:'center', width:160, marginTop:30, padding:3}}>
          <Text style={{fontSize: 30}}>
            Done
          </Text>
        </View>
        </TouchableOpacity>

      </View>

      <View style={{marginTop:48}}>
        {/* <TextInput style={{
            borderColor: "gray",
            borderWidth: 1,
            borderRadius: 3,
            paddingLeft: 5,
            paddingRight: 5,
            paddingTop: 10,
            paddingBottom: 10,
            margin: 7,
            alignSelf: "center",
            width: "65%"
          }}
          onChangeText={(password) => this.setState({password})}
          value = {this.state.password}
          placeholder="Password" /> */}
        {/* <Button
          style={{
            width: 51,
            justifyContent: "center",
            borderColor: "black",
            borderWidth: 2
          }}
          title="Submit"
          // onPress={this.addTrucksArray}
          onPress={this.submit}
        /> */}
        {/* <View style={styles.subButton}>
          <Button
            style={{ color: "#ff0000" }}
            title="Submit"
            onPress={this.submit}
          />
        </View> */}
      </View>
      {/* <Button
        style={{
          width: 51,
          justifyContent: "center",
          borderColor: "black",
          borderWidth: 2,
          marginTop:48,
        }}
        title="Sign out"
        onPress={() => this.props.navigation.navigate("Landing")}
      /> */}
      <View style={styles.subButton}>
          <Button
            style={{ color: "#ff0000" }}
            title="Sign out"
            onPress={this.signout}
          />
        </View>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  subButton: {
    backgroundColor: "palevioletred",
    borderRadius: 3,
    marginTop: 26,
    width:160,
    alignSelf:'center'
  }
});
