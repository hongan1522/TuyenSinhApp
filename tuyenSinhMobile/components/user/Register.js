import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { authApi, endpoints } from '../../configs/APIs';
import * as ImagePicker from 'expo-image-picker';
import { CLOUDINARY_UPLOAD_URL, CLOUDINARY_UPLOAD_PRESET } from '../../configs/cloudinary';

const Register = ({ navigation }) => {
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [email, setEmail] = useState('');
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [avatar, setAvatar] = useState(null);

const pickAvatar = async () => {
const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();


if (status !== 'granted') {
  Alert.alert('Permission Required', 'Please grant permission to access the photo library.');
  return;
}

let result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [4, 3],
  quality: 1,
});

if (!result.canceled) {
  setAvatar(result.assets[0].uri);
}
};

const uploadImageToCloudinary = async (uri) => {
try {
const formData = new FormData();
formData.append('file', {
uri,
type: 'image/jpeg',
name: 'upload.jpg'
});
formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);


  const response = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  const result = await response.json();
  if (response.ok) {
    const imagePath = result.secure_url.split('/').slice(6).join('/');
    return imagePath;
  } else {
    throw new Error(result.error.message || 'Failed to upload image');
  }
} catch (error) {
  Alert.alert('Error', 'Failed to upload image. Please try again.');
  return null;
}
};

const register = async () => {
if (password !== confirmPassword) {
Alert.alert('Error', 'Passwords do not match');
return;
}


if (!avatar) {
  Alert.alert('Error', 'Avatar is required');
  return;
}

try {
  let avatarPath = await uploadImageToCloudinary(avatar);
  if (!avatarPath) {
    return;
  }

  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  formData.append('email', email);
  formData.append('first_name', firstName);
  formData.append('last_name', lastName);
  formData.append('avatar', avatarPath);

  const response = await authApi().post(endpoints.register, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  if (response.status === 201 || response.status === 200) {
    Alert.alert("Success", "Registration successful. Please log in.");
    navigation.navigate("Login");
  } else {
    Alert.alert("Error", "There was an error registering. Please try again.");
  }
} catch (error) {
  Alert.alert("Error", error.response ? JSON.stringify(error.response.data) : "There was an error registering. Please try again.");
}
};

return (
<ScrollView contentContainerStyle={styles.container}>
<Text style={styles.title}>Register</Text>
<TextInput
value={firstName}
onChangeText={text => setFirstName(text)}
placeholder='First Name...'
style={styles.input}
/>
<TextInput
value={lastName}
onChangeText={text => setLastName(text)}
placeholder='Last Name...'
style={styles.input}
/>
<TextInput
value={username}
onChangeText={text => setUsername(text)}
placeholder='Username...'
style={styles.input}
/>
<TextInput
value={password}
onChangeText={text => setPassword(text)}
secureTextEntry={true}
placeholder='Password...'
style={styles.input}
/>
<TextInput
value={confirmPassword}
onChangeText={text => setConfirmPassword(text)}
secureTextEntry={true}
placeholder='Confirm Password...'
style={styles.input}
/>
<TextInput
value={email}
onChangeText={text => setEmail(text)}
placeholder='Email...'
style={styles.input}
/>
<TouchableOpacity style={styles.avatarButton} onPress={pickAvatar}>
<Text style={styles.avatarButtonText}>{avatar ? 'Change Avatar' : 'Pick an Avatar'}</Text>
</TouchableOpacity>
{avatar && (
<Image source={{ uri: avatar }} style={styles.avatar} />
)}
<TouchableOpacity style={styles.button} onPress={register}>
<Text style={styles.buttonText}>Register</Text>
</TouchableOpacity>
<TouchableOpacity onPress={() => navigation.navigate("Login")}>
<Text style={styles.link}>Already have an account? Login</Text>
</TouchableOpacity>
</ScrollView>
);
};

const styles = StyleSheet.create({
container: {
flexGrow: 1,
justifyContent: 'center',
alignItems: 'center',
padding: 20,
backgroundColor: '#f5f5f5',
},
title: {
fontSize: 28,
fontWeight: 'bold',
marginBottom: 20,
color: '#333',
},
input: {
width: '100%',
padding: 15,
marginVertical: 10,
borderWidth: 1,
borderColor: '#ccc',
borderRadius: 5,
backgroundColor: '#fff',
},
avatarButton: {
backgroundColor: '#007BFF',
padding: 15,
borderRadius: 5,
alignItems: 'center',
marginVertical: 10,
width: '100%',
},
avatarButtonText: {
color: '#fff',
fontSize: 16,
textAlign: 'center',
},
avatar: {
width: 100,
height: 100,
borderRadius: 50,
marginVertical: 20,
},
button: {
backgroundColor: '#28a745',
padding: 15,
borderRadius: 5,
alignItems: 'center',
width: '100%',
},
buttonText: {
color: '#fff',
fontSize: 16,
fontWeight: 'bold',
},
link: {
color: '#007BFF',
marginTop: 20,
fontSize: 16,
},
});

export default Register;