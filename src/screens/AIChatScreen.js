// src/screens/AIChatScreen.js

import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Image,
    Animated,
    PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function AIChatScreen({ navigation }) {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const scrollViewRef = useRef();
    const translateY = useRef(new Animated.Value(0)).current;
    const lastGestureDy = useRef(0);

    const handleSend = () => {
        if (message.trim()) {
            const newUserMessage = { type: 'user', text: message };
            setChatHistory(prev => [...prev, newUserMessage]);
            
            setTimeout(() => {
                setChatHistory(prev => [...prev, { 
                    type: 'bot', 
                    text: '분리배출에 대해 궁금하신 점을 알려주시면 자세히 안내해드리겠습니다!' 
                }]);
            }, 500);
            
            setMessage('');
        }
    };

    useEffect(() => {
        if (scrollViewRef.current && chatHistory.length > 0) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }, [chatHistory]);

    // 드래그 핸들러
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                // 세로 방향 드래그만 인식
                return Math.abs(gestureState.dy) > 5;
            },
            onPanResponderMove: (_, gestureState) => {
                // 아래로만 드래그 가능 (위로는 막음)
                if (gestureState.dy > 0) {
                    translateY.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                // 200px 이상 내리면 닫기
                if (gestureState.dy > 200) {
                    Animated.timing(translateY, {
                        toValue: height,
                        duration: 300,
                        useNativeDriver: true,
                    }).start(() => {
                        navigation.goBack();
                    });
                } else {
                    // 다시 원위치
                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                        bounciness: 5,
                    }).start();
                }
            },
        })
    ).current;

    return (
        <View style={styles.overlay}>
            <TouchableOpacity 
                style={styles.backdrop} 
                activeOpacity={1}
                onPress={() => {
                    Animated.timing(translateY, {
                        toValue: height,
                        duration: 300,
                        useNativeDriver: true,
                    }).start(() => {
                        navigation.goBack();
                    });
                }}
            />
            
            <Animated.View 
                style={[
                    styles.containerWrapper,
                    {
                        transform: [{ translateY }],
                    }
                ]}
            >
                <LinearGradient
                    colors={['#078C5A', '#0c3727ff']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.container}
                >
                    {/* 드래그 핸들 */}
                    <View style={styles.handleContainer} {...panResponder.panHandlers}>
                        <View style={styles.handle} />
                    </View>

                    {/* 헤더 */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>AI 분리배출 도우미</Text>
                        <TouchableOpacity 
                            onPress={() => {
                                Animated.timing(translateY, {
                                    toValue: height,
                                    duration: 300,
                                    useNativeDriver: true,
                                }).start(() => {
                                    navigation.goBack();
                                });
                            }}
                            style={styles.closeButton}
                        >
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/* 채팅 영역 */}
                    <ScrollView 
                        ref={scrollViewRef}
                        style={styles.chatArea}
                        contentContainerStyle={styles.chatContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {chatHistory.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <View style={styles.recycleImageContainer}>
                                    <Image 
                                        source={require('../../assets/recycle_icon.png')} 
                                        style={styles.recycleImage}
                                        resizeMode="contain"
                                    />
                                </View>
                                <Text style={styles.emptyTitle}>
                                    분리배출에 관해 무엇이든 물어보세요
                                </Text>
                                <Text style={styles.emptySubtitle}>
                                    AI가 분리배출 방법을 친절하게 안내해드립니다
                                </Text>
                            </View>
                        ) : (
                            chatHistory.map((chat, index) => (
                                <View 
                                    key={index} 
                                    style={[
                                        styles.messageContainer,
                                        chat.type === 'user' ? styles.userMessage : styles.botMessage
                                    ]}
                                >
                                    <View style={[
                                        styles.messageBubble,
                                        chat.type === 'user' ? styles.userBubble : styles.botBubble
                                    ]}>
                                        <Text style={[
                                            styles.messageText,
                                            chat.type === 'user' ? styles.userText : styles.botText
                                        ]}>
                                            {chat.text}
                                        </Text>
                                    </View>
                                </View>
                            ))
                        )}
                    </ScrollView>

                    {/* 입력창 */}
                    <View style={styles.inputContainer}>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                value={message}
                                onChangeText={setMessage}
                                placeholder="메시지를 입력하세요"
                                placeholderTextColor="#9CA3AF"
                                style={styles.input}
                                multiline
                                maxLength={500}
                            />
                            <TouchableOpacity 
                                style={[
                                    styles.sendButton,
                                    message.trim() && styles.sendButtonActive
                                ]}
                                onPress={handleSend}
                                disabled={!message.trim()}
                            >
                                <Text style={[
                                    styles.sendButtonText,
                                    message.trim() && styles.sendButtonTextActive
                                ]}>
                                    전송
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </LinearGradient>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    containerWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: height * 0.9,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: 'hidden',
    },
    container: {
        flex: 1,
    },
    
    // 드래그 핸들
    handleContainer: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 12,
        backgroundColor: 'transparent',
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 2,
    },
    
    // 헤더
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 16,
        backgroundColor: 'transparent',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    closeButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '300',
    },
    
    // 채팅 영역
    chatArea: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    chatContent: {
        padding: 20,
        paddingBottom: 10,
    },
    
    // 초기 빈 화면
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: height * 0.1,
    },
    recycleImageContainer: {
        width: 160,
        height: 160,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    recycleImage: {
        width: 120,
        height: 120,
    },
    emptyTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 10,
        letterSpacing: -0.3,
    },
    emptySubtitle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        letterSpacing: -0.2,
    },
    
    // 메시지
    messageContainer: {
        marginBottom: 12,
        width: '100%',
    },
    userMessage: {
        alignItems: 'flex-end',
    },
    botMessage: {
        alignItems: 'flex-start',
    },
    messageBubble: {
        maxWidth: '75%',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
    },
    userBubble: {
        backgroundColor: '#055F3C',
        borderBottomRightRadius: 4,
    },
    botBubble: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 22,
        letterSpacing: -0.2,
    },
    userText: {
        color: '#fff',
    },
    botText: {
        color: 'rgba(255, 255, 255, 0.95)',
    },
    
    // 입력창
    inputContainer: {
        backgroundColor: 'transparent',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingBottom: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center', // flex-end에서 center로 변경
        backgroundColor: '#fff',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 10, // 8에서 10으로 증가
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#111',
        maxHeight: 50,
        paddingVertical: 10,
        letterSpacing: -0.2,
        textAlign: 'left',
    },
    sendButton: {
        paddingHorizontal: 16,
        paddingVertical: 10, // 8에서 10으로 증가
        borderRadius: 18,
        marginLeft: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E5E7EB',
    },
    sendButtonActive: {
        backgroundColor: '#078C5A',
    },
    sendButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#9CA3AF',
    },
    sendButtonTextActive: {
        color: '#fff',
    },
});