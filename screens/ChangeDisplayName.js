import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Image, Text, StatusBar, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, SafeAreaView, Alert } from 'react-native';
import currentUserData from '../utils/userData'
import Title from '../components/Title'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';

function ChangeDisplayName({ navigation }) {
    const [userData, setUserData] = useState();
    const [errorsList, setErrorsList] = useState([]);
    const [name, onNameChange] = useState();
    let updateErrors = [...errorsList];
    useEffect(() => {
        const retrieveData = async () => {
            let data = await AsyncStorage.getItem('user_data');
            if (data) {
                setUserData(JSON.parse(data))
                onNameChange(JSON.parse(data).name)
            } else {
                navigation.navigate("Login")
            }
        }
        retrieveData()
    }, []);

    const changeName = () => {
        if (name != userData.name) {
            updateData(`https://covidapptf.herokuapp.com/update/${userData._id}/name`, {
                newName: name.charAt(0).toUpperCase() + name.slice(1),
            })
        } else {
            if (updateErrors.length > 0) {
                updateErrors.length = 0;
            }

            // Alimentar a lista de erros com a array
            setErrorsList(["O nome tem de ser diferente do atual"]);
        }
    }

    const updateData = (url, data) => {
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
                if (data.success) {
                    // envia para a página de verificação do codigo de segurança e manda o email como um parametro
                    Alert.alert(
                        "O seu nome foi alterado com sucesso!",
                        " ",
                        [
                          { text: "OK", onPress: () =>  navigation.navigate("Settings") }
                        ],
                        { cancelable: false }
                      );
                     
                } else {
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
                }
            }
        }).catch(function (error) {
            console.log('Erro a realizar a função updateData: ' + error.message);
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
                            <Title>Alterar o nome</Title>
                            {
                                errorsList.length > 0
                                    ? 
                                    <View style={styles.errorsContainer}>
                                        {errorsList.map((error, index) =>
                                            <Text key={index} style={{ color: '#F95A2C', fontFamily: "Roboto-Medium" }}>{error} </Text>
                                        )}
                                    </View>
                                    : <View style={{ paddingBottom: "32%" }}></View>}
                            <View style={{ marginBottom: "2%" }}>
                                <Text>Novo nome</Text>
                                <TextInput
                                value={name}
                                    style={styles.input}
                                    onChangeText={name => onNameChange(name)}
                                ></TextInput>
                            </View>

                            <View style={styles.center}>
                                <AppButton onPress={changeName} title="Mudar nome" />
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
        flex: 1
    },

    imageView: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: "16%"
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 64
    },

    image: {
        height: 40,
        width: 40,
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

    errorsContainer: {
        borderRadius: 12,
        marginVertical: 24,
        padding: 16,
        backgroundColor: "#F3F3F3",
    },

});

export default ChangeDisplayName;