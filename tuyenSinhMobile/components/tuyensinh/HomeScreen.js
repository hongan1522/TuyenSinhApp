import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { authApi, endpoints } from '../../configs/APIs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TYPE_MAP } from '../../configs/typemap';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    const [newsData, setNewsData] = useState({ 1: [], 2: [], 3: [], 4: [], 5: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImages, setSelectedImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);

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
    bannerContainer: {
        width: '100%',
    },
    bannerItem: {
        width,
        height: 150, // Adjust the height to your desired value, for example, 150
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0, // No padding
        margin: 0, // No margin
    },
    bannerImage: {
        width: width,
        height: '100%', // Ensures the image occupies the full height of the container
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
        marginBottom: 10, // Decrease margin bottom
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
        fontSize: 16, // Decrease font size
        fontWeight: 'bold',
    },
    tinTucTuyenSinh: {
        fontSize: 14, // Decrease font size
        color: '#555',
    },
    loadMoreButton: {
        alignSelf: 'center',
        marginTop: 10, // Add some margin top
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#007BFF',
        borderRadius: 5,
    },
    loadMoreButtonText: {
        color: '#fff',
        fontSize: 14, // Decrease font size
        fontWeight: 'bold',
    },
    sectionContainer: {
        width: '100%',
        marginTop: 20,
        backgroundColor: '#fff',
        padding: 10,
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
    sectionHeaderText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default HomeScreen;
