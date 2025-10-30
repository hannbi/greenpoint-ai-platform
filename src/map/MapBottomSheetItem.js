// src/map/MapBottomSheetItem.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MapBottomSheetItem({ location }) {
    // API 데이터 형식에 맞게 매핑
    const name = location.name || '이름 없음';
    const address = location.address || location.location || '주소 없음';
    const distance = location.distance || '거리 정보 없음';
    
    // type 변환: '기본' → '배출함', '폐배터리' → '폐건전지'
    let type = location.type;
    if (type === '기본') type = '배출함';
    if (type === '폐배터리') type = '폐건전지';
    
    // status 변환: 'normal' → '운영중', 'full' → '가득참', 'maintenance' → '정비중'
    let status = location.status;
    if (status === 'normal') status = '운영중';
    if (status === 'full') status = '가득참';
    if (status === 'maintenance') status = '정비중';
    
    // 이미지 URL이 있으면 사용
    const image = location.imageUrl ? { uri: location.imageUrl } : null;
    
    // 태그는 type 기반으로 생성
    const tags = [type];

    // 타입별 배경색
    const getTypeColor = () => {
        switch (type) {
            case '배출함':
                return '#078C5A';
            case '폐의약품':
                return '#3B82F6';
            case '폐건전지':
                return '#F59E0B';
            default:
                return '#6B7280';
        }
    };

    // 상태별 배지 색상
    const getStatusColor = () => {
        switch (status) {
            case '운영중':
                return { bg: '#DFFEF0', text: '#078C5A' };
            case '가득참':
                return { bg: '#FEE2E2', text: '#DC2626' };
            case '정비중':
                return { bg: '#FEF3C7', text: '#D97706' };
            default:
                return { bg: '#F3F4F6', text: '#6B7280' };
        }
    };

    const statusColors = getStatusColor();

    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={0.7}
            onPress={() => console.log('장소 클릭:', name)}
        >
            {/* 왼쪽: 이미지 */}
            <View style={styles.imageWrapper}>
                {image ? (
                    <Image source={image} style={styles.image} />
                ) : (
                    <View style={[styles.imagePlaceholder, { backgroundColor: getTypeColor() }]}>
                        <Ionicons name="location" size={28} color="#fff" />
                    </View>
                )}
            </View>

            {/* 중앙: 정보 */}
            <View style={styles.infoContainer}>
                {/* 이름 + 상태 배지 */}
                <View style={styles.titleRow}>
                    <Text style={styles.name} numberOfLines={1}>
                        {name}
                    </Text>
                    {status && (
                        <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
                            <Text style={[styles.statusText, { color: statusColors.text }]}>
                                {status}
                            </Text>
                        </View>
                    )}
                </View>

                {/* 주소 */}
                <Text style={styles.address} numberOfLines={1}>
                    {address}
                </Text>

                {/* 태그들 */}
                <View style={styles.tagsRow}>
                    <View style={styles.typeTag}>
                        <Text style={styles.typeText}>{type}</Text>
                    </View>
                    {tags && tags.map((tag, index) => (
                        <View key={index} style={[styles.extraTag, getTagStyle(tag)]}>
                            <Text style={[styles.extraTagText, getTagTextStyle(tag)]}>{tag}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* 오른쪽: 거리 + 즐겨찾기 */}
            <View style={styles.rightSection}>
                <TouchableOpacity style={styles.favoriteButton}>
                    <Ionicons name="star-outline" size={20} color="#D1D5DB" />
                </TouchableOpacity>
                <Text style={styles.distance}>{distance}</Text>
            </View>
        </TouchableOpacity>
    );
}

// 태그별 스타일
function getTagStyle(tag) {
    switch (tag) {
        case '배출함':
            return { backgroundColor: '#DFFEF0', borderColor: '#078C5A' };
        case '폐의약품':
            return { backgroundColor: '#DBEAFE', borderColor: '#3B82F6' };
        case '폐건전지':
            return { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' };
        default:
            return { backgroundColor: '#F3F4F6', borderColor: '#D1D5DB' };
    }
}

function getTagTextStyle(tag) {
    switch (tag) {
        case '배출함':
            return { color: '#078C5A' };
        case '폐의약품':
            return { color: '#3B82F6' };
        case '폐건전지':
            return { color: '#F59E0B' };
        default:
            return { color: '#6B7280' };
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    imageWrapper: {
        marginRight: 12,
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 12,
    },
    imagePlaceholder: {
        width: 70,
        height: 70,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContainer: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    name: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
        flex: 1,
        marginRight: 8,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
    },
    address: {
        fontSize: 13,
        color: '#9CA3AF',
        marginBottom: 8,
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    typeTag: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
    },
    typeText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#4B5563',
    },
    extraTag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        borderWidth: 1,
    },
    extraTagText: {
        fontSize: 11,
        fontWeight: '600',
    },
    rightSection: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 70,
        paddingVertical: 4,
    },
    favoriteButton: {
        padding: 4,
    },
    distance: {
        fontSize: 13,
        fontWeight: '700',
        color: '#078C5A',
    },
});