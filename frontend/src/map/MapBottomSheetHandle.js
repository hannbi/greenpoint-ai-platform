// src/map/MapBottomSheetHandle.js

import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function MapBottomSheetHandle() {
    return (
        <View style={styles.container}>
            <View style={styles.handle} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#D1D5DB',
        borderRadius: 2,
    },
});