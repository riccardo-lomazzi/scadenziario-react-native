import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ListItemStyle } from '../../Styles';

class ListItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableOpacity
                onPress={() => this.props.onPress(this.props.item)}
                onLongPress={() => this.props.onLongPress(this.props.item)}
                style={[ListItemStyle.container, this.props.containerStyle]}>
                <View style={ListItemStyle.leftSide}>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={this.props.titleStyle}>{this.props.title}</Text>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={this.props.subtitleStyle}>{this.props.subtitle}</Text>
                </View>
                <View style={ListItemStyle.rightSide}>
                    <Text style={this.props.rightTitleStyle}>
                        {this.props.rightTitle}
                    </Text>
                    {(this.props.chevron) ?
                        <View style={ListItemStyle.chevron}>
                            <Text>></Text>
                        </View>
                        :
                        null}
                </View>
            </TouchableOpacity>
        );
    }
};

export default ListItem;