import { StyleSheet } from "react-native";

export default StyleSheet.create({
    table: {
        borderWidth: 1,
        borderColor: '#dee2e6',
        borderRadius: 5,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      tableHeaderRow: {
        backgroundColor: '#318CE7',
      },
      tableHeaderText: {
        color: 'white',
        fontWeight: '900',
        textAlign: 'center',
      },
      centerText: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      tableRowEven: {
        backgroundColor: '#ffffff',
      },
      tableRowOdd: {
        backgroundColor: '#007bff20',
      }
});