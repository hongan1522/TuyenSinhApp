import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'; // Import useNavigation và useRoute hooks
import { authApi, endpoints } from '../../configs/APIs';
import { TYPE_MAP } from '../../configs/typemap'; // Import TYPE_MAP

const NewsByTypeScreen = () => {
    const [tintucs, setTinTucs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const navigation = useNavigation();
    const route = useRoute();
    const { type } = route.params; // Lấy type từ route params

    const fetchTinTucs = async () => {
        if (!hasMore) return;

        setLoading(true);
        try {
            const response = await authApi().get(`${endpoints.tintuc}?page=${page}&tuyenSinh=${type}`);
            if (response.data.next) {
                setPage(page + 1);
            } else {
                setHasMore(false);
            }
            setTinTucs(prevTinTucs => [...prevTinTucs, ...response.data.results]);
        } catch (ex) {
            setError(ex);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTinTucs();
    }, []);

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            fetchTinTucs();
        }
    };

    const renderFooter = () => {
        if (loading) {
            return <ActivityIndicator style={{ margin: 15 }} />;
        }
        if (!hasMore) {
            return <Text style={styles.noMoreText}>Không còn tin tức</Text>;
        }
        return (
            <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMore}>
                <Text style={styles.loadMoreButtonText}>Xem Trang Sau</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>{TYPE_MAP[type]}</Text>
            {error ? (
                <Text style={styles.errorText}>Error: {error.message}</Text>
            ) : (
                <FlatList
                    data={tintucs}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.tinTucContainer}
                            onPress={() => navigation.navigate('TinTuc', { id: item.id })}
                        >
                            <Text style={styles.tinTucName}>{item.name}</Text>
                            <Text style={styles.tinTucTuyenSinh}>Tuyển sinh: {TYPE_MAP[item.tuyenSinh]}</Text>
                        </TouchableOpacity>
                    )}
                    ListFooterComponent={renderFooter}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
    tinTucContainer: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    tinTucName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    tinTucTuyenSinh: {
        fontSize: 14,
        color: '#555',
    },
    loadMoreButton: {
        alignSelf: 'center',
        marginTop: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#007BFF',
        borderRadius: 5,
    },
    loadMoreButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    noMoreText: {
        textAlign: 'center',
        color: '#555',
        margin: 10,
    },
});

export default NewsByTypeScreen;
