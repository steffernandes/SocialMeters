import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Image, Text, StatusBar, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, SafeAreaView , Alert} from 'react-native';
import currentUserData from '../utils/userData'
import Title from '../components/Title'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';


function ChangeGroupName({route,  navigation }) {
    const { groupId, members, requests, groupName, token } = route.params
    const [userData, setUserData] = useState();
    const [newGroupName, setNewGroupName] = useState(groupName)

    const changeGroupName = () => {
        if (newGroupName != "") {
            updateData(`https://covidapptf.herokuapp.com/groups/${groupId}/name`, {
            newGroupName: newGroupName
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
    }

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

    const updateData = (url, data) => {
        fetch(url, {
            method: "PUT",
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
                console.log(data);
                if (!data.success) {
                    Alert.alert(
                        "Ocorreu um erro ao mudar o nome do grupo",
                        "Tente outra vez mais tarde",
                        [
                          { text: "OK"  }
                        ],
                        { cancelable: false }
                      );
                } else {
                    navigation.navigate("GroupInfo", { groupId: groupId, members: members, requests: requests, groupName: newGroupName, token: token })
                }

            }
        }).catch(function (error) {
            console.log(error);
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
                            <TouchableWithoutFeedback onPress={() => navigation.navigate("GroupInfo", { groupId: groupId, members: members, requests: requests, groupName: groupName, token: token })}>
                                <Image
                                    style={{
                                        height: 40,
                                        width: 40,
                                        marginBottom: 24
                                    }}
                                    source={require('../assets/img/go-back.png')}
                                />
                            </TouchableWithoutFeedback>
                            <Title>Alterar o nome do grupo</Title>

                            <View style={{ marginTop: "20%", marginBottom: "2%" }}>
                                <Text>Novo nome</Text>
                                <TextInput
                                    value={newGroupName}
                                    style={styles.input}
                                    onChangeText={name => setNewGroupName(name)}
                                ></TextInput>
                            </View>

                            <View style={styles.center}>
                                <AppButton onPress={() => {changeGroupName()}} title="Mudar nome" />
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
    }

});

export default ChangeGroupName;