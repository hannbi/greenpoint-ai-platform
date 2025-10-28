import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MarketScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>포인트 마켓 화면 준비중 🛍️</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, fontWeight: '600' },
});
