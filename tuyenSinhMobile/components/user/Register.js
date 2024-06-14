import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Styles from './Styles';
import MyContext from '../../configs/MyContext';
import { authApi, endpoints } from '../../configs/APIs';

const Register = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [state, dispatch] = useContext(MyContext);

    const register = async () => {
        try {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);
            formData.append('email', email);

            const response = await authApi().post(`${endpoints.user}register/`, formData.toString(), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            // Assuming the API responds with user data and token
            const { token, user } = response.data;

            // Store the token and user data in context
            dispatch({ type: "login", payload: { token, ...user } });

            // Navigate to Home or another screen
            navigation.navigate("Home");
        } catch (error) {
            console.error("Error registering:", error);
            // Handle error here
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Register</Text>
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
            <TextInput
                value={email}
                onChangeText={text => setEmail(text)}
                placeholder='Email...'
                style={Styles.input}
            />
            <TouchableOpacity onPress={register}>
                <Text style={Styles.button}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.link}>Already have an account? Login</Text>
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
    link: {
        color: 'blue',
        marginTop: 10,
    },
});

export default Register;
