import React, { useState, useEffect, useReducer } from 'react';
import BannerComponent from './components/tuyensinh/Banner';
import HomeScreen from './components/tuyensinh/HomeScreen';
import Khoa from './components/tuyensinh/Khoa';
import DiemKhoa from './components/tuyensinh/DiemKhoa';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Login from './components/user/login';
import { Provider } from 'react-native-paper';
import TinTucScreen from './components/tuyensinh/tintuc';
import { createStackNavigator } from '@react-navigation/stack';
import SeeMoreScreen from './components/tuyensinh/TinTucTungLoaiTuyenSinh';
import MyContext from './configs/MyContext';
import MyUserReducer from './reducer/MyUserReducer';
import Logout from './components/user/logout';
import KhoaDetail from './components/tuyensinh/KhoaDetail';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="HomeMain">
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: 'Home' }} />
      <Stack.Screen name="TinTuc" component={TinTucScreen} options={{ title: 'Tin Tức Chi Tiết' }} />
      <Stack.Screen name="SeeMore" component={SeeMoreScreen} />
    </Stack.Navigator>
  );
};

const KhoaStack = () => {
  return (
    <Stack.Navigator initialRouteName='KhoaMain'>
      <Stack.Screen name='KhoaMain' component={Khoa} options={{ title: 'Thông tin các khoa' }}/>
      <Stack.Screen name="KhoaDetail" component={KhoaDetail} options={{ title: 'Chi tiết khoa' }}/>
    </Stack.Navigator>
  )
}

export default function App() {
  const [user, dispatch] = useReducer(MyUserReducer, null);
  return (
    <MyContext.Provider value={[user, dispatch]}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName='Home' screenOptions={{headerRight: Logout}}>
          <Drawer.Screen name='Home' component={HomeStack}/>
          
          {user===null?<>
            <Drawer.Screen name='Login' component={Login} options={{ title: 'Đăng nhập' }}/>
            </>:<>
            <Drawer.Screen name={user.username} component={HomeStack} />
            
            </>}
            <Drawer.Screen name='Logout' component={Logout} options={{ drawerItemStyle: {display: "none"} }}/>
          <Drawer.Screen name='Banner' component={BannerComponent}/>
          <Drawer.Screen name='Khoa' component={KhoaStack}/>
          <Drawer.Screen name='Điểm chuẩn' component={DiemKhoa}/>
        </Drawer.Navigator>
    </NavigationContainer>
    </MyContext.Provider>
  )
}

