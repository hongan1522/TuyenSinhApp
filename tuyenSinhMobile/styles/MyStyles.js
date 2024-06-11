import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        padding: 20,
    },
    row: {
        display: "flex",
        flexDirection: "row",
        textAlign: 'center',
        flexWrap: 'wrap',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    item: {
        marginBottom: 20,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 20,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    chip: {
        margin: 5,
        marginBottom: 20,
        justifyContent: 'flex-start',
    },
    label: {
        borderWidth: 1,
        borderColor: '#d3d3d3',
        borderRadius: 10,
        padding: 5,
        marginVertical: 5,
        width: '100%', 
        textAlign: 'center',
        backgroundColor: '#E8E8E8',
    },
    text: {
        fontSize: 16,
        marginBottom: 5,
    },
    link: {
        color: 'blue',
        textDecorationLine: 'none',
    },
    name: {
        color: 'black',
        fontWeight: 'bold'
    },
    error: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
});
