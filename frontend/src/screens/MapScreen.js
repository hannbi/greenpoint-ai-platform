import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import KakaoMap from '../components/KakaoMap';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapBottomSheet from '../map/MapBottomSheet';

const { width, height } = Dimensions.get('window');

export default function MapScreen({ route, navigation }) {
    const [selectedFilter, setSelectedFilter] = useState('전체');
    const [searchText, setSearchText] = useState('');
    const [bins, setBins] = useState([]); // 배출함 데이터 상태 추가

    // 화면이 포커스될 때마다 실행
    useFocusEffect(
        React.useCallback(() => {
            if (route?.params?.filter) {
                // params에 filter가 있으면 해당 필터 적용
                setSelectedFilter(route.params.filter);
                // params 초기화 (다음에 하단바로 들어올 때 '전체'로 리셋되도록)
                navigation.setParams({ filter: undefined });
            } else {
                // params가 없으면 '전체'로 초기화
                setSelectedFilter('전체');
            }
        }, [route?.params?.filter, navigation])
    );
    
    const handleGoBack = () => {
        navigation.navigate('Home'); 
    };

    // KakaoMap에서 배출함 데이터를 받아서 상태에 저장
    const handleBinsUpdate = (newBins) => {
        setBins(newBins);
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.container}>
                {/* 지도 영역 */}
                <View style={styles.mapContainer}>
                    <KakaoMap
                        selectedFilter={selectedFilter}
                        onBinsUpdate={handleBinsUpdate}
                        onMapClick={(data) => {
                            console.log('지도에서 클릭한 좌표:', data.lat, data.lng);
                        }}
                    />
                </View>

                {/* 헤더 (지도 위에 오버레이) */}
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

                {/* 필터 버튼 (지도 위에 오버레이) */}
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

                {/* 바텀시트 */}
                <MapBottomSheet 
                    selectedFilter={selectedFilter} 
                    bins={bins}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeContainer: { flex: 1, backgroundColor: '#fff' },
    container: { flex: 1, backgroundColor: '#fff' },
    mapContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
    },
    mapArea: {
        flex: 1, 
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapPlaceholderText: { color: '#9CA3AF', fontSize: 13 },
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