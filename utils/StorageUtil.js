import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveUserData = async (userData) => {
    try {
        const userDataJson = JSON.stringify(userData);
        await AsyncStorage.setItem('userData', userDataJson);
    } catch (error) {
        console.error('User data error:', error);
    }
};

export const getUserData = async () => {
    try {
        const userDataJson = await AsyncStorage.getItem('userData');
        console.log("userdata" + userDataJson);

        if (userDataJson !== null) {
            return JSON.parse(userDataJson);
        }
        return null;
    } catch (error) {
        console.error('User data error:', error);
        return null;
    }
};
