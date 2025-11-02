import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { authApi } from '../services/api/authApi';
import { organizationApi } from '../services/api/organizationApi';
import { useApi } from '../hooks/useApi';

export default function SignUpStep3({ navigation, route }) {
  // 이전 단계에서 전달받은 데이터
  const { email, verificationTicket, password, nickname } = route.params || {};
  
  const [organization, setOrganization] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [organizationList, setOrganizationList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeService, setAgreeService] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeLocation, setAgreeLocation] = useState(false);

  // API 훅
  const { execute: signupUser, loading: signupLoading } = useApi(authApi.signup);
  const { execute: fetchOrganizations, loading: orgLoading } = useApi(organizationApi.getOrganizations);

  // 컴포넌트 마운트 시 조직 목록 가져오기
  React.useEffect(() => {
    const loadOrganizations = async () => {
      try {
        const data = await fetchOrganizations();
        setOrganizationList(data || []);
      } catch (error) {
        Alert.alert('오류', '조직 목록을 불러오는데 실패했습니다.');
      }
    };
    loadOrganizations();
  }, []);

  const handleInputChange = (text) => {
    setOrganization(text);
    if (text.trim() === '') {
      setSuggestions([]);
      return;
    }
    // 입력값을 포함한 항목만 필터링
    const filtered = organizationList.filter((item) => item.includes(text));
    setSuggestions(filtered);
  };

  const handleSelect = (item) => {
    setOrganization(item);
    setSuggestions([]);
  };

  const toggleAll = () => {
    const newVal = !agreeAll;
    setAgreeAll(newVal);
    setAgreeService(newVal);
    setAgreePrivacy(newVal);
    setAgreeLocation(newVal);
  };

  const handleComplete = async () => {
    if (!isFormValid) return;

    try {
      // 최종 회원가입 API 호출
      const signupData = {
        email: email,
        password: password,
        nickname: nickname,
        ticket: verificationTicket,
        org: organization, // 소속명
      };

      await signupUser(signupData);

      // 회원가입 성공
      Alert.alert('회원가입 완료', '회원가입이 완료되었습니다!', [
        {
          text: '확인',
          onPress: () => navigation.navigate('Login'),
        },
      ]);
    } catch (error) {
      // 에러 처리
      Alert.alert('회원가입 실패', error.message || '회원가입에 실패했습니다.');
    }
  };

  const isFormValid = organization && agreeService && agreePrivacy && agreeLocation;

  return (
    <View style={styles.container}>
      {/* 상단바 + 프로그레스바 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}></Text>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, styles.active]} />
          <View style={[styles.progressBar, styles.active]} />
          <View style={[styles.progressBar, styles.active]} />
        </View>
      </View>

      <Text style={styles.welcome}>마지막 단계입니다!</Text>
      <Text style={styles.subText}>소속을 선택하고 약관에 동의해주세요</Text>

      {/* 소속 입력 */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="소속 (학교, 회사 등)"
          placeholderTextColor="#cbd5e1"
          value={organization}
          onChangeText={handleInputChange}
        />
        {organization !== '' && (
          <TouchableOpacity onPress={() => setOrganization('')}>
            <Ionicons name="close-circle" size={20} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>

      {/* 자동완성 리스트 */}
      {suggestions.length > 0 && (
        <View style={styles.suggestionBox}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.suggestionItem} onPress={() => handleSelect(item)}>
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={true}
            scrollIndicatorInsets={{ right: -5 }} // 스크롤바 살짝 왼쪽으로 이동
          />
        </View>
      )}

      {/* 직접입력 버튼 */}
      <TouchableOpacity style={styles.manualBtn} onPress={() => setModalVisible(true)}>
        <Text style={styles.manualText}>직접 입력하기</Text>
      </TouchableOpacity>

      {/* 약관 체크 */}
      <View style={styles.checkContainer}>
        {/* 전체 동의 */}
        <TouchableOpacity style={styles.checkboxRow} onPress={toggleAll}>
          <Image
            source={require('../../assets/checkmark.png')}
            style={[styles.checkboxIcon, agreeAll && styles.checkboxChecked]}
          />
          <Text style={[styles.checkText, {fontWeight: '700',fontSize:18 }]}>전체 동의</Text>
        </TouchableOpacity>

        {/* 개별 항목 */}
        <TouchableOpacity style={styles.checkboxRow} onPress={() => setAgreeService(!agreeService)}>
          <Image
            source={require('../../assets/checkmark.png')}
            style={[styles.checkboxIcon, agreeService && styles.checkboxChecked]}
          />
          <Text style={styles.checkText}>서비스 이용약관 (필수)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.checkboxRow} onPress={() => setAgreePrivacy(!agreePrivacy)}>
          <Image
            source={require('../../assets/checkmark.png')}
            style={[styles.checkboxIcon, agreePrivacy && styles.checkboxChecked]}
          />
          <Text style={styles.checkText}>개인정보 처리방침 (필수)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.checkboxRow} onPress={() => setAgreeLocation(!agreeLocation)}>
          <Image
            source={require('../../assets/checkmark.png')}
            style={[styles.checkboxIcon, agreeLocation && styles.checkboxChecked]}
          />
          <Text style={styles.checkText}>위치기반 서비스 이용동의 (필수)</Text>
        </TouchableOpacity>
      </View>

      {/* 회원가입 완료 버튼 */}
      <TouchableOpacity
        style={[styles.completeBtn, isFormValid ? styles.completeActive : {}]}
        disabled={!isFormValid || signupLoading}
        onPress={handleComplete}
      >
        {signupLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.completeText}>회원가입 완료</Text>
        )}
      </TouchableOpacity>

      {/* 직접입력 모달 */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>※ 소속 등록</Text>
            <Text style={styles.modalDesc}>
              직접 등록하실 소속명을 입력해주세요.
            </Text>

            <TextInput
              style={styles.inputCode}
              placeholder="소속명 입력"
              placeholderTextColor="#cbd5e1"
              value={organization}
              onChangeText={setOrganization}
            />

            <TouchableOpacity style={styles.modalBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalBtnText}>등록하기</Text>
            </TouchableOpacity>
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
  progressBar: { flex: 1, height: 5, backgroundColor: '#e5e7eb', marginHorizontal: 0, borderRadius: 2 },
  active: { backgroundColor: '#078C5A' },

  welcome: { fontSize: 25, fontWeight: '600', color: '#111827', marginBottom: 15, textAlign: 'center' },
  subText: { color: '#6b7280', fontSize: 14, marginBottom: 70, fontWeight: 600, textAlign: 'center' },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 15,
    width: '100%',
  },
  searchIcon: { marginRight: 6 },
  input: { flex: 1, fontSize: 15,fontWeight:600, Height: 15, paddingVertical:3, color: '#111827' },

  suggestionBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginTop: 6,
    marginBottom: 20,
    maxHeight: 135, // 약 3항목 높이
  },
  suggestionItem: { paddingVertical: 10, paddingHorizontal: 12 },
  suggestionText: { fontSize: 14, color: '#111827' },

  manualBtn: { alignSelf: 'flex-end', marginTop: 5, marginBottom: 40 },
  manualText: { color: '#078C5A', fontSize: 15, textDecorationLine: 'underline', fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.1)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2, 
   },

  checkContainer: { width: '100%', gap: 18, marginBottom: 40 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center' },
  checkboxIcon: {
    width: 20,
    height: 20,
    tintColor: '#ced1d5ff',
    marginRight: 10,
  },
  checkboxChecked: {
    tintColor: '#096945ff', // 체크 시 초록색
  },
  checkText: { color: '#111827', fontSize: 14, fontWeight: '500' },

  completeBtn: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9ca3af',
  },
  completeActive: { backgroundColor: '#078C5A' },
  completeText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: { backgroundColor: '#fff', width: '80%', borderRadius: 16, padding: 28, alignItems: 'center' },
  modalIcon: { width: 60, height: 60, marginBottom: 10 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 25 },
  modalDesc: { color: '#6b7280', fontSize: 14, textAlign: 'center', marginBottom: 15 },
  inputCode: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 20,
  },
  modalBtn: {
    backgroundColor: '#078C5A',
    borderRadius: 8,
    width: '50%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
