import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Image, Pressable } from 'react-native';

export default function SignUpStep1({ navigation }) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isVerified, setVerified] = useState(false);
  const [modalType, setModalType] = useState(null);

  const handleCheck = () => {
    if (!email.includes('@') || !email.includes('.')) {
      setModalType('error');
      return;
    }
    setModalType('verify');
  };

  const handleVerify = () => {
    if (code.trim() !== '') {
      setVerified(true);
      setModalType(null);
    }
  };

  const handleNext = () => {
    if (isVerified) navigation.navigate('SignUpStep2');
  };

  const handleResend = () => {
    alert('인증코드가 재발송되었습니다.');
  };

  return (
    <View style={styles.container}>
      {/* 상단 타이틀 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}></Text>

        {/* 프로그레스바 (3단계 중 1단계) */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, styles.active]} />
          <View style={styles.progressBar} />
          <View style={styles.progressBar} />
        </View>
      </View>

      <Text style={styles.welcome}>환영합니다!</Text>
      <Text style={styles.subText}>로그인에 사용할 이메일을 입력해주세요</Text>

      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          placeholder="이메일"
          placeholderTextColor="#cbd5e1"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <TouchableOpacity
        style={[styles.checkBtn, email.includes('@') ? styles.btnActive : styles.btnDisabled]}
        onPress={isVerified ? handleNext : handleCheck}
        disabled={!email.includes('@')}
      >
        <Text style={styles.btnText}>{isVerified ? '다음' : '중복 확인'}</Text>
      </TouchableOpacity>

      {isVerified && (
        <Text style={styles.verifiedText}>사용 가능한 이메일입니다.</Text>
      )}

      {/* 팝업 모달 */}
      <Modal visible={!!modalType} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {modalType === 'error' && (
              <>
                <Text style={styles.modalText}>이메일 형식이 올바르지 않습니다.{'\n'}다시 확인해주세요.</Text>
                <Pressable style={styles.modalBtn} onPress={() => setModalType(null)}>
                  <Text style={styles.modalBtnText}>확인</Text>
                </Pressable>
              </>
            )}

            {modalType === 'verify' && (
              <>
                <View style={styles.modalTitleRow}>
                  <Image
                    source={require('../../assets/security-check.png')}
                    style={styles.modalIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.modalTitle}>본인 인증</Text>
                </View>

                <Text style={styles.modalDesc}>
                  인증을 위한 이메일이 발송되었습니다.{'\n'}
                  이메일에 포함된 <Text style={{ fontWeight: '700', color: '#111827' }}>인증코드</Text>를 입력해주세요.
                </Text>

                <TextInput
                  style={styles.inputCode}
                  placeholder="인증 코드"
                  placeholderTextColor="#cbd5e1"
                  value={code}
                  onChangeText={setCode}
                />

                <TouchableOpacity onPress={handleResend}>
                  <Text style={styles.resendText}>인증코드 재발송</Text>
                </TouchableOpacity>

                <Pressable style={styles.modalBtn} onPress={handleVerify}>
                  <Text style={styles.modalBtnText}>인증하기</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  subText: { color: '#6b7280', fontSize: 14, marginBottom: 36, fontWeight: 600, textAlign: 'center' },

  inputBox: { width: '100%', marginTop: 40, marginBottom: 30 },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 15,
    fontSize: 15,
    color: '#111827',
  },

  checkBtn: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnActive: { backgroundColor: '#078C5A' },
  btnDisabled: { backgroundColor: '#9ca3af' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  verifiedText: {
    color: '#078C5A',
    marginTop: 13,
    fontWeight: '600',
    alignSelf: 'flex-start', // 왼쪽 정렬
    textShadowColor: 'rgba(0, 0, 0, 0.1)', // 그림자 색 (살짝 회색)
    textShadowOffset: { width: 1, height: 1 }, // 가로·세로 거리
    textShadowRadius: 2, // 번짐 정도
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    width: '80',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: -5, 
  },
  modalIcon: { width: 24, height: 24, marginRight: 6 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
  modalDesc: { color: '#6b7280', fontSize: 13, textAlign: 'center', marginBottom: 30 },
  inputCode: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 8,
  },
  resendText: {
    color: '#078C5A',
    fontWeight: '500',
    fontSize: 12,
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  modalText: { fontSize: 15, color: '#111827', textAlign: 'center', marginBottom: 18 },
  modalBtn: {
    backgroundColor: '#078C5A',
    borderRadius: 8,
    width: '60%',
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
