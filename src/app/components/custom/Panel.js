import React, { Component } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';


class Panel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: false,
        };
    }

    toggle() {
        let initialValue = this.state.expanded ? this.state.maxHeight + this.state.minHeight : this.state.minHeight,
            finalValue = this.state.expanded ? this.state.minHeight : this.state.maxHeight + this.state.minHeight;

        this.setState({
            expanded: !this.state.expanded
        });

        this.state.animation.setValue(initialValue);
        Animated.spring(
            this.state.animation,
            {
                toValue: finalValue
            }
        ).start();
    }

    _setMaxHeight(event) {
        let maxHeight = event.nativeEvent.layout.height;
        this.setState({
            layoutLoaded: true,
            maxHeight,
        });
    }

    _setMinHeight(event) {
        let minHeight = event.nativeEvent.layout.height;
        this.setState({
            minHeight,
            layoutLoaded: true,
            animation: new Animated.Value(minHeight),
        });
    }

    render() {
        if (this.state.layoutLoaded === false)
            return null;
        else
            return (
                <Animated.View
                    style={[styles.container, { height: (this.state.animation) ? this.state.animation : null }]}>
                    <View
                        style={styles.titleContainer}
                        onLayout={(event) => this._setMinHeight(event)}>
                        <View>
                            {(this.state.expanded) ?
                                (this.props.expandedIcon) ? this.props.expandedIcon :
                                    <Icon.Button
                                        name="keyboard-arrow-up"
                                        style={this.props.iconStyle || styles.iconStyle}
                                        onPress={() => this.toggle()}>
                                        <Text
                                            style={this.props.titleStyle || styles.titleStyle}>
                                            {this.props.title}
                                        </Text>
                                    </Icon.Button>
                                :
                                (this.props.collapsedIcon) ? this.props.collapsedIcon :
                                    <Icon.Button
                                        name="keyboard-arrow-down"
                                        style={this.props.iconStyle || styles.iconStyle}
                                        onPress={() => this.toggle()}>
                                        <Text
                                            style={this.props.titleStyle || styles.titleStyle}>
                                            {this.props.title}
                                        </Text>
                                    </Icon.Button>
                            }
                        </View>
                        <View style={{ marginLeft: 5, }}>
                            <Icon.Button
                                name="add"
                                style={this.props.iconStyle || styles.iconStyle}
                                onPress={this.props.createGroup}>
                                <Text
                                    style={this.props.titleStyle || styles.titleStyle}>
                                    Crea gruppo
                            </Text>
                            </Icon.Button>
                        </View>
                    </View>

                    <View style={styles.body} onLayout={(event) => this._setMaxHeight(event)}>
                        {this.props.children}
                    </View>
                </Animated.View>
            );
    }
}

var styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        margin: 10,
        overflow: 'hidden',
        flexDirection: 'column'
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    iconStyle: {
        fontSize: 30,
        color: 'white',
    },
    titleStyle: {
        color: 'white',
    },
    body: {
        padding: 10,
    }
});

export default Panel;