import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Image, SafeAreaView, Text, StatusBar, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import currentUserData from "../utils/userData"
import AppButton from '../components/Button'
import Title from '../components/Title'
import AsyncStorage from '@react-native-async-storage/async-storage'; 


const SecurityCodeVerificationEmail = ({ route, navigation }) => {
    const [feedbackMessage, setFeedBackMessage] = useState(`Enviamos-lhe um email com um código de segurança. \nVerifique a sua caixa de entrada.`);
    const [code, onCodeChange] = useState();
    let { newEmail } = route.params;
    const [userData, setUserData] = useState();

    useEffect(() => {
        const retrieveData = async () => {
            let data = await AsyncStorage.getItem('user_data');
            if (data) {
                setUserData(JSON.parse(data));
            }  else {
                navigation.navigate("Login")
            }
        }
        retrieveData()
    }, []);

    const checkSecurityCode = () => { 
        verifySecurityCode('https://covidapptf.herokuapp.com/update/security-code', {
            email: userData.email,
            code: code
        })
    }

    const verifySecurityCode = (url, data) => {
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
                if (!data.success) {
                    // Note: If the email already exists in the db, it also displays this message
                    setFeedBackMessage("Código de segurança incorreto")
                } else {
                    changeEmail(`https://covidapptf.herokuapp.com/update/${userData._id}/email`, {
                        newEmail: newEmail,
                    })
                }
            }
        }).catch(function (error) {
            console.log('There has been a problem with your fetch operation: ' + error.message); 
            throw error;
        });
    };

    const sendEmail = () => {
        submitRequest(`https://covidapptf.herokuapp.com/email/email/`, {
            email: userData.email,
            newEmail: newEmail
        })
    }

    const submitRequest = (url, data) => {
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
                if (!data.success) {
                    setFeedBackMessage("Ocorreu um erro a enviar o email")

                } else {
                    // envia para a página de verificação do codigo de segurança e manda o email como um parametro
                    setFeedBackMessage("Enviámos-lhe um e-mail com um novo código de segurança. \nVerifique a sua caixa de entrada.")
                }

            }
        }).catch(function (error) {
            console.log('There has been a problem with your fetch operation: ' + error.message); 
            throw error;
        });
    };

    const changeEmail = (url, data) => {
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
                if (!data.success) {
                    alert("Ocorreu um erro ao mudar o seu email!")
                } else {
                    alert("O seu email foi alterado com sucesso!")
                    data.user.token = userData.token
                    currentUserData.setUserData(data.user) 
                    navigation.navigate("Settings")
                }

            }
        }).catch(function (error) {
            console.log('Erro a realizar a função changeEmail: ' + error.message); 
            throw error;
        });
    };

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
                                    style={styles.image}
                                    source={require('../assets/img/go-back.png')}
                                />
                            </TouchableWithoutFeedback>

                            <Title>Alterar o email</Title>


                            <View style={styles.errorsContainer}>
                                <Text style={styles.errorText}>{feedbackMessage}</Text>
                            </View>


                            <Text>Código de Segurança</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={code => onCodeChange(code)}
                            ></TextInput>

                            <View style={{
                                marginVertical: 8,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <Text>Não recebeste nenhum email? </Text>
                                <Text onPress={() => { sendEmail() }} style={{ color: '#00C6AE' }}>Reenviar código</Text>
                            </View>

                            <View style={styles.center}>
                                <AppButton onPress={() => { checkSecurityCode() }} title="Seguinte" />
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
        paddingTop: "8%",
        paddingBottom: "16%"
    },

    center: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: "32%"
    },

    image: {
        height: 40,
        width: 40,
        marginVertical: 24
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
    errorText: {
        color: "#F9825F",
        fontFamily: "Roboto-Medium"
    },
});

export default SecurityCodeVerificationEmail;