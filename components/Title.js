
import React from 'react';
import {
    Text
} from 'react-native';

class Title extends React.Component {
    render() {
        return (
            <Text style={{
                marginBottom: 18,
                fontSize: 32,
                color: "#0D1B1E",
                fontFamily: "Roboto-Black",
                
            }}>
                {this.props.children}
            </Text>
        );
    }
}

export default Title;