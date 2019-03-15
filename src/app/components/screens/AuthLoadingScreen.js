import React, { Component } from 'react';
import { View, ActivityIndicator, StatusBar, AsyncStorage } from 'react-native';
import { AuthLoadingScreenStyle } from '../../Styles';

class AuthLoadingScreen extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.bootstrapAsync();
    }

    // Fetch the token from storage then navigate to our appropriate place
    bootstrapAsync = async () => {

        let walkthroughDone = await AsyncStorage.getItem('walkthroughDone');
        if (!walkthroughDone) {
            this.props.navigation.navigate('Walkthrough');
            return null;
        }

        const token = await AsyncStorage.getItem('token');
        const result = (token) ? await this.props.screenProps.onLogin({ token }) : false;
        this.props.navigation.navigate(result ? 'AppStackNavigator' : 'AuthStackNavigator');
    };

    render() {
        return (
            <View style={AuthLoadingScreenStyle.activityIndicatorContainer}>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}


export default AuthLoadingScreen;