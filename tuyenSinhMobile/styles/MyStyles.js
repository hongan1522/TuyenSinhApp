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
    nameDetail: {
        fontSize: 30,
        textAlign: 'center',
        lineHeight: 30 * 1.5,
        paddingBottom: 45,
        textTransform: 'uppercase',
        letterSpacing: 2,
        color: '#111',
        position: 'relative', 
    },
    underline: {
        position: 'absolute',
        bottom: 20,
        width: '60%',
        left: '20%', 
        height: 1,
        backgroundColor: '#777',
        zIndex: 4,
    },
    iconAfter: {
        position: 'absolute',
        width: 40,
        height: 40,
        left: '50%',
        marginLeft: -20,
        bottom: 0,
        fontSize: 30,
        lineHeight: 40,
        color: '#c50000',
        fontWeight: '400',
        zIndex: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f8f8',
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
    nameBold: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16
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
    name: {
        color: "green"
    },
});
