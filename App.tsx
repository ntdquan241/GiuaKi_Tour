import React, { useState, useEffect, useMemo } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  SectionList, 
  FlatList, 
  ActivityIndicator, 
  RefreshControl, 
  Alert 
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import TourItem from './components/TourItem';
import { Tour, groupByCity, formatDate } from './utils/tour';

const API_URL = 'https://6ac9d0b93115bcc958200204.mockapi.io/tours';

export default function App() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchTours = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTours(data);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách tour từ máy chủ.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTours();
  };

  const handleToggleFavorite = async (id: string, next: boolean) => {
    if (!id) return;
    const previousTours = [...tours];

    // Cập nhật lạc quan (Optimistic Update)
    setTours(prev => prev.map(item => item.id === id ? { ...item, isFavorite: next } : item));

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: next }),
      });

      if (!response.ok) throw new Error();
    } catch (error) {
      setTours(previousTours);
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái yêu thích.');
    }
  };

  const handleTourPress = (tour: Tour) => {
    Alert.alert(
      'Thông tin Tour',
      `Tên: ${tour.name}\nNgày khởi hành: ${formatDate(tour.departure)}\nSố ngày: ${tour.days} ngày\nGiá: ${tour.price.toLocaleString('vi-VN')} ₫`
    );
  };

  const filteredTours = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return tours;
    return tours.filter(tour => tour.name && tour.name.toLowerCase().includes(query));
  }, [tours, searchQuery]);

  const sectionData = useMemo(() => {
    return groupByCity(filteredTours);
  }, [filteredTours]);

  const favoriteTours = useMemo(() => {
    return tours.filter(tour => tour.isFavorite);
  }, [tours]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.appTitle}>Tour Việt</Text>
          <Text style={styles.studentInfo}>21123456 – Nguyễn Trọng Tiến</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm tour theo tên..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : (
          <SectionList
            sections={sectionData}
            keyExtractor={item => item.id}
            stickySectionHeadersEnabled={true}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListHeaderComponent={
              <View style={styles.favSectionContainer}>
                <Text style={styles.sectionTitleHeader}>Tour yêu thích ({favoriteTours.length})</Text>
                {favoriteTours.length === 0 ? (
                  <Text style={styles.emptyFavText}>Chưa có tour yêu thích</Text>
                ) : (
                  <FlatList
                    horizontal
                    data={favoriteTours}
                    keyExtractor={item => `fav-${item.id}`}
                    showsHorizontalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
                    renderItem={({ item }) => (
                      <TourItem 
                        tour={item} 
                        compact={true} 
                        onPress={handleTourPress} 
                        onToggleFavorite={handleToggleFavorite} 
                      />
                    )}
                  />
                )}
              </View>
            }
            renderItem={({ item }) => (
              <TourItem 
                tour={item} 
                compact={false} 
                onPress={handleTourPress} 
                onToggleFavorite={handleToggleFavorite} 
              />
            )}
            renderSectionHeader={({ section: { title } }) => (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{title}</Text>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>Không tìm thấy tour phù hợp</Text>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  appTitle: { fontSize: 22, fontWeight: 'bold', color: '#007AFF' },
  studentInfo: { fontSize: 13, color: '#555', marginTop: 2 },
  searchInput: {
    height: 42,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 10,
    backgroundColor: '#fdfdfd',
  },
  listContainer: { paddingHorizontal: 16, paddingBottom: 20 },
  centerContainer: { padding: 40, alignItems: 'center', justifyContent: 'center' },
  favSectionContainer: { marginVertical: 12 },
  sectionTitleHeader: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  emptyFavText: { fontSize: 13, color: '#888', fontStyle: 'italic', marginBottom: 6 },
  sectionHeader: { backgroundColor: '#f8f9fa', paddingVertical: 6, marginTop: 10 },
  sectionHeaderText: { fontSize: 15, fontWeight: 'bold', color: '#007AFF' },
  emptyText: { fontSize: 14, color: '#777', textAlign: 'center', marginTop: 20 },
});