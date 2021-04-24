import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Image, Text, StatusBar, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, SafeAreaView, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TitleWithCloseButton from '../components/TitleWithCloseButton'

function JoinGroup({ navigation }) {
    const [userData, setUserData] = useState();
    const [groupID, setGroupID] = useState();
    const [requestSent, setRequestSent] = useState(false)
    const [errorsList, setErrorsList] = useState([]);
    let updateErrors = [...errorsList];

    useEffect(() => {
        const retrieveData = async () => {
            let data = await AsyncStorage.getItem('user_data');
            if (data) {
                setUserData(JSON.parse(data))
            } else {
                navigation.navigate("Login")
            }
        }
        retrieveData()
    }, []);

    const getGroupInfo = (url) => {
        fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": userData.token
            }
        })
            .then(response => response.json())
            .then(json => {
                console.log(json.info[0].members);
                if (json.info.length > 0) {
                    let newRequests = json.info[0].requests
                    let members = json.info[0].members

                    if (members.includes(userData._id)) {
                        if (updateErrors.length > 0) {
                            updateErrors.length = 0;
                        }
                        // Alimentar a lista de erros com a array
                        setErrorsList(["Já pertences a este grupo!"]);

                    } else {

                        if (newRequests.includes(userData._id)) {
                            if (updateErrors.length > 0) {
                                updateErrors.length = 0;
                            }
                            // Alimentar a lista de erros com a array
                            setErrorsList(["Já enviaste um pedido a este grupo!"]);

                        } else {
                            //newRequests.push(userData._id)
                            updateGroupRequests(`https://covidapptf.herokuapp.com/groups/${groupID}/requests`, {
                                operationType: "add",
                                userID: userData._id
                            })
                            /* updateGroupRequests(`http://10.0.2.2:3000/groups/requests/${groupID}`, {
                                updatedRequests: newRequests
                            }) */

                            /* Send a notification to the group admin saying that someone wants to join the group */
                            updates(`https://covidapptf.herokuapp.com/users/${json.info[0].admin}/notifications`, {
                                notificationText: `${userData.name} quer juntar-se ao grupo ${json.info[0].name}`
                            })

                            /* updates(`http://10.0.2.2:3000/users/notifications/${json.info[0].admin}`, {
                                notificationText: `${userData.name} quer juntar-se ao grupo ${json.info[0].name}`
                            }) */
                        }
                    }
                } else {
                    if (updateErrors.length > 0) {
                        updateErrors.length = 0;
                    }
                    // Alimentar a lista de erros com a array
                    setErrorsList(["Não existe nenhum grupo com esse id"]);

                }
            })
            .catch((error) => console.log(error))
    }

    const updateGroupRequests = (url, data) => {
        fetch(url, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Authorization": userData.token
            },
            credentials: "same-origin"
        }).then(response => {
            if (response.status == 200) {
                setRequestSent(true)
            } else {
                if (updateErrors.length > 0) {
                    updateErrors.length = 0;
                }
                // Alimentar a lista de erros com a array
                setErrorsList(["Ocorreu um erro ao realizar o pedido. Tente outra vez."]);

            }
        }).catch((error) => console.log(error))
    }
    const updates = (url, data) => {
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
            .then(data => {
                console.log(data);
            }).catch(function (error) {
                console.log(error.message);
                throw error;
            });
    }

    return (
        <>
            { requestSent ?
                <View style={styles.container}>
                    <TitleWithCloseButton navigation={navigation} goToPage="Dashboard" title=""></TitleWithCloseButton>
                    <View style={styles.imageView}>
                        <Image source={require('../assets/img/request-sent.png')} />
                    </View>
                </View> :
                <KeyboardAvoidingView
                    behavior={Platform.OS == "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}>

                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <ScrollView style={styles.container}>
                            <View style={{ paddingBottom: "24%" }}>


                                <SafeAreaView>
                                    <StatusBar backgroundColor="#F9F9F9" barStyle="dark-content" />
                                    <TitleWithCloseButton navigation={navigation} goToPage="Dashboard" title="Entra num grupo"></TitleWithCloseButton>
                                    {errorsList.length > 0
                                        && <View style={styles.errorsContainer}>
                                            {errorsList.map((error, index) =>
                                                <Text key={index} style={{ color: '#F95A2C', fontFamily: "Roboto-Medium" }}>{error} </Text>
                                            )}
                                        </View>
                                    }
                                    <View style={{ marginTop: "32%", marginBottom: "2%" }}>
                                        <Text>Id do grupo</Text>
                                        <TextInput
                                            style={styles.input}
                                            onChangeText={id => setGroupID(id)}
                                        ></TextInput>
                                    </View>

                                    <View style={styles.center}>
                                        <AppButton onPress={() => { getGroupInfo(`https://covidapptf.herokuapp.com/groups/${groupID}`) /* getGroupInfo(`http://10.0.2.2:3000/groups/${groupID}`) */ }} title="Enviar Pedido" />
                                    </View>

                                </SafeAreaView>
                            </View>
                        </ScrollView>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>}
        </>
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
        marginVertical: 8,
        padding: 16,
        backgroundColor: "#F3F3F3",
    },
});

export default JoinGroup;