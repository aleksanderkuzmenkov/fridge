import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useCallback, useReducer, useState, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { StatusBar } from 'expo-status-bar'
import { COLORS, SIZES, FONTS, icons } from "../constants"
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Input from '../components/input'
import Button from '../components/Button'
import { isLoading } from 'expo-font'
import { validateInput } from "../utils/actions/formActions"
import { reducer } from "../utils/reducers/formReducers"
import Checkbox from 'expo-checkbox'
import SocialButton from '../components/SocialButtons'
import axios from 'axios';
import { UserContext } from '../context/userContext'
import ErrorCard from '../components/ErrorCard';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { saveUserData, getUserData } from '../utils/StorageUtil'


const isTestMode = false;

const initialState = {
    inputValues: {
        email: isTestMode ? 'example@gmail.com' : '',
        password: isTestMode ? '**********' : '',
    },
    inputValidities: {
        email: false,
        password: false,
    },
    formIsValid: false,
}


const Login = ({ navigation }) => {
    const [error, setError] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [formState, dispatchFormState] = useReducer(reducer, initialState)
    const [isChecked, setChecked] = useState(false)
    const { userData, setUserData } = useContext(UserContext);
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    
    const inputChangedHandler = useCallback(
        (inputId, inputValue) => {
            const result = validateInput(inputId, inputValue)
            dispatchFormState({ inputId, validationResult: result, inputValue })
        }, [dispatchFormState])

    const submitHandler = async () => {
        if (!formState.formIsValid) {
            return;
        }
        const formData = {
            email: formState.inputValues.email,
            password: formState.inputValues.password
        };

        try {
            setIsLoading(true);
            const response = await axios.post('http://192.168.178.55:9191/users/get', formData);
            if (response.status === 200) {
                console.log('Form submitted successfully');
                const responseData = response.data;

                await saveUserData(responseData);

                setEmailError(null);

                console.log(responseData["enabled"]);

                if (responseData["enabled"]){
                    navigation.navigate('Home');
                }else{
                    navigation.navigate('ConfirmEmail');
                }
                
            } 
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    setEmailError('User not found');
                }else{
                    setEmailError(null);
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <LinearGradient
                // Background Linear Gradient
                colors={['rgba(45,45,167,1)', 'transparent']}
                style={{ flex: 1 }}
            >
                <StatusBar hidden />
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Sign In</Text>
                    <Text style={styles.subHeaderTitle}>Please sign in to your account.</Text>
                </View>
                <View style={styles.footer}>
                    {emailError && <ErrorCard errorMessage={emailError} />}
                    {/* <KeyboardAwareScrollView> */}
                    <Text style={styles.inputHeader}>Email</Text>
                    <Input
                        id="email"
                        placeholder="example@gmail.com"
                        onInputChanged={inputChangedHandler}
                        errorText={formState.inputValidities['email']}
                        placeholderTextColor={COLORS.black}
                        keyboardType="email-address"
                    />
                    <Text style={styles.inputHeader}>Password</Text>
                    <Input
                        onInputChanged={inputChangedHandler}
                        errorText={formState.inputValidities['password']}
                        autoCapitalize="none"
                        id="password"
                        placeholder="*************"
                        placeholderTextColor={COLORS.black}
                        secureTextEntry={true}
                    />
                    <View style={styles.checkBoxContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Checkbox
                                style={styles.checkbox}
                                value={isChecked}
                                color={isChecked ? COLORS.primary : COLORS.black}
                                onValueChange={setChecked}
                            />
                            <Text style={{ ...FONTS.body4 }}>Remenber me</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Verification")}
                        >
                            <Text style={{ ...FONTS.body4, color: COLORS.primary }}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Register")}
                        >
                            <Text style={{ ...FONTS.body4, color: COLORS.primary, alignSelf: 'flex-end' }}>Create new account</Text>
                        </TouchableOpacity>
                    </View>
                    <Button
                        title="SIGN IN"
                        isLoading={isLoading}
                        onPress={submitHandler}
                    />

                    <View style={styles.lineContainer}>
                        <View style={styles.line} />
                        <Text style={{ ...FONTS.body4, color: COLORS.black, textAlign: 'center' }}> Or </Text>
                        <View style={styles.line} />
                    </View>

                    <View style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        marginVertical: SIZES.padding2
                    }}>
                        <SocialButton
                            onPress={()=>console.log("TODO auth")}
                            icon={icons.google}
                        />
                        <SocialButton
                            onPress={() => console.log("TODO auth")}
                            icon={icons.facebook}
                        />
                        <SocialButton
                            onPress={() => console.log("TODO auth")}
                            icon={icons.twitter}
                        />
                    </View>
                    {/* </KeyboardAwareScrollView> */}
                </View>
            </LinearGradient>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    // Пример изменений в стилях
    Input: {
        // ... Ваши текущие стили
        marginBottom: 12, // Добавленный отступ снизу
    },
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 4
    },
    headerTitle: {
        ...FONTS.h2,
        color: COLORS.white
    },
    subHeaderTitle: {
        ...FONTS.body4,
        color: COLORS.white,
        marginVertical: SIZES.padding,
        textAlign: 'center'
    },
    footer: {
        flex: 3,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 22,
        paddingVertical: 30
    },
    // Пример изменений в стилях
    inputHeader: {
        textTransform: 'uppercase',
        ...FONTS.body4,
        marginVertical: 8,
        textAlign: 'left', // Выравнивание влево
    },

    // Пример изменений в стилях
    checkBoxContainer: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 18,
    },
    // Добавлены отступы для кнопок
    lineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },

    line: {
        flex: 1,
        height: 1,
        backgroundColor: 'gray',
    },
})

export default Login