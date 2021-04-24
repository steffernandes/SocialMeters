import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Text, StatusBar, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, SafeAreaView, Alert } from 'react-native';
import TitleWithCloseButton from '../components/TitleWithCloseButton'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';


function CreateGroup({ navigation }) {
    const [userData, setUserData] = useState();
    const [name, onNameChange] = useState();

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

    const createGroup = (url, data) => {
        fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Authorization": userData.token
            },
            credentials: "same-origin"
        })
            .then(response => response.json())
            .then(json => {
                updateUserGroups(`https://covidapptf.herokuapp.com/users/${userData._id}/groups`, {
                    operationType: "add",
                    groupID: json.info._id
                })
            })
            .catch((error) => console.log(error))
    }


    const updateUserGroups = (url, data) => {
        fetch(url, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Authorization": userData.token
            },
            credentials: "same-origin"
        })
            .then(response => response.json())
            .then(json => {
                if (json.success) {
                    navigation.push("GroupCreated", {
                        name: name.charAt(0).toUpperCase() + name.slice(1),
                        id: data.groupID
                    })
                }

            })
            .catch((error) => console.log(error))
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
                            <TitleWithCloseButton title="Criar grupo" navigation={navigation} goToPage="Ranking"></TitleWithCloseButton>

                            <View style={{ marginTop: "25%", marginBottom: "2%" }}>
                                <Text>Nome do grupo</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={name => onNameChange(name)}
                                ></TextInput>
                            </View>

                            <View style={styles.center}>
                                <AppButton onPress={() => {
                                    if (name != "") {
                                        createGroup("https://covidapptf.herokuapp.com/groups", {
                                            name: name,
                                            id: userData._id
                                        })
                                    } else {
                                        Alert.alert(
                                            "O nome do grupo não pode ser vazio",
                                            " ",
                                            [
                                              { text: "OK" }
                                            ],
                                            { cancelable: false }
                                          );
                                    }
                                }} title="Seguinte" />
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

    center: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 64
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

export default CreateGroup;
