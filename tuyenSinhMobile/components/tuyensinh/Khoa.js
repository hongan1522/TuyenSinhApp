import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, TouchableOpacity, ScrollView, Image, Linking } from "react-native";
import { Chip, Text, Searchbar } from "react-native-paper";
import MyStyles from "../../styles/MyStyles";
import APIs, { endpoints } from "../../configs/APIs";
import { isCloseToBottom } from "../utils/IsCloseToBottom";

const Khoa = ({navigation}) => {
    const [khoa, setKhoa] = useState([]);
    const [page, setPage] = useState(1);
    const [q, setQ] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const loadKhoa = async () => {
        if (loading || !hasMore) return;
        setLoading(true);

        try {
            const url = `${endpoints['khoa']}?q=${q}&page=${page}`;
            const res = await APIs.get(url);

            if (res.data && Array.isArray(res.data.results)) {
                setKhoa(prevKhoa => [...prevKhoa, ...res.data.results]);
                setHasMore(!!res.data.next);
            } else {
                throw new Error("Error: ", res.data);
            }
        } catch (ex) {
            setError(ex.message);
            console.error(ex);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setKhoa([]);
        setPage(1);
        setHasMore(true);
        setLoading(false);
        setError(null);
    }, [q]);

    useEffect(() => {
        loadKhoa();
    }, [page, q]);

    const loadMore = (nativeEvent) => {
        if (!loading && hasMore && isCloseToBottom(nativeEvent)) {
            setPage(prevPage => prevPage + 1);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
            <View>
                <Searchbar
                    placeholder="Tìm tên khoa..."
                    value={q}
                    onChangeText={setQ}
                    style={[MyStyles.margin, { backgroundColor: '#E6E6FA' }]}
                />
            </View>
            <ScrollView
                onScroll={({ nativeEvent }) => loadMore(nativeEvent)}
                scrollEventThrottle={16}
            >
                <View style={MyStyles.container}>
                    <Text style={[MyStyles.title, {textAlign: 'center', fontWeight: 600}]}>DANH MỤC KHOA</Text>
                    {loading && page === 1 ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : error ? (
                        <Text style={MyStyles.error}>Lỗi: {error}</Text>
                    ) : (
                        khoa.map(k => (
                            <TouchableOpacity key={k.id} onPress={() => navigation.navigate('KhoaDetail', { id: k.id })}>
                                <View  style={MyStyles.item}>
                                    <View style={MyStyles.row}>
                                        <View style={MyStyles.logoContainer}>
                                            <Image style={MyStyles.logo} source={{ uri: k.image }} />
                                        </View>
                                        <View style={MyStyles.contentContainer}>
                                            <Text style={MyStyles.label}>{k.name}</Text>
                                            <Text style={MyStyles.text}>
                                                <Text style={MyStyles.name}>Tên: </Text>
                                                {k.name}
                                            </Text>
                                            <TouchableOpacity onPress={() => Linking.openURL(k.website)}>
                                                <Text style={MyStyles.link}>
                                                    <Text style={MyStyles.name}>Trang web: </Text>
                                                    {k.website}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                    {loading && page > 1 && <ActivityIndicator size="large" color="#0000ff" />}
                </View>
            </ScrollView>
        </View>
    );
}

export default Khoa;
