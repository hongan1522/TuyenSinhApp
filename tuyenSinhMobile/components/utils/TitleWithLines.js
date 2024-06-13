import React from 'react';
import { View, Text } from 'react-native';
import MyStyles from '../../styles/MyStyles';
import { FontAwesome } from '@expo/vector-icons'; 

const TitleWithLines = ({ title }) => (
    <View>
        <Text style={MyStyles.nameDetail}>{title}</Text>
        <View style={MyStyles.underline}></View>
        <View style={MyStyles.iconAfter}>
            <Text style={{ fontSize: 24 }}>
                <FontAwesome name="diamond" />
            </Text>
        </View>
    </View>
);

export default TitleWithLines;
