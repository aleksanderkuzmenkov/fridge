import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useCallback, useReducer, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { StatusBar } from 'expo-status-bar'
import { COLORS, SIZES, FONTS } from "../constants"
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Input from '../components/input'
import Button from '../components/Button'
import { isLoading } from 'expo-font'
import { validateInput } from "../utils/actions/formActions"
import { reducer } from "../utils/reducers/formReducers"
import axios from 'axios';

const isTestMode = false;

const initialState = {
    inputValues: {
        fullName: '',
        email: '',
        password: '',
        passwordConfirm: ''
    },
    inputValidities: {
        fullName: false,
        email: false,
        password: false,
        passwordConfirm: false
    },
    formIsValid: true,
}

const Register = ({ navigation }) => {
    const [error, setError] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [formState, dispatchFormState] = useReducer(reducer, initialState)

    const inputChangedHandler = useCallback(
        (inputId, inputValue)=>{
            const result = validateInput(inputId, inputValue)
            dispatchFormState({ inputId, validationResult: result, inputValue })
        }, [dispatchFormState])

    const submitHandler = async () => {

        // console.log(formState.inputValues.email);
        // console.log(formState.inputValues.password);

        if (!formState.formIsValid) {
            console.log('Form is not valid');
            return;
        }

        const formData = {
            name: formState.inputValues.fullName,
            email: formState.inputValues.email,
            password: formState.inputValues.password,
            role: "USER"
            // passwordConfirm: formState.inputValues.passwordConfirm, // Это может быть не нужно, если сервер не требует подтверждения пароля
        };

        try {
            setIsLoading(true);
            const response = await axios.post('http://192.168.178.55:9191/register', formData);
            console.log('User registered successfully:', response.data);
            navigation.navigate('Login');
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            // Здесь можно установить ошибку, чтобы отобразить ее пользователю
            setError('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <LinearGradient
                // Background Linear Gradient
                colors={['rgba(45,45,167,1)', 'transparent']}
                style={{ flex: 1}}
            >
                <StatusBar hidden/>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Register</Text>
                    <Text style={styles.subHeaderTitle}>Please register to create a new account.</Text>
                </View>
                <View style={styles.footer}>
                    {/* <KeyboardAwareScrollView> */}
                    <Text style={styles.inputHeader}>Full Name</Text>
                    <Input
                        id="fullName"
                        placeholder="John Doe"
                        onInputChanged={inputChangedHandler}
                        errorText={formState.inputValidities["fullName"]}
                        placeholderTextColor={COLORS.black}
                    />
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
                    <Text style={styles.inputHeader}>Re-Type Password</Text>
                    <Input
                        onInputChanged={inputChangedHandler}
                        errorText={formState.inputValidities['passwordConfirm']}
                        autoCapitalize="none"
                        id="passwordConfirm"
                        placeholder="*************"
                        placeholderTextColor={COLORS.black}
                        secureTextEntry={true}
                    />
                    {/* </KeyboardAwareScrollView> */}
                    
                    <Button
                        title="SIGN UP"
                        isLoading={isLoading}
                        onPress={submitHandler}
                    />
                    <View>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Login")}
                        >
                            <Text style={{ ...FONTS.body4, color: COLORS.primary, alignSelf: 'center' }}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
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
    inputHeader: {
        textTransform: 'uppercase',
        ...FONTS.body4,
        marginVertical: 4
    }
})

export default Register