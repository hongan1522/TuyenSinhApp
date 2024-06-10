// App.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import BannerComponent from './components/tuyensinh/Banner';
import HomeScreen from './components/tuyensinh/HomeScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Login from './components/user/login';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName='Home'>
        <Drawer.Screen name='Home' component={HomeScreen}/>
        <Drawer.Screen name='Login' component={Login}/>
        <Drawer.Screen name='Banner' component={BannerComponent}/>
      </Drawer.Navigator>
    </NavigationContainer>
  )
}