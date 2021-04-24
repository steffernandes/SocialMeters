
import React from 'react';
import { StyleSheet, View, Text } from "react-native";
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export default ListItem = ({ onPress, title }) => (
    <TouchableWithoutFeedback onPress={onPress} style={styles.view}>
        <Text style={styles.title}>{title}</Text>
    </TouchableWithoutFeedback>
);

const styles = StyleSheet.create({
   view:{
       borderBottomColor: "#F3F3F3",
       borderBottomWidth: 2,
       paddingVertical: 8,
   },
   title:{
    fontSize: 16,
    color: "#0D1B1E",
    fontFamily: "Roboto-Regular",
   }
});