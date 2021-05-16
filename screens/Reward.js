import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StatusBar, View, StyleSheet, Text, Image, TouchableWithoutFeedback, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../components/Loading'


const Reward = ({ route, navigation }) => {
    const { id, userCoins, token, rewardId, rewardTitle, rewardSubtitle, rewardPrice, rewardImage, claimed } = route.params
    const [userData, setUserData] = useState();
    const [rewardClaimed, setRewardClaimed] = useState(claimed);
    const [rewardUsed, setRewardUsed] = useState(false);
    const remainingCoins = userCoins - rewardPrice 

    useEffect(() => {
        const retrieveData = async () => {
            let data = await AsyncStorage.getItem('user_data');
            if (data) {
                setUserData(JSON.parse(data))
            } else {
                navigation.replace("Login")
            }
        }
        retrieveData()
    }, []);


    const getReward = () => {
        setRewardClaimed(true)
        updateRewards(`https://covidapptf.herokuapp.com/users/${id}/rewards`, {
            operationType: "add",
            updatedCoins: remainingCoins,
            rewardId: rewardId
        }, token)

    }

    const useReward = () => {
        setRewardUsed(true)
        updateRewards(`https://covidapptf.herokuapp.com/users/${id}/rewards`, {
            operationType: "remove",
            rewardId: rewardId
        }, token)

    }

    const updateRewards = (url, data, token) => {
        fetch(url, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
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
        <ScrollView>
        <View style={styles.container}>
            <StatusBar backgroundColor="#F9F9F9" barStyle="dark-content" />
            <TouchableWithoutFeedback onPress={() => navigation.replace("Dashboard")}>
                <Image
                    style={styles.goBack}
                    source={require('../assets/img/go-back.png')}
                />
            </TouchableWithoutFeedback>
            <Image source={{ uri: rewardImage }} style={{ width: "100%", height: 300, resizeMode: 'contain', marginVertical: 20 }} /> 
                <View >
                    <Text style={[styles.title, { alignSelf: 'flex-start' }]}>{rewardTitle}</Text>
                    <Text style={styles.subtitle}>{rewardSubtitle}</Text>
                </View>

                <View style={[styles.row, {marginTop: "4%" }]}>
                    <Image source={require("../assets/img/coin.png")} style={{ width: 14, height: 14, marginRight: 8 }}></Image>
                    <Text style={styles.price}>{rewardPrice}</Text>
                </View>
            

            <View style={[styles.center, {marginTop:"15%"}]}>
                {rewardUsed ? <Text>Já usaste esta recompensa</Text> :
                    rewardClaimed ?
                        <TouchableWithoutFeedback onPress={useReward}>
                            <Image source={{ uri: "https://live.staticflickr.com/65535/50878193213_a8eac1869a_q.jpg" }} style={{ width: 100, height: 100 }}></Image>
                        </TouchableWithoutFeedback>
                        :
                        remainingCoins >= 0 ?
                            <View style={styles.center}>
                                <TouchableOpacity onPress={getReward} style={styles.buttonContainer}>
                                    <Text style={styles.buttonText}>Reclamar Recompensa</Text>
                                </TouchableOpacity>
                                <Text>Ficarás com {remainingCoins} moedas</Text>

                            </View> :
                            <View style={styles.center}>
                                <Text>Não tens moedas suficientes para esta recompensa</Text>
                            </View>

                }
            </View>
        </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: "#F9F9F9",
        color: "#0D1B1E"
    },

    container: {
        padding: 32
    },

    goBack: {
        height: 40,
        width: 40, 
        padding: 24,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageView: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: "16%"
    },
    groupName: {
        fontSize: 18,
        fontFamily: "Roboto-Medium",
        color: "#0D1B1E"
    },
    groupContainer: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        borderRadius: 12,
        backgroundColor: "#F1F1F1",
        padding: 16,
        marginVertical: 8
    },
    image: {
        height: 32,
        width: 32,
        resizeMode: 'contain',
    },
    imageView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: "25%"
    },
    buttonContainer: {
        backgroundColor: "#0D1B1E",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 12,
        marginVertical: 16,
        width: 232
    },
    buttonText: {
        fontSize: 16,
        color: "#FFFFFF",
        alignSelf: "center",
        fontFamily: "Roboto-Medium"
    },
    title: {
        fontFamily: "Roboto-Bold",
        fontSize: 18,
        color: "#0D1B1E"
    },
    subtitle: {
        fontFamily: "Roboto-Medium",
        fontSize: 14,
        color: "#979797"
    },
    price: {
        fontFamily: "Roboto-Medium",
        fontSize: 15,
        color: "#0D1B1E"
    },
    row: {
        flexDirection: "row",
        alignItems: 'center',
    }
});

export default Reward;
