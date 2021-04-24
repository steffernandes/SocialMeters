import AsyncStorage from '@react-native-async-storage/async-storage';
let data;
const currentUserData = {

    getCurrentUser: async () => {
        try {
            const value = await AsyncStorage.getItem('user_data');
            if (value !== null) {
                data = value;
            } else {
                console.log("no user data");
                data = true;
            }
        } catch (error) {
            // Error retrieving data
        }
        return data;
    },

    getVibrationValue: async () => {
        try {
            const value = await AsyncStorage.getItem('vibration');
            if (value !== null) {
                data = JSON.parse(value);
            } else {
                console.log("item doesn't exist in assync storage");
            }
        } catch (error) {
            // Error retrieving data
        }
        return data;
    },

    setUserData: async (value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('user_data', jsonValue)
        } catch (e) {
            // save error
        }
    },

    setUserContacts: async () => {
        try {
            await AsyncStorage.setItem('user_contacts', 0)
        } catch (e) {
            // save error
        }
    },

    setVibration: async (value) => {
        try {
            await AsyncStorage.setItem('vibration', value)
        } catch (e) {
            // save error
        }
    }

}

export default currentUserData;