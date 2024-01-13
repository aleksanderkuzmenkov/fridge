import React, { useContext, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { UserContext } from "../context/userContext";
import { COLORS, FONTS, icons } from "../constants";
import AccountSettings from "./AccountSettings";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserData } from '../utils/StorageUtil';

const SideMenu = (props) => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {

        const loadData = async () => {
            const data = await getUserData();
            if (data) {
                setUserData(data);
            }
        };

        loadData();
    }, []);

    const handleLogout = async () => {
        try {
            // Логика удаления данных из контекста
            setUserData(null);

            // Логика удаления данных из AsyncStorage
            await AsyncStorage.removeItem('userData');

            // Навигация на экран логина
            props.navigation.navigate('Login');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const handleNavigateToAccountSettings = () => {
        // Навигация на экран настроек аккаунта
        props.navigation.navigate('AccountSettings');
    };

    return (
        <DrawerContentScrollView {...props}>
            {/* Заголовок с аватаркой и именем пользователя */}
            <View style={styles.header}>
                <Image source={icons.avatar_cactus} style={styles.avatar} />
                <View>
                    <Text style={styles.userName}>{userData?.name}</Text>
                    <Text style={styles.userEmail}>{userData?.email}</Text>
                </View>
            </View>

            {/* Содержимое основного меню */}
            <DrawerItemList {...props} />
            <TouchableOpacity
                style={styles.menuItem}
                onPress={handleLogout}
            >
                <Text style={styles.menuItemText}>Logout</Text>
            </TouchableOpacity>
        </DrawerContentScrollView>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 16,
    },
    userName: {
        ...FONTS.h3,
        color: COLORS.black,
    },
    userEmail: {
        ...FONTS.body5,
        color: COLORS.black,
    },
    menuItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray,
    },
    menuItemText: {
        ...FONTS.body3,
        color: COLORS.black,
    },
});

export default SideMenu;
