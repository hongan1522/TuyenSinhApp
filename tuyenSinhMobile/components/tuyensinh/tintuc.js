import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, TextInput, Button, FlatList } from 'react-native';
import striptags from 'striptags';
import { authApi, endpoints } from '../../configs/APIs';
import moment from 'moment';
import he from 'he';

const TinTucScreen = ({ route }) => {
    const { id } = route.params;
    const [tinTuc, setTinTuc] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMoreComments, setHasMoreComments] = useState(true);

    useEffect(() => {
        const loadTinTuc = async () => {
            try {
                const url = `${endpoints.tintuc}${id}/`;
                const response = await authApi().get(url);
                
                // Decode HTML entities and strip HTML tags
                const contentWithoutHtml = striptags(he.decode(response.data.content));
                response.data.content = contentWithoutHtml;
                setTinTuc(response.data);

                // Assuming comments are part of the response.data
                if (response.data.comments) {
                    setComments(response.data.comments);
                }
            } catch (ex) {
                setError(ex);
            } finally {
                setLoading(false);
            }
        };

        loadTinTuc();
    }, [id]);

    const loadMoreComments = async () => {
        if (!hasMoreComments) return;

        try {
            const url = `${endpoints.tintuc}${id}/binhluan/?page=${page}`;
            const response = await authApi().get(url);

            if (response.data.length === 0) {
                setHasMoreComments(false);
            } else {
                setComments(prevComments => [...prevComments, ...response.data]);
                setPage(prevPage => prevPage + 1);
            }
        } catch (ex) {
            setError(ex);
        }
    };

    const formatDate = (dateString) => {
        return moment(dateString).format('DD/MM/YYYY HH:mm');
    };

    const handleAddComment = async () => {
        if (!newComment) return;

        try {
            const response = await authApi().post(`${endpoints.tintuc}${id}/binhluan/`, { content: newComment });
            setComments([...comments, response.data]);
            setNewComment('');
        } catch (ex) {
            setError(ex);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {loading ? (
                <ActivityIndicator />
            ) : error ? (
                <Text style={styles.errorText}>Error: {error.message}</Text>
            ) : (
                <View style={styles.content}>
                    <View style={styles.datesContainer}>
                        <Text style={styles.date}>Created: {formatDate(tinTuc.created_date)}</Text>
                        <Text style={styles.date}>Updated: {formatDate(tinTuc.updates_date)}</Text>
                    </View>
                    <Text style={styles.title}>{tinTuc.name}</Text>
                    <Text style={styles.description}>{tinTuc.content || "Không có"}</Text>
                    
                    <View style={styles.commentSection}>
                        <Text style={styles.commentsTitle}>Bình luận</Text>
                        <FlatList
                            data={comments}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.comment}>
                                    <Text style={styles.commentContent}>{item.content}</Text>
                                    <Text style={styles.commentDate}>{formatDate(item.created_date)}</Text>
                                </View>
                            )}
                            onEndReached={loadMoreComments}
                            onEndReachedThreshold={0.1}
                            ListFooterComponent={hasMoreComments ? <ActivityIndicator /> : null}
                        />
                        <TextInput
                            style={styles.commentInput}
                            placeholder="Viết bình luận..."
                            value={newComment}
                            onChangeText={setNewComment}
                        />
                        <Button title="Gửi" onPress={handleAddComment} />
                    </View>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        alignItems: 'flex-start',
    },
    content: {
        width: '100%',
    },
    datesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
        width: '100%',
    },
    date: {
        fontSize: 16,
    },
    description: {
        fontSize: 16,
        textAlign: 'justify',
    },
    errorText: {
        color: 'red',
    },
    commentSection: {
        width: '100%',
        marginTop: 20,
    },
    commentsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    comment: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
    },
    commentContent: {
        fontSize: 16,
    },
    commentDate: {
        fontSize: 12,
        color: '#888',
        textAlign: 'right',
    },
    commentInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});

export default TinTucScreen;
