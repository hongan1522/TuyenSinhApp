import { View, ActivityIndicator, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import MyStyles from "../../styles/MyStyles";
import React, { useState, useEffect} from "react";
import APIs, { endpoints } from "../../configs/APIs";
import { Chip, Text } from "react-native-paper";

// const DiemKhoa = () => {
//     const [diemKhoa, setDiemKhoa] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
  
//     useEffect(() => {
//       loadDiemKhoa();
//     }, []);
  
//     const loadDiemKhoa = async () => {
//       try {
//         let res = await APIs.get(endpoints['khoa']);
//         if (res.data && Array.isArray(res.data.results)) {
//           const khoaList = res.data.results;
  
//           const khoaWithDiem = await Promise.all(khoaList.map(async (k) => {
//             try {
//               let diemRes = await APIs.get(`${endpoints['khoa']}/${k.id}/get_scores_5year/`);
//               return { ...k, diem: diemRes.data };
//             } catch (ex) {
//               if (ex.response && ex.response.status === 404) {
//                 console.error(`Error fetching diem for khoa id ${k.id}: `, ex.message);
//                 return { ...k, diem: Array(5).fill(null) }; // Giả sử có 5 năm, điền null khi không có dữ liệu
//               } else {
//                 throw ex;
//               }
//             }
//           }));
  
//           setDiemKhoa(khoaWithDiem);
//         } else {
//           throw new Error("Expected an array in res.data.results but got: " + JSON.stringify(res.data));
//         }
//       } catch (ex) {
//         setError(ex.message);
//         console.error(ex);
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     return (
//       <View style={styles.container}>
//         <Text style={styles.title}>Điểm chuẩn 5 năm gần đây</Text>
//         {loading ? (
//           <ActivityIndicator size="large" color="#0000ff" />
//         ) : error ? (
//           <Text style={styles.error}>Lỗi: {error}</Text>
//         ) : (
//           <ScrollView horizontal>
//             <View style={styles.table}>
//               <View style={styles.tableRow}>
//                 <Text style={styles.tableHeader}>STT</Text>
//                 <Text style={styles.tableHeader}>Khoa</Text>
//                 {Array.from({ length: 5 }, (_, i) => (
//                   <Text key={i} style={styles.tableHeader}>Năm {2024 - i}</Text>
//                 ))}
//               </View>
//               {diemKhoa.map((k, index) => (
//                 <View key={k.id} style={styles.tableRow}>
//                   <Text style={styles.tableCell}>{index + 1}</Text>
//                   <Text style={styles.tableCell}>{k.name}</Text>
//                   {Array.from({ length: 5 }, (_, i) => {
//                     const diemForYear = k.diem ? k.diem.find((diem) => diem && diem.year === (2024 - i)) : null;
//                     return (
//                       <Text key={i} style={styles.tableCell}>
//                         {diemForYear ? diemForYear.diem.value : 'N/A'}
//                       </Text>
//                     );
//                   })}
//                 </View>
//               ))}
//             </View>
//           </ScrollView>
//         )}
//       </View>
//     );
//   };
  
//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: '#f8f8f8',
//       padding: 20,
//     },
//     title: {
//       fontSize: 24,
//       fontWeight: 'bold',
//       marginBottom: 20,
//     },
//     error: {
//       color: 'red',
//       fontSize: 18,
//     },
//     table: {
//       borderWidth: 1,
//       borderColor: '#ccc',
//     },
//     tableRow: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//     },
//     tableHeader: {
//       padding: 10,
//       fontWeight: 'bold',
//       backgroundColor: '#eee',
//       borderWidth: 1,
//       borderColor: '#ccc',
//       textAlign: 'center',
//     },
//     tableCell: {
//       padding: 10,
//       borderWidth: 1,
//       borderColor: '#ccc',
//       textAlign: 'center',
//     },
//   });
  
//   export default DiemKhoa;

const DiemKhoa = () => {
    const [diemKhoa, setDiemKhoa] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      loadDiemKhoa();
    }, []);
  
    const loadDiemKhoa = async () => {
      try {
        let res = await APIs.get(endpoints['diemkhoa']);
        if (res.data && Array.isArray(res.data.results)) {
          const groupedDiemKhoa = groupDiemKhoaByKhoa(res.data.results);
          setDiemKhoa(groupedDiemKhoa);
        } else {
          throw new Error("Expected an array in res.data.results but got: " + JSON.stringify(res.data));
        }
      } catch (ex) {
        setError(ex.message);
        console.error(ex);
      } finally {
        setLoading(false);
      }
    };
  
    const groupDiemKhoaByKhoa = (data) => {
      const groupedData = {};
  
      data.forEach(item => {
        const { khoa, diem, year } = item;
        if (!groupedData[khoa.id]) {
          groupedData[khoa.id] = { id: khoa.id, name: khoa.name, diem: [] };
        }
        groupedData[khoa.id].diem.push({ year, value: diem });
      });
  
      // Sắp xếp điểm theo năm giảm dần
      for (const khoaId in groupedData) {
        groupedData[khoaId].diem.sort((a, b) => b.year - a.year);
      }
  
      return Object.values(groupedData);
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Điểm chuẩn 5 năm gần đây</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : error ? (
          <Text style={styles.error}>Lỗi: {error}</Text>
        ) : (
          <ScrollView horizontal>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>STT</Text>
                <Text style={styles.tableHeader}>Khoa</Text>
                {Array.from({ length: 5 }, (_, i) => (
                  <Text key={i} style={styles.tableHeader}>{2024 - i}</Text>
                ))}
              </View>
              {diemKhoa.map((k, index) => (
                <View key={k.id} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{index + 1}</Text>
                  <Text style={styles.tableCell}>{k.name}</Text>
                  {Array.from({ length: 5 }, (_, i) => {
                    const diemForYear = k.diem.find(d => d.year === (2024 - i));
                    return (
                      <Text key={i} style={styles.tableCell}>
                        {diemForYear ? diemForYear.value : 'N/A'}
                      </Text>
                    );
                  })}
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f8f8',
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    error: {
      color: 'red',
      fontSize: 18,
    },
    table: {
      borderWidth: 1,
      borderColor: '#ccc',
    },
    tableRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    tableHeader: {
      padding: 10,
      fontWeight: 'bold',
      backgroundColor: '#eee',
      borderWidth: 1,
      borderColor: '#ccc',
      textAlign: 'center',
    },
    tableCell: {
      padding: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      textAlign: 'center',
    },
  });
  
  export default DiemKhoa;