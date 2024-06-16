import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import axios from "axios";
import { authApi, endpoints } from '../../configs/APIs';
import MyContext from "../../configs/MyContext";
import he from 'he'; // Import thư viện he

const QuestionsList = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [state] = useContext(MyContext);

  useEffect(() => {
    const fetchQuestionsAndAnswers = async () => {
      try {
        const api = authApi(state.token);

        // Fetch questions
        const questionsResponse = await api.get(endpoints.question);
        const fetchedQuestions = questionsResponse.data.results;

        // Fetch answers for each question
        const questionsWithAnswers = await Promise.all(
          fetchedQuestions.map(async (question) => {
            const answersResponse = await api.get(endpoints.answer);
            const filteredAnswers = answersResponse.data.results
              .filter(answer => answer.question === question.id)
              .map(answer => ({
                ...answer,
                answer_text: decodeEntities(answer.answer_text), // Decode HTML entities
              }));
            return { ...question, answers: filteredAnswers };
          })
        );

        setQuestions(questionsWithAnswers);
      } catch (error) {
        console.error("Error fetching questions and answers:", error);
        setError("Error fetching questions and answers");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionsAndAnswers();
  }, [state.token]); // Trigger useEffect on token change

  const decodeEntities = (encodedString) => {
    return he.decode(encodedString); // Sử dụng thư viện he để giải mã HTML entities
  };

  const stripHTMLTags = (htmlString) => {
    // Replace HTML tags with an empty string to strip them
    return htmlString.replace(/<[^>]*>?/gm, '');
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Error fetching questions and answers</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Danh sách câu hỏi</Text>
      <FlatList
        data={questions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{item.question_text}</Text>
            {item.answers && item.answers.length > 0 ? (
              <FlatList
                data={item.answers}
                keyExtractor={(answer) => answer.id.toString()}
                renderItem={({ item: answer }) => (
                  <View style={styles.answerContainer}>
                    <Text style={styles.answerText}>{stripHTMLTags(decodeEntities(answer.answer_text))}</Text>
                  </View>
                )}
              />
            ) : (
              <Text style={styles.noAnswerText}>Chưa có câu trả lời</Text>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ffffff",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  questionContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  questionText: {
    fontSize: 16,
    marginBottom: 5,
  },
  answerContainer: {
    marginLeft: 10,
    marginTop: 5,
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
  },
  answerText: {
    fontSize: 14,
  },
  noAnswerText: {
    marginLeft: 10,
    marginTop: 5,
    fontStyle: "italic",
    color: "#888",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
});

export default QuestionsList;
