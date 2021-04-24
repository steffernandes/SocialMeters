import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Image, SafeAreaView, Text, StatusBar, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import currentUserData from "../utils/userData"
import AppButton from '../components/Button'
import Title from '../components/Title'
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChangeEmail = ({ navigation }) => {
    const [errorsList, setErrorsList] = useState([]);
    const [email, onEmailChange] = useState('');
    const [emailIsFocused, setEmailIsFocused] = useState(false)

    const [userData, setUserData] = useState();

    let updateErrors = [...errorsList];

    useEffect(() => {
        const retrieveData = async () => {
            let data = await AsyncStorage.getItem('user_data');
            if (data) {
                setUserData(JSON.parse(data))
                onEmailChange(JSON.parse(data).email)
            } else {
                navigation.navigate("Login")
            }

        }
        retrieveData()
    }, []);  


    const nextStep = () => {
        // send a code to the provided email to confirm it exists
        if (userData.email != email) {
            sendEmail('https://covidapptf.herokuapp.com/email/email/', {
            email: userData.email,
            newEmail: email
        })
        } else {
            if (updateErrors.length > 0) {
                updateErrors.length = 0;
            }
            // Alimentar a lista de erros com a array
            setErrorsList(["O email tem de ser diferente do atual"]);
        }
    }

    const sendEmail = (url, data) => {
        fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Authorization": userData.token
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
                    // if theres no error sending the email go to the code verification page and send the new email as a parameter
                    navigation.navigate("SecurityCodeVerificationEmail", { newEmail: email })

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

                    <StatusBar backgroundColor="#F9F9F9" barStyle="dark-content" />
                    <TouchableWithoutFeedback onPress={() => navigation.navigate("Settings")}>
                        <Image
                            style={{
                                height: 40,
                                width: 40,
                                marginVertical: 24
                            }}
                            source={require('../assets/img/go-back.png')}
                        />
                    </TouchableWithoutFeedback>
                    <Title>Alterar o email</Title>

                    {
                        errorsList.length > 0
                            ? <View style={styles.errorsContainer}>
                                {errorsList.map((error, index) =>
                                    <Text key={index} style={{ color: '#F95A2C', fontFamily: "Roboto-Medium" }}>{error} </Text>
                                )}
                            </View>
                            : <View style={{ paddingBottom: "24%" }}></View>}
                    <Text>Novo email</Text>
                    <View style={[styles.input, emailIsFocused && styles.isFocused]}>
                        <Image
                            style={styles.image}
                            source={emailIsFocused
                                ? require('../assets/img/mail-focused.png')
                                : require('../assets/img/mail.png')} />
                        <TextInput
                        keyboardType="email-address"
                        value={email}
                            style={{ flex: 1 }}
                            onFocus={() => { setEmailIsFocused(true) }}
                            onBlur={() => { setEmailIsFocused(false) }}
                            onChangeText={email => onEmailChange(email)}
                            defaultValue={email}
                            placeholder="Email" />
                    </View>


                    <View style={styles.center}>
                        <AppButton onPress={nextStep} title="Mudar Email" />
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

export default ChangeEmail;