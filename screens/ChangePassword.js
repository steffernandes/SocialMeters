import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Image, SafeAreaView, Text, StatusBar, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Alert, ScrollView } from 'react-native';
import AppButton from '../components/Button'
import Title from '../components/Title'
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChangePassword = ({ navigation }) => {
    const [errorsList, setErrorsList] = useState([]);
    const [password, onPasswordChange] = useState('');
    const [newPassword, onNewPasswordChange] = useState('');
    const [showPassword, setShowPassword] = useState(true)
    const [showNewPassword, setNewShowPassword] = useState(true)
    const [userData, setUserData] = useState();
    const updateErrors = [...errorsList];

    useEffect(() => {
        const retrieveData = async () => {
            let data = await AsyncStorage.getItem('user_data');
            if (data) {
                setUserData(JSON.parse(data))
            } else {
                navigation.push("Login")
            }

        }
        retrieveData()
    }, []);

    const checkPassword = () => {
        console.log(userData._id);
        if (password != newPassword) {
            updatePassword(`https://covidapptf.herokuapp.com/update/${userData._id}/password`, {
                email: userData.email,
                password: password,
                newPassword: newPassword
            })
        } else {
            if (updateErrors.length > 0) {
                updateErrors.length = 0;
            }
            // Alimentar a lista de erros com a array
            setErrorsList(["As passwords têm de ser diferentes"]);
        }
    }

    const updatePassword = (url, data) => {
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
                    Alert.alert(
                        "A sua password foi alterada com sucesso!",
                        " ",
                        [
                          { text: "OK", onPress: () =>  navigation.navigate("Settings") }
                        ],
                        { cancelable: false }
                      );
                
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
                            <TouchableWithoutFeedback onPress={() => navigation.push("Settings")}>
                                <Image
                                    style={styles.goBack}
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

                            <Text>Password atual</Text>
                            <View style={styles.input}>

                                <TextInput
                                    style={{ flex: 1 }}
                                    onChangeText={password => onPasswordChange(password)}
                                    secureTextEntry={showPassword} ></TextInput>

                                <TouchableWithoutFeedback onPress={() => setShowPassword(!showPassword)}>
                                    <Image
                                        style={styles.image}
                                        source={showPassword
                                            ? require('../assets/img/show-password.png')
                                            : require('../assets/img/hide-password.png')} />
                                </TouchableWithoutFeedback>


                            </View>
                            <Text>Nova Password</Text>


                            <View style={styles.input}>

                                <TextInput
                                    style={{ flex: 1 }}
                                    onChangeText={password => onNewPasswordChange(password)}
                                    secureTextEntry={showNewPassword} ></TextInput>

                                <TouchableWithoutFeedback onPress={() => setNewShowPassword(!showNewPassword)}>
                                    <Image
                                        style={styles.image}
                                        source={showNewPassword
                                            ? require('../assets/img/show-password.png')
                                            : require('../assets/img/hide-password.png')} />
                                </TouchableWithoutFeedback>
                                
                            </View>


                            <View style={styles.center}>
                                <AppButton onPress={checkPassword} title="Mudar Password" />
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

    goBack: {
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
    }
});

export default ChangePassword;