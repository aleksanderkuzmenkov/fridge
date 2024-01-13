// Импорты React и React Native
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { getUserData } from '../utils/StorageUtil';

const ConfirmEmail = ({ navigation }) => {
    const [tokenExpired, setTokenExpired] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            const data = await getUserData();
            if (data) {
                setUserData(data);
            }
        };

        loadData();
        
        console.log(userData);
        axios
            .get(`http://192.168.178.55:9191/verification-token/user/${userData.id}`)
            .then((response) => {
                // Проверка срока действия токена.
                const tokenExpirationDate = new Date(response.data.expirationTime);
                const currentDate = new Date();

                if (tokenExpirationDate < currentDate) {
                    setTokenExpired(true);
                }
            })
            .catch((error) => {
                console.error('Ошибка при запросе на сервер:', error);
            });
    }, []);

    const onConfirmPressed = () => {
        if (tokenExpired) {
            // Обработка случая, когда срок действия токена истек
            console.log('Срок действия токена истек');
        } else {
            // Продолжение выполнения действия, например, переход на страницу входа
            navigation.navigate('Login');
        }
    };

    const onGetNewEmailConfirmationPressed = () => {
        
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Please confirm your email</Text>
            <TouchableOpacity style={styles.button} onPress={onConfirmPressed}>
                <Text style={styles.buttonText}>I have already confirmed</Text>
            </TouchableOpacity>
            {tokenExpired && (
                <TouchableOpacity style={styles.text} onPress={onGetNewEmailConfirmationPressed}>
                    <Text style={styles.textOnTheBottom}>Click to get a new confirmation E-Mail</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
    },
    textOnTheBottom: {
        padding: '4%'
    }
});

export default ConfirmEmail;
