import React, { useContext, useReducer } from 'react';
import BannerComponent from './components/tuyensinh/Banner';
import HomeScreen from './components/tuyensinh/HomeScreen';
import Khoa from './components/tuyensinh/Khoa';
import KhoaDetail from './components/tuyensinh/KhoaDetail';
import DiemKhoa from './components/tuyensinh/DiemKhoa';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icon library
import MyContext from './configs/MyContext';
import MyUserReducer from './reducer/MyUserReducer';
import TinTucScreen from './components/tuyensinh/tintuc';
import SeeMoreScreen from './components/tuyensinh/TinTucTungLoaiTuyenSinh';
import Login from './components/user/login';
import Register from './components/user/Register';
import Logout from './components/user/logout';
import CustomDrawerContent from './components/utils/customdrawer';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;

        if (route.name === 'Login') {
          iconName = 'login'; // Set icon for Login tab
        } else if (route.name === 'Register') {
          iconName = 'person-add'; // Set icon for Register tab
        }

        // You can return any component that you like here!
        return <Icon name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Login" component={Login} />
    <Tab.Screen name="Register" component={Register} />
  </Tab.Navigator>
);

const HomeStack = () => (
  <Stack.Navigator
    initialRouteName="HomeMain"
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: 'Home' }}/>
    <Stack.Screen name="TinTuc" component={TinTucScreen} options={{ title: 'Tin tức chi tiết' }}/>
    <Stack.Screen name="SeeMore" component={SeeMoreScreen} />
  </Stack.Navigator>
);

const KhoaStack = () => (
  <Stack.Navigator
    initialRouteName="KhoaMain"
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="KhoaMain" component={Khoa} options={{ title: 'Thông tin các khoa' }}/>
    <Stack.Screen name="KhoaDetail" component={KhoaDetail} options={{ title: 'Chi tiết khoa' }}/>
  </Stack.Navigator>
);

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);

  return (
    <MyContext.Provider value={[user, dispatch]}>
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName="Home"
          drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
          {user === null ? (
            <Drawer.Screen
              name="Auth"
              component={AuthTabs}
              options={{ title: 'Đăng nhập / Đăng ký' }}
            />
          ) : (
            <>
              <Drawer.Screen name="Home" component={HomeStack} />
              <Drawer.Screen name="Khoa" component={KhoaStack} />
              <Drawer.Screen name="Điểm chuẩn" component={DiemKhoa} />
              <Drawer.Screen
                name="Banner"
                component={BannerComponent}
                options={{ drawerItemStyle: user?.role === 0 ? null : { display: 'none' } }}
              />
              <Drawer.Screen
                name="Logout"
                component={Logout}
                options={{ title: 'Đăng xuất', swipeEnabled: false }}
              />
            </>
          )}
        </Drawer.Navigator>
      </NavigationContainer>
    </MyContext.Provider>
  );
};

export default App;
