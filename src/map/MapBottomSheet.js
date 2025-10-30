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
const BOTTOM_SHEET_MIN_HEIGHT = SCREEN_HEIGHT * 0.33;
const BOTTOM_SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.7;

// 실제 데이터
const MOCK_LOCATIONS = [
    // 전체 (1, 2, 3번)
    {
        id: '1',
        name: '순천대학교 공대3호관',
        address: '전라남도 순천시 중앙로 255',
        distance: '2.0km',
        type: '배출함',
        status: '운영중',
        image: require('../../assets/bin1.png'),
        tags: ['배출함'],
    },
    {
        id: '2',
        name: '삼산동 행정복지센터',
        address: '전라남도 순천시 삼산동 3',
        distance: '3.5km',
        type: '배출함',
        status: '운영중',
        image: require('../../assets/bin2.png'),
        tags: ['배출함', '폐의약품', '폐건전지'],
    },
    {
        id: '3',
        name: '순천 경찰서',
        address: '전라남도 순천시 조례동 2',
        distance: '4.2km',
        type: '배출함',
        status: '가동정지',
        image: require('../../assets/bin3.png'),
        tags: ['배출함', '폐건전지'],
    },
    
    // 폐의약품 (4, 5, 6번)
    {
        id: '4',
        name: '삼산동 행정복지센터',
        address: '전라남도 순천시 삼산동 3',
        distance: '2.0km',
        type: '폐의약품',
        status: '운영중',
        image: require('../../assets/bin4.png'),
        tags: ['폐의약품'],
    },
    {
        id: '5',
        name: '순천시 보건소',
        address: '전라남도 순천시 석현동 35-6',
        distance: '3.2km',
        type: '폐의약품',
        status: '운영중',
        image: require('../../assets/bin5.png'),
        tags: ['폐의약품'],
    },
    {
        id: '6',
        name: '매곡동 행정복지센터',
        address: '전라남도 순천시 덕암2길 63',
        distance: '4.8km',
        type: '폐의약품',
        status: '운영중',
        image: require('../../assets/bin6.png'),
        tags: ['폐의약품'],
    },
    
    // 폐건전지 (7, 8번)
    {
        id: '7',
        name: '삼산동 행정복지센터',
        address: '전라남도 순천시 삼산동 3',
        distance: '2.5km',
        type: '폐건전지',
        status: '운영중',
        image: require('../../assets/bin7.png'),
        tags: ['폐건전지'],
    },
    {
        id: '8',
        name: '매곡동 행정복지센터',
        address: '전라남도 순천시 덕암2길 63',
        distance: '5.1km',
        type: '폐건전지',
        status: '운영중',
        image: require('../../assets/bin8.png'),
        tags: ['폐건전지'],
    },
];

export default function MapBottomSheet({ selectedFilter }) {
    const [sortOption, setSortOption] = useState('내 주변');
    const animatedValue = useRef(new Animated.Value(0)).current;

    // 드래그 핸들러
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gestureState) => {
                if (gestureState.dy < 0) {
                    animatedValue.setValue(gestureState.dy);
                } else {
                    animatedValue.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (event, gestureState) => {
                if (gestureState.dy < -50) {
                    expandBottomSheet();
                } else if (gestureState.dy > 50) {
                    collapseBottomSheet();
                } else {
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

    const animatedHeight = animatedValue.interpolate({
        inputRange: [-(BOTTOM_SHEET_MAX_HEIGHT - BOTTOM_SHEET_MIN_HEIGHT), 0],
        outputRange: [BOTTOM_SHEET_MAX_HEIGHT, BOTTOM_SHEET_MIN_HEIGHT],
        extrapolate: 'clamp',
    });

    // 필터링 로직
    const filteredLocations =
        selectedFilter === '전체'
            ? MOCK_LOCATIONS.filter(loc => ['1', '2', '3'].includes(loc.id))
            : MOCK_LOCATIONS.filter((loc) => loc.type === selectedFilter);

    return (
        <Animated.View style={[styles.container, { height: animatedHeight }]}>
            {/* 드래그 핸들 */}
            <View style={styles.handleContainer} {...panResponder.panHandlers}>
                <View style={styles.handle} />
            </View>

            {/* 정렬 옵션 */}
            <View style={styles.sortRow}>
                {['내 주변', '운영중'].map((option) => (
                    <TouchableOpacity
                        key={option}
                        style={[
                            styles.sortButton,
                            sortOption === option && styles.sortButtonActive,
                        ]}
                        onPress={() => setSortOption(option)}
                    >
                        <Text
                            style={[
                                styles.sortText,
                                sortOption === option && styles.sortTextActive,
                            ]}
                        >
                            {option}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* 장소 리스트 */}
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {filteredLocations.length > 0 ? (
                    filteredLocations.map((location) => (
                        <MapBottomSheetItem key={location.id} location={location} />
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            해당하는 장소가 없습니다
                        </Text>
                    </View>
                )}
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
    sortRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingBottom: 15,
        gap: 8,
    },
    sortButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        backgroundColor: '#fff',
    },
    sortButtonActive: {
        borderColor: '#078C5A',
        backgroundColor: '#078C5A',
    },
    sortText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
    },
    sortTextActive: {
        color: '#fff',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    emptyContainer: {
        paddingVertical: 60,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: '#9CA3AF',
    },
});