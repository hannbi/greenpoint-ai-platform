// src/map/MapBottomSheet.js

import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    PanResponder,
    Dimensions,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import MapBottomSheetItem from './MapBottomSheetItem';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTOM_SHEET_MIN_HEIGHT = SCREEN_HEIGHT * 0.33; // 최소 33%
const BOTTOM_SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.7;  // 최대 70%

// ✨ 이미지 경로 수정! 문자열이 아니라 require() 사용
const MOCK_LOCATIONS = [
    {
        id: '1',
        name: '순천대학교 공대3호관',
        address: '전라남도 순천시 중앙로 255',
        distance: '2.0km',
        type: '배출함',
        status: '운영중',
        image: require('../../assets/bin1.png'), // 👈 require() 사용!
        tags: ['배출함'],
    },
    {
        id: '2',
        name: '삼산동 행정복지센터',
        address: '전라남도 순천시 삼산동 3',
        distance: '3.5km',
        type: '폐의약품',
        status: '운영중',
        image: require('../../assets/bin2.png'), // 👈 require() 사용!
        tags: ['배출함', '폐의약품'],
    },
    {
        id: '3',
        name: '순천 경찰서',
        address: '전라남도 순천시 조례동 2',
        distance: '4.2km',
        type: '배출함',
        status: '가동정지',
        image: require('../../assets/bin3.png'), // 👈 require() 사용!
        tags: ['배출함', '폐건전지'],
    },
];

export default function MapBottomSheet() {
    const [selectedFilter, setSelectedFilter] = useState('전체');
    const animatedValue = useRef(new Animated.Value(0)).current;

    // 드래그 핸들러
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gestureState) => {
                if (gestureState.dy < 0) {
                    // 위로 드래그
                    animatedValue.setValue(gestureState.dy);
                } else {
                    // 아래로 드래그
                    animatedValue.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (event, gestureState) => {
                if (gestureState.dy < -50) {
                    // 위로 → 확장
                    expandBottomSheet();
                } else if (gestureState.dy > 50) {
                    // 아래로 → 축소
                    collapseBottomSheet();
                } else {
                    // 원위치
                    Animated.spring(animatedValue, {
                        toValue: 0,
                        useNativeDriver: false,
                    }).start();
                }
            },
        })
    ).current;

    const expandBottomSheet = () => {
        Animated.spring(animatedValue, {
            toValue: -(BOTTOM_SHEET_MAX_HEIGHT - BOTTOM_SHEET_MIN_HEIGHT),
            useNativeDriver: false,
        }).start();
    };

    const collapseBottomSheet = () => {
        Animated.spring(animatedValue, {
            toValue: 0,
            useNativeDriver: false,
        }).start();
    };

    // 높이 애니메이션
    const animatedHeight = animatedValue.interpolate({
        inputRange: [-(BOTTOM_SHEET_MAX_HEIGHT - BOTTOM_SHEET_MIN_HEIGHT), 0],
        outputRange: [BOTTOM_SHEET_MAX_HEIGHT, BOTTOM_SHEET_MIN_HEIGHT],
        extrapolate: 'clamp',
    });

    // 필터링된 데이터
    const filteredLocations =
        selectedFilter === '전체'
            ? MOCK_LOCATIONS
            : MOCK_LOCATIONS.filter((loc) => loc.type === selectedFilter);

    return (
        <Animated.View style={[styles.container, { height: animatedHeight }]}>
            {/* 드래그 핸들 */}
            <View style={styles.handleContainer} {...panResponder.panHandlers}>
                <View style={styles.handle} />
            </View>

            {/* 필터 버튼 */}
            <View style={styles.filterRow}>
                {['전체', '내 주변', '운영중', '가장먼저'].map((filter) => (
                    <TouchableOpacity
                        key={filter}
                        style={[
                            styles.filterButton,
                            selectedFilter === filter && styles.filterButtonActive,
                        ]}
                        onPress={() => setSelectedFilter(filter)}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                selectedFilter === filter && styles.filterTextActive,
                            ]}
                        >
                            {filter}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* 장소 리스트 */}
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {filteredLocations.map((location) => (
                    <MapBottomSheetItem key={location.id} location={location} />
                ))}
            </ScrollView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    handleContainer: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#D1D5DB',
        borderRadius: 2,
    },
    filterRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingBottom: 15,
        gap: 8,
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        backgroundColor: '#fff',
    },
    filterButtonActive: {
        borderColor: '#078C5A',
        backgroundColor: '#078C5A',
    },
    filterText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
    },
    filterTextActive: {
        color: '#fff',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
});