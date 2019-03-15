import React from 'react';
import { createAppContainer, createDrawerNavigator, createStackNavigator, createSwitchNavigator } from 'react-navigation';
import AuthLoadingScreen from './components/screens/AuthLoadingScreen';
import HomeScreen from './components/screens/HomeScreen';
import LoginScreen from './components/screens/LoginScreen';
import NewTransactionScreen from './components/screens/NewTransactionScreen';
import WalkthroughScreen from './components/screens/WalkthroughScreen';


const HomeNav = createDrawerNavigator({
    'Home': createStackNavigator({
        HomeScreen,
        NewTransactionScreen,
    }, { initialRouteName: 'HomeScreen' }),
    'Esci': ({ navigation, screenProps }) => {
        screenProps.logout();
        navigation.navigate('AuthStackNavigator');
        return null;
    }
}, { initialRouteName: 'Home', contentOptions: { activeTintColor: '#6200EE' }, }); //default:'Home', modificare solo per debuggare velocemente 


const DummyAuthStackNavigator = createStackNavigator({ LoginScreen, }, { initialRouteName: 'LoginScreen' });
const AuthStackNavigator = ({ navigation, screenProps }) => <DummyAuthStackNavigator navigation={navigation} screenProps={{ onLogin: screenProps.onLogin }} />
AuthStackNavigator.router = DummyAuthStackNavigator.router;

const DummyAppStackNavigator = createStackNavigator({ HomeNav }, { headerMode: 'none', });
const AppStackNavigator = ({ navigation, screenProps }) =>
    <DummyAppStackNavigator navigation={navigation} screenProps={{
        data: screenProps.data,
        logout: screenProps.logout,
        transactionsUpdate: screenProps.transactionsUpdate,
        groupsUpdate: screenProps.groupsUpdate,
        appendNotification: screenProps.appendNotification,
    }} />;
AppStackNavigator.router = DummyAppStackNavigator.router;

const TopLevelNavigator = createSwitchNavigator({
    AuthLoadingScreen,
    AuthStackNavigator,
    AppStackNavigator,
    Walkthrough: WalkthroughScreen,
}, { initialRouteName: 'AuthLoadingScreen', });

export default AppContainer = createAppContainer(TopLevelNavigator);
