import React, { useEffect, useState } from 'react';
import { View, Image, Text } from 'react-native';

const BannerComponent = () => {
    const [bannerData, setBannerData] = useState(null);

    useEffect(() => {
        fetchBannerData();
    }, []);

    const fetchBannerData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/banner/');
            const data = await response.json();
            setBannerData(data[0]); // Assuming you're fetching a single banner
        } catch (error) {
            console.error('Error fetching banner data:', error);
        }
    };
    

    return (
        <View>
            {bannerData && (
                <View>
                    <Image
                        source={{ uri: bannerData.image_url }}
                        style={{ width: '100%', height: 200 }} // Adjust the styles as needed
                    />
                    <Text>Danh muc Banner</Text>  {/* Assuming 'title' is a field in your Banner model */}
                </View>
            )}
        </View>
    );
};

export default BannerComponent;
