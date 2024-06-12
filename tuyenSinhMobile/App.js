import React, { useState, useEffect } from 'react';
import BannerComponent from './components/tuyensinh/Banner';
import HomeScreen from './components/tuyensinh/HomeScreen';
import Khoa from './components/tuyensinh/Khoa';
import DiemKhoa from './components/tuyensinh/DiemKhoa';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Login from './components/user/login';
import { Provider } from 'react-native-paper';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <Provider>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName='Home'>
          <Drawer.Screen name='Home' component={HomeScreen}/>
          <Drawer.Screen name='Login' component={Login}/>
          <Drawer.Screen name='Banner' component={BannerComponent}/>
          <Drawer.Screen name='Khoa' component={Khoa}/>
          <Drawer.Screen name='Điểm chuẩn' component={DiemKhoa}/>
        </Drawer.Navigator>
    </NavigationContainer>
    </Provider>
  )
}

