import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, Image } from 'react-native';
import AppButton from '../components/Button'
import Title from '../components/Title'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';

function Tutorial({ navigation }) {
    const [userData, setUserData] = useState();
    const [screen, setScreen] = useState(0)

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
        <ScrollView>
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor="#F9F9F9" barStyle="dark-content" />

                <Title>Como Usar</Title>

                {screen == 0 ?
                    <View >
                        <Text style={styles.subtitle}>Ganhar moedas</Text>
                        <Image style={styles.image} source={require("../assets/img/tutorialCoins.png")} />
                        <View style={{
                            
                            position: 'relative', 
                             marginTop: "20%"

                        }}>
                            <TouchableWithoutFeedback onPress={() => { setScreen(screen + 1) }}>
                                <Image style={[styles.icon, { alignSelf: 'flex-end' }]} source={require("../assets/img/next.png")} />
                            </TouchableWithoutFeedback>
                        </View>

                    </View>
                    : screen == 1 &&
                    <View >
                        <Text style={styles.subtitle}>Ganhar pontos</Text>
                        <Image style={styles.image} source={require("../assets/img/tutorialPoints.png")} />
                        <View style={{
                           position: 'relative', 
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: "20%"

                        }}>
                            <TouchableWithoutFeedback onPress={() => { setScreen(screen - 1) }}>
                                <Image style={[styles.icon, { alignSelf: 'flex-start' }]} source={require("../assets/img/back.png")} />
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback style={styles.buttonContainer} onPress={() => { navigation.push('Dashboard') }}>
                                <Text style={styles.buttonText}>Entrar</Text>
                            </TouchableWithoutFeedback>
                        </View>

                    </View>
                }

            </SafeAreaView>
        </ScrollView >
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

    imageView: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: "20%"
    },

    image: {
        width: "100%",
        height: 325,
        resizeMode: 'contain',
        marginTop: 20
    },

    buttonContainer: {
        backgroundColor: "#FFE07D",
        borderRadius: 29,
        paddingVertical: 16,
        paddingHorizontal: 24,

    },
    buttonText: {
        fontSize: 16,
        color: "#0D1B1E",
        alignSelf: "center",
        fontFamily: "Roboto-Medium"
    },
    icon: {
        width: 56,
        height: 56,
        resizeMode: 'contain'
    },
    subtitle: {
        color: "#FFE07D",
        fontFamily: "Roboto-Medium",
        fontSize: 22,
        marginVertical: 12
    }

});

export default Tutorial;
