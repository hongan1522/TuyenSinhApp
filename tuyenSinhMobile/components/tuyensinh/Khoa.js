import { View, ActivityIndicator, TouchableOpacity, ScrollView, Image, Linking } from "react-native";
import MyStyles from "../../styles/MyStyles";
import React, { useState, useEffect} from "react";
import APIs, { endpoints } from "../../configs/APIs";
import { Chip, Text, ListItem } from "react-native-paper";


const Khoa = () => {
    const [khoa, setKhoa] = useState([]);
    const [khoaId, setKhoaId] = React.useState("");
    const [page, setPage] = React.useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadKhoa = async () => {
        try {
            let allKhoa = [];
            let nextPage = endpoints['khoa'];
            
            while (nextPage) {
                const res = await APIs.get(nextPage);
                if (res.data && Array.isArray(res.data.results)) {
                    console.info(res.data);
                    allKhoa = [...allKhoa, ...res.data.results];
                    nextPage = res.data.next;
                } else {
                    throw new Error("Error: ", res.data);
                }
            }
    
            setKhoa(allKhoa);
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
    
    const search = (value, callback) => {
        setPage(1);
        callback(value);
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <View style={MyStyles.container}>
                    <Text style={MyStyles.title}>DANH MỤC KHOA</Text>
                    {/* <View style={MyStyles.row}>
                        <Chip mode={!khoaId?"outlined":"flat"} onPress={() => search("", setKhoaId)} icon="shape-plus" style={MyStyles.margin}>Tất cả</Chip>
                        {khoa===null?<ActivityIndicator/>:<>
                            {khoa.map(k => <Chip mode={k.id===khoaId?"outlined":"flat"} key={k.id} onPress={() => search(k.id, setKhoaId)} icon="shape-plus" style={MyStyles.margin}>{k.name}</Chip>)}</>}
                    </View> */}

                    {loading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : error ? (
                        <Text style={MyStyles.error}>Lỗi: {error}</Text>
                    ) : (
                        khoa.map(k => (
                            // <View key={k.id} style={MyStyles.item}>
                            //     <View><Text key={k.id} variant="titleLarge" style={MyStyles.label}>{k.name}</Text></View>
                            //     <Text style={MyStyles.text}>
                            //         <Text style={MyStyles.name}>Tên: </Text>
                            //         {k.name}
                            //     </Text>
                            //     <TouchableOpacity onPress={() => Linking.openURL(k.website)}>
                            //         <Text style={MyStyles.link}>
                            //             <Text style={MyStyles.name}>Trang web: </Text>
                            //             {k.website}
                            //         </Text>
                            //     </TouchableOpacity>
                            // </View>
                            <View key={k.id} style={MyStyles.item}>
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
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

export default Khoa;
