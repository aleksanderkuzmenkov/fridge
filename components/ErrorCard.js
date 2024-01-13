// ErrorCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ErrorCard = ({ errorMessage }) => {
    return (
        <View style={styles.errorCard}>
            <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    errorCard: {
        backgroundColor: '#FF6347', // Coral color, you can change it to fit your design
        padding: 16,
        borderRadius: 8,
        margin: 16,
        alignItems: 'center',
    },
    errorText: {
        color: '#fff', // White color for text, you can change it to fit your design
        fontSize: 16,
    },
});

export default ErrorCard;
