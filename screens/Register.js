import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Image, SafeAreaView, Text, StatusBar, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import currentUserData from "../utils/userData"
import AppButton from '../components/Button'
import Title from '../components/Title'

const Register = ({ navigation }) => {
    const [errorsList, setErrorsList] = useState([]);
    const [name, onNameChange] = useState('');
    const [email, onEmailChange] = useState('');
    const [password, onPasswordChange] = useState('');
    const [showPassword, setShowPassword] = useState(true)
    const [nameIsFocused, setNameIsFocused] = useState(false)
    const [emailIsFocused, setEmailIsFocused] = useState(false)
    const [passwordIsFocused, setPasswordIsFocused] = useState(false);

    let updateErrors = [...errorsList];

    const register = () => {
        let randomImage = Math.floor(Math.random() * 4) + 1;
      
        postData("https://covidapptf.herokuapp.com/users/register", {
            name: name.charAt(0).toUpperCase() + name.slice(1),
            points: 0,
            profilePhoto: 'https://www.tchd.org/ImageRepository/Document?documentId=6966',
            email: email,
            password: password,
            location: '',
        })
    }

    const postData = (url, data) => {
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
                    currentUserData.setUserContacts()
                    currentUserData.setUserData(data.user)
                    navigation.push('Tutorial')
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
                            <Title >Registrar</Title>

                            {
                                errorsList.length > 0
                                    ? <View style={styles.errorsContainer}>
                                        {errorsList.map((error, index) =>
                                            <Text key={index} style={{ color: '#F95A2C', fontFamily: "Roboto-Medium" }}>{error} </Text>
                                        )}
                                    </View>
                                    : <View style={{ paddingBottom: "24%" }}></View>}

                            <View style={[styles.input, nameIsFocused && styles.isFocused]}>
                                <Image
                                    style={styles.image}
                                    source={nameIsFocused
                                        ? require('../assets/img/user-focused.png')
                                        : require('../assets/img/user.png')} />

                                <TextInput
                                    style={{ flex: 1 }}
                                    onFocus={() => { setNameIsFocused(true) }}
                                    onBlur={() => { setNameIsFocused(false) }}
                                    onChangeText={name => onNameChange(name)}
                                    defaultValue={name}
                                    placeholder="Nome e Apelido" />
                            </View>

                            <View style={[styles.input, emailIsFocused && styles.isFocused]}>
                                <Image
                                    style={styles.image}
                                    source={emailIsFocused
                                        ? require('../assets/img/mail-focused.png')
                                        : require('../assets/img/mail.png')} />


                                <TextInput
                                keyboardType="email-address"
                                    style={{ flex: 1 }}
                                    onFocus={() => { setEmailIsFocused(true) }}
                                    onBlur={() => { setEmailIsFocused(false) }}
                                    onChangeText={email => onEmailChange(email)}
                                    defaultValue={email}
                                    placeholder="Email" />
                            </View>

                            <View style={[styles.input, passwordIsFocused && styles.isFocused]}>
                                <Image
                                    style={styles.image}
                                    source={passwordIsFocused
                                        ? require('../assets/img/password-focused.png')
                                        : require('../assets/img/password.png')} />

                                < TextInput
                                    style={{ flex: 1 }}
                                    secureTextEntry={showPassword}
                                    onFocus={() => { setPasswordIsFocused(true) }}
                                    onBlur={() => { setPasswordIsFocused(false) }}
                                    onChangeText={password => onPasswordChange(password)}
                                    defaultValue={password}
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
                                <Text >Já tens uma conta?
                                    <Text onPress={() => { navigation.navigate('Login') }} style={{ color: '#00C6AE' }}> Entrar</Text>
                                </Text>
                            </View>

                            <View style={styles.center}>
                                <AppButton onPress={register} title="Registrar" />
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
        padding: 32,
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
        marginVertical: 24
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
        backgroundColor: "#fff",
        color: '#0D1B1E'
    }
});

export default Register;