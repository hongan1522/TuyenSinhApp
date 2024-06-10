import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image, TouchableOpacity } from 'react-native';

const BannerComponent = ({ onBannerLongPress }) => {
    const [bannerData, setBannerData] = useState([]); // Dữ liệu của banner từ API
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const maxId = 10; // Số id tối đa bạn muốn thử lấy

    useEffect(() => {
        fetchBannerData();
    }, []);

    const fetchBannerData = async () => {
        try {
            const fetchedData = [];
            let id = 1;
            while (id <= maxId) {
                // Gửi request API cho từng banner id
                const response = await fetch(`https://neutral-blatantly-ghost.ngrok-free.app/banner/${id}`);
                if (!response.ok) {
                    // Khi không còn dữ liệu nữa, thoát khỏi vòng lặp
                    break;
                }
                const data = await response.json();
                fetchedData.push(data);
                id++;
            }
            console.log('API response:', fetchedData); // Log để kiểm tra dữ liệu trả về từ API
            setBannerData(fetchedData); // Cập nhật state với dữ liệu từ API
        } catch (error) {
            console.error('Error fetching banner data:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.khoaStyle}>DANH MỤC BANNER</Text>
            {loading ? (
                <ActivityIndicator />
            ) : error ? (
                <Text style={styles.errorText}>Error: {error.message}</Text>
            ) : (
                <View>
                    {bannerData.map((banner, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.bannerItem}
                            onPress={() => onBannerLongPress && onBannerLongPress(banner.image)} // Sửa thành onPress và kiểm tra onBannerLongPress
                        >
                            <Image source={{ uri: `https://res.cloudinary.com/dcxpivgx4/${banner.image}` }} style={styles.bannerImage} />
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    khoaStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    errorText: {
        color: 'red',
    },
    bannerItem: {
        marginBottom: 16,
    },
    bannerImage: {
        width: 200,
        height: 200,
        resizeMode: 'cover',
    },
});

export default BannerComponent;
