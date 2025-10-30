// KakaoMap.js
import React, { useRef } from 'react';
import { View, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { binApi } from '../services/api/binApi';

const KAKAO_JS_KEY = '9944a2757aa5f92e931fc980566f4365';

export default function KakaoMap({ onMapClick, selectedFilter = '전체' }) {
  const webViewRef = useRef(null);

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
          let map;
          let markers = [];

          // SVG 문자열 정의
          const svgStrings = {
            기본_normal: \`<svg width="34" height="38" viewBox="0 0 34 38" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#filter0_d_188_963)"><path d="M4 2C4 0.89543 4.89543 0 6 0H28C29.1046 0 30 0.895431 30 2V24.9231C30 26.0276 29.1046 26.9231 28 26.9231H20.1749C19.4679 26.9231 18.8571 27.4176 18.7101 28.1092C18.3739 29.6908 16.1167 29.6908 15.7805 28.1092C15.6334 27.4176 15.0227 26.9231 14.3156 26.9231H6C4.89543 26.9231 4 26.0276 4 24.9231V2Z" fill="white"/><path d="M6 0.5H28C28.8284 0.5 29.5 1.17157 29.5 2V24.9229C29.5 25.7513 28.8284 26.4229 28 26.4229H20.1748C19.2318 26.4229 18.4169 27.0826 18.2207 28.0049C17.9967 29.0584 16.4935 29.0584 16.2695 28.0049C16.0733 27.0825 15.2584 26.4229 14.3154 26.4229H6C5.17157 26.4229 4.5 25.7513 4.5 24.9229V2C4.5 1.17157 5.17157 0.5 6 0.5Z" stroke="black" stroke-opacity="0.25"/></g><path d="M24.1875 9.4375L23.875 13.1875M14.8125 9.4375L15.1904 15.7105C15.2872 17.317 15.3355 18.1203 15.7367 18.698C15.935 18.9836 16.1905 19.2246 16.4869 19.4058C16.8508 19.6282 17.2896 19.7156 17.9375 19.75" stroke="#079C63" stroke-width="1.5" stroke-linecap="round"/><path d="M18.875 15.6875L19.5852 16.6036C19.9425 15.2699 21.3134 14.4785 22.647 14.8358C23.3297 15.0187 23.8703 15.4672 24.1875 16.0403M25.125 18.8125L24.4148 17.8977C24.0574 19.2313 22.6866 20.0228 21.3529 19.6654C20.6861 19.4868 20.1548 19.0547 19.8349 18.5006" stroke="#079C63" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.875 9.4375H25.125M22.0348 9.4375L21.6082 8.55733C21.3247 7.97266 21.183 7.68033 20.9386 7.498C20.8843 7.45756 20.8269 7.42159 20.7669 7.39044C20.4962 7.25 20.1713 7.25 19.5216 7.25C18.8555 7.25 18.5225 7.25 18.2473 7.39632C18.1863 7.42875 18.1281 7.46618 18.0733 7.50823C17.826 7.69794 17.6879 8.00097 17.4116 8.60704L17.0331 9.4375" stroke="#079C63" stroke-width="1.5" stroke-linecap="round"/><defs><filter id="filter0_d_188_963" x="0" y="0" width="34" height="37.2954" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="4"/><feGaussianBlur stdDeviation="2"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_188_963"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_188_963" result="shape"/></filter></defs></svg>\`,
            
            기본_full: \`<svg width="34" height="38" viewBox="0 0 34 38" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#filter0_d_188_1068)"><path d="M4 2C4 0.89543 4.89543 0 6 0H28C29.1046 0 30 0.895431 30 2V24.9231C30 26.0276 29.1046 26.9231 28 26.9231H20.1749C19.4679 26.9231 18.8571 27.4176 18.7101 28.1092C18.3739 29.6908 16.1167 29.6908 15.7805 28.1092C15.6334 27.4176 15.0227 26.9231 14.3156 26.9231H6C4.89543 26.9231 4 26.0276 4 24.9231V2Z" fill="white"/><path d="M6 0.5H28C28.8284 0.5 29.5 1.17157 29.5 2V24.9229C29.5 25.7513 28.8284 26.4229 28 26.4229H20.1748C19.2318 26.4229 18.4169 27.0826 18.2207 28.0049C17.9967 29.0584 16.4935 29.0584 16.2695 28.0049C16.0733 27.0825 15.2584 26.4229 14.3154 26.4229H6C5.17157 26.4229 4.5 25.7513 4.5 24.9229V2C4.5 1.17157 5.17157 0.5 6 0.5Z" stroke="black" stroke-opacity="0.25"/></g><path d="M24.1875 10.4375L23.875 14.1875M14.8125 10.4375L15.1904 16.7105C15.2872 18.317 15.3355 19.1203 15.7367 19.698C15.935 19.9836 16.1905 20.2246 16.4869 20.4058C16.8508 20.6282 17.2896 20.7156 17.9375 20.75" stroke="#CF2323" stroke-width="1.5" stroke-linecap="round"/><path d="M18.875 16.6875L19.5852 17.6036C19.9425 16.2699 21.3134 15.4785 22.647 15.8358C23.3297 16.0187 23.8703 16.4672 24.1875 17.0403M25.125 19.8125L24.4148 18.8977C24.0574 20.2313 22.6866 21.0228 21.3529 20.6654C20.6861 20.4868 20.1548 20.0547 19.8349 19.5006" stroke="#CF2323" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.875 10.4375H25.125M22.0348 10.4375L21.6082 9.55733C21.3247 8.97266 21.183 8.68033 20.9386 8.498C20.8843 8.45756 20.8269 8.42159 20.7669 8.39044C20.4962 8.25 20.1713 8.25 19.5216 8.25C18.8555 8.25 18.5225 8.25 18.2473 8.39632C18.1863 8.42875 18.1281 8.46618 18.0733 8.50823C17.826 8.69794 17.6879 9.00097 17.4116 9.60704L17.0331 10.4375" stroke="#CF2323" stroke-width="1.5" stroke-linecap="round"/><defs><filter id="filter0_d_188_1068" x="0" y="0" width="34" height="37.2954" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="4"/><feGaussianBlur stdDeviation="2"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_188_1068"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_188_1068" result="shape"/></filter></defs></svg>\`,
            
            기본_maintenance: \`<svg width="34" height="38" viewBox="0 0 34 38" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#filter0_d_188_963)"><path d="M4 2C4 0.89543 4.89543 0 6 0H28C29.1046 0 30 0.895431 30 2V24.9231C30 26.0276 29.1046 26.9231 28 26.9231H20.1749C19.4679 26.9231 18.8571 27.4176 18.7101 28.1092C18.3739 29.6908 16.1167 29.6908 15.7805 28.1092C15.6334 27.4176 15.0227 26.9231 14.3156 26.9231H6C4.89543 26.9231 4 26.0276 4 24.9231V2Z" fill="white"/><path d="M6 0.5H28C28.8284 0.5 29.5 1.17157 29.5 2V24.9229C29.5 25.7513 28.8284 26.4229 28 26.4229H20.1748C19.2318 26.4229 18.4169 27.0826 18.2207 28.0049C17.9967 29.0584 16.4935 29.0584 16.2695 28.0049C16.0733 27.0825 15.2584 26.4229 14.3154 26.4229H6C5.17157 26.4229 4.5 25.7513 4.5 24.9229V2C4.5 1.17157 5.17157 0.5 6 0.5Z" stroke="black" stroke-opacity="0.25"/></g><path d="M24.1875 9.4375L23.875 13.1875M14.8125 9.4375L15.1904 15.7105C15.2872 17.317 15.3355 18.1203 15.7367 18.698C15.935 18.9836 16.1905 19.2246 16.4869 19.4058C16.8508 19.6282 17.2896 19.7156 17.9375 19.75" stroke="#FAB005" stroke-width="1.5" stroke-linecap="round"/><path d="M18.875 15.6875L19.5852 16.6036C19.9425 15.2699 21.3134 14.4785 22.647 14.8358C23.3297 15.0187 23.8703 15.4672 24.1875 16.0403M25.125 18.8125L24.4148 17.8977C24.0574 19.2313 22.6866 20.0228 21.3529 19.6654C20.6861 19.4868 20.1548 19.0547 19.8349 18.5006" stroke="#FAB005" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.875 9.4375H25.125M22.0348 9.4375L21.6082 8.55733C21.3247 7.97266 21.183 7.68033 20.9386 7.498C20.8843 7.45756 20.8269 7.42159 20.7669 7.39044C20.4962 7.25 20.1713 7.25 19.5216 7.25C18.8555 7.25 18.5225 7.25 18.2473 7.39632C18.1863 7.42875 18.1281 7.46618 18.0733 7.50823C17.826 7.69794 17.6879 8.00097 17.4116 8.60704L17.0331 9.4375" stroke="#FAB005" stroke-width="1.5" stroke-linecap="round"/><defs><filter id="filter0_d_188_963" x="0" y="0" width="34" height="37.2954" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="4"/><feGaussianBlur stdDeviation="2"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_188_963"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_188_963" result="shape"/></filter></defs></svg>\`,
            
            폐의약품: \`<svg width="34" height="38" viewBox="0 0 34 38" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#filter0_d_406_1100)"><path d="M4 2C4 0.89543 4.89543 0 6 0H28C29.1046 0 30 0.895431 30 2V24.9231C30 26.0276 29.1046 26.9231 28 26.9231H20.1749C19.4679 26.9231 18.8571 27.4176 18.7101 28.1092C18.3739 29.6908 16.1167 29.6908 15.7805 28.1092C15.6334 27.4176 15.0227 26.9231 14.3156 26.9231H6C4.89543 26.9231 4 26.0276 4 24.9231V2Z" fill="white"/><path d="M6 0.5H28C28.8284 0.5 29.5 1.17157 29.5 2V24.9229C29.5 25.7513 28.8284 26.4229 28 26.4229H20.1748C19.2318 26.4229 18.4169 27.0826 18.2207 28.0049C17.9967 29.0584 16.4935 29.0584 16.2695 28.0049C16.0733 27.0825 15.2584 26.4229 14.3154 26.4229H6C5.17157 26.4229 4.5 25.7513 4.5 24.9229V2C4.5 1.17157 5.17157 0.5 6 0.5Z" stroke="black" stroke-opacity="0.25"/></g><path d="M15.6678 6.25H19.3322C19.908 6.25 20.1959 6.25 20.3748 6.43306C20.7084 6.77442 20.7084 8.22558 20.3748 8.56694C20.1959 8.75 19.908 8.75 19.3322 8.75H15.6678C15.092 8.75 14.8041 8.75 14.6252 8.56694C14.2916 8.22558 14.2916 6.77442 14.6252 6.43306C14.8041 6.25 15.092 6.25 15.6678 6.25Z" stroke="#E71317" stroke-width="1.5"/><path d="M15 8.75C15.1031 8.95616 15.1546 9.05926 15.1913 9.15981C15.3826 9.68447 15.33 10.2671 15.048 10.749C14.9939 10.8414 14.9248 10.9336 14.7865 11.118L14.5343 11.4542C14.253 11.8293 14.1124 12.0168 14.0105 12.2223C13.9075 12.4298 13.8339 12.6507 13.7917 12.8785C13.75 13.104 13.75 13.3384 13.75 13.8072V15C13.75 16.7678 13.75 17.6517 14.2992 18.2008C14.8483 18.75 15.7322 18.75 17.5 18.75C19.2678 18.75 20.1517 18.75 20.7008 18.2008C21.25 17.6517 21.25 16.7678 21.25 15V13.8072C21.25 13.3384 21.25 13.104 21.2083 12.8785C21.1661 12.6507 21.0925 12.4298 20.9895 12.2223C20.8876 12.0168 20.747 11.8293 20.4657 11.4542L20.2135 11.118C20.0752 10.9336 20.0061 10.8414 19.952 10.749C19.67 10.2671 19.6174 9.68447 19.8087 9.15981C19.8454 9.05926 19.8969 8.95617 20 8.75" stroke="#E71317" stroke-width="1.5"/><path d="M17.5 13.125V16.25M15.9375 14.6875L19.0625 14.6875" stroke="#E71317" stroke-width="1.5" stroke-linecap="round"/><defs><filter id="filter0_d_406_1100" x="0" y="0" width="34" height="37.2954" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="4"/><feGaussianBlur stdDeviation="2"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_406_1100"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_406_1100" result="shape"/></filter></defs></svg>\`,
            
            폐배터리: \`<svg width="34" height="38" viewBox="0 0 34 38" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#filter0_d_188_1040)"><path d="M4 2C4 0.89543 4.89543 0 6 0H28C29.1046 0 30 0.895431 30 2V24.9231C30 26.0276 29.1046 26.9231 28 26.9231H20.1749C19.4679 26.9231 18.8571 27.4176 18.7101 28.1092C18.3739 29.6908 16.1167 29.6908 15.7805 28.1092C15.6334 27.4176 15.0227 26.9231 14.3156 26.9231H6C4.89543 26.9231 4 26.0276 4 24.9231V2Z" fill="white"/><path d="M6 0.5H28C28.8284 0.5 29.5 1.17157 29.5 2V24.9229C29.5 25.7513 28.8284 26.4229 28 26.4229H20.1748C19.2318 26.4229 18.4169 27.0826 18.2207 28.0049C17.9967 29.0584 16.4935 29.0584 16.2695 28.0049C16.0733 27.0825 15.2584 26.4229 14.3154 26.4229H6C5.17157 26.4229 4.5 25.7513 4.5 24.9229V2C4.5 1.17157 5.17157 0.5 6 0.5Z" stroke="black" stroke-opacity="0.25"/></g><path d="M11.25 12.5C11.25 10.7322 11.25 9.84835 11.7992 9.29917C12.3483 8.75 13.2322 8.75 15 8.75H18.125C19.8928 8.75 20.7767 8.75 21.3258 9.29917C21.875 9.84835 21.875 10.7322 21.875 12.5C21.875 14.2678 21.875 15.1517 21.3258 15.7008C20.7767 16.25 19.8928 16.25 18.125 16.25H15C13.2322 16.25 12.3483 16.25 11.7992 15.7008C11.25 15.1517 11.25 14.2678 11.25 12.5Z" stroke="#ED7700" stroke-width="1.5" stroke-linecap="round"/><path d="M16.7676 10.625L15.6786 11.9843C15.5619 12.1299 15.6455 12.3395 15.8358 12.3783L16.9767 12.6108C17.1796 12.6521 17.257 12.8842 17.1151 13.0258L15.7638 14.375" stroke="#ED7700" stroke-linecap="round" stroke-linejoin="round"/><path d="M21.875 10.9375L22.517 11.0445C22.9428 11.1155 23.1557 11.151 23.3172 11.2542C23.4761 11.3557 23.6007 11.5028 23.6748 11.6762C23.75 11.8525 23.75 12.0683 23.75 12.5C23.75 12.9317 23.75 13.1475 23.6748 13.3238C23.6007 13.4972 23.4761 13.6443 23.3172 13.7458C23.1557 13.849 22.9428 13.8845 22.517 13.9555L21.875 14.0625" stroke="#ED7700" stroke-width="1.5" stroke-linecap="round"/><defs><filter id="filter0_d_188_1040" x="0" y="0" width="34" height="37.2954" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="4"/><feGaussianBlur stdDeviation="2"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_188_1040"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_188_1040" result="shape"/></filter></defs></svg>\`
          };

          // SVG를 base64로 변환하는 함수
          function svgToBase64(svgString) {
            return btoa(unescape(encodeURIComponent(svgString)));
          }

          // 마커 이미지 생성 함수
          function createMarkerImage(svgKey) {
            const svgBase64 = svgToBase64(svgStrings[svgKey]);
            const imageSrc = 'data:image/svg+xml;base64,' + svgBase64;
            const imageSize = new kakao.maps.Size(34, 38);
            const imageOption = { offset: new kakao.maps.Point(17, 38) };
            return new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
          }

          try {
            const container = document.getElementById('map');
            const options = {
              center: new kakao.maps.LatLng(37.29577279001729, 126.84130849261516),
              level: 3
            };
            map = new kakao.maps.Map(container, options);

            // 마커 표시 함수
            window.displayMarkers = function(bins) {
              // 기존 마커 제거
              markers.forEach(marker => marker.setMap(null));
              markers = [];

              bins.forEach(bin => {
                // 마커 이미지 키 결정
                let imageKey;
                if (bin.type === '기본') {
                  // 기본 배출함: status에 따라 구분 (normal, full, maintenance)
                  imageKey = '기본_' + bin.status;
                } else if (bin.type === '폐의약품') {
                  imageKey = '폐의약품';
                } else if (bin.type === '폐배터리') {
                  imageKey = '폐배터리';
                }

                const markerImage = createMarkerImage(imageKey);

                const markerPosition = new kakao.maps.LatLng(bin.latitude, bin.longitude);
                const marker = new kakao.maps.Marker({
                  position: markerPosition,
                  image: markerImage,
                  title: bin.name
                });

                marker.setMap(map);
                markers.push(marker);

                // 마커 클릭 이벤트
                kakao.maps.event.addListener(marker, 'click', function() {
                  if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'MARKER_CLICK',
                      data: bin
                    }));
                  }
                });
              });
            };

            // 지도 영역 가져오기 함수
            window.getMapBounds = function() {
              const bounds = map.getBounds();
              const sw = bounds.getSouthWest();
              const ne = bounds.getNorthEast();
              
              return {
                minX: sw.getLng(),
                minY: sw.getLat(),
                maxX: ne.getLng(),
                maxY: ne.getLat()
              };
            };

            // 지도 이동 완료 이벤트
            kakao.maps.event.addListener(map, 'idle', function() {
              const bounds = window.getMapBounds();
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'MAP_BOUNDS_CHANGED',
                  bounds: bounds
                }));
              }
            });

            // 지도 클릭 이벤트
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
        ref={webViewRef}
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
        onMessage={async (event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            
            if (data.type === 'MAP_LOADED') {
              console.log('✅ 카카오맵 로드 완료!');
            } else if (data.type === 'ERROR') {
              console.error('❌ 카카오맵 에러:', data.message);
            } else if (data.type === 'MAP_BOUNDS_CHANGED') {
              // 지도 영역이 변경되면 배출함 데이터 요청
              const { minX, minY, maxX, maxY } = data.bounds;
              try {
                const bins = await binApi.getBins(minX, minY, maxX, maxY);
                
                // 필터링 적용
                let filteredBins = bins;
                if (selectedFilter !== '전체') {
                  filteredBins = bins.filter(bin => {
                    if (selectedFilter === '배출함') return bin.type === '기본';
                    if (selectedFilter === '폐의약품') return bin.type === '폐의약품';
                    if (selectedFilter === '폐건전지') return bin.type === '폐배터리';
                    return true;
                  });
                }

                // 웹뷰에 마커 표시 요청
                webViewRef.current?.injectJavaScript(`
                  window.displayMarkers(${JSON.stringify(filteredBins)});
                  true;
                `);
              } catch (error) {
                console.error('배출함 데이터 로드 실패:', error);
              }
            } else if (data.type === 'MARKER_CLICK') {
              console.log('마커 클릭:', data.data);
              // 마커 클릭 시 추가 동작 (예: 상세 정보 모달)
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
