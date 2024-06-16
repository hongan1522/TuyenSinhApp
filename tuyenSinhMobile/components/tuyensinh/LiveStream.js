import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, ScrollView, TextInput, Alert, StyleSheet } from 'react-native';
import MyContext from '../../configs/MyContext'; // Điều chỉnh đường dẫn theo cần thiết
import { authApi, endpoints } from '../../configs/APIs'; // Điều chỉnh đường dẫn theo cần thiết

const LivestreamPage = () => {
  const [livestreams, setLivestreams] = useState([]);
  const [questionText, setQuestionText] = useState('');
  const [state, dispatch] = useContext(MyContext);

  useEffect(() => {
    if (state.token) {
      fetchLivestreams();
    } else {
      Alert.alert('Lỗi', 'Bạn chưa đăng nhập.');
    }
  }, [state.token]);

  const fetchLivestreams = async () => {
    try {
      const api = authApi(state.token);
      const response = await api.get(endpoints.livestream);

      console.log('Livestreams:', response.data); // Log livestreams trả về từ API

      setLivestreams(response.data);
    } catch (error) {
      console.error('Error fetching livestreams:', error);
      Alert.alert('Lỗi', 'Lỗi lấy dữ liệu livestream từ APIs.');
    }
  };

  const handleQuestionSubmit = async (livestreamId) => {
    try {
      const api = authApi(state.token);

      // Gửi câu hỏi lên server
      const response = await api.post(endpoints.question, {
        question_text: questionText,
        livestream: livestreamId,
      });

      console.log('Bạn đã đặt câu hỏi thành công: ', response.data);
      setQuestionText('');
      Alert.alert('Thông báo', 'Câu hỏi của bạn đã được gửi thành công!');
    } catch (error) {
      console.error('Error submitting question:', error);
      Alert.alert('Thông báo', 'Lỗi khi gửi câu hỏi');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lịch Livestream</Text>
      <ScrollView style={styles.scrollView}>
        {livestreams.map(livestream => (
          <View key={livestream.id} style={styles.livestreamContainer}>
            <Text style={styles.livestreamTitle}>{livestream.title}</Text>
            <Text style={styles.livestreamDescription}>{livestream.description}</Text>
            <Text style={styles.livestreamDate}>Ngày Livestream: {livestream.date_time}</Text>
            <Button title="Đặt câu hỏi" onPress={() => handleQuestionSubmit(livestream.id)} />
          </View>
        ))}
      </ScrollView>
      <TextInput
        value={questionText}
        onChangeText={text => setQuestionText(text)}
        placeholder="Nhập câu hỏi của bạn..."
        style={styles.textInput}
        multiline
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  scrollView: {
    marginBottom: 20,
  },
  livestreamContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  livestreamTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#444',
  },
  livestreamDescription: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  livestreamDate: {
    fontSize: 14,
    marginBottom: 10,
    color: '#999',
  },
  textInput: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
});

export default LivestreamPage;
