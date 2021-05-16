import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, StyleSheet, Text, StatusBar, Image } from 'react-native';
import Subtitle from '../components/Subtitle'
import TitleWithCloseButton from '../components/TitleWithCloseButton'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Button, Paragraph, Dialog, Portal, Switch } from 'react-native-paper'; 

const AccountOptions = [
    {
        title: 'Alterar password',
        page: "ChangePassword",
        color: "#0D1B1E"
    },
    {
        title: 'Alterar email',
        page: "ChangeEmail",
        color: "#0D1B1E"
    },
    {
        title: 'Alterar nome',
        page: "ChangeDisplayName",
        color: "#0D1B1E"
    },
];

const ApplicationOptions = [

    {
        title: 'Notificações',
        page: '',
        color: "#0D1B1E"
    }
];



function Settings({ navigation }) {
    const [userData, setUserData] = useState();
    const [visible, setVisible] = useState(false); 

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

    const showDialog = () => setVisible(true);

    const hideDialog = () => setVisible(false);
 
    const deleteAccount = () => {
        deleteUser(`https://covidapptf.herokuapp.com/users/${userData._id}`)
    }

    const deleteUser = (url, data) => {
        fetch(url, {
            method: "DELETE",
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
                    alert("Não conseguimos apagar a sua conta. Tente novamente.")
                } else {
                    logout()
                }
            }
        }).catch(function (error) {
            console.log('There has been a problem with your fetch operation: ' + error.message); 
            throw error;
        });
    }

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('user_data')
        } catch (e) {
            // remove error
        }
        navigation.navigate("Login")
    }

    return (
        <ScrollView>

            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor="#F9F9F9" barStyle="dark-content" />

                <TitleWithCloseButton navigation={navigation} goToPage="Dashboard" title="Definições"></TitleWithCloseButton>

                <Subtitle>Definições da aplicação</Subtitle>

                {ApplicationOptions.map((item, index) =>
                        <View style={styles.optionContainer} key={index}>
                            <Text style={[styles.option, { color: item.color }]}>{item.title}</Text> 
                        </View>
                )}
                <Subtitle>Informações da conta</Subtitle>

                {AccountOptions.map((item, index) =>
                    <TouchableWithoutFeedback key={index} onPress={() => { navigation.replace(item.page) }}>
                        <View style={styles.optionContainer}>
                            <Text style={[styles.option, { color: item.color }]}>{item.title}</Text>
                        </View> 
                        </TouchableWithoutFeedback>
                )}
                <TouchableWithoutFeedback onPress={showDialog}>
                    <View style={styles.optionContainer}>
                        <Text style={[styles.option, { color: "#F95A2C" }]}>Apagar Conta</Text>
                    </View>

                </TouchableWithoutFeedback>

                <View style={styles.flex}>
                    <Image
                        style={styles.image}
                        source={require('../assets/img/logout-red.png')} />

                    <Text onPress={logout} style={styles.logout}>Sair</Text>
                </View>

                <Portal>
                    <Dialog visible={visible} onDismiss={hideDialog}>
                        <Dialog.Title>Quer mesmo apagar a sua conta?</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>Esta é uma ação irreversível</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button color={'#F95A2C'} onPress={deleteAccount}>Sim</Button>
                            <Button color={'#0D1B1E'} onPress={hideDialog}>Não</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </SafeAreaView>
        </ScrollView>
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

    image: {
        padding: 10,
        margin: 5,
        height: 18,
        width: 18,
        resizeMode: 'stretch',
        alignItems: 'center',

    },

    flex: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 18
    },

    logout: {
        fontSize: 16,
        color: "#F95A2C",
        fontFamily: "Roboto-Bold",
    },
    option: {
        fontSize: 14,
        fontFamily: "Roboto-Medium",
        marginVertical: 8,

    },
    optionContainer: {
        backgroundColor: "#F3F3F3",
        borderRadius: 8,
        marginVertical: 8,
        padding: 8,
        paddingLeft: 16
    }

});

export default Settings;