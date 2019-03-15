import React, { Component } from 'react';
import { AsyncStorage, Text, View, Image, TouchableOpacity } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { WalkthroughScreenStyle, CustomHeaderStyle, GeneralStyle } from '../../Styles';


class WalkthroughScreen extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft:
                <View style={{ marginLeft: 15, }}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Icon name="arrow-back" style={GeneralStyle.iconStyle} />
                    </TouchableOpacity>
                </View>,
            headerTitle:
                <View style={CustomHeaderStyle.headerContainer}>
                    <View style={CustomHeaderStyle.searchbarContainer}>
                        <Text style={CustomHeaderStyle.headerTitle}>
                            Intro
                        </Text>
                    </View>
                </View>,
            headerStyle: {
                backgroundColor: '#a32729',
            }
        };
    };

    constructor(props) {
        super(props);

        this.state = {};
    }


    async onDone() {
        await AsyncStorage.setItem('walkthroughDone', true.toString());
        if (this.props.navigation.getParam('fromSettings', null))
            this.props.navigation.navigate('SettingsScreen');
        else
            this.props.navigation.navigate('AuthStackNavigator');
    }


    renderSlide = props => {
        return (
            <View
                style={[WalkthroughScreenStyle.mainContent, {
                    paddingTop: props.topSpacer,
                    paddingBottom: props.bottomSpacer,
                    width: props.width,
                    height: props.height,
                }]}>
                {(props.key === '1') ?  //se la schermata è la prima, mostra il logo
                    <View style={WalkthroughScreenStyle.imageContainer}>
                        <Image
                            source={props.image}
                            resizeMode='contain'
                            style={WalkthroughScreenStyle.imageStyle} />
                    </View>
                    :
                    <Icon name={props.icon} size={300} />}
                <Text style={WalkthroughScreenStyle.title}>{props.title}</Text>
                <Text style={WalkthroughScreenStyle.text}>{props.text}</Text>
            </View>
        );
    }

    renderNextButton = () => {
        return (
            <View>
                <Icon
                    name="arrow-forward"
                    color="black"
                    size={24}
                    style={WalkthroughScreenStyle.nextButtonIcon}
                />
            </View>
        );
    };

    renderDoneButton = () => {
        return (
            <View>
                <Icon
                    name="check"
                    size={24}
                    color="black"
                    style={WalkthroughScreenStyle.doneButtonIcon}
                />
            </View>
        );
    };

    render() {
        return (
            <AppIntroSlider
                slides={slides}
                renderItem={this.renderSlide}
                onDone={() => { this.onDone(); }}
                renderDoneButton={this.renderDoneButton}
                renderNextButton={this.renderNextButton}
            />
        );
    };

}

const slides = [
    {
        key: '1',
        title: 'Benvenuto',
        text: "Crea dei promemoria per le tue scadenze",
        icon: 'event-note',
    },
    {
        key: '2',
        title: 'Dividi in gruppi',
        text: "Puoi creare delle categorie per suddividere le tue scadenze",
        icon: 'insert-drive-file',
    },
    {
        key: '3',
        title: 'Ricevi le notifiche',
        text: "Puoi sempre disattivarle dal menu Impostazioni",
        icon: 'notifications',
    },
];

export default WalkthroughScreen;