import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground, ActivityIndicator, Animated, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import RecognitionResultBottomSheet from './RecognitionResultBottomSheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dischargeApi from '../services/api/dischargeApi';

export default function RecognizeScreen({ navigation }) {

    const [selectedImage, setSelectedImage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [detections, setDetections] = useState([]);
    const [userId, setUserId] = useState(null);

    // 안내 바텀시트
    const [showGuide, setShowGuide] = useState(true);
    const [guideStep, setGuideStep] = useState(0);

    // userId 로드
    useEffect(() => {
        const loadUserId = async () => {
            try {
                const id = await AsyncStorage.getItem('userId');
                if (id) {
                    setUserId(id);
                }
            } catch (error) {
                console.error('userId 로드 실패:', error);
            }
        };
        loadUserId();
    }, []);

    // 인식 결과 바텀시트
    const [showResult, setShowResult] = useState(false);
    const [recognitionData, setRecognitionData] = useState([]);

    const guideImages = [
        require('../../assets/method1.png'),
        require('../../assets/method2.png'),
        null, // 3번째는 로딩
        require('../../assets/method3.png')
    ];

    const guideTexts = [
        "배출함에 부착된 \nQR코드를 스캔해주세요",
        "현재 위치의 배출함이 맞는지 확인 후 \n쓰레기를 투입해주세요",
        "모든 투입이 끝나면 \n완료 버튼을 눌러주세요",
        "잠시 후 포인트가 적립됩니다"
    ];

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setSelectedImage(uri);

            setIsProcessing(true);
            setDetections([]);

            try {
                // FastAPI /detect 엔드포인트 호출
                const response = await dischargeApi.detectRecyclable(uri);
                
                console.log('감지 결과:', response);

                // FastAPI 응답 형식에 맞춰 바운딩 박스 생성
                if (response && response.items && response.items.length > 0) {
                    const formattedDetections = response.items.map(item => ({
                        left: `${item.bbox.x}%`,
                        top: `${item.bbox.y}%`,
                        width: `${item.bbox.width}%`,
                        height: `${item.bbox.height}%`,
                        grade: item.grade,
                        material: item.material_type,
                        color: getColorByGrade(item.grade)
                    }));
                    setDetections(formattedDetections);
                } else {
                    // 응답이 없을 경우 목 데이터 사용 (개발용)
                    setDetections([
                        { left: '15%', top: '50%', width: '70%', height: '30%', grade: 'A', material: 'PLASTIC', color: '#1b04e3ff' },
                        { left: '20%', top: '13%', width: '78%', height: '30%', grade: 'B', material: 'PAPER', color: '#c26400ff' },
                        { left: '18%', top: '40%', width: '35%', height: '12%', grade: 'C', material: 'CAN', color: '#d40b0bff' },
                    ]);
                }

            } catch (error) {
                console.error('이미지 감지 실패:', error);
                Alert.alert('오류', '이미지 분석에 실패했습니다. 다시 시도해주세요.');
                setSelectedImage(null);
            } finally {
                setIsProcessing(false);
                const mockDetections = [
                    { left: '15%', top: '50%', width: '70%', height: '30%', grade: 'A', material: 'PLASTIC', color: '#1b04e3ff' },
                    { left: '20%', top: '13%', width: '78%', height: '30%', grade: 'B', material: 'PAPER', color: '#c26400ff' },
                    { left: '18%', top: '40%', width: '35%', height: '12%', grade: 'C', material: 'CAN', color: '#d40b0bff' },
                ];
                setDetections(mockDetections);

                // ✅ AI 인식 완료 후 결과 데이터 생성
                const results = [
                    { 
                        type: 'PET', 
                        clean: 0.78, 
                        removed_labeled: 0.34, 
                        color: 0.9, 
                        grade: 'C', 
                        carbon: 198.3, 
                        points: 1 
                    },
                    { 
                        type: 'PAPER', 
                        clean: 0.78, 
                        color: 0.8, 
                        grade: 'A', 
                        carbon: 198.3, 
                        points: 5 
                    },
                    { 
                        type: 'CAN', // ✅ PET에서 CAN으로 변경
                        clean: 0.68, 
                        grade: 'A', 
                        carbon: 198.3, 
                        points: 5 
                    }
                ];
                
                // ✅ 2초 후 결과 바텀시트 표시
                setTimeout(() => {
                    setRecognitionData(results);
                    setShowResult(true);
                }, 2000);
            }, 1200);
        }
    };

    // Grade에 따른 색상 매핑
    const getColorByGrade = (grade) => {
        const colorMap = {
            'A': '#1b04e3ff', // 파란색
            'B': '#c26400ff', // 주황색
            'C': '#d40b0bff', // 빨간색
            'D': '#666666ff', // 회색
        };
        return colorMap[grade] || '#078C5A'; // 기본값: 초록색
    };

    const showMaskAndFrame = !selectedImage;

    return (
        <View style={styles.container}>

            {/* 배경 */}
            <ImageBackground
                source={selectedImage ? { uri: selectedImage } : require('../../assets/mock_camera_bg.png')}
                style={styles.cameraMock}
                resizeMode="cover"
            />

            {/* 회색 마스크 (이미지 선택 전만 표시) */}
            {showMaskAndFrame && (
                <View style={styles.overlayContainer}>
                    <View style={styles.overlayTop} />
                    <View style={styles.overlayMiddle}>
                        <View style={styles.overlaySide} />
                        <View style={styles.clearCenter} />
                        <View style={styles.overlaySide} />
                    </View>
                    <View style={styles.overlayBottom} />
                </View>
            )}

            {/* 초록 프레임 (이미지 선택 전만 표시) */}
            {showMaskAndFrame && (
                <View style={styles.frameOverlay}>
                    <View style={styles.cornerTL} />
                    <View style={styles.cornerTR} />
                    <View style={styles.cornerBL} />
                    <View style={styles.cornerBR} />
                </View>
            )}


            {/* 상단 사용자 정보 */}
            <View style={styles.topBar}>
                <View style={styles.profileRow}>
                    <Image source={require('../../assets/profile.png')} style={styles.profileImage} />
                    <View>
                        <Text style={styles.gradeText}>새싹등급</Text>
                        <Text style={styles.userName}>한비 님</Text>
                    </View>
                </View>

                <View style={styles.pointBox}>
                    <Image source={require('../../assets/coin.png')} style={styles.coinIcon} />
                    <Text style={styles.pointText}>32,600 P</Text>
                </View>
            </View>

            {/* 안내 박스 */}
            <View style={styles.infoBox}>
                <Text style={styles.infoText}>※ 해커톤 시연용 이미지 촬영 및 업로드 방식</Text>
                <Text style={styles.alertText}>실제 사용자 앱에서는 배출물을 촬영하지 않습니다.</Text>
            </View>

            {/* 인식 로딩 */}
            {selectedImage && isProcessing && (
                <View style={styles.processingOverlay}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.processingText}>AI 인식 중입니다…</Text>
                </View>
            )}

            {/* 바운딩 박스 */}
            {selectedImage && !isProcessing && detections.map((d, i) => (
                <View key={i} style={[styles.box, { left: d.left, top: d.top, width: d.width, height: d.height, borderColor: d.color }]}>
                    <View style={[styles.badgeRight, { borderColor: d.color }]}>
                        <Text style={[styles.badgeText, { color: d.color }]}>Grade {d.grade}</Text>
                    </View>
                    <View style={[styles.badgeLeft, { borderColor: d.color }]}>
                        <Text style={[styles.badgeText, { color: d.color }]}>{d.material}</Text>
                    </View>
                </View>
            ))}

            {/* 하단 컨트롤 */}
            <View style={styles.bottomControls}>
                <TouchableOpacity onPress={pickImage}><Ionicons name="images-outline" size={32} color="#fff" /></TouchableOpacity>
                <TouchableOpacity><Ionicons name="camera-reverse-outline" size={32} color="#fff" /></TouchableOpacity>

                <TouchableOpacity style={styles.captureBtn}>
                    <View style={styles.captureInner}>
                        <Ionicons name="camera-outline" size={28} color="#fff" />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity><Ionicons name="flash-outline" size={32} color="#fff" /></TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="close" size={32} color="#fff" /></TouchableOpacity>
            </View>

            {/* 하단 배출 방법 Bottom Sheet */}
            {showGuide && (
                <View style={styles.guideSheet}>

                    {/* 제목 + 아이콘 */}
                    <View style={styles.titleRow}>
                        <Image source={require('../../assets/alert_icon.png')} style={styles.guideAlertIcon} />
                        <Text style={styles.guideTitle}>배출 방법</Text>
                    </View>

                    {/* 닫기 버튼 */}
                    <TouchableOpacity style={styles.closeBtn} onPress={() => setShowGuide(false)}>
                        <Ionicons name="close" size={28} color="#000" />
                    </TouchableOpacity>

                    {/* 이미지 or 로딩 */}
                    {guideStep === 2 ? (
                        <View style={styles.loadingWrapper}>
                            <ActivityIndicator size={70} color="#444" />
                        </View>
                    ) : (
                        <Image source={guideImages[guideStep]} style={styles.guideImage} resizeMode="contain" />
                    )}
                    {/* 설명문 */}
                    <Text style={styles.guideDesc}>{guideTexts[guideStep]}</Text>

                    {/* 다음 / 확인 버튼 */}
                    <TouchableOpacity
                        style={styles.nextButton}
                        onPress={() => guideStep < 3 ? setGuideStep(guideStep + 1) : setShowGuide(false)}
                    >
                        <Text style={styles.nextText}>{guideStep < 3 ? "다음" : "확인"}</Text>
                    </TouchableOpacity>

                </View>
            )}

            {/* ✅ 인식 결과 바텀시트 */}
            <RecognitionResultBottomSheet
                visible={showResult}
                onClose={() => {
                    setShowResult(false);
                    // 홈 화면으로 이동
                    navigation.navigate('Main');
                }}
                recognitionData={recognitionData}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    cameraMock: { ...StyleSheet.absoluteFillObject },

    topBar: {
        position: 'absolute', top: 50, left: 20, right: 20,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 20
    },
    profileRow: { flexDirection: 'row', alignItems: 'center' },
    profileImage: { width: 60, height: 60, borderRadius: 10, marginRight: 10 },
    gradeText: { color: '#fff', fontSize: 12, opacity: 0.8 },
    userName: { color: '#fff', fontSize: 18, fontWeight: '700' },
    pointBox: { flexDirection: 'row', alignItems: 'center' },
    coinIcon: { width: 25, height: 25, marginRight: 5 },
    pointText: { color: '#ffd966', fontSize: 18, fontWeight: '600' },

    infoBox: {
        position: 'absolute', bottom: 115, left: 25, right: 25,
        backgroundColor: 'rgba(0,0,0,0.45)', paddingVertical: 10,
        borderRadius: 10, alignItems: 'center', zIndex: 30
    },
    infoText: { color: '#fff', fontSize: 14 },
    alertText: { color: '#ff5e5e', fontSize: 13, marginTop: 3 },

    processingOverlay: {
        ...StyleSheet.absoluteFillObject, justifyContent: 'center',
        alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.35)', zIndex: 40
    },
    processingText: { marginTop: 10, color: '#fff', fontSize: 16 },

    box: { position: 'absolute', borderWidth: 2, borderRadius: 8, zIndex: 25 },
    badgeLeft: { position: 'absolute', top: -28, left: 0, padding: 4, borderRadius: 6, borderWidth: 2 },
    badgeRight: { position: 'absolute', top: -28, right: 0, padding: 4, borderRadius: 6, borderWidth: 2 },
    badgeText: { fontSize: 12, fontWeight: '700' },

    bottomControls: {
        position: 'absolute', bottom: 35, width: '100%',
        flexDirection: 'row', justifyContent: 'space-around', zIndex: 10
    },
    captureBtn: {
        width: 70, height: 70, borderRadius: 35, borderWidth: 3, borderColor: '#fff',
        justifyContent: 'center', alignItems: 'center'
    },
    captureInner: {
        width: 55, height: 55, borderRadius: 35, backgroundColor: '#078C5A',
        justifyContent: 'center', alignItems: 'center'
    },

    /* 회색 마스크 */
    overlayContainer: {
        ...StyleSheet.absoluteFillObject,
        pointerEvents: 'none',
        zIndex: 5,
    },
    overlayTop: { height: 150, backgroundColor: 'rgba(0,0,0,0.45)' },
    overlayMiddle: { flexDirection: 'row', height: 600 },
    overlayBottom: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
    overlaySide: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
    clearCenter: { width: 380, height: 600 },

    /* 프레임 */
    frameOverlay: { position: 'absolute', top: 150, left: 25, width: 380, height: 600, zIndex: 6 },
    cornerTL: { width: 50, height: 50, borderColor: '#078C5A', borderWidth: 4, borderBottomWidth: 0, borderRightWidth: 0, position: 'absolute', top: 0, left: 0 },
    cornerTR: { width: 50, height: 50, borderColor: '#078C5A', borderWidth: 4, borderBottomWidth: 0, borderLeftWidth: 0, position: 'absolute', top: 0, right: 0 },
    cornerBL: { width: 50, height: 50, borderColor: '#078C5A', borderWidth: 4, borderTopWidth: 0, borderRightWidth: 0, position: 'absolute', bottom: 0, left: 0 },
    cornerBR: { width: 50, height: 50, borderColor: '#078C5A', borderWidth: 4, borderTopWidth: 0, borderLeftWidth: 0, position: 'absolute', bottom: 0, right: 0 },


    /* 바텀시트 */
    guideSheet: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 550,
        backgroundColor: '#fff',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        alignItems: 'center',
        paddingTop: 45,
        zIndex: 999
    },

    /* 제목 줄 */
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 10,
        marginTop: -10
    },
    guideAlertIcon: {
        width: 25,
        height: 25,
        resizeMode: 'contain'
    },

    guideTitle: {
        fontSize: 19,
        fontWeight: '700',
        color: '#111'
    },

    closeBtn: {
        position: 'absolute',
        right: 30,
        top: 28
    },

    guideImage: {
        width: 400,
        height: 500,
        marginVertical: 5,
        marginTop: -80,
        marginBottom: -70
    },

    guideDesc: {
        textAlign: 'center',
        fontSize: 18,
        color: '#111',
        marginBottom: 15,
        marginTop: 1,
        paddingHorizontal: 50
    },

    nextButton: {
        backgroundColor: '#078C5A',
        paddingVertical: 12,
        paddingHorizontal: 50,
        borderRadius: 14,
        marginTop: 5
    },
    nextText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 17
    },

    loadingWrapper: {
        width: 400,
        height: 500,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -80,
        marginBottom: -70,
    },

});