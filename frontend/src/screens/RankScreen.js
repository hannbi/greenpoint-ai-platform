// src/screens/RankScreen.js

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window');

export default function RankScreen() {
    const [selectedTab, setSelectedTab] = useState('개인'); // '기관/기업' or '개인'

    // 상위 3명 데이터 (podium)
    const topThree = [
        { rank: 2, name: '성원', carbon: 56.1, avatar: require('../../assets/sw_profile.png') },
        { rank: 1, name: '태범', carbon: 58.3, avatar: require('../../assets/tb_profile.png') },
        { rank: 3, name: '한비', carbon: 48.5, avatar: require('../../assets/profile.png') },
    ];

    // 4위 ~ 8위 리스트 데이터
    const rankList = [
        { rank: 4, name: '윤원', carbon: 46.1, avatar: require('../../assets/default_profile.png') },
        { rank: 5, name: '수용', carbon: 46.1, avatar: require('../../assets/default_profile.png') },
        { rank: 6, name: '선우', carbon: 46.1, avatar: require('../../assets/default_profile.png') },
        { rank: 7, name: '재우', carbon: 46.1, avatar: require('../../assets/default_profile.png') },
        { rank: 8, name: '윤원', carbon: 46.1, avatar: require('../../assets/default_profile.png') },
    ];

    return (
        <SafeAreaView style={styles.safeContainer}>
            <LinearGradient
                colors={['#078C5A', '#0c3727ff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.container}
            >
                {/* 헤더 */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton}>
                        <Text style={styles.backIcon}>‹</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>랭킹</Text>
                    <View style={styles.placeholder} />
                </View>

                {/* 탭 전환 */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, selectedTab === '기관/기업' && styles.tabActive]}
                        onPress={() => setSelectedTab('기관/기업')}
                    >
                        <Text style={[styles.tabText, selectedTab === '기관/기업' && styles.tabTextActive]}>
                            기관/기업
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, selectedTab === '개인' && styles.tabActive]}
                        onPress={() => setSelectedTab('개인')}
                    >
                        <Text style={[styles.tabText, selectedTab === '개인' && styles.tabTextActive]}>
                            개인
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* 스크롤 영역 */}
                <View style={styles.contentWrapper}>
                    <ScrollView 
                        style={styles.scrollArea}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* 상위 3명 Podium */}
                        <View style={styles.podiumContainer}>
                            {/* 2등 (왼쪽) */}
                            <View style={styles.podiumItem}>
                                <View style={styles.crownContainer}>
                                    <Text style={styles.crownIcon}></Text>
                                </View>
                                <View style={styles.avatarContainer}>
                                    <Image source={topThree[0].avatar} style={styles.avatar} />
                                    <View style={styles.rankBadge2}>
                                        <Text style={styles.rankBadgeText}>2</Text>
                                    </View>
                                </View>
                                <Text style={styles.podiumName}>{topThree[0].name}</Text>
                                <View style={styles.carbonBox}>
                                    <Text style={styles.carbonIcon}>♻️</Text>
                                    <Text style={styles.carbonText}>{topThree[0].carbon} kg CO₂</Text>
                                </View>
                            </View>

                            {/* 1등 (중앙) */}
                            <View style={[styles.podiumItem, styles.podiumFirst]}>
                                <View style={styles.crownContainer}>
                                    <Text style={styles.crownIconFirst}></Text>
                                </View>
                                <View style={styles.avatarContainer}>
                                    <Image source={topThree[1].avatar} style={styles.avatarFirst} />
                                    <View style={styles.rankBadge1}>
                                        <Text style={styles.rankBadgeText}>1</Text>
                                    </View>
                                </View>
                                <Text style={styles.podiumNameFirst}>{topThree[1].name}</Text>
                                <View style={styles.carbonBox}>
                                    <Text style={styles.carbonIcon}>♻️</Text>
                                    <Text style={styles.carbonText}>{topThree[1].carbon} kg CO₂</Text>
                                </View>
                            </View>

                            {/* 3등 (오른쪽) */}
                            <View style={styles.podiumItem}>
                                <View style={styles.crownContainer}>
                                    <Text style={styles.crownIcon}></Text>
                                </View>
                                <View style={styles.avatarContainer}>
                                    <Image source={topThree[2].avatar} style={styles.avatar} />
                                    <View style={styles.rankBadge3}>
                                        <Text style={styles.rankBadgeText}>3</Text>
                                    </View>
                                </View>
                                <Text style={styles.podiumName}>{topThree[2].name}</Text>
                                <View style={styles.carbonBox}>
                                    <Text style={styles.carbonIcon}>♻️</Text>
                                    <Text style={styles.carbonText}>{topThree[2].carbon} kg CO₂</Text>
                                </View>
                            </View>
                        </View>

                        {/* 4위 ~ 8위 리스트 */}
                        <View style={styles.listContainer}>
                            {rankList.map((item, index) => (
                                <View 
                                    key={item.rank} 
                                    style={[
                                        styles.listItem,
                                        index === rankList.length - 1 && styles.listItemLast
                                    ]}
                                >
                                    <Text style={styles.listRank}>{item.rank}</Text>
                                    <Image source={item.avatar} style={styles.listAvatar} />
                                    <Text style={styles.listName}>{item.name}</Text>
                                    <View style={styles.listCarbonBox}>
                                        <Text style={styles.listCarbonIcon}>♻️</Text>
                                        <Text style={styles.listCarbonText}>{item.carbon} kg CO₂</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#078C5A',
    },
    container: {
        flex: 1,
    },
    
    // 헤더
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: {
        fontSize: 32,
        color: '#fff',
        fontWeight: '300',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
    },
    placeholder: {
        width: 40,
    },
    
    // 탭
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 80,
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 25,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 20,
    },
    tabActive: {
        backgroundColor: '#fff',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    tabTextActive: {
        color: '#078C5A',
    },
    
    // ✅ 컨텐츠 래퍼 (스크롤 영역을 감싸는 컨테이너)
    contentWrapper: {
        flex: 1,
        paddingBottom: 5,  // ✅ 하단 배너와의 간격 5px
    },
    
    // 스크롤
    scrollArea: {
        flex: 1,
    },
    
    // Podium (상위 3명)
    podiumContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: 10,
        marginBottom: 55,
    },
    podiumItem: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    podiumFirst: {
        marginTop: -10,
    },
    crownContainer: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    crownIcon: {
        fontSize: 24,
    },
    crownIconFirst: {
        fontSize: 32,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 3,
        borderColor: '#FFD700',
    },
    avatarFirst: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 4,
        borderColor: '#FFD700',
    },
    rankBadge1: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFD700',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    rankBadge2: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#C0C0C0',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    rankBadge3: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#CD7F32',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    rankBadgeText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
    },
    podiumName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 6,
    },
    podiumNameFirst: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 6,
    },
    carbonBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 2,
        borderRadius: 20,
    },
    carbonIcon: {
        fontSize: 22,
        marginRight: 3,
    },
    carbonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#fff',
    },
    
    // 리스트 (4위 ~)
    listContainer: {
        marginHorizontal: 10,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 10,
        minHeight: height * 0.4,  // ✅ 최소 높이 지정
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    // ✅ 마지막 아이템 구분선 제거
    listItemLast: {
        borderBottomWidth: 0,
    },
    listRank: {
        fontSize: 16,
        fontWeight: '700',
        color: '#666',
        width: 30,
        textAlign: 'center',
    },
    listAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginLeft: 10,
        backgroundColor: '#E0E0E0',
    },
    listName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginLeft: 15,
        flex: 1,
    },
    listCarbonBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    listCarbonIcon: {
        fontSize: 16,
        marginRight: 4,
    },
    listCarbonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4CAF50',
    },
});