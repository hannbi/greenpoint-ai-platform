import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFocusedEmail, setFocusedEmail] = useState(false);
  const [isFocusedPw, setFocusedPw] = useState(false);

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

      <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.replace('Main')}>
        <Text style={styles.loginText}>로그인</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.kakaoBtn} onPress={() => navigation.replace('Main')}>
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
    width: '80%',
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
