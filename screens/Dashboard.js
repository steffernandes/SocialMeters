import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableWithoutFeedback, Image, Text, View, ScrollView, SafeAreaView, StatusBar, FlatList , Alert} from 'react-native';
import BluetoothTraking from '../utils/BluetoothTraking'
import AsyncStorage from '@react-native-async-storage/async-storage';
import currentUserData from "../utils/userData"
import Loading from "../components/Loading"
import Geolocation from '@react-native-community/geolocation';
import { RewardsTab } from '../components/SegmentedControl';

/* import {launchImageLibrary} from 'react-native-image-picker'; */
class NoMoreRewards extends React.Component {
    render() {
        return (
            <View style={{ marginVertical: "10%", width: 325, alignSelf: 'center' }}>
                <Text style={{ fontFamily: "Roboto-Medium", fontSize: 18, textAlign: "center" }}>De momento não temos nenhuma recompensa para te mostrar.</Text>
                <Text style={{ fontFamily: "Roboto-Regular", fontSize: 16, textAlign: "center", color: "#979797", marginTop: 8 }}>Tenta outra vez mais tarde</Text>
            </View>
        );
    }
}

class EmptyUserRewards extends React.Component {
    render() {
        return (
            <View style={{ marginVertical: "10%", width: 325, alignSelf: 'center' }}>
                <Text style={{ fontFamily: "Roboto-Medium", fontSize: 18, textAlign: "center" }}>Não tens nehuma recompensa</Text>
                <Text style={{ fontFamily: "Roboto-Regular", fontSize: 16, textAlign: "center", color: "#979797", marginTop: 8 }}>Para reclamares recompensas vai à página de Recompensas</Text>
            </View>
        );
    }
}
const Dashboard = ({ navigation }) => {

    const [imageData, setImageData] = useState();
    const [userData, setUserData] = useState();
    const [rewards, setRewards] = useState([]);
    const [availableRewards, setAvailableRewards] = useState();
    const [userRewards, setUserRewards] = useState();
    const [token, setToken] = useState();
    const [quizAvailable, setQuizAvailable] = useState(false)
    const [hours, setHours] = useState()
    const [minutes, setMinutes] = useState()
    const [seconds, setSeconds] = useState()
    const [numberOfRewards, setNumberOfRewards] = useState()
    const [rewardsLength, setRewardsLength] = useState()

    const [state, setState] = useState({ open: false });
    const onStateChange = ({ open }) => setState({ open });

    const { open } = state;
    const [tabIndex, setTabIndex] = useState(0);
    const handleTabsChange = index => {
        setTabIndex(index);
    };

    let rewardInfo = []
    let availableRewardsArray = []
    let userLocation = ""

    useEffect(() => {
        /* Geolocation.getCurrentPosition(info => {
            getUserLocation(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${info.coords.latitude}&longitude=${info.coords.longitude}&localityLanguage=en`)
        }) */
        const retrieveData = async () => {
            let data = await AsyncStorage.getItem('user_data');
            if (data) {
                setToken(JSON.parse(data).token)
                getUserData(`https://covidapptf.herokuapp.com/users/${JSON.parse(data)._id}`, JSON.parse(data).token, JSON.parse(data))
/* 
                if (START_BLE_SCAN == false) {
                    BluetoothTraking.startScan(JSON.parse(data)._id, JSON.parse(data).token);
                } */
                /* BluetoothTraking.startScan(JSON.parse(data)._id, JSON.parse(data).token); */
            } else {
                navigation.push("Login")
            }

        }
        retrieveData()

    }, []);

    /* const getUserLocation = (url) => {
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "same-origin"
        })
            .then(response => response.json())
            .then(json => {
                userLocation = json.locality
            })
            .catch((error) => console.log(error))
    } */

    const getAllRewards = (url, token, userRewards, userUsedRewards) => {
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            credentials: "same-origin"
        })
            .then(response => response.json())
            .then(json => {
                // Only show the rewards the user hasn't claimed
                json.map(reward => {
                    if (!userRewards.includes(reward._id) && !userUsedRewards.includes(reward._id)) {
                        availableRewardsArray.push(reward)
                    }
                })
                setRewards(availableRewardsArray)
                setAvailableRewards(availableRewardsArray.length)
            })
            .catch((error) => console.log(error))
    }

    const getUserData = (url, token, userData) => {
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        }).then(response =>
            response.json()
        ).then(data => {
            if (data) {
                // Verificar se existem erros 
                if (data.success) {
                   /*  if (userLocation != data.user.location) {
                        updateUserLocation(`https://covidapptf.herokuapp.com/users/${userData._id}/location`, {
                            updatedLocation: userLocation
                        }, token, userData)
                    } */
                    getAllRewards(`https://covidapptf.herokuapp.com/rewards/`, token, data.user.rewards, data.user.usedRewards)
                    setUserData(data.user)
                    const showQuizTimer = setInterval(() => {
                        setQuizAvailable(false)
                        let currentDate = new Date().getTime();
                        const quizAvailableAt = new Date(data.user.quizAvailableAt).getTime()
                        let distance = quizAvailableAt - currentDate
                        if (Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) < 10) {
                            setHours("0" + Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
                        } else {
                            setHours(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
                        }
                        if (Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)) < 10) {
                            setMinutes("0" + Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)))
                        } else {
                            setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)))
                        }
                        if (Math.floor((distance % (1000 * 60)) / 1000) < 10) {
                            setSeconds("0" + Math.floor((distance % (1000 * 60)) / 1000))
                        } else {
                            setSeconds(Math.floor((distance % (1000 * 60)) / 1000))
                        }
                        if (distance < 0) {
                            setQuizAvailable(true)
                            clearInterval(showQuizTimer);
                        }
                    }, 1000)
                    setNumberOfRewards(data.user.rewards.length)
                    data.user.rewards.map(reward => {
                        getUserRewards(`https://covidapptf.herokuapp.com/rewards/${reward}`, token)
                    })

                } else {
                    Alert.alert(
                        "Erro ao atualizar os dados do utilizador",
                        " ",
                        [
                          { text: "OK"}
                        ],
                        { cancelable: false }
                      );
                }

            }
        }).catch((error) => {
            console.log(error);
        })
    }

    const getUserRewards = (url, token) => {
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        }).then(response =>
            response.json()
        ).then(data => {
            if (data) {
                // Verificar se existem erros 
                if (data.success) {
                    rewardInfo.push(data.rewards)
                    setRewardsLength(rewardInfo.length)
                    setUserRewards(rewardInfo)
                }
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    const updateUserLocation = (url, data, token, userData) => {
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
                userData.location = userLocation
                currentUserData.setUserData(userData)
            }).catch(function (error) {
                throw error;
            });
    }

    return (
        <>
            {userData ?
                <ScrollView>
                    <SafeAreaView >
                        <StatusBar backgroundColor="#F3F3F3" barStyle="dark-content" />

                        <View style={styles.userInfoContainer}>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                padding: 32
                            }}>
                                <View>
                                    <Image style={[styles.icon, { alignSelf: 'flex-start' }]} source={require('../assets/img/ar-button.png')} />
                                </View>
                                <View style={{ flexDirection: 'row-reverse' }}>
                                    <TouchableWithoutFeedback onPress={() => { navigation.push("Settings") }}>
                                        <Image style={styles.icon} source={require('../assets/img/settings.png')} />
                                    </TouchableWithoutFeedback>

                                    <TouchableWithoutFeedback onPress={() => { navigation.push("Notifications", { id: userData._id, token: token }) }}>
                                        <Image style={styles.icon} source={userData.newNotifications
                                            ? require('../assets/img/notification-badge.png')
                                            : require('../assets/img/notification.png')} />
                                    </TouchableWithoutFeedback>

                                </View>
                            </View>
                            <View style={[styles.center, { flexDirection: 'row', marginTop: 16, marginBottom: "6%", marginLeft: 32 }]}>
                                <Image source={{ uri: userData.profilePhoto }} style={styles.image} />
                                <View style={{ marginLeft: 24 }}>
                                    <Text ellipsizeMode='tail' numberOfLines={2} style={{ fontFamily: "Roboto-Medium", fontSize: 20, marginLeft: 24, maxWidth: "75%" }}>Olá {userData.name}!</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={styles.infoContainer}>
                                            <Text style={{ color: "#00C6AE", fontSize: 14, fontFamily: "Roboto-Medium", marginBottom: 8 }}>Dinheiro doado</Text>
                                            <Text style={{ color: "#0D1B1E", fontSize: 20, fontFamily: "Roboto-Bold" }}>{Math.round(userData.points / 2000)}.00€</Text>
                                        </View>
                                        <View style={styles.infoContainer}>
                                            <Text style={{ color: "#00C6AE", fontSize: 14, fontFamily: "Roboto-Medium", marginBottom: 8 }}>Pontos</Text>
                                            <Text style={{ color: "#0D1B1E", fontSize: 20, fontFamily: "Roboto-Bold" }}>{Math.round(userData.points)}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.center, { flexDirection: 'row', marginTop: 32 }]}>

                            <TouchableWithoutFeedback onPress={() => { navigation.push("Ranking") }}>
                                <View style={[styles.buttonsContainer, { marginRight: 16 }]}>
                                    <View style={styles.button}>
                                        <Image style={styles.buttonImage} source={require("../assets/img/trophy_black.png")}></Image>
                                        <Text style={{ fontFamily: "Roboto-Bold", fontSize: 16, marginHorizontal: 16, color: "#0D1B1E" }}>Rankings</Text>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>

                            <TouchableWithoutFeedback onPress={() => {
                                if (quizAvailable) {
                                    navigation.push("QuizIntroduction")
                                }
                            }}>
                                <View style={styles.buttonsContainer}>
                                    <View style={styles.button}>
                                        <Image style={styles.buttonImage} source={quizAvailable ? require("../assets/img/quiz.png") : hours && require("../assets/img/timer.png")}></Image>
                                        {quizAvailable ? <Text style={{ fontFamily: "Roboto-Bold", fontSize: 16, marginLeft: 16, color: "#0D1B1E" }}>Quiz</Text>
                                            : hours ? <Text style={{ fontFamily: "Roboto-Bold", fontSize: 16, marginLeft: 16, color: "#0D1B1E" }}>{hours + ":" + minutes + ":" + seconds}</Text> : <Text style={{ fontFamily: "Roboto-Bold", fontSize: 16, marginLeft: 16, color: "#0D1B1E" }}>Loading...</Text>}
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>

                        </View>

                        <RewardsTab
                            tabs={['Recompensas', 'Minhas recompensas']}
                            currentIndex={tabIndex}
                            onChange={handleTabsChange}
                        />

                        {tabIndex == 0 && 
                            rewards.length == availableRewards &&
                            <View>
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                    marginHorizontal: 32
                                }}>

                                    <View style={{ flexDirection: 'row', backgroundColor: "#F1F1F1", padding: 8, borderRadius: 8, paddingHorizontal: 18 }}>
                                        <Image style={{ width: 24, height: 24, marginRight: 16 }} source={require("../assets/img/coin.png")}></Image>
                                        <Text style={{ fontFamily: "Roboto-Bold", fontSize: 16, color: "#0D1B1E" }}>{userData.coins}</Text>
                                    </View>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginHorizontal: 28,
                                }}>
                                    <FlatList
                                        data={rewards}
                                        keyExtractor={item => item.id}
                                        numColumns={3}
                                        renderItem={({ item }) => {
                                            return (
                                                <TouchableWithoutFeedback onPress={() => { navigation.push("Reward", { id: userData._id, userCoins: userData.coins, token: token, rewardId: item._id, rewardTitle: item.title, rewardSubtitle: item.subtitle, rewardPrice: item.price, rewardImage: item.image, claimed: false }) }}>
                                                    <View>
                                                        <View style={styles.rewardContainer}>
                                                            <Image source={{ uri: item.image }} style={styles.rewardImage}></Image>
                                                        </View>

                                                        <View style={{
                                                            flexDirection: "row",
                                                            alignContent: "space-between",
                                                            alignItems: "center"
                                                            , marginVertical: 12
                                                        }}>
                                                            <Image source={require("../assets/img/coin.png")} style={{ width: 14, height: 14, marginRight: 8 }}></Image>
                                                            <Text style={styles.price}>{item.price}</Text>
                                                        </View>
                                                        <View style={{
                                                            marginVertical: 12,
                                                            width: 105
                                                        }}>
                                                            <Text ellipsizeMode='tail' numberOfLines={2} style={styles.title}>{item.title}</Text>
                                                            <Text ellipsizeMode='tail' numberOfLines={1} style={styles.subtitle}>{item.subtitle}</Text>
                                                        </View>
                                                    </View>
                                                </TouchableWithoutFeedback>
                                            );
                                        }}
                                    />
                                </View>
                            </View>}

                        {tabIndex == 1 &&
                            rewardsLength == numberOfRewards &&
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                margin: 28,

                            }}>
                                <FlatList
                                    data={userRewards}
                                    keyExtractor={item => item.id}
                                    numColumns={3}
                                    renderItem={({ item }) => {
                                        return (
                                            <TouchableWithoutFeedback onPress={() => { navigation.push("Reward", { id: userData._id, userCoins: userData.coins, token: token, rewardId: item._id, rewardTitle: item.title, rewardSubtitle: item.subtitle, rewardPrice: item.price, rewardImage: item.image, claimed: true }) }}>
                                                <View>
                                                    <View style={styles.rewardContainer}>
                                                        <Image source={{ uri: item.image }} style={styles.rewardImage}></Image>
                                                    </View>

                                                    <View style={{
                                                        flexDirection: "row",
                                                        alignContent: "space-between",
                                                        alignItems: "center"
                                                    }}>
                                                        <Image source={require("../assets/img/coin.png")} style={{ width: 14, height: 14, marginRight: 8 }}></Image>
                                                        <Text style={styles.price}>{item.price}</Text>
                                                    </View>
                                                    <View style={{
                                                        marginVertical: 16,
                                                        width: 105
                                                    }}>
                                                        <Text ellipsizeMode='tail' numberOfLines={2} style={styles.title}>{item.title}</Text>
                                                        <Text ellipsizeMode='tail' numberOfLines={1} style={styles.subtitle}>{item.subtitle}</Text>
                                                    </View>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        );
                                    }}
                                />
                            </View>
                        }
                         {tabIndex == 0 &&
                           availableRewards == 0 &&
                            <NoMoreRewards />
                        } 

                        {tabIndex == 1 &&
                            numberOfRewards == 0 &&
                            <EmptyUserRewards/>
                        }



                    </SafeAreaView>
                </ScrollView>
                : <Loading />}

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
    },

    image: {
        width: 80,
        height: 80,
        borderRadius: 50,
        resizeMode: "contain"
    },

    rewardImage: {
        width: 90,
        height: 90,
        resizeMode: "contain"
    },

    icon: {
        width: 28,
        height: 28,
        marginHorizontal: 8,
    },

    center: {
        justifyContent: 'center',
        alignItems: 'center',
        //marginTop: 32
    },

    userInfoContainer: {
        backgroundColor: "#F3F3F3",
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        paddingBottom: 8
    },

    buttonsContainer: {
        backgroundColor: "#78DBD2",
        justifyContent: 'center',
        width: "42%",
        borderRadius: 8,
        padding: 16,
    },

    buttonImage: {
        width: 32,
        height: 32,
        resizeMode: 'contain',
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContainer: {
        padding: 24
    },
    rewardContainer: {
        alignItems: "center",
        flexGrow: 0,
        padding: 20,
        margin: 6,
        height: 100,
        width: 100,
        borderRadius: 8,
    },
    title: {
        fontFamily: "Roboto-Bold",
        fontSize: 14,
        color: "#0D1B1E"
    },
    subtitle: {
        fontFamily: "Roboto-Medium",
        fontSize: 12,
        color: "#00C6AE"
    },
    price: {
        fontFamily: "Roboto-Medium",
        fontSize: 13,
        color: "#0D1B1E"
    }
});

export default Dashboard;

