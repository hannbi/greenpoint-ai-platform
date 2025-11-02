import React, { useState } from 'react';
import { View, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function MarketScreen() {
  const [currentImage, setCurrentImage] = useState('market');

  const images = {
    market: 'https://s3.treebomb.org/it-da/market.png',
    market2: 'https://s3.treebomb.org/it-da/market2.png',
  };

  const imageKeys = Object.keys(images);

  const handleImagePress = () => {
    const currentIndex = imageKeys.indexOf(currentImage);
    const nextIndex = (currentIndex + 1) % imageKeys.length;
    setCurrentImage(imageKeys[nextIndex]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleImagePress} activeOpacity={0.9}>
        <Image 
          source={{ uri: images[currentImage] }} 
          style={styles.fullImage}
          resizeMode='cover'
        />
      </TouchableOpacity>
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
