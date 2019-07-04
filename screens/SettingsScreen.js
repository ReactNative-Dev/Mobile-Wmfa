import React from "react";
import {
  AsyncStorage,
  Button,
  ScrollView,
  Slider,
  Switch,
  Text,
  View
} from "react-native";
import R from "ramda";
import { connect } from "react-redux";
import { set, update } from "../actions";

import TruckModal from "../components/TruckModal";

class SettingsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Settings"
  });

  state={
    receiveNotifications:false
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          padding: 20,
          backgroundColor: "#ffbd59"
        }}
      >
        <TruckModal />
        <Text
          style={{
            alignSelf: "center"
          }}
        >
          Receive Notifications:
        </Text>
        <Switch
          style={{
            alignSelf: "center",
            marginTop: 15
          }}
          value={this.state.receiveNotifications}
          onValueChange={switchState =>
            // this.props.update([
            //   ["user", "local", "preferences", "receiveNotifications"],
            //   () => switchState
            // ])
            this.setState({receiveNotifications: switchState})
          }
        />
        <Text
          style={{
            alignSelf: "center",
            paddingTop: 30
          }}
        >
          Notification Distance:
          {""}
        </Text>
        <Slider
          style={{
            width: "70%",
            alignSelf: "center"
          }}
          minimumValue={1}
          maximumValue={10000}
          value={this.props.notificationDistance}
          onSlidingComplete={n =>
            this.props.update([
              ["user", "local", "preferences", "notificationDistance"],
              () => n
            ])
          }
          onSlidingComplete={n =>
            this.props.set({
              user: R.assocPath(
                ["local", "preferences", "notificationDistance"],
                n,
                this.props.state.user
              )
            })
          }
        />
        <Button
          style={{
            width: 50,
            justifyContent: "center",
            borderColor: "black",
            borderWidth: 2
          }}
          title="Sign out"
          onPress={() => this.props.navigation.navigate("Landing")}
        />
        <Text>State:</Text>
        <ScrollView style={{ flex: 1 }}>
          <Text>{JSON.stringify(this.props.state, null, 2)}</Text>
        </ScrollView>
        <Button
          title="Clear Storage"
          onPress={() =>
            AsyncStorage.getAllKeys().then(AsyncStorage.multiRemove)
          }
        />
      </View>
    );
  }
}

export default connect(
  state => ({
    state,
    ...R.pick(["notificationDistance"], R.path(["local"], state.user))
  }),
  { set, update }
)(SettingsScreen);
