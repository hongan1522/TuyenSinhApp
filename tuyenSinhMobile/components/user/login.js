import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Styles from './Styles';
import MyContext from '../../configs/MyContext';
import { authApi, endpoints } from '../../configs/APIs'; // Import authApi and endpoints

const Login = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [state, dispatch] = useContext(MyContext);

    const login = async () => {
        try {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);
            formData.append('client_id', 'ILOYvrlkXmnIKxKUmXBvdWEKaKY6xJOTEsZf2Oqz');
            formData.append('client_secret', 'GlVx5lhe8Zu6iYVkTtg4IHmZHCxvyR8PjOI3jsgGdM5UZMOdutYtnvvs6ZCfxdJOHdXH27hzAsc1GcC6ZVey7eIf9Tuq4Gfi7dqRqwMVleLWXWeUvN6FP7crU9QdAJfG');
            formData.append('grant_type', 'password');

            const response = await authApi().post(endpoints.login, formData.toString(), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            const token = response.data.access_token;

            // Ensure endpoints.user is correctly defined
            const userUrl = `${endpoints.currentUser}`;
            console.log("Fetching user details from URL:", userUrl);

            // Fetch the current user details
            const userResponse = await authApi(token).get(userUrl);

            const userData = userResponse.data;

            // Store the token and user data in context
            dispatch({ type: "login", payload: { token, ...userData } });

            // Navigate to Home or another screen
            navigation.navigate("Home");
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
                style={Styles.input}
            />
            <TextInput
                value={password}
                onChangeText={text => setPassword(text)}
                secureTextEntry={true}
                placeholder='Mật khẩu...'
                style={Styles.input}
            />
            <TouchableOpacity onPress={login}>
                <Text style={Styles.button}>Login</Text>
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
});

export default Login;
