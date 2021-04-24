
import React from 'react';
import {
    Text
} from 'react-native';

class Subtitle extends React.Component {
    render() {
        return (
            <Text style={{
                fontSize: 18,
                color: "#0D1B1E",
                fontFamily: "Roboto-Black",
                marginTop: 24,
                marginBottom: 24
                
            }}>
                {this.props.children}
            </Text>
        );
    }
}

export default Subtitle;