import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./navigation/TabNavigator";
import Auth from "./screens/Auth";
import Home from "./screens/Home";
import Profile from "./screens/Profile";
import Task from "./screens/Task";
export default function App() {
  return (
    <Home/>
  );
}
