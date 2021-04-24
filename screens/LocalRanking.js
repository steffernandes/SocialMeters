import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, StatusBar, Image, SafeAreaView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../components/Loading'

class NoNearbyUsers extends React.Component {
    render() {
        return (
            <View style={{marginTop: "25%"}}>
              <Text style={{fontFamily: "Roboto-Medium", fontSize: 18, textAlign: "center"}}>De momento não existem utilizadores perto de si</Text>
            </View>
        );
    }
}

function LocalRanking() {
    const [userData, setUserData] = useState();
    const [membersData, setMembersData] = useState([])
    const [membersCounter, setMembersCounter] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    let middleMembersData = []
   
    useEffect(() => {
        const retrieveData = async () => {
            let data = await AsyncStorage.getItem('user_data');
            if (data) {
                setUserData(JSON.parse(data))
                getUsersData(`https://covidapptf.herokuapp.com/users/`, JSON.parse(data).token, JSON.parse(data).location)
            } else {
                navigation.replace("Login")
            }
        }
        retrieveData()
    }, []);

    const getUsersData = (url, token, userLocation) => {
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
                json.map((user) => {
                    if (user.location == userLocation) {
                        let userObject = {
                            id: user._id,
                            name: user.name,
                            points: user.points
                        }
                        middleMembersData.push(userObject)
                    }
                })
                middleMembersData.sort((a, b) => {
                    return b.points - a.points
                })
                setMembersCounter(middleMembersData.length)
                setMembersData(middleMembersData)
                setIsLoading(false)
            })
            .catch((error) => console.log(error))
    }

    return (
        <SafeAreaView >
            <StatusBar backgroundColor="#F9F9F9" barStyle="dark-content" />

            {membersCounter > 0 ?
                <View style={{ paddingBottom: 16 }}>
                   {membersData.map((member, index) => {
                        return (
                            <View style={styles.userContainer} key={index}>
                                <View style={styles.grid}>
                                    <View style={styles.row}>
                                        <View style={styles.row}>
                                        <Text style={member.id != userData._id ? styles.ranking : styles.currentUserRanking}>{index + 1}</Text>
                                            <Image source={{ uri: userData.profilePhoto }} style={styles.image} />
                                            <View>
                                                <Text style={styles.memberName}>{member.name}</Text> 
                                                <Text style={member.id != userData._id ? styles.points : styles.currentUserPoints}>{Math.round(member.points)}</Text>
                                         
                                            </View>
                                        </View>

                                        {
                                            index <= 2 && <View style={{ alignItems: 'flex-end' }}>
                                                <Image source={index == 0 ? require("../assets/img/first_place.png") : index == 1 ? require("../assets/img/second_place.png") : index == 2 && require("../assets/img/third_place.png")} style={styles.trophy} />
                                            </View>
                                        }

                                    </View>
                                </View>
                            </View>
                        )
                    })}

                </View>

                : isLoading ? <Loading /> : membersCounter == 0 && <NoNearbyUsers/>}
        </SafeAreaView>
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

    memberName: {
        fontFamily: "Roboto-Regular", fontSize: 14, color: "#F95A2C"
    },

    points: { 
        fontFamily: "Roboto-Medium", fontSize: 22, color: "#0D1B1E"
    },

    userContainer: {
        borderRadius: 12,
        backgroundColor: "#F1F1F1",
        padding: 16,
        marginVertical: 8,
    },
    grid: {
        flex: 1,
        // justifyContent: 'flex-start'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    image: {
        height: 40,
        width: 40,
        resizeMode: 'contain',
        marginHorizontal: 16
    },
    trophy: {
        height: 32,
        width: 32,
        resizeMode: 'contain',
        marginHorizontal: 16
    },
    ranking: {
        fontFamily: "Roboto-Bold",
        fontSize: 16,
        paddingTop: "4%",
        color: "#0D1B1E"
    },
    currentUserRanking: {
        fontFamily: "Roboto-Bold",
        fontSize: 16,
        paddingTop: "4%",
        color: "#F95A2C"
    },
    currentUserPoints: {
        fontFamily: "Roboto-Medium",
        fontSize: 22,
        color: "#F95A2C"
    },
    points: {
        fontFamily: "Roboto-Medium",
        fontSize: 22,
        color: "#0D1B1E"
    },
});

export default LocalRanking;
