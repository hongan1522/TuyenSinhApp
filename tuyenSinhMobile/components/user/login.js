import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import MyContext from '../../configs/MyContext';
import { authApi, endpoints } from '../../configs/APIs';

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [state, dispatch] = useContext(MyContext);

  const login = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      // formData.append('client_id', '7kOVvXyCtjlPZpjucl3lLKIOBQXSDETQT4ZALSkN');
      // formData.append('client_secret', 'Gy5nwbxc89HwhYD2uCOFkwD9HlaOE8T0t9yx4YUIdJiqHgt7BS2gJx12KXLulOPNaM9RFnL7ILonalzXjnsNEsi04g8YMWBlaRlBtalZVk0C6sjm2jQtFCa7YQvAu7qG');
      formData.append('client_id', 'oqqD4UHEG9XxE0AanGZUBRhEv3pBols6DNRDJ3dL');
      formData.append('client_secret', 'EIOaeXW9dLbZsAmiFzSUz4ODh19Knn7VtK4w9fiyIc6Pdi5JHTIQqENTwK97Pcjw82gGoKOFaRrHcYE2MN9hK3Y33IKCcglJAxYOblkL4iqobr6b8JCisGqRmyBtnCYH');
      formData.append('grant_type', 'password');

      const response = await authApi().post(endpoints.login, formData.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const token = response.data.access_token;
      const userResponse = await authApi(token).get(endpoints.currentUser);
      const userData = userResponse.data;

      dispatch({ type: "login", payload: { token, ...userData } });

      
    } catch (error) {
      console.error("Error logging in:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login</Text>
      <TextInput
        value={username}
        onChangeText={text => setUsername(text)}
        placeholder='Tên đăng nhập...'
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry={true}
        placeholder='Mật khẩu...'
        style={styles.input}
      />
      <TouchableOpacity onPress={login}>
        <Text style={styles.button}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '80%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  button: {
    color: '#fff',
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default Login;
