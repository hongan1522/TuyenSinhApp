import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import MyContext from '../../configs/MyContext';

const CustomDrawerContent = (props) => {
  const [user] = useContext(MyContext);

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.headerContainer}>
        {user && user.avatar && (
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        )}
        {user && (
          <Text style={styles.username}>{user.username}</Text>
        )}
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#f5f5f5',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CustomDrawerContent;
