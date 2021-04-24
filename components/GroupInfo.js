import React, { useState } from 'react';
import { StyleSheet, Image, View, Text, TouchableWithoutFeedback } from "react-native";
import { Button, Dialog, Portal, Modal, Snackbar, RadioButton } from 'react-native-paper';
import Clipboard from '@react-native-community/clipboard';

const leaveGroup = (members, groupId, userId, token, hideDialog, navigation, isDialog) => {

    if (members.length == 1) {
        leaveGroupHandler(`https://covidapptf.herokuapp.com/${groupId}/groups`, {}, token)
    }

    /* Remove the user id from the group members array */
    updates(`https://covidapptf.herokuapp.com/groups/${groupId}/members`, {
        operationType: "remove",
        userID: userId,
    }, token)

    /*   updates(`http://10.0.2.2:3000/groups/members/${groupId}`, {
          updatedMembers: updatedMembers
      }) */

    /* Remove the group id from the user's groups array */
    leaveGroupHandler(`https://covidapptf.herokuapp.com/users/${userId}/groups`, {
        operationType: "remove",
        groupID: groupId
    }, token)

    /* updates(`http://10.0.2.2:3000/users/groups/${userId}`, {
        updatedGroups: updatedGroups
    }) */
    if (isDialog) {
        hideDialog()
    }
    navigation.replace("Ranking")

}

const updates = (url, data, token) => {
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

const leaveGroupHandler = (url, data, token) => {
    fetch(url, {
        method: "DELETE",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        credentials: "same-origin"
    })
        .then(response => response.json())
        .then(data => {
        }).catch(function (error) {
            console.log(error.message);
            throw error;
        });
}

export const AdminView = ({ navigation, groupName, groupId, members, requests, userId, token }) => {
    const [visible, setVisible] = useState(false);
    const [checked, setChecked] = useState('');
    const [dialogVisible, setDialogVisible] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);

    const onToggleSnackBar = () => setSnackbarVisible(!snackbarVisible);

    const onDismissSnackBar = () => setSnackbarVisible(false);
    const showDialog = () => setDialogVisible(true);
    const hideDialog = () => setDialogVisible(false);

    const showModal = () => {
        if (members.length == 1) {
            showDialog()
        } else {
            setVisible(true);
        }
    }
    const hideModal = () => setVisible(false);

    const setAdmin = (newAdmin) => {
        if (newAdmin !== '') {
            updates(`https://covidapptf.herokuapp.com/groups/${groupId}/admin`, {
                newAdmin: newAdmin,
            }, token)

            /* Send notification to the new admin */
            updates(`https://covidapptf.herokuapp.com/users/${newAdmin}/notifications`, {
                notificationText: `Tornaste-te administrador(a) do grupo ${groupName}.`
            }, token)

            leaveGroup(members, groupId, userId, token, hideModal, navigation, false)
            hideModal()
        }
    }

    return (
        <View style={styles.infoContainer}>
            <View style={styles.rowContainer}>
                <View style={styles.row}>
                    <TouchableWithoutFeedback onPress={() => navigation.replace("Ranking")}>
                        <Image style={styles.goBack} source={require("../assets/img/backward-red.png")}></Image>
                    </TouchableWithoutFeedback>

                    <View style={[{ width: 125 }, styles.row]}>
                        <Text ellipsizeMode='tail' numberOfLines={1} style={styles.groupName}>{groupName}</Text>
                        <TouchableWithoutFeedback onPress={() => navigation.replace("ChangeGroupName", { groupId: groupId, members: members, requests: requests, groupName: groupName, token: token })}>
                            <Image style={styles.editIcon} source={require("../assets/img/edit.png")}></Image>
                        </TouchableWithoutFeedback>
                    </View>
                </View>

                <View style={styles.row}>
                    <TouchableWithoutFeedback onPress={() => navigation.replace("GroupMembers", { groupId: groupId, members: members, requests: requests, groupName: groupName, userID: userId })}>
                        <Image style={styles.icon} source={require("../assets/img/users.png")}></Image>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback onPress={() => { showModal() }}>
                        <Image style={styles.icon} source={require("../assets/img/exit-group.png")}></Image>
                    </TouchableWithoutFeedback>


                </View>
            </View>

            <View style={styles.rowContainer}>
                <TouchableWithoutFeedback onPress={() => {
                    Clipboard.setString(groupId)
                    onToggleSnackBar()
                }}>
                    <View style={[styles.row, { marginTop: 8 }]}>
                        <Image style={styles.clipboardIcon} source={require("../assets/img/copy-black.png")}></Image>
                        <Text ellipsizeMode='tail' numberOfLines={1} style={styles.groupId}>id: {groupId}</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>

            <Portal>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modal}>
                    <Text style={styles.subtitle}>Escolha um membro para ser o novo administrador do grupo.</Text>
                    {members.map((member, index) => {
                        return (

                            member.id !== userId &&
                            <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.memberName}>{member.name}</Text>
                                <RadioButton
                                    value={member.id}
                                    color="#F95A2C"
                                    status={checked === member.id ? 'checked' : 'unchecked'}
                                    onPress={() => setChecked(member.id)}
                                />
                            </View>


                        )
                    })
                    }
                    <TouchableWithoutFeedback onPress={() => { setAdmin(checked) }}>
                        <Text style={styles.button}>
                            Escolher
                            </Text>
                    </TouchableWithoutFeedback>

                </Modal>

                <Dialog visible={dialogVisible} onDismiss={() => { hideDialog() }}>
                    <Dialog.Title>Quer mesmo sair do grupo <Text style={{ color: "#F95A2C" }}>{groupName}</Text>?</Dialog.Title>
                    <Dialog.Actions>
                        <Button color={'#F95A2C'} onPress={() => { leaveGroup(members, groupId, userId, token, hideDialog, navigation, true) }}>Sim</Button>
                        <Button color={'#0D1B1E'} onPress={() => { hideDialog() }}>Não</Button>
                    </Dialog.Actions>
                </Dialog>

                <Snackbar
                    visible={snackbarVisible}
                    duration={2000}
                    onDismiss={onDismissSnackBar} >
                    O id do grupo foi copiado para a tua área de transferências.
                    </Snackbar>
            </Portal>
        </View>
    )
};

export const NormalMemberView = ({ navigation, groupName, groupId, userId, members, token }) => {
    const [visible, setVisible] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);

const onToggleSnackBar = () => setSnackbarVisible(!snackbarVisible);

const onDismissSnackBar = () => setSnackbarVisible(false);
    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);

    return (
        <View style={styles.infoContainer}>
            <View style={styles.rowContainer}>
                <View style={styles.row}>
                    <TouchableWithoutFeedback onPress={() => navigation.replace("Ranking")}>
                        <Image style={styles.goBack} source={require("../assets/img/backward-red.png")}></Image>
                    </TouchableWithoutFeedback>
                    <Text ellipsizeMode='tail' numberOfLines={1} style={[styles.groupName, { width: 150 }]}>{groupName}</Text>
                </View>

                <View>
                    <TouchableWithoutFeedback onPress={() => { showDialog() }}>
                        <Image style={styles.icon} source={require("../assets/img/exit-group.png")}></Image>
                    </TouchableWithoutFeedback>
                </View>



            </View>

            <View style={styles.rowContainer}>
                <TouchableWithoutFeedback onPress={() => {
                    Clipboard.setString(groupId.toString())
                    onToggleSnackBar()
                }}>
                    <View style={[styles.row, { marginTop: 8 }]}>
                        <Image style={styles.clipboardIcon} source={require("../assets/img/copy-black.png")}></Image>
                        <Text ellipsizeMode='tail' numberOfLines={1} style={styles.groupId}>id: {groupId}</Text>
                    </View>
                </TouchableWithoutFeedback>

            </View>
            <Portal>
                <Dialog visible={visible} onDismiss={() => { hideDialog() }}>
                    <Dialog.Title>Quer mesmo sair do grupo <Text style={{ color: "#F95A2C" }}>{groupName}</Text>?</Dialog.Title>
                    <Dialog.Actions>
                        <Button color={'#F95A2C'} onPress={() => { leaveGroup(members, groupId, userId, token, hideDialog, navigation, true) }}>Sim</Button>
                        <Button color={'#0D1B1E'} onPress={() => { hideDialog() }}>Não</Button>
                    </Dialog.Actions>
                </Dialog>

                <Snackbar
                    visible={snackbarVisible}
                    duration={2000}
                    onDismiss={onDismissSnackBar} >
                    O id do grupo foi copiado para a tua área de transferências.
                    </Snackbar>
            </Portal>
        </View>
    );
}

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',

    },

    infoContainer: {
        marginBottom: 32
    },

    icon: {
        height: 24,
        width: 24,
        resizeMode: 'stretch',
        marginHorizontal: 8
    },

    goBack: {
        height: 30,
        width: 30,
        resizeMode: 'stretch'
    },

    groupName: {
        fontSize: 20,
        fontFamily: "Roboto-Medium",
        color: "#F95A2C",
    },

    groupId: {
        fontSize: 16,
        fontFamily: "Roboto-Medium",
        color: "#0D1B1E",
        marginHorizontal: 8,
        width: 100
    },

    clipboardIcon: {
        height: 16,
        width: 16,
        marginLeft: 36,
        marginRight: 8,
        resizeMode: 'stretch',
    },

    editIcon: {
        height: 20,
        width: 20,
        resizeMode: 'stretch',
        marginHorizontal: 8,
        marginTop: 4
    },

    row: {
        flexDirection: 'row',
        paddingVertical: 2
    },
    modal: {
        width: "80%",
        alignSelf: 'center',
        padding: 32,
        backgroundColor: "#F1F1F1",
         minHeight: 200
    },
    subtitle: {
        fontSize: 18,
        color: "#F95A2C",
        marginBottom: 24
    },
    button: {
        marginTop: 30,
        fontSize: 16,
        fontFamily: "Roboto-Medium",
        color: "#0D1B1E",
        alignSelf: 'flex-end'
    },
    memberName: {
        fontSize: 16,
    }
});
