import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./navigation/TabNavigator";
import Auth from "./screens/Auth";
import { enableScreens } from 'react-native-screens';

enableScreens(false);

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <NavigationContainer>
      {user ? <TabNavigator user={user} /> : <Auth onLoginSuccess={setUser} />}
    </NavigationContainer>
  );
}
