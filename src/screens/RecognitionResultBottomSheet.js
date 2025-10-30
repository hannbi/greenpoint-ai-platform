// src/screens/RecognitionResultBottomSheet.js

import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Image,
    Animated,
    PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function RecognitionResultBottomSheet({ 
    visible, 
    onClose, 
    recognitionData = [] 
}) {
    const translateY = useRef(new Animated.Value(height)).current;

    useEffect(() => {
        if (visible) {
            // 바텀시트 올라오기
            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
                bounciness: 5,
            }).start();
        } else {
            // 바텀시트 내려가기
            Animated.timing(translateY, {
                toValue: height,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    // 드래그 핸들러
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return Math.abs(gestureState.dy) > 5;
            },
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) {
                    translateY.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > 150) {
                    handleClose();
                } else {
                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                        bounciness: 5,
                    }).start();
                }
            },
        })
    ).current;

    const handleClose = () => {
        Animated.timing(translateY, {
            toValue: height,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            onClose();
        });
    };

    // 총 포인트 계산
    const totalPoints = recognitionData.reduce((sum, item) => sum + (item.points || 0), 0);

    // 등급별 그라데이션 색상
    const getGradeGradient = (grade) => {
        switch(grade) {
            case 'A': return ['#E8F5E9', '#C8E6C9'];
            case 'B': return ['#FFF3E0', '#FFE0B2'];
            case 'C': return ['#FCE4EC', '#F8BBD0'];
            default: return ['#F5F5F5', '#E0E0E0'];
        }
    };

    const getGradeBorderColor = (grade) => {
        switch(grade) {
            case 'A': return '#4CAF50';
            case 'B': return '#FF9800';
            case 'C': return '#E91E63';
            default: return '#BDBDBD';
        }
    };

    const getTypeGradient = (type) => {
        switch(type.toUpperCase()) {
            case 'PET': return ['#7C4DFF', '#5E35B1'];
            case 'PAPER': return ['#66BB6A', '#43A047'];
            case 'PLASTIC': return ['#42A5F5', '#1E88E5'];
            case 'CAN': return ['#EF5350', '#E53935'];
            case 'GLASS': return ['#26C6DA', '#00ACC1'];
            default: return ['#9E9E9E', '#757575'];
        }
    };

    if (!visible) return null;

    return (
        <View style={styles.overlay}>
            <TouchableOpacity 
                style={styles.backdrop} 
                activeOpacity={1}
                onPress={handleClose}
            />
            
            <Animated.View 
                style={[
                    styles.container,
                    {
                        transform: [{ translateY }],
                    }
                ]}
            >
                {/* 드래그 핸들 */}
                <View style={styles.handleContainer} {...panResponder.panHandlers}>
                    <View style={styles.handle} />
                </View>

                {/* 헤더 */}
                <View style={styles.header}>
                    <View style={styles.headerTitleContainer}>
                        <Image 
                            source={require('../../assets/Finish_img.png')} 
                            style={styles.finishIcon}
                            resizeMode="contain"
                        />
                        <Text style={styles.headerTitle}>인식 완료</Text>
                    </View>
                </View>

                {/* 스크롤 영역 */}
                <ScrollView 
                    style={styles.scrollArea}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {recognitionData.map((item, index) => (
                        <LinearGradient
                            key={index}
                            colors={getGradeGradient(item.grade)}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={[
                                styles.resultCard,
                                { borderColor: getGradeBorderColor(item.grade) }
                            ]}
                        >
                            {/* 재질 타입 */}
                            <View style={styles.cardHeader}>
                                <Text style={[styles.typeText, { color: getTypeGradient(item.type)[0] }]}>
                                    {item.type.toUpperCase()}
                                </Text>
                                {/* ✅ 재활용 등급 섹션 - 완벽 중앙 정렬 */}
                                <View style={styles.gradeContainer}>
                                    <View style={styles.gradeRow}>
                                        <Text style={styles.gradeLabel}>재활용 등급</Text>
                                        <View style={[styles.gradeBadge, { borderColor: getGradeBorderColor(item.grade) }]}>
                                            {/* ✅ C와 A/B 스타일 분리 */}
                                            <Text style={[
                                                item.grade === 'C' ? styles.gradeTextC : styles.gradeTextA,
                                                { color: getGradeBorderColor(item.grade) }
                                            ]}>
                                                {item.grade}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* 분석 정보 */}
                            <View style={styles.infoSection}>
                                {item.clean !== undefined && (
                                    <Text style={styles.infoText}>• clean (청결도): {item.clean}</Text>
                                )}
                                {item.removed_labeled !== undefined && (
                                    <Text style={styles.infoText}>• removed_labeled (제거된): {item.removed_labeled}</Text>
                                )}
                                {item.color !== undefined && (
                                    <Text style={styles.infoText}>• color (색상): {item.color}</Text>
                                )}
                            </View>

                            {/* 탄소 절감 & 포인트 */}
                            <View style={styles.cardFooter}>
                                <View style={styles.carbonContainer}>
                                    <Text style={styles.carbonIcon}>♻️</Text>
                                    <Text style={styles.carbonText}>탄소 절감량: {item.carbon || '198.3'} kg CO₂</Text>
                                </View>
                                <View style={styles.pointContainer}>
                                    <Text style={styles.coinIcon}>🪙</Text>
                                    <Text style={styles.pointText}>획득 포인트: {item.points || 0}P</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    ))}

                    {/* 총 포인트 */}
                    <View style={styles.totalSection}>
                        <Text style={styles.totalLabel}>최종 포인트:</Text>
                        <Text style={styles.totalPoints}>{totalPoints}P</Text>
                    </View>
                </ScrollView>

                {/* 포인트 받기 버튼 */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={styles.confirmButton}
                        onPress={() => {
                            // 포인트 적립 로직
                            console.log('포인트 받기:', totalPoints);
                            handleClose();
                        }}
                    >
                        <Text style={styles.confirmButtonText}>포인트 받기</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: height * 0.85,
        backgroundColor: '#F5F5F5',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: 'hidden',
    },
    
    // 드래그 핸들
    handleContainer: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 12,
        backgroundColor: '#F5F5F5',
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#BDBDBD',
        borderRadius: 2,
    },
    
    // 헤더
    header: {
        paddingHorizontal: 20,
        paddingBottom: 16,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    finishIcon: {
        width: 32,
        height: 32,
        marginRight: 10,
    },
    headerTitle: {
        color: '#078C5A',
        fontSize: 24,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    
    // 스크롤 영역
    scrollArea: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 10,
    },
    
    // 결과 카드
    resultCard: {
        borderRadius: 20,
        borderWidth: 3,
        padding: 22,
        marginBottom: 18,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 18,
    },
    typeText: {
        fontSize: 32,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    gradeContainer: {
        alignItems: 'flex-end',
    },
    gradeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    gradeLabel: {
        fontSize: 18,
        color: '#666',
        fontWeight: '600',
        lineHeight: 52,
    },
    gradeBadge: {
        width: 52,
        height: 52,
        borderRadius: 26,
        borderWidth: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    
    // ✅ 재활용 등급 글자 - A, B 전용 (기본 중앙 정렬)
    gradeTextA: {
        fontSize: 26,
        fontWeight: '700',
        lineHeight: 26,
        textAlign: 'center',
        includeFontPadding: false,
        textAlignVertical: 'center',
        marginLeft: 0,
        marginTop: -4,
    },
    
    // ✅ 재활용 등급 글자 - C 전용 (미세 조정 x: -1, y: +1)
    gradeTextC: {
        fontSize: 26,
        fontWeight: '700',
        lineHeight: 26,
        textAlign: 'center',
        includeFontPadding: false,
        textAlignVertical: 'center',
        marginLeft: -1,
        marginTop: -2,
    },
    
    // 정보 섹션
    infoSection: {
        marginBottom: 18,
    },
    infoText: {
        fontSize: 19,
        color: '#333',
        lineHeight: 28,
        letterSpacing: -0.2,
        fontWeight: '500',
    },
    
    // 카드 푸터
    cardFooter: {
        borderTopWidth: 2,
        borderTopColor: 'rgba(0, 0, 0, 0.1)',
        paddingTop: 16,
    },
    carbonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    carbonIcon: {
        fontSize: 22,
        marginRight: 8,
    },
    carbonText: {
        fontSize: 20,
        color: '#4CAF50',
        fontWeight: '700',
    },
    pointContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    coinIcon: {
        fontSize: 22,
        marginRight: 8,
    },
    pointText: {
        fontSize: 20,
        color: '#FF9800',
        fontWeight: '700',
    },
    
    // 총 포인트
    totalSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 26,
        marginTop: 12,
        marginBottom: 12,
        borderWidth: 3,
        borderColor: '#078C5A',
    },
    totalLabel: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
        marginRight: 10,
    },
    totalPoints: {
        fontSize: 36,
        fontWeight: '700',
        color: '#078C5A',
    },
    
    // 버튼
    buttonContainer: {
        padding: 20,
        paddingBottom: 30,
        backgroundColor: '#F5F5F5',
    },
    confirmButton: {
        backgroundColor: '#078C5A',
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: -0.3,
    },
});