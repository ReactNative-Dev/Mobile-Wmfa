import {
  createAppContainer,
  createStackNavigator,
} from "react-navigation";

import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import Landing from "../screens/Landing";
import TruckHome from "../screens/TruckHome";
import OTPScreen from "../screens/OTPScreen";

export default createAppContainer(
  createStackNavigator(
    {
      Landing: Landing,
      Code: OTPScreen,
      Truck: TruckHome,
      Home: HomeScreen,
      Settings: SettingsScreen
    },
    {
      initialRouteName: "Landing"
    }
  )
);
