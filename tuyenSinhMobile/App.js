<<<<<<< HEAD
import BannerComponent from "./components/tuyensinh/Banner";
import DiemKhoa from "./components/tuyensinh/DiemKhoa";
import Khoa from "./components/tuyensinh/Khoa";
=======
// App.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import BannerComponent from './components/tuyensinh/Banner';
import HomeScreen from './components/tuyensinh/HomeScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Login from './components/user/login';

const Drawer = createDrawerNavigator();
>>>>>>> 8c75fb0e5d115187f519d4ddc145ba8852c245d2

export default function App() {
  return (
<<<<<<< HEAD
    //<BannerComponent></BannerComponent>
    //<Khoa></Khoa>
    <DiemKhoa></DiemKhoa>
  );
}

export default App;
=======
    <NavigationContainer>
      <Drawer.Navigator initialRouteName='Home'>
        <Drawer.Screen name='Home' component={HomeScreen}/>
        <Drawer.Screen name='Login' component={Login}/>
        <Drawer.Screen name='Banner' component={BannerComponent}/>
      </Drawer.Navigator>
    </NavigationContainer>
  )
}
>>>>>>> 8c75fb0e5d115187f519d4ddc145ba8852c245d2
