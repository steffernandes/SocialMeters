import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, Image, TouchableWithoutFeedback } from 'react-native';
import AppButton from '../components/Button'
import Title from '../components/Title'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import currentUserData from "../utils/userData"



function QuizResults({ route, navigation }) {
    let { coins, rightAnswersCounter, wrongAnswers } = route.params;
    const [showWrongAnswers, setShowWrongAnswers] = useState(false);

    /*    const [userData, setUserData] = useState();
  
      useEffect(() => {
          const retrieveData = async () => {
              let data = await AsyncStorage.getItem('user_data');
              if (data) {
                  setUserData(JSON.parse(data))
                  console.log("User data:" + userData);
              } else {
                  navigation.navigate("Login")
              }
          }
          retrieveData()
      }, []); */


    return (
        <ScrollView>
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor="#F9F9F9" barStyle="dark-content" />
                <Title>Resultado</Title>
                <View style={[styles.flex, { paddingTop: "32%" }]}>
                    <Text style={styles.subtitle}>Perguntas certas</Text>
                    <Text style={[styles.subtitle, { paddingLeft: "16%" }]}>Moedas ganhas</Text>
                </View>

                <View style={styles.flex}>

                    <View style={styles.resultsContainer}>
                        <Text style={{ fontFamily: "Roboto-Medium", fontSize: 32 }}>{rightAnswersCounter} <Text style={{ fontFamily: "Roboto-Medium", fontSize: 24 }}>/10</Text></Text>
                    </View>
                    
                    <View style={[styles.resultsContainer, { marginLeft: "5%" }]}>
                        <View style={styles.flex}>
                            <Image style={styles.image} source={require("../assets/img/coin.png")}></Image>
                            <Text style={{ fontFamily: "Roboto-Medium", fontSize: 24 }}>{coins}</Text>
                        </View>
                    </View>
                </View>
                {wrongAnswers.length > 0 ? showWrongAnswers ? 
                        <View style={styles.wrongAnswersContainer}>
                            <View style={{flexDirection: 'row', justifyContent: "space-between"}}>
                                <Text style={{ fontFamily: "Roboto-Medium", fontSize: 18 }}>Esconder respostas erradas</Text>
                                <TouchableWithoutFeedback onPress={() => { setShowWrongAnswers(!showWrongAnswers) }}>
                                     <Image style={{ alignItems: 'flex-end', marginTop: 8}} source={require("../assets/img/chevron-up.png")}></Image>
                                </TouchableWithoutFeedback>
                               
                            </View>

                            <View style={{ marginTop: 16 }}>
                                {wrongAnswers.map((answer, index) =>
                                    <View style={{ marginVertical: 8 }} key={index}>
                                        <Text style={{ fontFamily: "Roboto-Regular", fontSize: 16 }}>{answer.question}</Text>
                                        <Text style={{ fontFamily: "Roboto-Medium", fontSize: 16 }}>{answer.answer}</Text>
                                    </View>

                                )}
                            </View>
                        </View>
                    
                    :
                        <View style={styles.wrongAnswersContainer}>
                        <View style={{flexDirection: 'row',  justifyContent: "space-between"}}>
                            <Text style={{ fontFamily: "Roboto-Medium", fontSize: 18 }}>Ver respostas erradas</Text>
                            <TouchableWithoutFeedback onPress={() => { setShowWrongAnswers(!showWrongAnswers) }}>
                                <Image style={{ alignContent: 'flex-end', marginTop: 8}} source={require("../assets/img/chevron-down.png")}></Image>
                            </TouchableWithoutFeedback>
                            
                            </View>
                        </View> : <View style={styles.wrongAnswersContainer}>
                            <Text style={{ fontFamily: "Roboto-Medium", fontSize: 18, textAlign: "center" }}>Parabéns!</Text>
                        </View> }
             

                <View style={styles.center}>
                    <AppButton onPress={() => { navigation.push("Dashboard") }} title="Percebi" />
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
        marginVertical: "8%"
    },
    resultsContainer: {
        width: "45%",
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        height: 64,
        justifyContent: 'center',
        alignItems: 'center',
    },
    flex: {
        flexDirection: 'row',
    },
    subtitle: {
        fontSize: 16,
        fontFamily: "Roboto-Medium",
        paddingVertical: "5%",
    },
    wrongAnswersContainer: {
        backgroundColor: "#FFE07D",
        padding: 16,
        borderRadius: 8,
        marginVertical: "5%"
    },
    bold: {

    }

});

export default QuizResults;
