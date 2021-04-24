import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, StyleSheet, Text, StatusBar } from 'react-native';
import TitleWithCloseButton from '../components/TitleWithCloseButton'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import {PageTab} from '../components/SegmentedControl';
import GroupsRanking from './GroupsRanking'
import NationalRanking from './NationalRanking'
import LocalRanking from './LocalRanking'

function Ranking({ navigation }) {
    const [userData, setUserData] = useState();
    const [state, setState] = useState({ open: false });
    const onStateChange = ({ open }) => setState({ open });

    const { open } = state;
    const [tabIndex, setTabIndex] = React.useState(0);
    const handleTabsChange = index => {
        setTabIndex(index);
    };

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


    return (
        <ScrollView>
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor="#F9F9F9" barStyle="dark-content" />

                <TitleWithCloseButton navigation={navigation} goToPage="Dashboard" title="Ranking"></TitleWithCloseButton>
                <View style={styles.center}>
                    <PageTab
                        tabs={['Grupos', 'Localidade', 'Nacional']}
                        currentIndex={tabIndex}
                        onChange={handleTabsChange}
                    />
                </View>

                {tabIndex == 0 ?

                    <GroupsRanking navigation={navigation} />
                    : tabIndex == 1 ? <LocalRanking/> : <NationalRanking/>}


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
});

export default Ranking;
