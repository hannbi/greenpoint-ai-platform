import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function RecognizeScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>재활용 품목 인식 화면</Text>
            <Image
                source={{ uri: 'https://i.ibb.co/VSwDyc7/recycle-scan-sample.jpg' }}
                style={styles.sampleImage}
            />
            <Text style={styles.desc}>카메라를 이용해 배출 품목을 인식할 수 있어요!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
    title: { fontSize: 20, fontWeight: '800', marginBottom: 20 },
    sampleImage: { width: 280, height: 280, borderRadius: 14 },
    desc: { marginTop: 15, fontSize: 14, color: '#555' },
});
