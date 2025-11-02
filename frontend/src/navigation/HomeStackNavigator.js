// navigation/HomeStackNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DischargeGuideScreen from '../screens/DischargeGuideScreen';
import AIChatScreen from '../screens/AIChatScreen';

const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* 기본 홈 화면 */}
            <Stack.Screen name="HomeMain" component={HomeScreen} />
            
            {/* 분리 배출 가이드 화면 */}
            <Stack.Screen
                name="DischargeGuide"
                component={DischargeGuideScreen}
                options={{
                    headerShown: true,
                    title: '분리 배출 가이드',
                    headerTitleAlign: 'center',
                    headerTintColor: '#111827',
                    headerStyle: { backgroundColor: '#ffffff' },
                    headerTitleStyle: { fontWeight: '700', fontSize: 20 },
                }}
            />

            {/* AI 챗봇 화면 */}
            <Stack.Screen
                name="AIChat"
                component={AIChatScreen}
                options={{
                    headerShown: false,
                    presentation: 'transparentModal', // 투명 모달
                    animation: 'none', // 애니메이션 없음 (직접 구현)
                }}
            />
        </Stack.Navigator>
    );
}