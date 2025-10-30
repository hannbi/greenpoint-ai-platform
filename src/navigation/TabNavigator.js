import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet, Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import HomeStackNavigator from './HomeStackNavigator';
import MarketScreen from '../screens/MarketScreen';
import MapStackNavigator from './MapStackNavigator';
import RankScreen from '../screens/RankScreen';
import MyPageScreen from '../screens/MyPageScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarStyle: {
          backgroundColor: '#ffffff',
          height: 70,
          paddingBottom: 6,
          paddingTop: 6,
        },

        tabBarActiveTintColor: '#078C5A',
        tabBarInactiveTintColor: '#9ca3af',

        tabBarIcon: ({ color }) => {
          let icon;

          switch (route.name) {
            case 'Home':
              icon = require('../../assets/home_icon.png');
              break;
            case 'Market':
              icon = require('../../assets/market_icon.png');
              break;
            case 'Map':
              icon = require('../../assets/map_icon.png');
              break;
            case 'Rank':
              icon = require('../../assets/rank_icon.png');
              break;
            case 'MyPage':
              icon = require('../../assets/mypage_icon.png');
              break;
          }

          return <Image source={icon} style={[styles.icon, { tintColor: color }]} />;
        },

        // 선택된 탭만 글씨 진하게
        tabBarLabel: ({ focused, color }) => (
          <Text style={{ color, fontSize: 12, fontWeight: focused ? '700' : '400' }}>
            {route.name === 'Home' && '홈'}
            {route.name === 'Market' && '포인트마켓'}
            {route.name === 'Map' && '내 근처'}
            {route.name === 'Rank' && '랭킹'}
            {route.name === 'MyPage' && '마이페이지'}
          </Text>
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Market" component={MarketScreen} />
      <Tab.Screen name="Map" component={MapStackNavigator} />
      <Tab.Screen name="Rank" component={RankScreen} />
      <Tab.Screen name="MyPage" component={MyPageScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
});
