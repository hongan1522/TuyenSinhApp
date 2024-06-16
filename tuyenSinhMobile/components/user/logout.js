import { useContext, useEffect } from "react";
import { Button, View, Text, ActivityIndicator } from "react-native";
import MyContext from "../../configs/MyContext";

const Logout = ({ navigation }) => {
  const [user, dispatch] = useContext(MyContext);

  useEffect(() => {
    if (user !== null) {
      dispatch({ type: "logout" });
    }
    navigation.navigate("Login");
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Logging out...</Text>
    </View>
  );
};

export default Logout;
