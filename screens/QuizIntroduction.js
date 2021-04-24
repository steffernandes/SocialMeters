import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, Image } from 'react-native';
import AppButton from '../components/Button'
import Title from '../components/Title'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import currentUserData from "../utils/userData"

function QuizIntroduction({ navigation }) {
    const [userData, setUserData] = useState();


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

            <Title>Questionário</Title>

            <Text style={{marginVertical: 18}}>Iremos fazer-te 10 perguntas sobre o covid. Após completares este questionário tens 3 horas até poderes fazer outro. Cada pergunta certa vale 10 moedas.</Text>

                <View style={styles.imageView}>
                    <Image source={require('../assets/img/quiz-board.png')} />
                </View>

            <View style={styles.center}>
                <AppButton onPress={() => { navigation.push("Quiz", { id: userData._id, token: userData.token }) }} title="Começar questionário" />
                <TouchableWithoutFeedback style={{ marginVertical: 24 }} onPress={() => { navigation.push("Dashboard") }}>
                    <Text style={{fontFamily: "Roboto-Medium", textDecorationLine: 'underline'}}>Sair</Text>
                </TouchableWithoutFeedback>
            </View>

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

    imageView: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: "20%"
    },

    image: {
        padding: 10,
        margin: 5,
        height: 18,
        width: 18,
        resizeMode: 'stretch',
        alignItems: 'center',

    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        /* marginVertical: "20%" */
    },

});

export default QuizIntroduction;
