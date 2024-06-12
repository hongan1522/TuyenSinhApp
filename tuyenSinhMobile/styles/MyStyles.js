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
            height: 4, 
        },
        shadowOpacity: 0.5,
        shadowRadius: 6.27,  
        elevation: 10,
    },
    label: {
        borderWidth: 1,
        borderColor: '#d3d3d3',
        borderRadius: 10,
        padding: 5,
        marginVertical: 5,
        width: '100%', 
        textAlign: 'center',
        backgroundColor: '#EAF2F8',
    },
    text: {
        fontSize: 16,
        marginBottom: 10,
        marginTop: 5
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
    margin: {
        margin: 7
    },
    contentContainer: {
        flex: 8, 
        justifyContent: 'center',
        paddingLeft: 30,
    },
    logoContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 88,
        height: 88,
        borderRadius: 20, 
        borderWidth: 2,    
        borderColor: 'gainsboro', 
        resizeMode: 'stretch',
    },
});
