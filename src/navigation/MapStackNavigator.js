import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Image } from 'react-native';
import MapScreen from '../screens/MapScreen';

const Stack = createNativeStackNavigator();

export default function MapStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MapMain"
        component={MapScreen}
        options={({ navigation }) => ({
          title: '내 근처',
          headerShown: true,
          headerTitleAlign: 'center',
          headerTintColor: '#111827',
          headerStyle: { backgroundColor: '#ffffff' },
          headerTitleStyle: { fontWeight: '700', fontSize: 20 },

          // 뒤로가기 버튼
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingHorizontal: 12, paddingVertical: 6 }}
            >
              <Image
                source={require('../../assets/backstep.png')}
                style={{ width: 20, height: 20, resizeMode: 'contain' }}
              />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
}
