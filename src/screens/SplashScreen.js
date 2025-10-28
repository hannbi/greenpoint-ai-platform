import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2000); // 2초 뒤 로그인으로 이동
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Green Point</Text>
      <Text style={styles.subtitle}>버리는 순간 가치가 시작됩니다</Text>
      <Text style={styles.desc}>AI와 함께 즐기는 새로운 환경습관, GreenPoint</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 10,
  },
  title: {
    fontSize: 50,
    color: '#078C5A',
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#7C7C7C',
  },
  desc: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7C7C7C',
    marginTop: 4,
  },
});
