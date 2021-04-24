/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  StyleSheet,
  Image,
} from 'react-native';


const NoConnection = () => {
  
  return (
    <>
           <Image style={styles.centerImage} source={require('../assets/img/sem_internet.png')} />
    </>
  );
};

const styles = StyleSheet.create({

  body: {
    backgroundColor: "#F9F9F9",
  },
  centerImage: {
    display: "flex",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop:"10%",
    width: "100%"
  },

});

export default NoConnection;
