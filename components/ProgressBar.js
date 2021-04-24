import React from 'react';
import { StyleSheet, View } from "react-native";

export default ProgressBar = ({ width }) => (
    <View style={styles.progressBar}>
        
        <View style={[styles.progress,{width: width + "%"} ]}></View>
    </View>
);

const styles = StyleSheet.create({
    progressBar: {
        backgroundColor: "#F3F3F3",
        borderRadius: 8,
        height: 16,
        width: "100%"
    },
    progress: {
        backgroundColor: "#00C6AE",
        borderRadius: 8,
        height: 16,
    }
});