import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableWithoutFeedback, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FAB, Portal, } from 'react-native-paper';
import Loading from '../components/Loading'


const GroupsRanking = ({ navigation }) => {
    const [userData, setUserData] = useState();
    const [state, setState] = useState({ open: false });
    const [userGroups, setUserGroups] = useState([])
    const [numberOfGroups, setNumberOfGroups] = useState()
    const [groupLength, setGroupLength] = useState()

    let token
    let groupInfo = []

    const onStateChange = ({ open }) => setState({ open });

    const { open } = state;

    useEffect(() => {
        const retrieveData = async () => {
            let data = await AsyncStorage.getItem('user_data');
            if (data) {
                setUserData(JSON.parse(data))
                token = JSON.parse(data).token
                /* Get the ids of the groups the user belongs to */
                getUserGroups(`https://covidapptf.herokuapp.com/users/${JSON.parse(data)._id}`)
            } else {
                navigation.replace("Login")
            }
        }
        retrieveData()
    }, []);

    const getUserGroups = (url) => {
        fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
            .then(response => response.json())
            .then(json => {
                setNumberOfGroups(json.user.groups.length)
                json.user.groups.map(group => {
                    getGroup(`https://covidapptf.herokuapp.com/groups/${group}`) 
                })
            })
            .catch((error) => console.log(error))
    }

    const getGroup = (url) => {
        fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        }).then(response => response.json())
            .then(json => {
                console.log(json.info);
                if (json.success) {
                    json.info.map(group => {
                        let groupObject = {
                            name: group.name.charAt(0).toUpperCase() + group.name.slice(1),
                            id: group._id,
                            admin: group.admin,
                            requests: group.requests,
                        }
                        groupInfo.push(groupObject)
                    })
                    groupInfo.sort((a, b) => {
                        return a.name > b.name
                    })
                    setGroupLength(groupInfo.length)
                    setUserGroups(groupInfo)
                } else {
                    console.log("Error finding group");
                }
            })
            .catch((error) => console.log(error))
    }

    return (
        <ScrollView>

            { groupLength == numberOfGroups ?
                userGroups.map(group => {
                    return (
                        <View key={group.id}>
                            <TouchableWithoutFeedback onPress={() => {
                                navigation.replace("GroupInfo", { groupId: group.id, groupName: group.name, admin: group.admin, userId: userData._id, requests: group.requests, token: userData.token })
                            }}>
                                <View style={styles.groupContainer}>
                                    <Text style={styles.groupName}>{group.name}</Text>
                                    <Image style={styles.image} source={require("../assets/img/forward-red.png")}></Image>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    )
                })
                : numberOfGroups == 0 ? <View></View> : <Loading />}

            { numberOfGroups == 0 &&
                <View style={styles.imageView}>
                    <Image source={require('../assets/img/no-groups.png')} />
                </View>}

            <Portal theme={{
                colors: {
                    backdrop: 'transparent',
                },
            }}>
                <FAB.Group
                    fabStyle={{ backgroundColor: "#F9825F" }}
                    open={open}
                    icon={open ? 'close' : 'plus'}
                    color='#F1F1F1'
                    actions={[
                        {
                            icon: 'account-multiple-plus',
                            label: 'Cria um grupo',
                            color: '#F9825F',
                            onPress: () => { navigation.replace("CreateGroup") },
                        },
                        {
                            icon: 'account-group',
                            label: 'Junta-te a um grupo',
                            color: '#F9825F',
                            onPress: () => { navigation.replace("JoinGroup") },
                        }
                    ]}
                    onStateChange={onStateChange}
                />
            </Portal>
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

    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
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

});

export default GroupsRanking;
