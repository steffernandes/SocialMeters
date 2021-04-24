import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Image, SafeAreaView, Text, StatusBar, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import currentUserData from "../utils/userData"
import AppButton from '../components/Button'
import Title from '../components/Title'
import AsyncStorage from '@react-native-async-storage/async-storage';



const RecoverPassword = ({ route, navigation }) => {
    const [errorsList, setErrorsList] = React.useState([]);
    const [newPassword, onNewPasswordChange] = React.useState('');
    const [showPassword, setShowPassword] = useState(true)
    const [PasswordIsFocused, setPasswordIsFocused] = useState(false)

    //const [userData, setUserData] = React.useState();

    let { email } = route.params;
    let updateErrors = [...errorsList];
    
    const resetPassword = () => {
        updatePassword(`https://covidapptf.herokuapp.com/update/password`, {
            email: email,
            password: newPassword
        })
    }

    const updatePassword = (url, data) => {
        fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "same-origin"
        }).then(response =>
            response.json()
        ).then(data => {
            if (data) {
                /* Verificar se existem erros */
                if (!data.success) {
                    // Limpar a array de erros 
                    if (updateErrors.length > 0) {
                        updateErrors.length = 0;
                    }
                    // Adicionar os erros à array  
                    for (let i = 0; i < data.errors.length; i++) {
                        updateErrors.push(data.errors[i].msg);
                    }
                    // Alimentar a lista de erros com a array
                    setErrorsList(updateErrors);
                } else {
                    alert("Password alterada")
                    navigation.replace("Login")
                }
            }
        })
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={{ flex: 1 }}>

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView style={styles.container}>
                    <View style={{ paddingBottom: "24%" }}>

                        <SafeAreaView>
                            <StatusBar backgroundColor="#F9F9F9" barStyle="dark-content" />
                            <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                                <Image
                                    style={{
                                        height: 40,
                                        width: 40,
                                        marginVertical: 24
                                    }}
                                    source={require('../assets/img/go-back.png')}
                                />
                            </TouchableWithoutFeedback>
                            <Title>Alterar password</Title>

                            {
                                errorsList.length > 0
                                    ? <View style={styles.errorsContainer}>
                                        {errorsList.map((error, index) =>
                                            <Text key={index} style={{ color: '#F95A2C', fontFamily: "Roboto-Medium" }}>{error} </Text>
                                        )}
                                    </View>
                                    : <View style={{ paddingBottom: "24%" }}></View>}


                            <Text>Nova Password</Text>

                            <View style={[styles.input, PasswordIsFocused && styles.isFocused]}>
                                <Image
                                    style={styles.image}
                                    source={PasswordIsFocused
                                        ? require('../assets/img/password-focused.png')
                                        : require('../assets/img/password.png')} />
                                < TextInput
                                    style={{ flex: 1 }}
                                    secureTextEntry={showPassword}
                                    onFocus={() => { setPasswordIsFocused(true) }}
                                    onBlur={() => { setPasswordIsFocused(false) }}
                                    onChangeText={password => onNewPasswordChange(password)}
                                    defaultValue={newPassword}
                                    placeholder="Password" />

                                <TouchableWithoutFeedback onPress={() => setShowPassword(!showPassword)}>
                                    <Image
                                        style={styles.image}
                                        source={showPassword
                                            ? require('../assets/img/show-password.png')
                                            : require('../assets/img/hide-password.png')} />
                                </TouchableWithoutFeedback>


                            </View>

                            <View style={styles.center}>
                                <AppButton onPress={resetPassword} title="Mudar Password" />
                            </View>

                        </SafeAreaView>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );

}

const styles = StyleSheet.create({
    body: {
        backgroundColor: "#F9F9F9",
        color: "#0D1B1E",
    },

    container: {
        paddingHorizontal: 32,
    },

    errorsContainer: {
        borderRadius: 12,
        marginVertical: 24,
        padding: 16,
        backgroundColor: "#F3F3F3",
    },

    center: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 64
    },

    image: {
        padding: 12,
        margin: 8,
        height: 8,
        width: 8,
        resizeMode: 'contain',
        alignItems: 'center',

    },

    input: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 44,
        paddingRight: 10,
        paddingLeft: 10,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        borderColor: "#FFFFFF",
        borderWidth: 2,
        color: '#0D1B1E',
        marginVertical: 12
    },

    isFocused: {
        borderColor: "#00C6AE",
        borderWidth: 2,
        borderRadius: 12,
        backgroundColor: "#FFFFFF",
        color: '#0D1B1E'
    }
});

export default RecoverPassword;