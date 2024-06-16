import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity, Button } from 'react-native';
import { authApi, endpoints } from '../../configs/APIs';
import striptags from 'striptags';
import he from 'he';

const SeeMoreScreen = ({ route, navigation }) => {
    const { tuyenSinhType } = route.params;
    const [news, setNews] = useState([]);
    const [displayedNews, setDisplayedNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const itemsPerPage = 10;

    const loadAllNews = async () => {
        try {
            let allData = [];
            let nextPage = endpoints.tintuc;

            // Fetch all pages
            while (nextPage) {
                const response = await authApi().get(nextPage);
                const filteredData = response.data.results.filter(item => item.tuyenSinh === tuyenSinhType);
                allData = [...allData, ...filteredData];
                nextPage = response.data.next;
            }

            // Decode HTML entities and remove HTML tags from content
            const cleanedData = allData.map(item => ({
                ...item,
                content: striptags(he.decode(item.content)),
            }));

            // Sort data by modification date (assuming the field is named 'updates_date')
            cleanedData.sort((a, b) => new Date(b.updates_date) - new Date(a.updates_date));

            setNews(cleanedData);
            setDisplayedNews(cleanedData.slice(0, itemsPerPage));
            setHasMore(cleanedData.length > itemsPerPage);
        } catch (ex) {
            setError(ex);
        } finally {
            setLoading(false);
        }
    };

    const loadMoreNews = () => {
        const startIndex = currentPage * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageData = news.slice(startIndex, endIndex);

        setDisplayedNews(prevNews => [...prevNews, ...pageData]);
        setHasMore(news.length > endIndex);
        setCurrentPage(prevPage => prevPage + 1);
    };

    useEffect(() => {
        loadAllNews();
    }, []);

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator />
            ) : error ? (
                <Text style={styles.errorText}>Error: {error.message}</Text>
            ) : (
                <>
                    <FlatList
                        data={displayedNews}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.newsItem}
                                onPress={() => navigation.navigate('TinTuc', { id: item.id })}
                            >
                                <Text style={styles.newsTitle}>{item.name}</Text>
                                <Text style={styles.newsContent}>{item.content}</Text>
                            </TouchableOpacity>
                        )}
                    />
                    {hasMore ? (
                        <Button title="Xem thêm" onPress={loadMoreNews} />
                    ) : (
                        <Text style={styles.noMoreText}>Không còn tin tức khác</Text>
                    )}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    errorText: {
        color: 'red',
    },
    newsItem: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    newsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    newsContent: {
        fontSize: 14,
        color: '#555',
    },
    noMoreText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#555',
    },
});

export default SeeMoreScreen;
