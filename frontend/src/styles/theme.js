// src/screens/MapScreen.js

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapBottomSheet from '../map/MapBottomSheet';

export default function MapScreen({ navigation }) {
    const [selectedFilter, setSelectedFilter] = useState('전체');
    const [searchText, setSearchText] = useState('');
    
    const handleGoBack = () => {
        navigation.navigate('Home'); 
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.container}>
                
                {/* 1. 지도 영역 (배경) */}
                <View style={styles.mapArea}>
                    <Text style={styles.mapPlaceholderText}>
                        🗺️ 지도 API 연결 예정 🗺️
                    </Text>
                </View>

                {/* 2. 상단 헤더/검색창 */}
                <View style={styles.header}> 
                    <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                        <Ionicons name="arrow-back" size={24} color="#111827" />
                    </TouchableOpacity>
                    
                    <View style={styles.searchBox}>
                        <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
                        <TextInput 
                            placeholder="지역, 주소를 검색해보세요" 
                            placeholderTextColor="#9CA3AF" 
                            style={styles.input} 
                            value={searchText} 
                            onChangeText={setSearchText}
                        />
                    </View>
                    
                    <TouchableOpacity style={styles.locateButton}>
                        <Ionicons name="locate" size={24} color="#111827" />
                    </TouchableOpacity>
                </View>

                {/* 3. 필터 버튼 */}
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

                {/* 4. 하단 목록 */}
                <MapBottomSheet selectedFilter={selectedFilter} />
                
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeContainer: { flex: 1, backgroundColor: '#fff' },
    container: { flex: 1, backgroundColor: '#fff' },

    // 지도 영역
    mapArea: {
        flex: 1, 
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapPlaceholderText: { color: '#9CA3AF', fontSize: 13 },
    
    // 상단 헤더
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        zIndex: 10,
    },
    backButton: { marginRight: 8, padding: 5 },
    
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 25,
        paddingHorizontal: 12,
        flex: 1,
        height: 40,
    },
    searchIcon: { marginRight: 6 },
    input: { flex: 1, fontSize: 15, color: '#111827', paddingVertical: 0 },
    locateButton: { marginLeft: 10, padding: 5 },

    // 필터 버튼
    filterRow: {
        position: 'absolute',
        top: 65,
        left: 15,
        flexDirection: 'row',
        zIndex: 10,
    },
    filterBtn: {
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginRight: 8,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    filterBtnActive: {
        borderColor: '#111827',
        backgroundColor: '#111827',
    },
    filterText: { color: '#6B7280', fontSize: 13, fontWeight: '600' },
    filterTextActive: { color: '#fff', fontWeight: '700' },
});