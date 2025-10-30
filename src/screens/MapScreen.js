// src/screens/MapScreen.js (최종 버전)

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

                {/* 2. 상단 헤더 */}
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

                {/* 3. 하단 BottomSheet */}
                <MapBottomSheet />
                
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeContainer: { 
        flex: 1, 
        backgroundColor: '#fff' 
    },
    container: { 
        flex: 1, 
        backgroundColor: '#fff' 
    },

    // 지도 영역
    mapArea: {
        flex: 1, 
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapPlaceholderText: { 
        color: '#9CA3AF', 
        fontSize: 13 
    },
    
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
    backButton: { 
        marginRight: 8, 
        padding: 5 
    },
    
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
    input: { 
        flex: 1, 
        fontSize: 15, 
        color: '#111827', 
        paddingVertical: 0 
    },
    locateButton: { 
        marginLeft: 10, 
        padding: 5 
    },
});