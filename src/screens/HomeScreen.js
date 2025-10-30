import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen({ navigation }) {
    const userName = "한비";
    const userGrade = "새싹등급";
    const userPoints = 32600;

    const [modalVisible, setModalVisible] = useState(false);

    const bannerImages = [
        require('../../assets/boost1.png'),
        require('../../assets/boost2.png'),
        require('../../assets/boost3.png'),
        require('../../assets/boost4.png'),
    ];

    // leagueTop3 (DB 연동 전 임시값)
    const leagueTop3 = [
        { rank: 1, org: '야놀자', co2: '198.3kg CO₂', logo: require('../../assets/yanoljalogo.png') },
        { rank: 2, org: '신한금융그룹', co2: '192.6kg CO₂', logo: require('../../assets/shinhanlogo.png') },
        { rank: 3, org: '한양대학교', co2: '168.1kg CO₂', logo: require('../../assets/hanyang.png') },
    ];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

            {/* 상단 전체 초록 영역 */}
            <LinearGradient
                colors={['#078C5A', '#0c3727ff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.topSection}
            >

                {/* 이 영역 자체를 누르면 MyPageScreen */}
                <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('MyPageScreen')}>
                    <Text style={styles.appTitle}>Green Point</Text>

                    <Text style={styles.pointLabel}>사용 가능한 포인트</Text>
                    <Text style={styles.pointValue}>{userPoints.toLocaleString()} P</Text>

                    <View style={styles.gradeChip}>
                        <Text style={styles.gradeText}>{userName} 님  {userGrade}</Text>
                    </View>
                </TouchableOpacity>

                {/* 원형 메뉴 (개별 이동 그대로) */}
                <View style={styles.menuRow}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('UsePointScreen')}>
                        <View style={styles.circleIcon}>
                            <Image source={require('../../assets/pointused_icon.png')} style={styles.menuIcon} />
                        </View>
                        <Text style={styles.menuLabel}>포인트 사용</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('HistoryScreen')}>
                        <View style={styles.circleIcon}>
                            <Image source={require('../../assets/usedlist_icon.png')} style={styles.menuIcon} />
                        </View>
                        <Text style={styles.menuLabel}>이용 내역</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ContributionScreen')}>
                        <View style={styles.circleIcon}>
                            <Image source={require('../../assets/contribution_icon.png')} style={styles.menuIcon} />
                        </View>
                        <Text style={styles.menuLabel}>환경 기여도</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('GuideScreen')}>
                        <View style={styles.circleIcon}>
                            <Image source={require('../../assets/getpoint_icon.png')} style={styles.menuIcon} />
                        </View>
                        <Text style={styles.menuLabel}>적립 가이드</Text>
                    </TouchableOpacity>
                </View>

            </LinearGradient>


            {/* 쓰레기 배출하기 카드 */}
            <TouchableOpacity style={styles.trashCard}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.trashTitle}>쓰레기 배출하기</Text>
                    <Text style={styles.trashSub}>올바른 재활용 배출로 포인트 받아보세요</Text>

                    {/* 버튼 클릭 시 모달 열기 */}
                    <TouchableOpacity style={styles.trashBtn} onPress={() => setModalVisible(true)}>
                        <Text style={styles.trashBtnText}>⭐ 자주 찾는 배출함 상태 확인</Text>
                    </TouchableOpacity>
                </View>

                {/* QR 이미지 클릭 시 RecognizeScreen 이동 */}
                <TouchableOpacity style={styles.qrWrap} onPress={() => navigation.navigate('RecognizeScreen')}>
                    <View style={styles.cornerTL} />
                    <View style={styles.cornerTR} />
                    <Image source={require('../../assets/qr.png')} style={styles.qrImg} />
                    <View style={styles.cornerBL} />
                    <View style={styles.cornerBR} />
                </TouchableOpacity>
            </TouchableOpacity>

            {/* 모달 */}
            <Modal transparent visible={modalVisible} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        {/* 제목 + 아이콘 */}
                        <View style={styles.modalTitleWrap}>
                            <Image source={require('../../assets/alert_icon.png')} style={styles.alertIcon} />
                            <Text style={styles.modalTitle}>자주 찾는 배출함</Text>
                        </View>

                        {/* 리스트 */}
                        <View style={styles.modalList}>
                            {[
                                { name: '성산2동 주민센터', status: '운영중' },
                                { name: '마포 중앙도서관 B2', status: '운영중' },
                                { name: '한양대 여자 기숙사 1층', status: '가득참' },
                            ].map((item, i) => (
                                <View key={i} style={[styles.modalItem, i < 2 && styles.modalItemDivider]}>
                                    <Text style={styles.modalItemText}>⭐  {item.name}</Text>
                                    <Text
                                        style={[
                                            styles.modalStatusText,
                                            { color: item.status === '가득참' ? '#d61f45' : '#1d4ed8' }, // 빨강/파랑
                                        ]}
                                    >
                                        {item.status}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        {/* 설정하러 가기 */}
                        <TouchableOpacity style={styles.modalLinkWrap}>
                            <Text style={styles.goSettingText}>설정하러 가기</Text>
                        </TouchableOpacity>

                        {/* 확인 버튼 */}
                        <TouchableOpacity style={styles.modalBtn} onPress={() => setModalVisible(false)}>
                            <Text style={styles.modalBtnText}>확인</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* 리스트 */}
            <View style={styles.listSection}>
                <Text style={styles.sectionTitle}>올바른 배출과 수거 안내</Text>

                <TouchableOpacity
                    style={styles.listItem}
                    onPress={() => navigation.navigate('DischargeGuide')}
                >
                    <View style={styles.listRow}>
                        <Image source={require('../../assets/exhaustguide_icon.png')} style={styles.listIcon} />
                        <View style={styles.listTextWrap}>
                            <Text style={styles.listItemText}>분리배출 가이드</Text>
                            <Text style={styles.listItemSub}>올바른 분리배출 방법 확인하기</Text>
                        </View>
                    </View>
                </TouchableOpacity>


                <TouchableOpacity style={styles.listItem}>
                    <View style={styles.listRow}>
                        <Image source={require('../../assets/searchmedicine_icon.png')} style={styles.listIcon} />
                        <View style={styles.listTextWrap}>
                            <Text style={styles.listItemText}>폐약품 수거함 찾기</Text>
                            <Text style={styles.listItemSub}>가까운 폐약품 수거함 찾기</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.listItem}>
                    <View style={styles.listRow}>
                        <Image source={require('../../assets/searchbattery_icon.png')} style={styles.listIcon} />
                        <View style={styles.listTextWrap}>
                            <Text style={styles.listItemText}>배터리 수거함 확인하기</Text>
                            <Text style={styles.listItemSub}>가까운 배터리 수거함 확인하기</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>


            {/* 그린 리그 */}
            <View style={styles.leagueSection}>
                <View style={styles.leagueHeaderRow}>
                    <Text style={styles.leagueTitle}><Text style={{ color: '#078C5A', fontSize: 22, fontWeight: '700' }}>10월</Text> 그린 리그</Text>
                </View>
                <Text style={styles.leagueDesc}>소속별 평균 점감률(%)을 기준으로 매월 순위를 산정하며, 1위 소속 구성원 전원에게 +100P가 추가 보상이 제공됩니다.</Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
                    {leagueTop3.map((item, index) => (
                        <View key={index} style={[
                            styles.leagueCard,
                            item.rank === 1 && styles.leagueCardFirst,
                            item.rank === 2 && styles.leagueCardSecond,
                            item.rank === 3 && styles.leagueCardThird,
                        ]}>
                            {/* 크라운 + 순위 배지 */}
                            <View style={[
                                styles.rankBadge,
                                item.rank === 1 && { backgroundColor: '#e5ae23ff' },
                                item.rank === 2 && { backgroundColor: '#A3A3A3' },
                                item.rank === 3 && { backgroundColor: '#af6419ff' },
                            ]}>
                                {item.rank === 1 && (
                                    <Image
                                        source={require('../../assets/crown_icon.png')}
                                        style={styles.crownIcon}
                                    />
                                )}
                                <Text style={styles.rankNumber}>{item.rank}</Text>
                            </View>

                            {/* 상단 이미지(포스터/썸네일 대용) */}
                            <Image source={item.logo} style={styles.leagueImage} />

                            {/* 하단 정보: 왼쪽=기관명, 오른쪽=로고+CO2 */}
                            <View style={styles.leagueInfoRow}>
                                <Text style={styles.leagueOrg} numberOfLines={1}>{item.org}</Text>
                                <View style={styles.rightInfoRow}>
                                    <Image source={require('../../assets/logo.png')} style={styles.leagueLogoSmall} />
                                    <Text style={styles.leagueCO2}>{item.co2}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>

                <View style={styles.leagueMoreWrap}>
                    <TouchableOpacity>
                        <Text style={styles.leagueMore}>자세히 보기 &gt;</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* 그린 부스트 */}
            <View style={styles.boostSection}>
                <Text style={styles.boostTitle}>그린 부스트</Text>
                <Text style={styles.boostDesc}>이번주 Green Boost 미션을 완료하고 추가 포인트를 받아보세요!</Text>
            </View>

            {/* 배너 */}
            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={{ marginVertical: 15 }}>
                {bannerImages.map((img, i) => (
                    <Image key={i} source={img} style={styles.banner} />
                ))}
            </ScrollView>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { backgroundColor: '#fff' },

    /* 상단 초록 영역 */
    topSection: {
        backgroundColor: '#078C5A',
        paddingVertical: 60,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 80,
        borderBottomRightRadius: 80,
    },
    appTitle: { color: '#fff', fontSize: 25, fontWeight: '600', marginTop: -40, marginBottom: 55 },
    pointLabel: { color: '#d1fae5', fontSize: 16, textAlign: 'center' },
    pointValue: { color: '#fff', fontSize: 50, fontWeight: '700', textAlign: 'center', marginTop: 4 },

    gradeChip: {
        alignSelf: 'center',
        backgroundColor: '#FFFFFF30',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 30,
        marginTop: 12,
    },
    gradeText: { color: '#fff', fontSize: 14 },

    menuRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 40 },
    menuItem: { alignItems: 'center' },
    menuIcon: { width: 30, height: 30, marginBottom: 8 },
    menuLabel: { color: '#d1fae5', fontSize: 13, fontWeight: '500' },

    /* 쓰레기 배출하기 카드 */
    trashCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginTop: -25,
        marginHorizontal: 18,
        borderRadius: 16,
        padding: 18,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },

    },
    trashTitle: { fontWeight: '800', fontSize: 18 },
    trashSub: { color: '#6b7280', marginTop: 4, fontsize: 11, fontWeight: '500', marginBottom: 20 },
    trashBtn: { backgroundColor: '#078C5A', borderRadius: 50, paddingVertical: 10, alignItems: 'center', width: 240 },
    trashBtnText: { color: '#fff', fontWeight: '600' },
    qrImg: { width: 100, height: 100, alignSelf: 'center' },

    /* 리스트 */
    listSection: { marginTop: 30, paddingHorizontal: 20 },
    sectionTitle: { fontWeight: '700', fontSize: 18, marginBottom: 5 },
    listItem: { paddingVertical: 14, borderBottomWidth: 1, borderColor: '#e5e7eb' },

    listRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    listIcon: {
        width: 40,
        height: 40,
        marginRight: 10,
        resizeMode: 'contain',
    },

    /* 텍스트 묶음 래퍼 */
    listTextWrap: {
        flexDirection: 'column',
        marginLeft: 2,
    },

    listItemText: {
        fontSize: 15,
        fontWeight: '600',
        lineHeight: 20,
    },

    listItemSub: {
        color: '#6b7280',
        marginTop: 2,
        fontSize: 12,
        fontWeight: '500',
    },

    /* 그린 리그 */
    leagueSection: { marginTop: 20, paddingHorizontal: 20 },

    leagueTitle: { fontSize: 18, fontWeight: '900', color: '#111827' },
    leagueDesc: { color: '#6b7280', fontSize: 12, marginTop: 6 },

    leagueMoreWrap: { alignItems: 'flex-end' },
    leagueMore: { color: '#6b7280', fontSize: 12, textDecorationLine: 'underline', marginTop: 10 },

    leagueCard: {
        width: 170,
        borderRadius: 16,
        backgroundColor: '#fff',
        margin: 10,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 4,
        borderWidth: 3,
        borderColor: '#e5e7eb',
        position: 'relative',
        overflow: 'visible',
        height: 170,
    },

    leagueCardFirst: { borderColor: '#e5ae23ff' },
    leagueCardSecond: { borderColor: '#A3A3A3' },
    leagueCardThird: { borderColor: '#af6419ff' },

    rankBadge: {
        position: 'absolute',
        top: -2,
        left: -12,
        width: 25,
        height: 25,
        borderRadius: 19,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 6,
    },
    rankNumber: { color: '#fff', fontWeight: '800', fontSize: 13 },

    crownIcon: {
        position: 'absolute',
        top: -25,
        left: 155,
        width: 45,
        height: 45,
        zIndex: 7,
    },

    leagueImage: { width: '94%', height: 120, resizeMode: 'contain', padding: 12, margin: 5, resizeMode: 'cover', borderRadius: 10 },

    leagueInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 10,
    },

    leagueOrg: { fontSize: 13, fontWeight: '900', color: '#111827', flexShrink: 1, paddingRight: 8 },

    rightInfoRow: { flexDirection: 'row', alignItems: 'center' },
    leagueLogoSmall: { width: 13, height: 13, marginRight: 1, resizeMode: 'contain' },
    leagueCO2: { fontSize: 10, fontweight: 900, color: '#000000ff' },

    /* 배너 */
    boostSection: { marginTop: 25, paddingHorizontal: 20 },
    boostTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 6, marginTop: -15 },
    boostDesc: { color: '#6b7280', fontSize: 12, marginBottom: -15 },
    banner: { width: 340, height: 140, borderRadius: 14, margin: 12, resizeMode: 'cover' },

    /* 모달 */
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000055' },
    modalBox: { width: '80%', backgroundColor: '#fff', borderRadius: 16, padding: 20, alignItems: 'center' },

    modalTitleWrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
    alertIcon: { width: 20, height: 20, marginRight: 6 },
    modalTitle: { fontSize: 18, fontWeight: '800' },

    modalList: { width: '100%', marginTop: 10, backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden' },
    modalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 8,
        backgroundColor: '#fff',
    },
    modalItemDivider: { borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },

    /* 글씨 크기/두께 조절 지점 */
    modalItemText: { fontSize: 15, fontWeight: '500', color: '#111827' },
    modalStatusText: { fontSize: 15, fontWeight: '700' },

    modalLinkWrap: { marginTop: 15, marginBottom: 15 },
    goSettingText: { fontSize: 13, color: '#6b7280', textDecorationLine: 'underline' },

    /* 확인 버튼*/
    modalBtn: {
        backgroundColor: '#078C5A',
        marginTop: 6,
        width: '55%',
        paddingVertical: 12,
        borderRadius: 28,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 10,
        elevation: 6,
    },
    modalBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },

});