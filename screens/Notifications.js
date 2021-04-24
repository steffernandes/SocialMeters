import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, Image, TouchableWithoutFeedback } from 'react-native';
import TitleWithCloseButton from '../components/TitleWithCloseButton'
import Loading from '../components/Loading'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import currentUserData from "../utils/userData"


class NoNotifications extends React.Component {
    render() {
        return (
            <View style={styles.imageView}>
                <Image source={require('../assets/img/no-notifications.png')} />
            </View>
        );
    }
}

function Notifications({ route, navigation }) {
    const [notifications, setNotification] = useState([])
    const [loading, setLoading] = useState(true)
    const { id, token } = route.params;

    useEffect(() => {
        updateUser(`https://covidapptf.herokuapp.com/users/${id}`)
        /* updateUser(`http://10.0.2.2:3000/users/${id}`) */
        updateNewNotifications(`https://covidapptf.herokuapp.com/users/${id}/notifications`, {
            operationType: "notificationsChecked"
        })
    }, [id])

    const updateUser = (url) => {
        fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        }).then(response =>
            response.json()
        ).then(data => {
            if (data) {
                /* Verificar se existem erros */
                if (data.success) {
                    if (data.user.notifications.length == 0) setLoading(false)
                    setNotification(data.user.notifications);
                    setLoading(false)
                } else {
                    alert("Erro a atualizar os dados do utilizador")
                }

            }
        })
    }

    const updateNewNotifications = (url, data) => {
        fetch(url, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
              "Authorization": token
            },
            credentials: "same-origin"
          }).then(response =>
            response.json()
          ).then(data => {
            if (data) {

            }
          }).catch(function (error) {
            throw error;
          });
        }

    return (
        <ScrollView>
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor="#F9F9F9" barStyle="dark-content" />

                <TitleWithCloseButton navigation={navigation} goToPage="Dashboard" title="Notificações"></TitleWithCloseButton>

                {!loading ? notifications.length > 0 ?
                    notifications.reverse().map((notification, index) =>
                        <View key={index} style={styles.notificationContainer}>
                                <Text style={styles.notificationText}>{notification.title}</Text>
                           
                        </View>

                    )
                    : <NoNotifications /> : <Loading />}

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
    notificationText: {
        fontSize: 16,
        fontFamily: "Roboto-Medium",
        marginVertical: 8,

    },
    notificationContainer: {
        flexDirection: 'row',
        //flex: 1,
        justifyContent: 'space-between',
        backgroundColor: "#F3F3F3",
        borderRadius: 8,
        marginVertical: 8,
        padding: 8,
        paddingLeft: 16
    },
    image: {
        width: 24,
        height: 24, 
        marginTop: "45%" 
    },
    imageView: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: "25%"
    }

});

export default Notifications;
