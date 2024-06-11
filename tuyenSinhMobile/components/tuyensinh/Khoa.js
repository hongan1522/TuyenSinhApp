import { View, ActivityIndicator, TouchableOpacity } from "react-native";
import MyStyles from "../../styles/MyStyles";
import React, { useState, useEffect} from "react";
import APIs, { endpoints } from "../../configs/APIs";
import { Chip, Text } from "react-native-paper";

const Khoa = () => {
    const [khoa, setKhoa] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadKhoa = async () => {
        try {
            let res = await APIs.get(endpoints['khoa']);
            if (res.data && Array.isArray(res.data.results)) {
                console.info(res.data);
                setKhoa(res.data.results);
            } else {
                throw new Error("Error: ", res.data);
            }
        } catch (ex) {
            setError(ex.message);
            console.error(ex);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadKhoa();
    }, []);

    return (
        <View style={MyStyles.container}>
            <Text style={MyStyles.title}>DANH MỤC KHOA</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
                <Text style={MyStyles.error}>Lỗi: {error}</Text>
            ) : (
                <View style={MyStyles.row}>
                    {khoa.map(k => (
                        <Chip key={k.id} style={[MyStyles.chip]}>{k.name}</Chip>
                    ))}
                </View>
            )}

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
                <Text style={MyStyles.error}>Lỗi: {error}</Text>
            ) : (
                khoa.map(k => (
                    <View key={k.id} style={MyStyles.item}>
                        <View><Text key={k.id} variant="titleLarge" style={MyStyles.label}>{k.name}</Text></View>
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
                ))
            )}
        </View>
    );
}

export default Khoa;
