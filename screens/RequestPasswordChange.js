import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Image, SafeAreaView, Text, StatusBar, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import AppButton from '../components/Button'
import Title from '../components/Title' 


const RequestPasswordChange = ({ navigation }) => {
    const [feedbackMessage, setFeedBackMessage] = useState('');
    const [email, onEmailChange] = useState('');

    const sendEmail = () => {
        submitRequest(`https://covidapptf.herokuapp.com/email/password`, {
            email: email
        })
    }

    const submitRequest = (url, data) => {
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
                    setFeedBackMessage("Ocorreu um erro a enviar o email de recuperação de password")

                } else {
                    // envia para a página de verificação do codigo de segurança e manda o email como um parametro
                   navigation.navigate("SecurityCodeVerificationPassword", { email: email })
                }

            } 
        }).catch(function (error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
            // ADD THIS THROW error
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

                            <Title>Recuperar password</Title>
                           

                            <View style={styles.errorsContainer}>
                                <Text style={styles.errorText}>{feedbackMessage}</Text>
                            </View>


                            <Text>Email associado à sua conta</Text>
                            <TextInput
                            keyboardType="email-address"
                                style={styles.input}
                                onChangeText={email => onEmailChange(email)}></TextInput>
                            

                            <View style={styles.center}>
                                <AppButton onPress={sendEmail} title="Seguinte" />
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

export default RequestPasswordChange;