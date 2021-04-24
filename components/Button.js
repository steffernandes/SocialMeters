import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from "react-native";

export default AppButton = ({ onPress, title }) => (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: "#78DBD2",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 12,
        width: 232
    },
    buttonText: {
        fontSize: 16,
        color: "#0D1B1E",
        alignSelf: "center",
        fontFamily: "Roboto-Medium"
    }
});