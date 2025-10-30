:: 프로젝트 루트에 이 파일을 두고 더블클릭하면 설치 시작
@echo off
echo === Green Point App 환경 설치 중... ===

REM 기본 React Navigation
npm install @react-navigation/native

REM Stack Navigator
npm install @react-navigation/native-stack

REM Bottom Tab Navigator (하단 탭 네비게이션)
npm install @react-navigation/bottom-tabs

REM React Navigation 필수 의존성
npm install react-native-screens react-native-safe-area-context

REM Expo 환경일 경우 (자동 버전 호환)
:: npx expo install react-native-screens react-native-safe-area-context

REM 추가적으로 자주 쓰는 유틸/아이콘/폰트 패키지
npm install react-native-vector-icons
npm install expo-font expo-asset

REM LInear Gradient
npm isntall expo-linear-gradient

REM Camera
npm install expo-camera
npm install expo-image-picker


echo === 설치 완료! ===
pause
