
import React from 'react';
import {
    ActivityIndicator, View , StyleSheet
} from 'react-native';

class Loading extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#78DBD2" />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center"
    }
  });
  
export default Loading;