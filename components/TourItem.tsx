import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Tour, formatDate, getSeatLabel } from '../utils/tour.js';

export interface TourItemProps {
  tour: Tour;
  compact?: boolean;
  onPress: (tour: Tour) => void;
  onToggleFavorite: (id: string, next: boolean) => void;
}

const TourItem: React.FC<TourItemProps> = ({ tour, compact = false, onPress, onToggleFavorite }) => {
  const isLowSeat = tour.seats <= 3;

  if (compact) {
    return (
      <TouchableOpacity style={styles.compactCard} onPress={() => onPress(tour)}>
        <Image source={{ uri: tour.image }} style={styles.compactImage} />
        <TouchableOpacity 
          testID="fav-btn" 
          style={styles.compactFavBtn} 
          onPress={() => onToggleFavorite(tour.id, !tour.isFavorite)}
        >
          <Text style={{ fontSize: 14 }}>{tour.isFavorite ? '♥' : '♡'}</Text>
        </TouchableOpacity>
        <Text numberOfLines={1} style={styles.compactName}>{tour.name}</Text>
        <Text style={styles.price}>{tour.price.toLocaleString('vi-VN')} ₫</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.normalCard} onPress={() => onPress(tour)}>
      <Image source={{ uri: tour.image }} style={styles.normalImage} />
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>{tour.name}</Text>
        <Text style={styles.city}>{tour.city}</Text>
        <Text style={styles.subText}>📅 {formatDate(tour.departure)} · {tour.days} ngày</Text>
        <View style={styles.row}>
          <Text style={styles.price}>{tour.price.toLocaleString('vi-VN')} ₫</Text>
          <Text style={[styles.seatLabel, isLowSeat && styles.redText]}>
            {getSeatLabel(tour.seats)}
          </Text>
        </View>
      </View>
      <TouchableOpacity 
        testID="fav-btn" 
        style={styles.favBtn} 
        onPress={() => onToggleFavorite(tour.id, !tour.isFavorite)}
      >
        <Text style={{ fontSize: 22, color: tour.isFavorite ? 'red' : '#999' }}>
          {tour.isFavorite ? '♥' : '♡'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default React.memo(TourItem);

const styles = StyleSheet.create({
  normalCard: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    padding: 10, 
    marginVertical: 6, 
    borderRadius: 8, 
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    elevation: 2 
  },
  normalImage: { width: 90, height: 90, borderRadius: 8 },
  infoContainer: { flex: 1, marginLeft: 10 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  city: { fontSize: 13, color: '#666' },
  subText: { fontSize: 12, color: '#444', marginVertical: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4, alignItems: 'center' },
  price: { fontSize: 14, fontWeight: 'bold', color: '#007AFF' },
  seatLabel: { fontSize: 12, color: '#333' },
  redText: { color: 'red', fontWeight: 'bold' },
  favBtn: { padding: 10 },

  compactCard: { 
    width: 160, 
    backgroundColor: '#fff', 
    borderRadius: 8, 
    padding: 8, 
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    elevation: 1
  },
  compactImage: { width: '100%', aspectRatio: 4 / 3, borderRadius: 6 },
  compactFavBtn: { 
    position: 'absolute', 
    top: 12, 
    right: 12, 
    backgroundColor: 'rgba(255,255,255,0.9)', 
    padding: 6, 
    borderRadius: 15,
    elevation: 2
  },
  compactName: { fontSize: 14, fontWeight: 'bold', marginTop: 6, color: '#333' },
});