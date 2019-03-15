import React, { Component } from 'react';
import { ActivityIndicator, Button, Text, TextInput, AsyncStorage, TouchableOpacity, View } from 'react-native';
import { GeneralStyle, LoginScreenStyle } from '../../Styles';


class LoginScreen extends Component {
    static navigationOptions = {
        headerTitle: 'Scadenziario',
        headerStyle: {
            backgroundColor: '#6200EE',
        },
        headerTitleStyle: { color: 'white', },
    };

    constructor(props) {
        super(props);

        this.state = { username: '', password: '', loginResult: undefined, fetchingData: false }
    }

    async componentDidMount() {
        this.setState({
            username: await AsyncStorage.getItem('username') || '',
            password: await AsyncStorage.getItem('password') || '',
        });
    }


    handleUsernameSubmit = text => {
        this.setState({ username: text });
    }

    handlePasswordSubmit = text => {
        this.setState({ password: text });
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.loginResult === true) {
            //se username e password sono giusti, salvali nel telefono per il prossimo accesso nel caso di scadenza del token
            AsyncStorage.setItem('username', nextState.username);
            AsyncStorage.setItem('password', nextState.password);
            this.props.navigation.navigate('AppStackNavigator');
            return false;
        }

        return true;
    }


    onLoginPress = async () => {
        this.setState({ fetchingData: true, });
        let loginResult = await this.props.screenProps.onLogin({ username: this.state.username, password: this.state.password });

        this.setState({ loginResult, fetchingData: false, });
    }

    render() {
        return (
            <View style={LoginScreenStyle.container}>
                <Text style={LoginScreenStyle.welcome}>Login</Text>
                <TextInput
                    placeholder='username'
                    style={LoginScreenStyle.input}
                    onChangeText={this.handleUsernameSubmit}
                    value={this.state.username} />
                <TextInput
                    secureTextEntry
                    placeholder='password'
                    style={LoginScreenStyle.input}
                    onChangeText={this.handlePasswordSubmit}
                    value={this.state.password} />
                {(this.state.loginResult === false) ?
                    <Text style={LoginScreenStyle.invalidData}>Dati errati</Text> :
                    null}
                {this.state.fetchingData ?
                    <ActivityIndicator /> :
                    <Button color='#6200EE' onPress={() => this.onLoginPress()} title="Accedi" />}
            </View >
        );
    }
}

export default LoginScreen;