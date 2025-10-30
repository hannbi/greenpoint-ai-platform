// navigation/MapStackNavigator.js (수정)

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// 💡 커스텀 헤더를 MapScreen에서 처리하므로, 아래 두 import는 더 이상 필요 없습니다.
// import { TouchableOpacity, Image } from 'react-native'; 
import MapScreen from '../screens/MapScreen';

const Stack = createNativeStackNavigator();

export default function MapStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MapMain"
        component={MapScreen}
        options={
          // 💡 가장 중요! OS 기본 헤더를 숨깁니다.
          {
            headerShown: false,
          }
          /* 모든 커스텀 헤더(title, headerTitleAlign, headerLeft 등) 옵션을 제거합니다.
            이제 MapScreen 내부에서 검색 바와 뒤로가기 버튼을 관리합니다.
          */
        }
      />
    </Stack.Navigator>
  );
}