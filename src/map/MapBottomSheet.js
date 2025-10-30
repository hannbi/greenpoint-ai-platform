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

export default function MapBottomSheet({ selectedFilter, bins = [] }) {
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
    const filteredLocations = bins.filter((bin) => {
        if (selectedFilter === '전체') return true;
        if (selectedFilter === '배출함') return bin.type === '기본';
        if (selectedFilter === '폐의약품') return bin.type === '폐의약품';
        if (selectedFilter === '폐건전지') return bin.type === '폐배터리';
        return true;
    });

    // 정렬 옵션 적용
    const sortedLocations = [...filteredLocations].sort((a, b) => {
        if (sortOption === '운영중') {
            // status가 'normal'인 것 우선
            if (a.status === 'normal' && b.status !== 'normal') return -1;
            if (a.status !== 'normal' && b.status === 'normal') return 1;
        }
        // 기본: 내 주변 (거리순) - 거리 계산 필요시 추가
        return 0;
    });

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
                {sortedLocations.length > 0 ? (
                    sortedLocations.map((location) => (
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