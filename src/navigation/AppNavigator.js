import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpStep1 from '../screens/SignUpStep1';
import SignUpStep2 from '../screens/SignUpStep2';
import SignUpStep3 from '../screens/SignUpStep3';
import MyPageScreen from '../screens/MyPageScreen';
import RecognizeScreen from '../screens/RecognizeScreen';
import MapScreen from '../screens/MapScreen';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        {/* 스플래시 */}
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />

        {/* 로그인 */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: '로그인',
            headerShown: true,
            headerTitleAlign: 'center',
            headerTintColor: '#111827',
            headerStyle: { backgroundColor: '#ffffff' },
            headerTitleStyle: { fontWeight: '700', fontSize: 20 },
          }}
        />

        {/* 회원가입 */}
        <Stack.Screen
          name="SignUpStep1"
          component={SignUpStep1}
          options={{
            title: '회원가입',
            headerShown: true,
            headerTitleAlign: 'center',
            headerTintColor: '#111827',
            headerStyle: { backgroundColor: '#ffffff' },
            headerTitleStyle: { fontWeight: '700', fontSize: 20 },
          }}
        />
        <Stack.Screen
          name="SignUpStep2"
          component={SignUpStep2}
          options={{
            title: '회원가입',
            headerShown: true,
            headerTitleAlign: 'center',
            headerTintColor: '#111827',
            headerStyle: { backgroundColor: '#ffffff' },
            headerTitleStyle: { fontWeight: '700', fontSize: 20 },
          }}
        />
        <Stack.Screen
          name="SignUpStep3"
          component={SignUpStep3}
          options={{
            title: '회원가입',
            headerShown: true,
            headerTitleAlign: 'center',
            headerTintColor: '#111827',
            headerStyle: { backgroundColor: '#ffffff' },
            headerTitleStyle: { fontWeight: '700', fontSize: 20 },
          }}
        />

        {/* 로그인 후 홈*/}
        <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />

        <Stack.Screen
          name="MyPageScreen"
          component={MyPageScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="RecognizeScreen"
          component={RecognizeScreen}
          options={{ headerShown: false }}
        />

        {/* 내 근처 */}
        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={{
            title: '내 근처',
            headerShown: true,
            headerTitleAlign: 'center',
            headerTintColor: '#111827',
            headerStyle: { backgroundColor: '#ffffff' },
            headerTitleStyle: { fontWeight: '700', fontSize: 20 },
          }}
        />



      </Stack.Navigator>
    </NavigationContainer>
  );
}
