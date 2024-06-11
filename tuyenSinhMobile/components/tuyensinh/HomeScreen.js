import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { authApi, endpoints } from '../../configs/APIs';

const HomeScreen = () => {
    const [tintucs, setTinTucs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadTinTucs = async () => {
            try {
                const response = await authApi().get(endpoints.tintuc);
                console.log('API response:', response.data); // Log API response
                setTinTucs(response.data);
            } catch (ex) {
                console.error('Error fetching tin tuc:', ex);
                setError(ex);
            } finally {
                setLoading(false);
            }
        }

        loadTinTucs();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Tin Tức</Text>
            {loading ? (
                <ActivityIndicator />
            ) : error ? (
                <Text>Error: {error.message}</Text>
            ) : (
                <View>
                    {tintucs.map(tintuc => (
                        <View key={tintuc.id} style={styles.tinTucContainer}>
                            <Text style={styles.tinTucName}>{tintuc.name}</Text>
                            <Text style={styles.tinTucTuyenSinh}>Tuyển sinh: {tintuc.tuyenSinh}</Text>
                        </View>
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
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    tinTucContainer: {
        marginBottom: 20,
    },
    tinTucName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    tinTucTuyenSinh: {
        fontSize: 14,
    },
});

export default HomeScreen;
