import React, { useState } from 'react';
import { StyleSheet, Image, View } from "react-native";
import { Button, Paragraph, Dialog, Portal } from 'react-native-paper';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Title from '../components/Title'


export default TitleWithCloseButton = ({ navigation, title, goToPage }) => {
    const [visible, setVisible] = useState(false);
    const showDialog = () => setVisible(true);

    const hideDialog = () => setVisible(false);

    return (
        <View style={styles.viewContainer}>
            <Title>{title}</Title>
            <TouchableWithoutFeedback onPress={() => {
                if (title == "Questionário") {
                    showDialog()
                } else  {
                    navigation.replace(goToPage)
                }
            }
            }>
                <Image
                    style={styles.close}
                    source={require('../assets/img/close-button.png')}
                />
            </TouchableWithoutFeedback>

            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>Queres mesmo abandonar o quiz?</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>Se saires agora não vais receber as moedas que ganhaste</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button color={'#F95A2C'} onPress={() => {
                            hideDialog()
                            navigation.replace(goToPage)
                        }}>Sim</Button>
                        <Button color={'#0D1B1E'} onPress={hideDialog}>Não</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

        </View>
    );
}



const styles = StyleSheet.create({
    viewContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32
    },

    close: {
        padding: 16,
        margin: 8,
        height: 16,
        width: 16,
        resizeMode: 'stretch',
    },
});