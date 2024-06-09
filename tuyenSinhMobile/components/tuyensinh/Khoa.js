import { View, Text, ActivityIndicator } from "react-native";
import MyStyles from "../../styles/MyStyles";
import React, { useState } from "react";
import APIs, { endpoints } from "../../configs/APIs";
import { Chip } from "react-native-paper";

const Khoa = () => {
    const [khoa, setKhoa] = useState(null);

    const loadKhoa = async () => {
        try {
            let res = await APIs.get(endpoints['khoa'])
            setKhoa(res.data);
        } catch(ex) {
            console.error(ex)
        }
    }

    React.useEffect(() => {
        loadKhoa();
    }, []);

    return (
        <View style={MyStyles.container}>
            <Text style={MyStyles.khoaStyle}>DANH MỤC KHOAa</Text>
            {khoa===null?<ActivityIndicator/>:<>
                {khoa.map(c => <Chip key={c.id} icon="tag">{c.name}</Chip>)}
            </>}
        </View>
    );
}

export default Khoa;