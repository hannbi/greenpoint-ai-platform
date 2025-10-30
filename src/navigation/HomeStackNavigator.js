// navigation/HomeStackNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DischargeGuideScreen from '../screens/DischargeGuideScreen';

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
        </Stack.Navigator>
    );
}
