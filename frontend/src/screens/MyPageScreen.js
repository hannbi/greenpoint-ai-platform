import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function MyPageScreen() {
  return (
    <View style={styles.container}>
      <Image 
        source={ 'https://s3.treebomb.org/it-da/mypage.png'} 
        style={styles.fullImage}
        resizeMode='cover'
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#000',
  },
  fullImage: {
    width: width,
    height: height,
  },
});
