import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export default function MapScreen() {
  const [selectedFilter, setSelectedFilter] = useState('전체');
  const [searchText, setSearchText] = useState('');

  return (

      <View style={styles.container}> 
      {/* 상단 검색창 */} 
      <View style={styles.searchContainer}> 
        <View style={styles.searchBox}>
          <TextInput placeholder="지역, 주소를 검색해보세요" 
          placeholderTextColor="#9ca3af" 
          style={styles.input} 
          value={searchText} 
          
          onChangeText={setSearchText}
          /> </View> </View>

        {/* 필터 버튼 */}
        <View style={styles.filterRow}>
          {['전체', '배출함', '폐의약품', '폐건전지'].map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.filterBtn,
                selectedFilter === item && styles.filterBtnActive,
              ]}
              onPress={() => setSelectedFilter(item)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === item && styles.filterTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 지도 자리 (흰 박스) */}
        <View style={styles.mapPlaceholder}>
          <Text style={{ color: '#9ca3af', fontSize: 13 }}>지도 API 연결 예정</Text>
        </View>
      </View>
      );
}

      const styles = StyleSheet.create({
        container: {flex:1, backgroundColor: '#fff' },

      searchContainer: {
        flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 10,
      paddingHorizontal: 16,
      backgroundColor: '#fff',
  },

      searchBox: {
        flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f3f4f6',
      borderRadius: 15,
      paddingHorizontal: 10,
      flex: 1,
      height: 50,
      justifyContent: 'space-between',
  },
      input: {marginLeft: 6, flex: 1, fontSize: 16, color: '#111827' },

      searchIconBtn: {
        padding: 4,
  },

      searchIcon: {
        width: 16,
      height: 16,
      tintColor: '#9ca3af', // 검색 아이콘 색감 회색 톤 유지
  },

      filterRow: {
        flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 12,
      marginHorizontal: 50,
  },
      filterBtn: {
        borderRadius: 20,
      borderWidth: 1,
      borderColor: '#d1d5db',
      paddingVertical: 6,
      paddingHorizontal: 12,
  },
      filterBtnActive: {
        borderColor: '#000',
      backgroundColor: '#111827',
  },
      filterText: {color: '#6b7280', fontSize: 13 },
      filterTextActive: {color: '#fff', fontWeight: '600' },

      mapPlaceholder: {
        flex: 1,
      marginTop: 4,
      backgroundColor: '#f5f5f5',
      justifyContent: 'center',
      alignItems: 'center',
      width: width,
  },
});
