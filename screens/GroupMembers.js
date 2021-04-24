import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, StyleSheet, Text, StatusBar, TouchableWithoutFeedback, Image, ScrollView } from 'react-native';
import TitleWithCloseButton from '../components/TitleWithCloseButton'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PageTab } from '../components/SegmentedControl';
import { Button, Dialog, Portal } from 'react-native-paper';

class NoRequests extends React.Component {
    render() {
        return (
            <View style={{marginTop: "25%"}}>
              <Text style={{fontFamily: "Roboto-Medium", fontSize: 18, textAlign: "center"}}>De momento não existem pedidos</Text>
              <Text style={{fontFamily: "Roboto-Regular", fontSize: 16, textAlign: "center", color:"#979797", marginTop: 8}}>Não te preocupes, se alguém quiser juntar-se a este grupo iremos avisar-te!</Text>
            </View>
        );
    }
}

class NoMembers extends React.Component {
    render() {
        return (
            <View style={{marginTop: "25%"}}>
              <Text style={{fontFamily: "Roboto-Medium", fontSize: 18, textAlign: "center"}}>De momento não existem membros para além de si</Text>
              <Text style={{fontFamily: "Roboto-Regular", fontSize: 16, textAlign: "center", color:"#979797", marginTop: 8}}>Não te preocupes, se alguém quiser juntar-se a este grupo iremos avisar-te!</Text>
            </View>
        );
    }
}

function GroupMembers({ route, navigation }) {
    const { groupId, members, requests, groupName, userID } = route.params
    members.sort((a, b) => {
        return a.name > b.name
    })

    requests.sort((a, b) => {
        return a.name > b.name
    })
    const [userData, setUserData] = useState();
    const [tabIndex, setTabIndex] = useState(0);
    const [visible, setVisible] = useState(false);
    const [id, setId] = useState();
    const [name, setName] = useState();
    const [groups, setGroups] = useState();
    const [membersList, setMembersList] = useState(members);
    const [requestData, setRequestData] = useState(requests)
    const [updatedMembersIds, setUpdatedMembersIds] = useState([])

    const handleTabsChange = index => {
        setTabIndex(index);
    };

    const showDialog = (memberName, memberId, memberGroups) => {
        setId(memberId);
        setName(memberName);
        setGroups(memberGroups);
        setVisible(true);
    }

    const hideDialog = () => setVisible(false);

    const deleteMember = (id) => {

        setMembersList(membersList.filter( (member) => {
            return member.id !== id // remove the removed user id from the list
        }))

        hideDialog()
        updates(`https://covidapptf.herokuapp.com/groups/${groupId}/members`, {
            operationType: "remove",
            userID: id
        })
        /* updates(`http://10.0.2.2:3000/groups/members/${groupId}`, {
            updatedMembers: updatedMembersIds
        }) */

        updates(`https://covidapptf.herokuapp.com/users/${id}/groups`, {
            operationType: "remove",
            groupID: groupId
        })

        /* Send notification to the removed member */
        updates(`https://covidapptf.herokuapp.com/users/${id}/notifications`, {
            notificationText: `Foste removido do grupo ${groupName}.`
        })
       /*  updates(`http://10.0.2.2:3000/users/groups/${id}`, {
            updatedGroups: updatedUserGroups
        })
       /*  updates(`http://10.0.2.2:3000/users/groups/${id}`, {
            updatedGroups: updatedUserGroups
        }) */

    }

    const rejectRequest = (memberId) => {

        setRequestData(requestData.filter(function (item) {
            return item.id !== memberId // remove the removed user id from the list
        }))

        updates(`https://covidapptf.herokuapp.com/groups/${groupId}/requests`, {
            operationType: "remove",
            userID: memberId
        })
        /* updates(`http://10.0.2.2:3000/groups/requests/${groupId}`, {
            operationType: "remove",
            userID: memberId
        })
 */
                
        /* Send a notification saying that the request was denied */
        updates(`https://covidapptf.herokuapp.com/users/${memberId}/notifications`, {
            notificationText: `O teu pedido de entrada no grupo ${groupName} foi recusado!`
        })
       /*  updates(`http://10.0.2.2:3000/users/notifications/${memberId}`, {
            notificationText: `O teu pedido de entrada no grupo ${groupName} foi recusado.`
        })*/
    } 

    const acceptRequest = (memberId, memberName) => {

        let newMembersList = [...membersList]
        newMembersList.push({id: memberId, name: memberName.charAt(0).toUpperCase() + memberName.slice(1)})
        newMembersList.sort((a, b) => {
            return a.name > b.name
        })
        setMembersList(newMembersList)

        /* Delete user id from requests */
        setRequestData(requestData.filter(function (item) {
            return item.id !== memberId // remove the removed user id from the list
        }))

        updates(`https://covidapptf.herokuapp.com/groups/${groupId}/requests`, {
            operationType: "remove",
            userID: memberId
        })
        /* updates(`http://10.0.2.2:3000/groups/requests/${groupId}`, {
            operationType: "remove",
            userID: memberId
        }) */

        updates(`https://covidapptf.herokuapp.com/groups/${groupId}/members`, {
            operationType: "add",
            userID: memberId
        })
        /* updates(`http://10.0.2.2:3000/groups/members/${groupId}`, {
            operationType: "add",
            userID: memberId
        }) */

        updates(`https://covidapptf.herokuapp.com/users/${memberId}/groups`, {
            operationType: "add",
            groupID: groupId
        })
        /* updates(`http://10.0.2.2:3000/users/groups/${memberId}`, {
            updatedGroups: groups
        })
        /* updates(`http://10.0.2.2:3000/users/groups/${memberId}`, {
            updatedGroups: groups
        }) */

        
        /* Send a notification saying that the request was accepted */
        updates(`https://covidapptf.herokuapp.com/users/${memberId}/notifications`, {
            notificationText: `O teu pedido de entrada no grupo ${groupName} foi aceite!`
        })
       /*  updates(`http://10.0.2.2:3000/users/notifications/${memberId}`, {
            notificationText: `O teu pedido de entrada no grupo ${groupName} foi aceite!`
        }) */
    }

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

    const updates = (url, data) => {
        fetch(url, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Authorization": userData.token
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
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor="#F9F9F9" barStyle="dark-content" />
                <TitleWithCloseButton navigation={navigation} goToPage="Ranking" title="Membros"></TitleWithCloseButton>
                <View style={styles.center}>
                    <PageTab
                        tabs={['Membros', 'Pedidos']}
                        currentIndex={tabIndex}
                        onChange={handleTabsChange}
                    />
                </View>

                {tabIndex == 0 ?
                membersList.length != 1 ?
                    membersList.map((member, index) => {
                        if (member.id != userID) {
                        return (
                            <View key={index} style={styles.memberContainer}>
                                <Text style={styles.memberName}>{member.name}</Text>
                                <TouchableWithoutFeedback onPress={() => showDialog(member.name, member.id, member.groups)}>
                                    <Image style={styles.image} source={require("../assets/img/trash.png")}></Image>
                                </TouchableWithoutFeedback>
                            </View>
                        )}
                    }) : <NoMembers/>
                    :

                    requestData.length > 0 ?
                    requestData.map((member, index) => {
                        return (
                            <View key={index} style={styles.memberContainer}>
                                <Text style={styles.memberName}>{member.name}</Text>
                                <View style={styles.row}>
                                    <TouchableWithoutFeedback onPress={() => rejectRequest(member.id)}>
                                        <Image style={styles.icon} source={require("../assets/img/reject-request.png")}></Image>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback onPress={() => acceptRequest(member.id, member.name)}>
                                        <Image style={styles.icon} source={require("../assets/img/accept-request.png")}></Image>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                        )
                    }) : <NoRequests/>
                }

                <Portal>
                    <Dialog visible={visible} onDismiss={hideDialog}>
                        <Dialog.Title>Quer mesmo eliminar <Text style={{ color: "#F95A2C" }}>{name} </Text>do grupo?</Dialog.Title>
                        <Dialog.Actions>
                            <Button color={'#F95A2C'} onPress={() => { deleteMember(id) }}>Sim</Button>
                            <Button color={'#0D1B1E'} onPress={hideDialog}>Não</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>


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
        flex: 1
    },

    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    memberName: {
        fontSize: 16,
        fontFamily: "Roboto-Regular",
        color: "#0D1B1E"
    },
    memberContainer: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        borderRadius: 12,
        backgroundColor: "#F1F1F1",
        padding: 16,
        marginVertical: 8
    },
    image: {
        height: 18,
        width: 18,
        resizeMode: 'contain',
        marginHorizontal: 8
    },
    icon: {
        height: 24,
        width: 24,
        resizeMode: 'contain',
        marginHorizontal: 8
    },
    row: {
        flexDirection: 'row',

    }


});

export default GroupMembers;
