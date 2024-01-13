import React, { useContext, useState, useCallback, useReducer, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { COLORS, SIZES, FONTS } from "../constants";
import Input from '../components/input';
import Button from '../components/Button';
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/formReducers";
import { UserContext } from '../context/userContext';

const isTestMode = true;

const initialState = {
    inputValues: {
        fullName: isTestMode ? 'John Doe' : '',
        email: isTestMode ? 'example@gmail.com' : '',
        password: '',
        passwordConfirm: ''
    },
    inputValidities: {
        fullName: false,
        email: false,
        password: false,
        passwordConfirm: false
    },
    formIsValid: false,
};

const AccountSettings = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formState, dispatchFormState] = useReducer(reducer, initialState);
    const { userData } = useContext(UserContext);


    // Effect to set initial state based on user data
    useEffect(() => {
        dispatchFormState({
            type: 'SET_DATA',
            payload: {
                fullName: userData?.fullName || '',
                email: userData?.email || '',
                password: '',
                passwordConfirm: ''
            }
        });
    }, [userData]);

    const inputChangedHandler = useCallback(
        (inputId, inputValue) => {
            const result = validateInput(inputId, inputValue);
            dispatchFormState({ inputId, validationResult: result, inputValue });
        },
        [dispatchFormState]
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <LinearGradient
                colors={['rgba(45,45,167,1)', 'transparent']}
                style={{ flex: 1 }}
            >
                <StatusBar hidden />
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Your Account Settings</Text>
                    <Text style={styles.subHeaderTitle}>
                        You can change information about yourself.
                    </Text>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.inputHeader}>Full Name</Text>
                    <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={formState.inputValues.fullName}
                        onInputChanged={inputChangedHandler}
                        errorText={formState.inputValidities.fullName}
                        placeholderTextColor={COLORS.black}
                    />
                    <Text style={styles.inputHeader}>Email</Text>
                    <Input
                        id="email"
                        placeholder="example@gmail.com"
                        value={formState.inputValues.email}
                        onInputChanged={inputChangedHandler}
                        errorText={formState.inputValidities.email}
                        placeholderTextColor={COLORS.black}
                        editable={false} // Make the email field not editable
                    />
                    <Text style={styles.inputHeader}>Password</Text>
                    <Input
                        onInputChanged={inputChangedHandler}
                        errorText={formState.inputValidities.password}
                        autoCapitalize="none"
                        id="password"
                        placeholder="*************"
                        placeholderTextColor={COLORS.black}
                        secureTextEntry={true}
                    />
                    <Text style={styles.inputHeader}>Re-Type Password</Text>
                    <Input
                        onInputChanged={inputChangedHandler}
                        errorText={formState.inputValidities.passwordConfirm}
                        autoCapitalize="none"
                        id="passwordConfirm"
                        placeholder="*************"
                        placeholderTextColor={COLORS.black}
                        secureTextEntry={true}
                    />
                    <Button
                        title="SAVE CHANGES"
                        isLoading={isLoading}
                        onPress={() => navigation.goBack()}
                    />
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

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
        ...FONTS.body5,
        marginVertical: 4
    }
});

export default AccountSettings;
