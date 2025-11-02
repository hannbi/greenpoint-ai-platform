import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function SignUpStep2({ navigation, route }) {
  // 이전 단계에서 전달받은 데이터
  const { email, verificationTicket } = route.params || {};
  
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [nickname, setNickname] = useState('');
  const [nicknameTaken, setNicknameTaken] = useState(false);

  const handleNicknameCheck = () => {
    if (nickname.trim().toLowerCase() === 'hanbi') {
      setNicknameTaken(true);
    } else {
      setNicknameTaken(false);
    }
  };

  const isSamePw = password === confirmPw && password !== '';
  const isFormValid = isSamePw && nickname && !nicknameTaken;

  const handleNext = () => {
    if (!isFormValid) return;

    // 비밀번호 유효성 검사 (최소 8자, 영문+숫자 조합 등)
    if (password.length < 8) {
      Alert.alert('오류', '비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }

    // Step3로 데이터 전달 (아직 회원가입 API 호출 안함)
    navigation.navigate('SignUpStep3', {
      email,
      verificationTicket,
      password,
      nickname,
    });
  };

  return (
    <View style={styles.container}>
      {/* 상단바 + 프로그레스바 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}></Text>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, styles.active]} />
          <View style={[styles.progressBar, styles.active]} />
          <View style={styles.progressBar} />
        </View>
      </View>

      <Text style={styles.welcome}>비밀번호와 닉네임을 설정하세요</Text>
      <Text style={styles.subText}>안전한 비밀번호를 설정하고 닉네임을 입력해주세요</Text>

      {/* 비밀번호 입력 */}
      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          placeholderTextColor="#cbd5e1"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* 비밀번호 확인 */}
      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          placeholder="비밀번호 확인"
          placeholderTextColor="#cbd5e1"
          secureTextEntry
          value={confirmPw}
          onChangeText={setConfirmPw}
        />
      </View>

      {!isSamePw && confirmPw.length > 0 && (
        <Text style={styles.warningText}>비밀번호가 일치하지 않습니다.</Text>
      )}

      {/* 닉네임 입력 */}
      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          placeholder="닉네임"
          placeholderTextColor="#cbd5e1"
          value={nickname}
          onChangeText={setNickname}
          onBlur={handleNicknameCheck}
        />
      </View>

      {nicknameTaken ? (
        <Text style={styles.warningText}>이미 존재하는 닉네임입니다.</Text>
      ) : nickname ? (
        <Text style={styles.verifiedText}>사용 가능한 닉네임입니다.</Text>
      ) : null}

      {/* 다음 버튼 */}
      <TouchableOpacity
        style={[styles.nextBtn, isFormValid ? styles.nextActive : {}]}
        disabled={!isFormValid}
        onPress={handleNext}
      >
        <Text style={styles.nextText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 30, paddingTop: 50, alignItems: 'center' },

  header: { alignItems: 'center', marginBottom: 40, width: '100%' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: -50 },
  progressContainer: { flexDirection: 'row', justifyContent: 'center', width: '120%', marginBottom: 50 },
  progressBar: {
    flex: 1,
    height: 5,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 0,
    borderRadius: 2,
  },
  active: { backgroundColor: '#078C5A' },

  welcome: { fontSize: 25, fontWeight: '600', color: '#111827', marginBottom: 15, textAlign: 'center' },
  subText: { color: '#6b7280', fontSize: 14, marginBottom: 70, fontWeight: 600, textAlign: 'center'},

  inputBox: { width: '100%', marginBottom: 30 },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 15,
    fontSize: 15,
    color: '#111827',
  },

  warningText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginTop:-30,
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.1)', // 그림자 색 (살짝 회색)
    textShadowOffset: { width: 1, height: 1 }, // 가로·세로 거리
    textShadowRadius: 2, // 번짐 정도
  },
  verifiedText: {
    color: '#078C5A',
    fontSize: 13,
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginTop:-30,
    textShadowColor: 'rgba(0, 0, 0, 0.1)', // 그림자 색 (살짝 회색)
    textShadowOffset: { width: 1, height: 1 }, // 가로·세로 거리
    textShadowRadius: 2, // 번짐 정도
  },

  nextBtn: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9ca3af',
    marginTop: 40,
  },
  nextActive: { backgroundColor: '#078C5A' },
  nextText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
