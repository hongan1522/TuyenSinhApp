import React, { useContext, useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { authApi, endpoints } from '../../configs/APIs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TYPE_MAP } from '../../configs/typemap';
import MyContext from '../../configs/MyContext';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    const [newsData, setNewsData] = useState({ 1: [], 2: [], 3: [], 4: [], 5: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImages, setSelectedImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);

    const [state] = useContext(MyContext); // Get state from context

    const loadTinTucs = async () => {
        try {
            let allData = [];
            let nextPage = endpoints.tintuc;

            // Fetch all pages
            while (nextPage) {
                const response = await authApi().get(nextPage);
                console.log('Tin Tức trả về:', response.data);

                allData = [...allData, ...response.data.results];
                nextPage = response.data.next;
            }

            console.log('All data received from API:', allData);

            // Sort data by publication date (assuming the field is named 'updates_date')
            allData.sort((a, b) => new Date(b.updates_date) - new Date(a.updates_date));

            const groupedData = { 1: [], 2: [], 3: [], 4: [], 5: [] };

            allData.forEach(item => {
                if (groupedData[item.tuyenSinh]) {
                    groupedData[item.tuyenSinh].push(item);
                }
            });

            console.log('Grouped Data before slicing:', groupedData);

            for (let key in groupedData) {
                groupedData[key] = groupedData[key].slice(0, 5);
            }

            console.log('Grouped Data after slicing:', groupedData);

            setNewsData(groupedData);
        } catch (ex) {
            setError(ex);
        } finally {
            setLoading(false);
        }
    };

    const loadSelectedImages = async () => {
        try {
            const savedImages = await AsyncStorage.getItem('selectedBanners');
            if (savedImages) {
                setSelectedImages(JSON.parse(savedImages));
            }
        } catch (error) {
            console.error('Error loading selected banners:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                setLoading(true);
                await loadTinTucs();
                await loadSelectedImages();
            };

            loadData();

            return () => {};
        }, [])
    );

    useEffect(() => {
        let timer;
        if (selectedImages.length > 1) {
            timer = setInterval(() => {
                setCurrentIndex(prevIndex => (prevIndex + 1) % selectedImages.length);
            }, 2000); // Change image every 2 seconds
        }

        return () => clearInterval(timer);
    }, [selectedImages]);

    useEffect(() => {
        if (flatListRef.current && selectedImages.length > 1) {
            flatListRef.current.scrollToIndex({ index: currentIndex, animated: true });
        }
    }, [currentIndex, selectedImages]);

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            {state && state.username && (
                <View style={styles.avatarContainer}>
                    <Image source={{ uri: `http://res.cloudinary.com/dcxpivgx4/image/upload/${state.avatar}` }} style={styles.avatar} />
                    <Text style={styles.userName}>Welcome, {state.username}!</Text>
                </View>
            )}
            {selectedImages.length > 0 && (
                <FlatList
                    ref={flatListRef}
                    data={selectedImages}
                    horizontal
                    pagingEnabled
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.bannerItem}>
                            <Image source={{ uri: `https://res.cloudinary.com/dcxpivgx4/${item}` }} style={styles.bannerImage} />
                        </View>
                    )}
                />
            )}
            <View style={styles.newsContainer}>
                <Text style={styles.headerText}>Tin Tức</Text>
                {loading ? (
                    <ActivityIndicator />
                ) : error ? (
                    <Text style={styles.errorText}>Error: {error.message}</Text>
                ) : (
                    <>
                        {Object.keys(newsData).map(key => (
                            <View key={key} style={styles.sectionContainer}>
                                <Text style={styles.sectionHeaderText}>{TYPE_MAP[key]}</Text>
                                {newsData[key].map(tintuc => (
                                    <TouchableOpacity
                                        key={tintuc.id}
                                        style={styles.tinTucContainer}
                                        onPress={() => navigation.navigate('TinTuc', { id: tintuc.id })}
                                    >
                                        <Text style={styles.tinTucName}>{tintuc.name}</Text>
                                    </TouchableOpacity>
                                ))}
                                <TouchableOpacity
                                    style={styles.loadMoreButton}
                                    onPress={() => navigation.navigate('SeeMore', { tuyenSinhType: parseInt(key) })}
                                >
                                    <Text style={styles.loadMoreButtonText}>Xem Thêm</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        paddingBottom: 20,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    bannerContainer: {
        width: '100%',
    },
    bannerItem: {
        width,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        margin: 0,
    },
    bannerImage: {
        width: width,
        height: '100%',
        resizeMode: 'cover',
    },
    newsContainer: {
        width: '90%',
        marginTop: 20,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
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
    },
    sectionContainer: {
        marginBottom: 20,
    },
    sectionHeaderText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    loadMoreButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    loadMoreButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default HomeScreen;
