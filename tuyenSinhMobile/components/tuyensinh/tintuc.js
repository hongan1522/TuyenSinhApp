import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TextInput, Button, FlatList, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import striptags from 'striptags';
import { authApi, endpoints } from '../../configs/APIs';
import moment from 'moment';
import he from 'he';
import MyContext from '../../configs/MyContext';

const TinTucScreen = ({ route }) => {
    const { id } = route.params;
    const [user] = useContext(MyContext);
    const { token, username, avatar, role } = user || {};
    const [tinTuc, setTinTuc] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingComments, setLoadingComments] = useState(false);
    const [error, setError] = useState(null);
    const [errorComments, setErrorComments] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMoreComments, setHasMoreComments] = useState(true);
    const [commentsPerPage] = useState(5); // Số lượng comment hiển thị mỗi lần

    useEffect(() => {
        const loadTinTuc = async () => {
            try {
                console.log('Fetching tin tuc data...');
                const url = `${endpoints.tintuc}${id}/`;
                const response = await authApi().get(url);
                console.log('Tin tuc data:', response.data);
                const contentWithoutHtml = striptags(he.decode(response.data.content));
                response.data.content = contentWithoutHtml;
                setTinTuc(response.data);

                // Load initial comments if present in the response
                if (response.data.comments) {
                    setComments(response.data.comments);
                }

                // Load comments associated with the news article, initially only page 1
                await loadComments(1);
            } catch (ex) {
                console.error('Error fetching tin tuc data:', ex);
                setError(ex);
            } finally {
                setLoading(false);
            }
        };

        loadTinTuc();
    }, [id]);

    const loadComments = async (pageNumber) => {
        try {
            console.log(`Fetching comments for page ${pageNumber}...`);
            setLoadingComments(true);
            const url = `${endpoints.binhluan}tintuc/${id}/?page=${pageNumber}&page_size=${commentsPerPage}`;
            const response = await authApi().get(url);
            console.log(`Comments data for page ${pageNumber}:`, response.data);
    
            if (!Array.isArray(response.data.results)) {
                throw new Error('Invalid data format: response.data.results is not an array');
            }
    
            if (response.data.results.length === 0) {
                setHasMoreComments(false);
            }
    
            const commentsWithUserDetails = await Promise.all(response.data.results.map(async (comment) => {
                try {
                    const userUrl = `${endpoints.register}${comment.user}/`;
                    console.log('Fetching user details for comment:', comment.id);
                    const userResponse = await authApi().get(userUrl);
                    console.log('User details:', userResponse.data);
    
                    return {
                        ...comment,
                        username: userResponse.data.username,
                        avatar: userResponse.data.avatar,
                        role: userResponse.data.role, // Ensure role is added to comment item
                    };
                } catch (ex) {
                    console.error("Error loading user details:", ex);
                    return comment;
                }
            }));
    
            // If pageNumber === 1, replace existing comments, otherwise append new comments
            setComments(prevComments => pageNumber === 1 ? commentsWithUserDetails : [...prevComments, ...commentsWithUserDetails]);
            setPage(pageNumber); // Update the page state after successful load
        } catch (ex) {
            console.error(`Error fetching comments for page ${pageNumber}:`, ex);
            setErrorComments(ex);
        } finally {
            setLoadingComments(false);
        }
    };
    
    const handleLoadMore = () => {
        if (hasMoreComments && !loadingComments) {
            loadComments(page + 1);
        }
    };

    const formatDate = (dateString) => {
        return moment(dateString).format('DD/MM/YYYY HH:mm');
    };

    const handleAddComment = async () => {
        if (!newComment || !username) return;

        const newCommentData = {
            content: newComment,
            user_id: username, // Use username or any other user identifier
            created_date: moment().toISOString(),
        };

        try {
            console.log('Adding new comment:', newCommentData);
            const response = await authApi().post(`${endpoints.tintuc}${id}/binhluan/`, newCommentData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('New comment added:', response.data);

            // Reload comments after adding new comment
            await loadComments(1);

            setNewComment('');
        } catch (ex) {
            console.error('Error adding new comment:', ex);
            setError(ex);
        }
    };

    if (loading) {
        return <ActivityIndicator style={styles.container} />;
    }

    if (error) {
        return <Text style={[styles.container, styles.errorText]}>Error: {error.message}</Text>;
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.content}>
                    <View style={styles.datesContainer}>
                        <Text style={styles.date}>Created: {formatDate(tinTuc?.created_date)}</Text>
                        <Text style={styles.date}>Updated: {formatDate(tinTuc?.updates_date)}</Text>
                    </View>
                    <Text style={styles.title}>{tinTuc?.name}</Text>
                    <Text style={styles.description}>{tinTuc?.content || "Không có"}</Text>
                    
                    <View style={styles.commentSection}>
                        <Text style={styles.commentsTitle}>Bình luận</Text>
                        <FlatList
                            data={comments}
                            keyExtractor={(item) => item.id?.toString() || `${item.created_date}-${Math.random()}`}
                            renderItem={({ item }) => (
                                <CommentItem item={item} />
                            )}
                            ListEmptyComponent={!loadingComments && <Text style={styles.noCommentsText}>Không có bình luận mới</Text>}
                            ListFooterComponent={loadingComments && <ActivityIndicator />}
                        />
                        {hasMoreComments && (
                            <Button title="Xem thêm" onPress={handleLoadMore} disabled={loadingComments} />
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* Phần nhập bình luận và nút gửi */}
            <View style={styles.commentInputContainer}>
                <TextInput
                    style={styles.commentInput}
                    placeholder="Viết bình luận..."
                    value={newComment}
                    onChangeText={setNewComment}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleAddComment}>
                    <Text style={styles.sendButtonText}>Gửi</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

// Memoized CommentItem component for optimized rendering
const CommentItem = React.memo(({ item }) => {
    const formatDate = (dateString) => {
        return moment(dateString).format('DD/MM/YYYY HH:mm');
    };

    return (
        <View style={styles.comment}>
            <View style={styles.commentHeader}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <Text style={styles.username}>{item.username}</Text>
                {item.role === 0 && <Text style={styles.role}>Admin </Text>}
                {item.role === 1 && <Text style={styles.role}>Tư vấn viên </Text>}
                {item.role === 2 && <Text style={styles.role}>User </Text>}
            </View>
            <Text style={styles.commentContent}>{item.content}</Text>
            <Text style={styles.commentDate}>{formatDate(item.created_date)}</Text>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa', // Light background for better readability
    },
    scrollContainer: {
        padding: 16,
        paddingBottom: 100, // Additional padding to ensure the input is not covered
    },
    content: {
        width: '100%',
        paddingBottom: 16,
    },
    datesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: '700', // Semi-bold for a stronger emphasis
        textAlign: 'center',
        marginBottom: 16,
        color: '#333333', // Darker text color
    },
    date: {
        fontSize: 14,
        color: '#555555', // Slightly lighter text color for dates
    },
    description: {
        fontSize: 16,
        textAlign: 'justify',
        lineHeight: 24, // Increased line height for better readability
        color: '#444444', // Slightly darker text color for the main content
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
    commentSection: {
        width: '100%',
        marginTop: 20,
        marginBottom: 25,
    },
    commentsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333333',
    },
    commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#dddddd', // Lighter border color for better aesthetics
        position: 'absolute',
        bottom: 0,
    },
    commentInput: {
        flex: 1,
        height: 40,
        borderColor: '#cccccc',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
        marginRight: 10,
        backgroundColor: '#ffffff', // White background for input
    },
    sendButton: {
        backgroundColor: '#007BFF', // Bootstrap primary color
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    sendButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    comment: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
    },
    username: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
    },
    role: {
        marginLeft: 8,
        paddingVertical: 2,
        paddingHorizontal: 6,
        borderRadius: 10,
        backgroundColor: '#e0e0e0', // Light background for role badges
        color: '#555555',
        fontSize: 12,
        fontWeight: '600',
    },
    commentContent: {
        fontSize: 16,
        color: '#444444',
    },
    commentDate: {
        fontSize: 12,
        color: '#888888',
        textAlign: 'right',
    },
    noCommentsText: {
        textAlign: 'center',
        color: '#888',
        fontSize: 16,
        padding: 16,
    },
});

export default TinTucScreen;
