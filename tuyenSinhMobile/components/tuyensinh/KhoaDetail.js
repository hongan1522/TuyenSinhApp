import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Image, TouchableOpacity, Linking, StyleSheet, ScrollView } from 'react-native';
import APIs, { endpoints } from '../../configs/APIs';
import MyStyles from '../../styles/MyStyles';
import striptags from 'striptags';
import { Video } from 'expo-av';
import TitleWithLines from '../utils/TitleWithLines';

const KhoaDetail = ({route}) => {
    const [khoa, setKhoa] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { id } = route.params;

    const loadKhoa = async () => {
        try {
            const url = `${endpoints['khoa']}${id}`;
            setLoading(true);
            const res = await APIs.get(url);
            if (res.data) {
                let contentWithoutHtml = striptags(res.data.introduction);
                res.data.introduction = contentWithoutHtml;
                contentWithoutHtml = striptags(res.data.program_description);
                res.data.program_description = contentWithoutHtml;
                setKhoa(res.data);
            } else {
                setError("Không tìm thấy thông tin khoa");
            }
        } catch (ex) {
            setError(ex.message);
            console.error(ex);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadKhoa();
    }, [id]);

    if (loading) {
        return (
            <View style={[MyStyles.container, MyStyles.center]}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={[MyStyles.container, MyStyles.center]}>
                <Text style={MyStyles.error}>{error}</Text>
            </View>
        );
    }

    if (!khoa) {
        return null;
    }

    return (
        <ScrollView>
            <View style={MyStyles.container}>
                <TitleWithLines title={khoa.name} />
                {khoa.image && (
                    <Image source={{ uri: khoa.image }} style={styles.image} />
                )}
                <Text style={MyStyles.margin}>
                    <Text style={[MyStyles.name]}>Giới thiệu: </Text>
                {khoa.introduction}</Text>
                <Text style={MyStyles.margin}>
                    <Text style={MyStyles.name}>Chương trình đào tạo: </Text>
                {khoa.program_description}</Text>
                {khoa.website && (
                    <TouchableOpacity onPress={() => Linking.openURL(khoa.website)}>
                        <Text style={[MyStyles.link, MyStyles.margin]}>
                            <Text style={MyStyles.name}>Trang web: </Text>
                        {khoa.website}</Text>
                    </TouchableOpacity>
                )}
                {khoa.video && (
                    <Video
                        source={{ uri: khoa.video }}
                        style={[styles.video, MyStyles.margin]}
                        useNativeControls
                        resizeMode="stretch"
                        isLooping
                    />
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    image: {
        width: '60%',
        height: 100, 
        resizeMode: 'stretch',
        marginBottom: 15,
        marginLeft: 60,
    },
    video: {
        width: '100%',
        height: 300, 
        marginBottom: 10,
    }
});

export default KhoaDetail;