import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, StatusBar, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import { AdminView, NormalMemberView } from '../components/GroupInfo'
import Loading from '../components/Loading'

function GroupInfo({ route, navigation }) {
    const [userData, setUserData] = useState();
    const [membersData, setMembersData] = useState([])
    const [requests, setRequests] = useState([])
    const [numberOfMembers, setNumberOfMembers] = useState()
    const [undefinedMembers, setUndefinedMembers] = useState(0)
    const [membersCounter, setMembersCounter] = useState()
    const { groupId, admin, userId, groupName, token } = route.params;
    let middleMembersData = []
    let middleRequestData = []
    let undefinedMembersCounter = 0

    useEffect(() => {
        const retrieveData = async () => {
            let data = await AsyncStorage.getItem('user_data');
            if (data) {
                setUserData(JSON.parse(data))
                getGroupMembers(`https://covidapptf.herokuapp.com/groups/${groupId}`)
            } else {
                navigation.replace("Login")
            }
        }
        retrieveData()
    }, []);


    const getGroupMembers = (url) => {
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
                setNumberOfMembers(json.info[0].members.length)
                json.info[0].requests.map(userID => {
                    getUserData(`https://covidapptf.herokuapp.com/users/${userID}`, "request")
                    /* getUserData(`http://10.0.2.2:3000/users/${userID}`) */
                })

                json.info[0].members.map(userID => {
                    getUserData(`https://covidapptf.herokuapp.com/users/${userID}`, "member")
                    /*  getUserData(`http://10.0.2.2:3000/users/${userID}`, "member") */
                })
                return () => getGroupMembers.close();
            })
            .catch((error) => console.log(error))
    }

    const getUserData = (url, userType) => {
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
                console.log(json);
                if (json.success) {
                    if (userType == "member") {
                        let userObject = {
                            id: json.user._id,
                            name: json.user.name.charAt(0).toUpperCase() + json.user.name.slice(1),
                            points: json.user.points,
                            groups: json.user.groups,
                        }
                        middleMembersData.push(userObject)
                        middleMembersData.sort((a, b) => {
                            return b.points - a.points
                        })
                        setMembersCounter(middleMembersData.length)
                        setMembersData(middleMembersData)
                    } else {
                        let requestData = {
                            id: json.user._id,
                            name: json.user.name.charAt(0).toUpperCase() + json.user.name.slice(1),
                            groups: json.user.groups
                        }
                        middleRequestData.push(requestData)
                        setRequests(middleRequestData)
                    }
                } else {
                    undefinedMembersCounter += 1
                    setUndefinedMembers(undefinedMembersCounter);
                }

            })
            .catch((error) => console.log(error))
    }

    return (
        <ScrollView style={styles.container}>
            <StatusBar backgroundColor="#F9F9F9" barStyle="dark-content" />
            {userId === admin ? <AdminView navigation={navigation} groupName={groupName} groupId={groupId} members={membersData} requests={requests} userId={userId} token={token} /> : <NormalMemberView navigation={navigation} groupName={groupName} groupId={groupId} members={membersData} userId={userId} members={membersData} token={token} />}

            {membersCounter === (numberOfMembers - undefinedMembers) ?
                <View style={{ paddingBottom: 64 }}>
                    {membersData.map((member, index) => {
                        return (
                            <View key={index} style={styles.groupContainer}>
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

                : <Loading />}
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

    memberName: {
        fontFamily: "Roboto-Regular",
        fontSize: 14,
        color: "#F95A2C"
    },

    points: {
        fontFamily: "Roboto-Medium",
        fontSize: 22,
        color: "#0D1B1E"
    },

    groupContainer: {
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
});

export default GroupInfo;
