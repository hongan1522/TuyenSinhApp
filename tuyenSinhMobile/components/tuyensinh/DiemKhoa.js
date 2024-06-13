import { View, ActivityIndicator, ScrollView, Searchbar  } from "react-native";
import MyStyles from "../../styles/MyStyles";
import React, { useState, useEffect} from "react";
import APIs, { endpoints } from "../../configs/APIs";
import { Chip, Text, DataTable } from "react-native-paper";
import Styles from "./Styles";

const DiemKhoa = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [diemKhoa, setDiemKhoa] = useState([]);
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const numberOfItemsPerPageList = [3, 5, 10];

  const fetchAllDiemKhoa = async () => {
    let allDiemKhoa = [];
    let page = 1;
    let hasNextPage = true;

    while (hasNextPage) {
      try {
        const response = await APIs.get((`${endpoints['diemkhoa']}?page=${page}`));
        const { results, next } = response.data;
        allDiemKhoa = [...allDiemKhoa, ...results];

        if (next) {
          page++;
        } else {
          hasNextPage = false;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Có lỗi xảy ra khi tải dữ liệu");
        setLoading(false);
        return []; 
      }
    }

    return allDiemKhoa;
  };

  useEffect(() => {
    const fetchAndSetData = async () => {
      try {
        const data = await fetchAllDiemKhoa();
        setDiemKhoa(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Có lỗi xảy ra khi tải dữ liệu");
        setLoading(false);
      }
    };

    fetchAndSetData();
  }, []);

  const groupDiemByKhoa = (data) => {
    const grouped = {};

    data.forEach((item) => {
      if (!grouped[item.khoa]) {
        grouped[item.khoa] = {
          name: item.khoa_name,
          diem: []
        };
      }
      grouped[item.khoa].diem.push({
        year: item.year,
        value: item.diem_value
      });
    });

    return Object.keys(grouped).map((khoa) => ({
      khoa,
      name: grouped[khoa].name,
      diem: grouped[khoa].diem
    }));
  };

  const groupedDiemKhoa = diemKhoa.length > 0 ? groupDiemByKhoa(diemKhoa) : [];

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, groupedDiemKhoa.length);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  return (
    <View style={MyStyles.container}>
      <Text style={MyStyles.title}>Điểm chuẩn 5 năm gần đây</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={MyStyles.error}>Lỗi: {error}</Text>
      ) : (
        <ScrollView>
            <ScrollView horizontal>
            <DataTable style={[Styles.table, Styles.tableHeaderText]}>
              <DataTable.Header style={Styles.tableHeaderRow}>
                <DataTable.Title style={[Styles.cellBorder, { borderLeftWidth: 0 }]}>
                  <View style={Styles.centerText}><Text style={[Styles.tableHeaderText, { flex: 1, maxWidth: 50 }]}>STT</Text></View>
                </DataTable.Title>
                <DataTable.Title style={{ flex: 5 }}>
                  <View style={Styles.centerText}><Text style={[Styles.tableHeaderText]}>Tên Khoa</Text></View>
                </DataTable.Title>
                {Array.from({ length: 5 }, (_, i) => (
                  <DataTable.Title key={`header-${i}`} style={{ flex: 1 }}>
                    <View style={Styles.centerText}><Text style={[Styles.tableHeaderText]}>{new Date().getFullYear() - i}</Text></View>
                  </DataTable.Title>
                ))}
              </DataTable.Header>
              {groupedDiemKhoa.slice(from, to).map((k, index) => (
                <DataTable.Row
                key={`khoa-${k.khoa}`}
                style={index % 2 === 0 ? Styles.tableRowEven : Styles.tableRowOdd}
              >
                <DataTable.Cell >{index + 1}</DataTable.Cell>
                <DataTable.Cell style={{ flex: 6, maxWidth: 160 }}>
                  <Text numberOfLines={0}>{k.name}</Text>
                </DataTable.Cell>
                {Array.from({ length: 5 }, (_, j) => {
                  const year = 2024 - j;
                  const diemForYear = k.diem.find(d => d.year === year);
                  return (
                    <DataTable.Cell style={{ flex: 1,}} key={`khoa-${k.khoa}-diem-${j}`}>
                      {diemForYear ? diemForYear.value : '__'}
                    </DataTable.Cell>
                  );
                })}
              </DataTable.Row>
              ))}
              <DataTable.Pagination
                page={page}
                numberOfPages={Math.ceil(groupedDiemKhoa.length / itemsPerPage)}
                onPageChange={(page) => setPage(page)}
                label={`${from + 1}-${to} of ${groupedDiemKhoa.length}`}
                numberOfItemsPerPageList={numberOfItemsPerPageList}
                numberOfItemsPerPage={itemsPerPage}
                onItemsPerPageChange={setItemsPerPage}
                showFastPaginationControls
                selectPageDropdownLabel={"Rows per page"}
              />
            </DataTable>
          </ScrollView>
        </ScrollView>
      )}
    </View>
  );
};

export default DiemKhoa;