import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { authApi } from '../services/api/authApi';
import { useApi } from '../hooks/useApi';
import { tokenStorage } from '../services/tokenStorage';

export default function LoginScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFocusedEmail, setFocusedEmail] = useState(false);
  const [isFocusedPw, setFocusedPw] = useState(false);

  // API 훅
  const { execute: loginUser, loading: loginLoading } = useApi(authApi.login);

  const handleLogin = async () => {
    // 입력 검증
    if (!email || !password) {
      Alert.alert('입력 오류', '이메일과 비밀번호를 입력해주세요.');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('입력 오류', '올바른 이메일 형식을 입력해주세요.');
      return;
    }

    try {
      const response = await loginUser(email, password);
      
      // Authorization 헤더에서 토큰 추출
      const authHeader = response.headers?.authorization || response.headers?.Authorization;
      const token = authHeader?.replace('Bearer ', '');
      
      // 토큰 저장
      if (token) {
        await tokenStorage.saveAccessToken(token);
        console.log('로그인 성공 - 토큰 저장 완료');
      }
      
      // 웹에서도 보이도록 alert() 사용 - 개발용도
      if (typeof window !== 'undefined') {
        window.alert('로그인 성공! 환영합니다!');
      }
      
      Alert.alert('로그인 성공', '환영합니다!', [
        {
          text: '확인',
          onPress: () => {
            // 메인 화면으로 이동 - 나중에 여기다 하시면 됩니다
            // navigation.navigate('Main');
          },
        },
      ]);
      
    } catch (error) {
      console.error('로그인 에러:', error);
      Alert.alert('로그인 실패', error.message || '이메일 또는 비밀번호를 확인해주세요.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      <Text style={styles.hello}>
        안녕하세요{'\n'}
        <Text style={styles.green}>Green Point</Text> 입니다
      </Text>
      <Text style={styles.subText}>회원 서비스를 이용을 위해 로그인 해주세요</Text>

      <View style={styles.inputBox}>
        <Text style={styles.label}>이메일</Text>
        <TextInput
          style={[styles.input, isFocusedEmail && styles.inputFocused]}
          placeholder=" 이메일 입력"
          placeholderTextColor="#cbd5e1"
          value={email}
          onChangeText={setEmail}
          onFocus={() => setFocusedEmail(true)}
          onBlur={() => setFocusedEmail(false)}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loginLoading}
        />
      </View>

      <View style={styles.inputBox}>
        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          style={[styles.input, isFocusedPw && styles.inputFocused]}
          placeholder=" 비밀번호 입력"
          placeholderTextColor="#cbd5e1"
          value={password}
          onChangeText={setPassword}
          onFocus={() => setFocusedPw(true)}
          onBlur={() => setFocusedPw(false)}
          secureTextEntry
          editable={!loginLoading}
        />
      </View>

      <View style={styles.linkRow}>
        <Text style={styles.link}>아이디 찾기</Text>
        <Text style={styles.divider}>|</Text>
        <Text style={styles.link}>비밀번호 찾기</Text>
        <Text style={styles.divider}>|</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUpStep1')}>
            <Text style={[styles.link, styles.signup]}>회원가입</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.loginBtn}
        onPress={handleLogin}
        disabled={loginLoading}
      >
        {loginLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginText}>로그인</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.kakaoBtn}>
        <Image
          source={require('../../assets/kakao_login.png')}
          style={styles.kakaoFull}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 30,
    paddingTop: 30,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  hello: {
    fontSize: 25,
    fontWeight: '600',
    textAlign: 'left',
    width: '100%',
    lineHeight: 32,
    color: '#111827',
    marginTop: 50,
    marginBottom: 18,
  },
  green: {
    fontSize: 35,
    color: '#078C5A',
    fontWeight: '700',
  },
  subText: {
    color: '#6b7280',
    fontSize: 13,
    marginTop: 1,
    marginBottom: 50,
    width: '100%',
    fontWeight: '600',
    textAlign: 'left',
  },
  inputBox: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 6,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#111827',
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
  },
  inputFocused: {
    borderBottomColor: '#078C5A',
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 36,
  },
  link: {
    fontSize: 13,
    color: '#6b7280',
  },
  divider: {
    marginHorizontal: 8,
    color: '#9ca3af',
  },
  signup: {
    color: '#6b7280',
  },
  loginBtn: {
    backgroundColor: '#078C5A',
    width: '85%',
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  kakaoBtn: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  kakaoFull: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});
