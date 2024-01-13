import axios from 'axios';
import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from "../context/userContext";
import { getUserData } from '../utils/StorageUtil';

const fetchUserFridge = async (userId) => {
    try {
        const response = await axios.get(`http://192.168.178.55:9191/users/${userId}/fridge`, {
            headers: {
                'Content-Type': 'application/json',
                // Добавьте здесь необходимые заголовки, например токен авторизации, если он нужен
            },
        });

        return response.data;
    } catch (error) {
        console.error('Ошибка при получении данных холодильника:', error);
    }
};

const Home = ({ navigation }) => {
    const [hasFridge, setHasFridge] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {

        const loadData = async () => {
            const data = await getUserData();
            if (data) {
                setUserData(data);
            }
        };

        loadData();

        const userId = userData?.id;
        fetchUserFridge(userId).then(fridge => {
            if (fridge) {
                console.log( "Fridge data isset");
                setHasFridge(true);
            } else {
                console.log("Fridge data not isset");
                setHasFridge(false);
            }
        }).catch(error => {
            // Обработка ошибок
        });
    }, []);

    const handleNewFridgePress = () => {
        console.log('Нажми что бы создать');
        console.log(userData);
    };

    const handleMyFridgePress = () => {
        console.log('Открыть мой холодильник');
        console.log(userData);
    };
    

    return (
        <View style={styles.container}>
            <View style={styles.upperContainer} />

            {hasFridge ? (
                <TouchableOpacity onPress={handleMyFridgePress}>
                    <View style={styles.card}>
                        <Text style={styles.cardText}>Manage your fridge</Text>
                    </View>
                </TouchableOpacity>
            ) : (
                    <TouchableOpacity onPress={handleNewFridgePress}>
                    <View style={styles.card}>
                        <Text style={styles.cardText}>Click to create a new fridge</Text>
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: "10%",
        alignItems: 'center',
    },
    upperContainer: {
        backgroundColor: 'lightgray',
        borderRadius: 10,
        width: '80%',
        aspectRatio: 4,
        marginBottom: 20,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: '80%',
        aspectRatio: 2,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },
    cardText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Home;
