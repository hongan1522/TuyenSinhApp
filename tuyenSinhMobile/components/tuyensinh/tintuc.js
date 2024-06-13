import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import striptags from 'striptags';
import { authApi, endpoints } from '../../configs/APIs';
import moment from 'moment'; // Make sure to install moment.js with `npm install moment`

const TinTucScreen = ({ route }) => {
    const { id } = route.params;
    const [tinTuc, setTinTuc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadTinTuc = async () => {
            try {
                const url = `${endpoints.tintuc}${id}`;
                console.log(`Fetching news item with URL: ${url}`);
                const response = await authApi().get(url);
                console.log('API response:', response.data);
                // Loại bỏ thẻ HTML từ nội dung tin tức
                const contentWithoutHtml = striptags(response.data.content);
                response.data.content = contentWithoutHtml;
                setTinTuc(response.data);
            } catch (ex) {
                console.error('Error fetching tin tuc:', ex);
                setError(ex);
            } finally {
                setLoading(false);
            }
        };

        loadTinTuc();
    }, [id]);

    const formatDate = (dateString) => {
        const formattedDate = moment(dateString).format('DD/MM/YYYY HH:mm');
        console.log(`Formatted date for ${dateString}: ${formattedDate}`);
        return formattedDate;
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {loading ? (
                <ActivityIndicator />
            ) : error ? (
                <Text style={styles.errorText}>Error: {error.message}</Text>
            ) : (
                <View style={styles.content}>
                    <View style={styles.datesContainer}>
                        <Text style={styles.date}>Created: {tinTuc ? formatDate(tinTuc.created_date) : ''}</Text>
                        <Text style={styles.date}>Updated: {tinTuc ? formatDate(tinTuc.updates_date) : ''}</Text>
                    </View>
                    <Text style={styles.title}>{tinTuc ? tinTuc.name : ''}</Text>
                    <Text style={styles.description}>{tinTuc ? tinTuc.content || "Không có" : ''}</Text>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        alignItems: 'flex-start', // Align items to the top
    },
    content: {
        width: '100%',
    },
    datesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 16,
    },
    title: {
        fontSize: 28, // Increased font size
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
        width: '100%', // Ensure it spans full width for centering
    },
    date: {
        fontSize: 16,
    },
    description: {
        fontSize: 16,
        textAlign: 'justify', // Justify text
    },
    errorText: {
        color: 'red',
    },
});

export default TinTucScreen;
