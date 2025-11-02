import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

const { width } = Dimensions.get('window');

// 아이콘 이미지
const images = {
    paper: require('../../assets/paper.png'),
    glass: require('../../assets/glass.png'),
    can: require('../../assets/can.png'),
    plastic: require('../../assets/plastic.png'),
    pet: require('../../assets/pet.png'),
    vinyl: require('../../assets/vinyl.png'),
    styrofoam: require('../../assets/styrofoam.png'),
    light: require('../../assets/light.png'),
    electronic: require('../../assets/electronic.png'),
    clothes: require('../../assets/clothes.png'),
};

// 분리배출 올바른 가이드
const guideCards = [
    {
        color: '#F2FEF9',
        title: '분리배출 이렇게 해요!',
        subtitle: '올바른 분리수거, 우리 함께 실천해요',
        image: require('../../assets/stepguide.png'),
    },
    {
        color: '#FFF6F5',
        title: '분리배출 이건 안돼요!',
        subtitle: '종량제 봉투에 버려주세요',
        warning: [
            '❌ 씻어도 이물질이 제거되지 않은 용기류',
            '❌ 치킨상자·즉석용기 등 기름묻은 종이류',
            '❌ 과일망, 깨진 병, 도자기, 아이스팩, 스티커 비닐 등 혼동 품목',
        ],
    },
];

// 상세 모달 데이터
const wasteInfo = {
    paper: {
        title: '종이',
        tabs: ['종이', '종이팩'],
        data: {
            '종이': {
                subtitle: '골판지와 기타 종이류 (신문지, 책자, 종이컵)',
                numbered: [
                    '종이는 골판지, 기타 종이로 구분하여 배출',
                    '물에 젖거나 이물질이 묻지 않도록 하고 끈으로 묶거나 마대 등에 담아 배출',
                ],
                tips: ['코팅, 테이프, 스프링은 반드시 제거', '종이컵은 압착 후 봉투에 넣거나 묶어서 배출', '양면코팅 찢김 불가 → 종량제 봉투'],
                recycling: '집하 → 제지업 → 해리/정선/농축 → 골판지/신문/화장지 생산',
            },
            '종이팩': {
                subtitle: '일반팩(우유) / 멸균팩(두유, 주스, 소주)',
                numbered: ['내용물/빨대/비닐 제거 + 헹군 후 배출', '일반팩/멸균팩 구분 없이 배출', '가능하면 종이팩 전용수거함, 없으면 종이류와 구분하여 묶기'],
                tips: [],
                recycling: '종이팩 → 제지업 → 미용티슈 및 고급재생지 생산',
            },
        },
    },
    glass: {
        title: '유리',
        data: {
            default: {
                subtitle: '3색 유리병(투명/녹색/갈색) 및 기타 유리병',
                numbered: ['유리병 수거함 또는 재활용 배출', '색상은 구분 없이 배출 (선별장에서 분류)'],
                tips: ['병 내부 이물질 넣지 않기', '깨진 유리는 신문지로 감싸 종량제로 배출'],
                recycling: '선별 → 파쇄 → 용융 → 유리제품/건축자재 재생',
            },
        },
    },
    can: {
        title: '금속류(캔)',
        data: {
            default: {
                subtitle: '철캔, 알루미늄캔',
                numbered: ['음료/식품 캔은 금속 수거함에 배출', '생활철/공구류는 고철 수거함 배출'],
                tips: ['가스 캔은 완전히 가스 제거 후 배출', '날카로운 금속류는 종이로 감싸 종량제 배출'],
                recycling: '선별장 → 압축 → 제철소 용융 → 철판/알루미늄판 생산',
            },
        },
    },
    plastic: {
        title: '플라스틱',
        data: {
            default: {
                subtitle: 'PET, PP, PE, PS 등 플라스틱 용기 및 트레이',
                numbered: ['이물질 제거 + 헹궈서 배출', '재질 구분 없이 배출 (선별장에서 분리)', '치약용기 등 헹구기 어려운 건 내용물만 제거'],
                recycling: '선별 → 파쇄/세척 → 재생칩 → 플라스틱 제품 제조',
            },
        },
    },
    pet: {
        title: '페트병',
        data: {
            default: {
                subtitle: '무색 투명 페트 음료병 대상',
                numbered: ['라벨 제거 + 물로 헹구기', '압착 후 뚜껑 닫아 배출'],
                tips: ['헹구고 압착하면 재활용 효율 ↑'],
                recycling: '선별 → 분쇄/살균/건조 → 재생원료 → 식품/섬유 생산',
            },
        },
    },
    vinyl: {
        title: '비닐류',
        data: {
            default: {
                subtitle: '일회용 비닐봉투 · 필름류 · 포장비닐',
                numbered: ['이물질 제거 후 투명봉투에 모아서 배출', '재질 구분 없이 배출', '농산물 그물망은 함께 배출'],
                tips: [],
                recycling: '선별 → 압축 → 재활용업체 감용 → 파이프/배수관/SRF 재활용',
            },
        },
    },
    styrofoam: {
        title: '스티로폼',
        data: {
            default: {
                subtitle: '포장 완충재, 단열재용 스티로폼',
                numbered: ['상표/테이프 제거 후 배출', '색상/재질 구분 없이 배출', '가전제품 포장재는 구매처 반납 권장'],
                recycling: '분쇄 → 감용/성형 → 건축자재/액자 등으로 재생',
            },
        },
    },
    light: {
        title: '조명제품',
        data: {
            default: {
                subtitle: '형광등 & LED 조명',
                numbered: ['형광등/LED은 깨지지 않게 전용수거함 배출', '일체형 LED는 불연성종량제로', '깨진 조명은 신문지로 감싸 불연성종량제'],
                recycling: '파쇄/선별 → 유리/금속/수은 회수 → 재사용',
            },
        },
    },
    electronic: {
        title: '전자제품',
        data: {
            default: {
                subtitle: '가전/소형가전 전반',
                numbered: ['재사용 가능 제품은 재활용센터/나눔센터', '신규 구매 시 역회수 가능', '폐가전 무상 방문수거 1599-0903', '소형 전자제품 → 전용수거함'],
                tips: [],
                recycling: '해체 → 분쇄 → 소재 회수 (철/구리/알루미늄)',
            },
        },
    },
    clothes: {
        title: '의류 및 원단',
        data: {
            default: {
                subtitle: '의류 및 신발/가방/섬유류',
                numbered: ['깨끗한 상태로 의류수거함 배출', '세트 구성품은 함께 묶어서', '문전 수거 지역은 젖지 않게 마대 사용'],
                tips: ['지자체별 수거 기준 다를 수 있음'],
                recycling: '분류 → 재사용 · 재자원화 (섬유 / 산업용 재료)',
            },
        },
    },
};

// ✅ 수정: navigation props 추가
export default function DischargeGuideScreen({ navigation }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [selected, setSelected] = useState(null);
    const [selectedSubTab, setSelectedSubTab] = useState('종이');

    const iconData = [
        ['paper', '종이'],
        ['glass', '유리'],
        ['can', '금속류(캔)'],
        ['plastic', '플라스틱'],
        ['pet', '페트병'],
        ['vinyl', '비닐'],
        ['styrofoam', '스티로폼'],
        ['light', '조명제품'],
        ['electronic', '전자제품'],
        ['clothes', '의류'],
    ];

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            {/* 상단 가이드 카드 */}
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={(e) => setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
                scrollEventThrottle={16}
                style={styles.guideScroll}
            >
                {/* 초록 카드 */}
                <View style={[styles.card, { backgroundColor: guideCards[0].color }]}>
                    <Text style={styles.cardTitle}>{guideCards[0].title}</Text>
                    <Text style={styles.cardSubtitle}>{guideCards[0].subtitle}</Text>

                    <Image source={guideCards[0].image} style={styles.stepImage} />
                    <View style={styles.stepRow}>
                    <View style={styles.stepCol}>
                        <Text style={styles.stepTitle}>비운다</Text>
                        <Text style={styles.stepDesc}>용기 안의 내용물을 깨끗하게비운다</Text>
                    </View>
                    <View style={styles.stepCol}>
                        <Text style={styles.stepTitle}>헹군다</Text>
                        <Text style={styles.stepDesc}>폐기물에 묻은 이물질, 음식물 등을 헹군다</Text>
                    </View>
                    <View style={styles.stepCol}>
                        <Text style={styles.stepTitle}>분리한다</Text>
                        <Text style={styles.stepDesc}>라벨·뚜껑 등 다른 재질을 분리한다</Text>
                    </View>
                    <View style={styles.stepCol}>
                        <Text style={styles.stepTitle}>섞지않는다</Text>
                        <Text style={styles.stepDesc}>종류 및 재질별로 섞이지 않게 배출한다</Text>
                    </View>
                    </View>
                </View>

                {/* 빨간 카드 */}
                <View style={[styles.card, { backgroundColor: guideCards[1].color }]}>
                    <Text style={styles.cardTitleRed}>{guideCards[1].title}</Text>
                    <Text style={styles.cardSubtitleRed}>{guideCards[1].subtitle}</Text>

                    <View style={styles.redCardContentArea}>
                    <View style={styles.badItemBox}>
                        {guideCards[1].warning.map((t, i) => (
                        <Text key={i} style={styles.badItemText}>
                            {t}
                        </Text>
                        ))}
                    </View>
                    </View>
                </View>
                </ScrollView>

                {/* 인디케이터는 여기에 */}
                <View style={styles.indicatorWrapper}>
                {[0, 1].map((i) => (
                    <View key={i} style={[styles.indicator, activeIndex === i && styles.indicatorActive]} />
                ))}
                </View>

            {/* ✅ 수정: 검색창 클릭 시 네비게이션으로 이동 */}
            <View style={styles.chatContainer}>
                <TouchableOpacity 
                    style={styles.searchBar} 
                    onPress={() => navigation.navigate('AIChat')}
                    activeOpacity={0.9}
                >
                    <Text style={styles.searchPlaceholder}>어떻게 버려야 할지 모르겠다면 AI에게 물어보세요</Text>
                    <View style={styles.searchIconWrap}>
                        <Text style={styles.searchIcon}>🔍</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* 아이콘 그리드 */}
            <View style={styles.iconGrid}>
                {iconData.map(([key, label]) => (
                    <TouchableOpacity key={label} style={styles.iconItem} onPress={() => setSelected(key)}>
                        <Image source={images[key]} style={styles.iconImage} />
                        <Text style={styles.iconLabel}>{label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* 하단 안내 배너 - 글자 크기 1 감소 */}
            <View style={styles.noticeBar}>
                <Text style={styles.noticeText}>ⓘ 폐의약품·폐건전지는 전용 배출함에 버려야 합니다.</Text>
                <TouchableOpacity>
                    <Text style={styles.noticeLink}>근처 전용 배출함 찾기</Text>
                </TouchableOpacity>
            </View>

            {/* 상세 모달 */}
            {selected && (
                <View style={styles.infoOverlay}>
                    <View style={styles.infoCard}>
                        <View style={styles.infoHeader}>
                            <Text style={styles.infoTitle}>{wasteInfo[selected].title}</Text>
                            <TouchableOpacity onPress={() => setSelected(null)}style={styles.closeButton}>
                                <Text style={{ fontSize: 20, fontWeight: '600' }}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        {wasteInfo[selected].tabs && (
                            <View style={styles.tabRow}>
                                {wasteInfo[selected].tabs.map((t) => (
                                    <TouchableOpacity key={t} onPress={() => setSelectedSubTab(t)}>
                                        <View style={selectedSubTab === t ? styles.tabChipActive : styles.tabChipInactive}>
                                            <Text style={selectedSubTab === t ? { color: '#fff' } : { color: '#078C5A' }}>{t}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        <ScrollView style={{ marginTop: 18 }} showsVerticalScrollIndicator={false}>
                            <Text style={styles.sectionTitle}>대상 품목</Text>

                            <Text style={styles.subtitleText}>
                                {wasteInfo[selected].data[selectedSubTab]?.subtitle ?? wasteInfo[selected].data.default.subtitle}
                            </Text>

                            {(wasteInfo[selected].data[selectedSubTab]?.numbered ?? wasteInfo[selected].data.default.numbered).map(
                                (line, index, arr) => (
                                    <View style={styles.numberGroup} key={index}>
                                        <View style={styles.numberCircle}>
                                            <Text style={styles.numberText}>{index + 1}</Text>
                                        </View>
                                        {index < arr.length - 1 && <View style={styles.verticalLine} />}
                                        <Text style={styles.numberLine}>{line}</Text>
                                    </View>
                                ),
                            )}

                            {(wasteInfo[selected].data[selectedSubTab]?.tips ?? wasteInfo[selected].data.default.tips)?.map((t, i) => (
                                <Text key={i} style={styles.tipText}>
                                    · {t}
                                </Text>
                            ))}

                            <Text style={styles.processTitle}>※ 재활용 과정</Text>
                            <Text style={styles.processText}>
                                {wasteInfo[selected].data[selectedSubTab]?.recycling ?? wasteInfo[selected].data.default.recycling}
                            </Text>
                        </ScrollView>
                    </View>
                </View>
            )}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ffffff' },

    // 카드 영역
    guideScroll: { marginTop: 16 },
    card: {
        position: 'relative',
        width: width - 55,
        marginHorizontal: 20,
        borderRadius: 20,
        paddingVertical: 18,
        paddingHorizontal: 10,
        alignItems: 'center',
        marginVertical: 12,
        minHeight: 480,
    },
    cardTitle: { fontSize: 22, fontWeight: '700', color: '#078C5A', letterSpacing: -0.5 },
    cardSubtitle: { color: '#5B5B5B', marginTop: 6, marginBottom: 14, fontSize: 14, letterSpacing: -0.3 },
    stepImage: { 
        width: width - 100,
        height: 180,
        resizeMode: 'contain', 
        marginTop: -40,
        marginBottom: -20,
    },

    cardTitleRed: { fontSize: 22, fontWeight: '700', color: '#E53E3E', letterSpacing: -0.5 },
    cardSubtitleRed: { color: '#E53E3E', marginTop: 8, marginBottom: 14, fontSize: 14, letterSpacing: -0.3 },
    
    redCardContentArea: {
        width: '100%',
        height: 260,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badItemBox: { 
        backgroundColor: '#fff', 
        padding: 18,
        borderRadius: 16,
        width: '100%', 
        borderWidth: 1, 
        marginTop:-60,
        borderColor: '#F3C1C1',
    },
    badItemText: { color: '#333', fontSize: 14, lineHeight: 24, marginBottom: 6, letterSpacing: -0.25 },

    indicatorWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: -10,
        marginBottom: 6,
    },
    indicator: { 
        width: 8, 
        height: 8, 
        borderRadius: 4, 
        backgroundColor: '#d1d5db', 
        marginHorizontal: 4,
        zIndex: 101,
    },
    indicatorActive: { 
        backgroundColor: '#078C5A',
        zIndex: 102,
    },

    // 검색창
    chatContainer: { marginHorizontal: 20, marginTop: 20, marginBottom: 4 },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 28,
        paddingVertical: 14,
        paddingLeft: 18,
        paddingRight: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    searchPlaceholder: { color: '#9CA3AF', fontSize: 14, flex: 1, letterSpacing: -0.2 },
    searchIconWrap: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    searchIcon: { fontSize: 16 },

    // 아이콘 그리드
    iconGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingHorizontal: 22,
        marginBottom: 8,
    },
    iconItem: { alignItems: 'center', width: '20%', marginVertical: 14 },
    iconImage: { width: 44, height: 44, resizeMode: 'contain' },
    iconLabel: { fontSize: 12, marginTop: 6, color: '#333', textAlign: 'center', letterSpacing: -0.2 },

    // 하단 안내 배너
    noticeBar: {
        marginTop: 12,
        marginBottom: 16,
        marginHorizontal: 20,
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingVertical: 14,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    noticeText: { fontSize: 11, color: '#111', flex: 1, letterSpacing: -0.2 },
    noticeLink: { fontSize: 11, color: '#9CA3AF', textDecorationLine: 'underline' },

    // 상세 모달
    infoOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center' },
    infoCard: { width: width - 40, backgroundColor: '#fff', borderRadius: 26, padding: 22, maxHeight: '80%' },
    infoHeader: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'relative' },
    infoTitle: { fontSize: 18, fontWeight: '700', color: '#0b0b0b', letterSpacing: -0.3, textAlign: 'center' },
// ✅ 새로 추가 (infoTitle 바로 아래)
    closeButton: {position: 'absolute',right: 0,top: 0,padding: 4,},

    tabRow: { flexDirection: 'row', marginTop: 18 },
    tabChipActive: { backgroundColor: '#078C5A', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginRight: 8 },
    tabChipInactive: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#078C5A', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginRight: 8 },

    sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
    subtitleText: { fontSize: 13, color: '#666', marginBottom: 14, letterSpacing: -0.2 },

    numberGroup: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 12, position: 'relative' },
    numberCircle: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#078C5A', justifyContent: 'center', alignItems: 'center', marginRight: 10, zIndex: 2 },
    numberText: { color: '#fff', fontWeight: '700', fontSize: 13, letterSpacing: -0.3 },
    verticalLine: { position: 'absolute', left: 13, top: 26, width: 2, height: 28, backgroundColor: '#078C5A', zIndex: 1 },
    numberLine: { flex: 1, color: '#111', fontSize: 14, lineHeight: 20, letterSpacing: -0.15 },

    tipText: { fontSize: 13, color: '#111', marginTop: 20, lineHeight: 19, letterSpacing: -0.15 },
    processTitle: { fontSize: 13, marginTop: 22, marginBottom: 6, color: '#666' },
    processText: { fontSize: 12, color: '#999', lineHeight: 18 },

    // Step Row
    stepRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        width: '100%', 
        paddingHorizontal: 4,
        marginTop: 18,
        marginBottom: 10,
    },
    stepCol: { 
        width: (width - 70) / 4,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 3,
    },
    stepTitle: { 
        fontSize: 15,
        fontWeight: '700', 
        color: '#078C5A', 
        marginBottom: 8,
        marginTop: -30,
        textAlign: 'center',
        width: '100%',
        letterSpacing: 0.1,
    },
    stepDesc: { 
        fontSize: 10.5,
        color: '#6B7280', 
        textAlign: 'center', 
        lineHeight: 16,
        width: '100%',
        letterSpacing: -0.3,
    },
});