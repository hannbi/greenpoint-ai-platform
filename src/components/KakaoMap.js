// KakaoMap.js
import React from 'react';
import { View, Platform, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const KAKAO_JS_KEY = '9944a2757aa5f92e931fc980566f4365';

export default function KakaoMap({ onMapClick }) {
  // Web에서는 iframe 사용
  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <iframe
          src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}`}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Kakao Map"
        />
      </View>
    );
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
        <style>
          html, body, #map { 
            width: 100%; 
            height: 100%; 
            margin: 0; 
            padding: 0; 
            overflow: hidden;
          }
        </style>
        <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&libraries=services"></script>
      </head>
      <body>
        <div id="map"></div>
        <script>
          try {
            const container = document.getElementById('map');
            const options = {
              center: new kakao.maps.LatLng(37.29577279001729, 126.84130849261516),
              level: 3
            };
            const map = new kakao.maps.Map(container, options);

            // 지도 클릭 → RN으로 좌표 보내기
            kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
              const latlng = mouseEvent.latLng;
              const data = {
                type: 'MAP_CLICK',
                lat: latlng.getLat(),
                lng: latlng.getLng()
              };
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify(data));
              }
            });

            // 지도 로드 완료 알림
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'MAP_LOADED' }));
            }
          } catch (error) {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ 
                type: 'ERROR', 
                message: error.toString() 
              }));
            }
          }
        </script>
      </body>
    </html>
  `;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={{ flex: 1, backgroundColor: 'transparent' }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        mixedContentMode="always"
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            
            if (data.type === 'MAP_LOADED') {
              console.log('✅ 카카오맵 로드 완료!');
            } else if (data.type === 'ERROR') {
              console.error('❌ 카카오맵 에러:', data.message);
            } else if (data.type === 'MAP_CLICK' && onMapClick) {
              onMapClick(data);
            }
          } catch (e) {
            console.warn('WebView 메시지 파싱 실패:', e);
          }
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('❌ WebView 에러:', nativeEvent);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('❌ WebView HTTP 에러:', nativeEvent.statusCode);
        }}
        onLoadStart={() => console.log('🔄 WebView 로딩 시작...')}
        onLoadEnd={() => console.log('✅ WebView 로딩 완료!')}
      />
    </View>
  );
}
