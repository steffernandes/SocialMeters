import {
    NativeEventEmitter,
    NativeModules,
    Platform,
    PermissionsAndroid,
    Vibration
} from 'react-native';

import DeviceInfo from 'react-native-device-info';
import BleManager from 'react-native-ble-manager';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
let contacts = 0
let runCounter = 0
let currentContacts = 0
const BluetoothTraking = {
    startScan: (userID, token) => {
        console.log(START_BLE_SCAN);
        START_BLE_SCAN = true
        /*   console.log(vibrationEnabled); */
        /* startScan: (token, userID) => { */
        BleManager.start({ showAlert: false }).then(() => {
            // Success code
            console.log("Module initialized");
        });

        bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
        //bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);

        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                if (result) {
                    console.log("Permission is OK");
                } else {
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                        if (result) {
                            console.log("User accept");
                        } else {
                            console.log("User refuse");
                        }
                    });
                }
            });
        }

        const updateUserPoints = (url, data) => {
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

        setInterval(() => {
            BleManager.scan([], 3, false).then((results) => {
                console.log('Scanning...');
                currentContacts = contacts
                handleDiscoverPeripheral(results)
            }).then(() => {
                if (runCounter == 30) {
                    console.log("points added")
                    if (currentContacts === contacts) {
                        updateUserPoints(`https://covidapptf.herokuapp.com/users/${userID}/points`, {
                            operationType: "add"
                        })
                    } else {
                        console.log("contacto");
                        runCounter = 0
                    }
                }
                runCounter += 1
            })

        }, 30000)

        function handleDiscoverPeripheral(peripheral) {
            
            if (peripheral  && peripheral.advertising.isConnectable) {
                let distance = Math.pow(10, ((-69 - (peripheral.rssi)) / (10 * 2))).toFixed(2);

                if (distance < 2) {
                    contacts++
                    console.log("number of contacts " + contacts);
                }
                if (contacts == 20) {
                    Vibration.vibrate()
                } else if (contacts == 40) {
                    console.log("points removed")
                    updateUserPoints(`https://covidapptf.herokuapp.com/users/${userID}/points`, {
                        operationType: "remove"
                    })
                    contacts = 0;
                }
            }
        }

    },

    saveContacts: async (contacts, token, userID) => {

        /*  const updateUserContacts = (url, data) => {
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
 
         updateUserContacts(`https://covidapptf.herokuapp.com/users/${userID}/contacts`, {
             contactsToAdd: 1
         })
 
         try {
             await AsyncStorage.setItem('user_contacts', contacts)
         } catch (e) {
             // save error
         } */
    },

    stopScan: () => {
        BleManager.stopScan().then(() => {
            // Success code
            console.log("Scan stopped");
        });
    },
    /* 
        disableVibration: () => {
            vibrationEnabled = false
        },
    
        enableVibration: () => {
            vibrationEnabled = true
        }, 
    
        getVibrationValue: () =>{
            return vibrationEnabled
        } */

}

export default BluetoothTraking;