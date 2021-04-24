import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Text, StatusBar, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, SafeAreaView, Image } from 'react-native';
import TitleWithCloseButton from '../components/TitleWithCloseButton'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import Clipboard from '@react-native-community/clipboard';
import {  Snackbar } from 'react-native-paper';


function GroupCreated({ route, navigation }) {
    const [userData, setUserData] = useState();
    const { name, id } = route.params;
    const [visible, setVisible] = useState(false);

    const onToggleSnackBar = () => setVisible(!visible);

    const onDismissSnackBar = () => setVisible(false);

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

                            <View style={[styles.center, { marginTop: "32%" }]}>
                                <Text style={styles.subtitle}>O grupo <Text style={{ color: "#F95A2C" }}>{name}</Text> foi criado!</Text>

                                <TouchableWithoutFeedback onPress={() => {
                                    Clipboard.setString(id)
                                    onToggleSnackBar()
                                }} >
                                    <View style={styles.clipboardContainer} >
                                        <Image style={styles.image} source={require("../assets/img/copy-white.png")}></Image>
                                        <Text style={styles.clipboardText}>{id}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <Text style={styles.smallText}>Agora os teus amigos podem juntar-se ao teu grupo utilizando este id.</Text>
                            </View>

                            <View style={styles.center}>
                                <AppButton onPress={() => { navigation.push("Ranking") }} title="Ok!" />
                            </View>

                        </SafeAreaView>
                    </View>

                    <Snackbar
                        visible={visible}
                        duration= {2000}
                        onDismiss={onDismissSnackBar} >
                        O id do grupo foi copiado para a tua área de transferências.
                    </Snackbar>

                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}


const styles = StyleSheet.create({
    body: {
        backgroundColor: "#F9F9F9",
    },

    container: {
        padding: 32,
        flex: 1
    },

    center: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: "8%"
    },

    clipboardContainer: {
        backgroundColor: "#F9825F",
        marginVertical: "8%",
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignContent: 'space-between'
    },

    clipboardText: {
        fontFamily: "Roboto-Medium",
        color: "#FFFFFF",
        fontSize: 18,

    },

    subtitle: {
        fontFamily: "Roboto-Medium",
        color: "#0D1B1E",
        fontSize: 24,
        textAlign: 'center'
    },

    smallText: {
        fontFamily: "Roboto-Regular",
        color: "#0D1B1E",
        fontSize: 14,
        textAlign: 'center'
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
    image: {
        width: 24,
        height: 24,
        marginRight: 24,
        resizeMode: 'contain',
    }

});

export default GroupCreated;
