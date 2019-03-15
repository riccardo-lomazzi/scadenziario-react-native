import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

class RoundButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let disabled = this.props.disabled;
        let iconName = this.props.iconName;
        return (
            <Icon
                reverse
                size={30}
                raised
                color="#6200EE"
                disabled={disabled}
                disabledStyle={{ backgroundColor: "#D1D5D8" }}
                name={iconName}
                onPress={() => this.props.onPress()}
            />
        );
    }
}

export default RoundButton;