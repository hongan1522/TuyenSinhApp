import React, { useState, useEffect } from 'react';
import BannerComponent from './components/tuyensinh/Banner';
import HomeScreen from './components/tuyensinh/HomeScreen';
import Khoa from './components/tuyensinh/Khoa';
import DiemKhoa from './components/tuyensinh/DiemKhoa';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Login from './components/user/login';
import { Provider } from 'react-native-paper';
import TinTucScreen from './components/tuyensinh/tintuc';
import AllNewsScreen from './components/tuyensinh/TinTucs';
import NewsByTypeScreen from './components/tuyensinh/tintuctungloai';
import { createStackNavigator } from '@react-navigation/stack';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="HomeMain">
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: 'Home' }} />
      <Stack.Screen name="TinTuc" component={TinTucScreen} options={{ title: 'Tin Tức Chi Tiết' }} />
      <Stack.Screen name="AllNews" component={AllNewsScreen} options={{ title: 'All News' }} />
      <Stack.Screen name="NewsByType" component={NewsByTypeScreen} />
    </Stack.Navigator>
  );
};

const MainStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="DrawerScreens" headerMode="none">
      <Stack.Screen name="DrawerScreens" component={DrawerScreens} />
      <Stack.Screen name="AllNews" component={AllNewsScreen} options={{ title: 'All News' }} />
      <Stack.Screen name="Banner" component={BannerComponent} />
    </Stack.Navigator>
  );
};
export default function App() {
  return (
    <Provider>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName='Home'>
          <Drawer.Screen name='Home' component={HomeStack}/>
          <Drawer.Screen name='Login' component={Login}/>
          <Drawer.Screen name='Banner' component={BannerComponent}/>
          <Drawer.Screen name='Khoa' component={Khoa}/>
          <Drawer.Screen name='Điểm chuẩn' component={DiemKhoa}/>
        </Drawer.Navigator>
    </NavigationContainer>
    </Provider>
  )
}

