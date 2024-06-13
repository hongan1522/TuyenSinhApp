import React, { useEffect, useState, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet, Image, FlatList, TouchableOpacity, Dimensions, Button, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const BannerComponent = ({ onSave }) => {
    const [bannerData, setBannerData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedBanners, setSelectedBanners] = useState([]);
    const maxId = 10;
    const flatListRef = useRef(null);

    useEffect(() => {
        fetchBannerData();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerData.length);
        }, 2000);

        return () => clearInterval(interval);
    }, [bannerData]);

    useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({ index: currentIndex, animated: true });
        }
    }, [currentIndex]);

    const fetchBannerData = async () => {
        try {
            const fetchedData = [];
            let id = 1;
            while (id <= maxId) {
                //const response = await fetch(`https://neutral-blatantly-ghost.ngrok-free.app/banner/${id}`);
                const response = await fetch(`https://feline-helped-safely.ngrok-free.app/banner/${id}`);
                if (!response.ok) {
                    break;
                }
                const data = await response.json();
                fetchedData.push(data);
                id++;
            }
            console.log('API response:', fetchedData);
            setBannerData(fetchedData);
        } catch (error) {
            console.error('Error fetching banner data:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const toggleSelectBanner = (image) => {
        setSelectedBanners((prevSelectedBanners) => {
            if (prevSelectedBanners.includes(image)) {
                return prevSelectedBanners.filter(banner => banner !== image);
            } else {
                return [...prevSelectedBanners, image];
            }
        });
    };

    const handleSaveSelectedBanners = async () => {
        console.log('Selected Banners:', selectedBanners);
        try {
            await AsyncStorage.setItem('selectedBanners', JSON.stringify(selectedBanners));
            if (onSave) {
                onSave(selectedBanners);
            }
        } catch (error) {
            console.error('Error saving selected banners:', error);
        }
    };

    return (
        <View style={styles.bannerContainer}>
            {loading ? (
                <ActivityIndicator />
            ) : error ? (
                <Text style={styles.errorText}>Error: {error.message}</Text>
            ) : (
                <>
                    <FlatList
                        ref={flatListRef}
                        data={bannerData}
                        horizontal
                        pagingEnabled
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[styles.bannerItem, selectedBanners.includes(item.image) && styles.selectedBannerItem]}
                                onPress={() => toggleSelectBanner(item.image)}
                            >
                                <Image source={{ uri: `https://res.cloudinary.com/dcxpivgx4/${item.image}` }} style={styles.bannerImage} />
                            </TouchableOpacity>
                        )}
                    />
                    <Button title="Save Selected Banners" onPress={handleSaveSelectedBanners} />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    bannerContainer: {
        width: '100%',
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bannerItem: {
        width,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    selectedBannerItem: {
        borderWidth: 2,
        borderColor: 'blue',
    },
    bannerImage: {
        width: width - 32,
        height: 200,
        resizeMode: 'cover',
    },
    errorText: {
        color: 'red',
    },
});

export default BannerComponent;
