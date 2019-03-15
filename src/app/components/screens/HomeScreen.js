import React, { Component } from 'react';
import { ActivityIndicator, Alert, Picker, ToastAndroid, ScrollView, SectionList, Text, TouchableOpacity, View, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { DrawerActions, NavigationEvents } from 'react-navigation';
import { customFetch, formatDate, getTimestamp, groupBy, months, isInToday } from '../../Helpers';
import { CustomHeaderStyle, GeneralStyle, HomeScreenStyle } from '../../Styles';
import ListItem from '../custom/ListItem';
import Panel from '../custom/Panel';
import RoundButton from '../custom/RoundButton';
import Dialog from "react-native-dialog";


class HomeScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft:
                <View style={CustomHeaderStyle.menuIconContainer}>
                    <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} >
                        <Icon name="menu" style={GeneralStyle.iconStyle} />
                    </TouchableOpacity>
                </View>,
            headerTitle:
                <View style={CustomHeaderStyle.searchbarContainer}>
                    <Text style={CustomHeaderStyle.headerTitle}>Le mie scadenze</Text>
                </View>,
            headerRight:
                <View style={CustomHeaderStyle.rightIconsContainer}>
                    {
                        // (navigation.getParam('notificationAlerts') === true) ?
                        //     <Icon
                        //         name="notifications"
                        //         onPress={navigation.getParam('changeNotificationAlertStatus')}
                        //         style={GeneralStyle.iconStyle} />
                        //     :
                        //     <Icon
                        //         name="notifications-off"
                        //         onPress={navigation.getParam('changeNotificationAlertStatus')}
                        //         style={GeneralStyle.iconStyle} />
                    }
                    <Icon
                        name="autorenew"
                        onPress={navigation.getParam('refreshList')}
                        style={GeneralStyle.iconStyle} />

                </View>,
            headerStyle: {
                backgroundColor: '#6200EE',
            }
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            fetchingTransactions: false,
            showFilters: false,
            filters: {},
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        //forse qui va aggiornato anche groups
        let responseObj = {};
        let nextTrans = JSON.stringify(nextProps.screenProps.data.transactions);
        let prevTrans = JSON.stringify(prevState.transactions);
        if (nextTrans !== prevTrans) {
            responseObj = { transactions: nextProps.screenProps.data.transactions };
        }
        let nextGroups = JSON.stringify(nextProps.screenProps.data.groups);
        let prevGroups = JSON.stringify(prevState.groups);
        if (nextGroups !== prevGroups)
            responseObj = Object.assign(responseObj, { groups: nextProps.screenProps.data.groups });
        // console.log('responseObj', responseObj);
        return (Object.keys(responseObj).length === 0) ? null : responseObj;

    }

    componentDidMount() {
        //setting filters
        this.props.navigation.setParams({ refreshList: this.getTransactions, changeNotificationAlertStatus: this.changeNotificationAlertStatus });
        this.createFilters();
    }


    changeNotificationAlertStatus = async () => {
        console.log('ciao');
        let notificationAlerts = JSON.parse(await AsyncStorage.getItem('notificationAlerts'));
        notificationAlerts = (notificationAlerts === undefined) ? true : !notificationAlerts;
        AsyncStorage.setItem('notificationAlerts', JSON.stringify(notificationAlerts));
        ToastAndroid.show((notificationAlerts === true) ? 'Notifiche attivate' : 'Notifiche disattivate', ToastAndroid.SHORT);
        this.props.navigation.setParams({ notificationAlerts: notificationAlerts });
    }

    createFilters() {
        let groups = this.state.groups;
        let transactions = this.state.transactions;

        // console.log('groups', groups);

        if (!groups) return;
        //transactionGroup
        let transactionsGroupPickerItems = groups.map(x => {
            let y = x.idgruppo.toString();
            return <Picker.Item key={y} label={x.nome} value={y} />; //label dovrà cambiare
        });
        transactionsGroupPickerItems.push(
            <Picker.Item key={'Tutti'} label={'Tutti'} value={'Tutti'} />
        );

        //transactionType
        let transactionTypePickerItems = [
            <Picker.Item key={'Tutti'} label={'Tutti'} value={'Tutti'} />,
            <Picker.Item key={'Dare'} label={'Dare'} value={'Dare'} />,
            <Picker.Item key={'Avere'} label={'Avere'} value={'Avere'} />
        ];
        if (!transactions) return;
        let groupedTransactions = this.organizeArrInSections(transactions, 'datamovimento');

        //get months
        let monthsPickerItems = [], i = 0;
        let monthsInTransactions = groupedTransactions.map(x =>
            months[new Date(x.title).getMonth()]
        );
        let translatedMonths = [...new Set(monthsInTransactions)];
        // console.log(translatedMonths);
        for (let month of translatedMonths) {
            monthsPickerItems.push(
                <Picker.Item key={i} label={month} value={month} />
            );
            i++;
        }
        monthsPickerItems.push(
            <Picker.Item key={'Tutti'} label={'Tutti'} value={'Tutti'} />
        );

        //get the years
        let yearsPickerItems = [];
        let yearsInTransactions = groupedTransactions.map(x =>
            new Date(x.title).getFullYear().toString()
        );
        let years = [...new Set(yearsInTransactions)];
        for (let year of years) {
            yearsPickerItems.push(
                <Picker.Item key={i} label={year} value={year} />
            );
        }
        yearsPickerItems.push(
            <Picker.Item key={'Tutti'} label={'Tutti'} value={'Tutti'} />
        );

        this.setState(prevState => {
            let filters = prevState.filters;
            filters.selectedGroup = 'Tutti';
            filters.selectedMonth = 'Tutti';
            filters.selectedYear = 'Tutti';
            filters.selectedTransactionType = 'Tutti';
            return {
                transactionsGroupPickerItems,
                transactionTypePickerItems,
                monthsPickerItems,
                yearsPickerItems,
                filters,
            }
        });
    }

    getTransactions = async () => {
        this.setState({ fetchingTransactions: true });
        let response = await this.props.screenProps.transactionsUpdate();
        switch (response.status) {
            case 500:
                Alert.alert(
                    'Attenzione',
                    'Impossibile recuperare i dati dal server. Motivo: ' + response.message,
                    [
                        { text: 'OK', onPress: () => { } },
                    ]
                );
                break;
            case 200:
                console.log('success getting transactions');
                break;
            default:
                break;
        }


        this.setState({
            fetchingTransactions: false,
            // transactions: response.data
        });
        this.createFilters();
    }



    renderDay = ({ section: { title } }) => {
        // console.log('title', title);
        return <View style={GeneralStyle.sectionView}>
            <Text style={GeneralStyle.sectionTitle}>
                {
                    formatDate(title)
                }
            </Text>
        </View>
    }

    renderTransaction = ({ item, index, section }) => {
        let prezzo =
            ((item.tipomovimento.toUpperCase() === 'DARE') ? '- ' : '+ ') +
            item.importo + ' ' + item.valuta;
        return (
            <ListItem
                key={index}
                item={item}
                chevron={false}
                containerStyle={(item.tipomovimento.toUpperCase() === 'DARE') ? HomeScreenStyle.transactionDareContainer : HomeScreenStyle.transactionAvereContainer}
                title={item.nome}
                titleStyle={HomeScreenStyle.transactionName}
                subtitle={item.dettagli}
                rightTitle={prezzo}
                rightTitleStyle={(item.tipomovimento.toUpperCase() === 'DARE') ? HomeScreenStyle.prezzoDareStyle : HomeScreenStyle.prezzoAvereStyle}
                onPress={(item) => this.handleTransactionPress(item)}
                onLongPress={(item) => this.handleDeletePress(item)}
            />
        );
    }



    noItemDisplay = () => {
        return (
            <View style={GeneralStyle.noItemDisplay}>
                <Text>Nessuna scadenza da mostrare</Text>
            </View>
        );
    };

    organizeArrInSections(arr, sectionKey) {
        let groupedSections = groupBy(arr, sectionKey); //raggruppa per data movimento

        return Object.entries(groupedSections) //riordina come vuole SectionList, title è il nome della sezione (la data del giorno), data è il resto della lista
            .map(x => {
                return {
                    title: (sectionKey === 'datamovimento') ? getTimestamp(x[0].split('T')[0]) : x[0],
                    data: x[1]
                };
            });
    }

    applyFilter(filter, value) {
        this.setState(prevState => {
            let filters = prevState.filters;
            filters[filter] = value;
            return { filters };
        });
    }

    filterArray(arr, filters) {
        if (!arr || arr.length <= 0) return undefined;
        if (!filters || filters.length <= 0) return arr;
        for (let key in filters) {
            let translatedKey = this.translateKey(key);
            let value = filters[key].toString().toUpperCase();
            //caso particolare: tutti i tipi di movimento
            if (value === 'TUTTI' || key === 'selectedMonth' || key === 'selectedYear') continue;
            arr = arr.filter(x => {
                return x[translatedKey].toString().toUpperCase() === value;
            });
        }
        return arr;
    }

    translateKey(key) {
        switch (key) {
            case 'selectedGroup':
                return 'idgruppo';
            case 'selectedTransactionType':
                return 'tipomovimento';
        }
    }

    handleTransactionPress = (item) => {
        this.props.navigation.navigate('NewTransactionScreen', { transactionId: item.idmovimento, });
    }

    handleDeletePress = async (item) => {
        Alert.alert(
            'Attenzione',
            "Sei sicuro di voler cancellare l'elemento?",
            [
                {
                    text: 'SI', onPress: async () => {
                        let response = await customFetch({
                            method: 'DELETE',
                            url: '/deadlines/' + item.idmovimento,
                            useToken: true,
                        });
                        if (response.status !== 200) {
                            Alert.alert(
                                'Errore',
                                "Errore durante la cancellazione dell'elemento",
                                [
                                    {
                                        text: 'OK', onPress: () => { },
                                    }
                                ]
                            );
                        }
                        this.getTransactions();
                    }
                },
                { text: 'NO', onPress: () => { } },
            ]
        );
    }

    showCreateGroupDialog = () => {
        this.setState({ showCreateGroupDialog: true });
    }

    closeCreateGroupDialog = () => {
        this.setState({ showCreateGroupDialog: false });
    }

    createGroup = async () => {
        //creo i gruppi e li aggiorno
        let createGroupResponse = await customFetch({
            url: '/groups/',
            method: 'PUT',
            useToken: true,
            body: JSON.stringify({ newGroupName: this.state.newGroupName }),
        });
        this.closeCreateGroupDialog();

        if (createGroupResponse.status !== 201) console.log('Error creating group', createGroupResponse);
        else {
            console.log('yay');
            this.getGroups();
        }
    }

    getGroups = async () => {
        this.setState({ fetchingGroups: true });
        // console.log("screenProps", this.props.screenProps);
        let getGroupsResponse = await this.props.screenProps.groupsUpdate();
        switch (getGroupsResponse.status) {
            case 500:
                Alert.alert(
                    'Attenzione',
                    'Impossibile recuperare i dati dal server. Motivo: ' + response.message,
                    [
                        { text: 'OK', onPress: () => { } },
                    ]
                );
                break;
            case 200:
                console.log('success getting groups');
                break;
            default:
                break;
        }
        this.setState({ fetchingGroups: false });
        this.createFilters();
    }

    render() {
        let transactions = this.state.transactions;
        let groupedSections = [];
        if (transactions && transactions.length > 0) {
            transactions = this.filterArray(transactions, this.state.filters);
            groupedSections = this.organizeArrInSections(transactions, 'datamovimento')
                .sort((a, b) => a.title - b.title) //ordinali per data più vicina
                .filter(x => isInToday(new Date(x.title)) || x.title > Date.now()) //saltando i giorni passati 
                .filter(x => (this.state.filters.selectedMonth === 'Tutti') ?
                    x
                    :
                    months[new Date(x.title).getMonth()] === this.state.filters.selectedMonth
                ) //filtra per mese
                .filter(x => (this.state.filters.selectedYear === 'Tutti') ?
                    x
                    :
                    new Date(x.title).getFullYear().toString() === this.state.filters.selectedYear
                ); //filtra per anno
        }
        return (
            <View style={HomeScreenStyle.container}>
                {<NavigationEvents onWillFocus={this.getTransactions} />}
                <ScrollView>
                    <Panel
                        title='Filtri'
                        createGroup={this.showCreateGroupDialog}
                    >
                        <View style={HomeScreenStyle.filtersContainer}>
                            {(this.state.fetchingGroups) ?
                                <ActivityIndicator />
                                :
                                <View style={HomeScreenStyle.filter}>
                                    <Text style={HomeScreenStyle.filterTitle}>Gruppo</Text>
                                    <Picker
                                        style={HomeScreenStyle.filterPickerStyle}
                                        selectedValue={this.state.filters.selectedGroup}
                                        onValueChange={(itemValue, itemIndex) => {
                                            this.applyFilter('selectedGroup', itemValue);
                                        }}>
                                        {this.state.transactionsGroupPickerItems}
                                    </Picker>
                                </View>
                            }
                            <View style={HomeScreenStyle.filter}>
                                <Text style={HomeScreenStyle.filterTitle}>Tipo Movimento</Text>
                                <Picker
                                    style={HomeScreenStyle.filterPickerStyle}
                                    selectedValue={this.state.filters.selectedTransactionType}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.applyFilter('selectedTransactionType', itemValue);
                                    }}>
                                    {this.state.transactionTypePickerItems}
                                </Picker>
                            </View>
                            <View style={HomeScreenStyle.filter}>
                                <Text style={HomeScreenStyle.filterTitle}>Mese</Text>
                                <Picker
                                    style={HomeScreenStyle.filterPickerStyle}
                                    selectedValue={this.state.filters.selectedMonth}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.applyFilter('selectedMonth', itemValue);
                                    }}>
                                    {this.state.monthsPickerItems}
                                </Picker>
                            </View>
                            <View style={HomeScreenStyle.filter}>
                                <Text style={HomeScreenStyle.filterTitle}>Anno</Text>
                                <Picker
                                    style={HomeScreenStyle.filterPickerStyle}
                                    selectedValue={this.state.filters.selectedYear}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.applyFilter('selectedYear', itemValue);
                                    }}>
                                    {this.state.yearsPickerItems}
                                </Picker>
                            </View>
                        </View>
                    </Panel>
                    <View style={HomeScreenStyle.sectionListContainer}>
                        {(this.state.fetchingTransactions) ?
                            <ActivityIndicator />
                            :
                            <SectionList
                                ref='sectionList'
                                extraData={this.state}
                                renderItem={this.renderTransaction}
                                renderSectionHeader={this.renderDay}
                                sections={groupedSections}
                                initialNumToRender={10}
                                ListEmptyComponent={this.noItemDisplay}
                                stickySectionHeadersEnabled={true}
                                ListFooterComponent={
                                    <View style={{ height: 60, flex: 1 }}>
                                    </View>
                                }
                                keyExtractor={(item, index) => index.toString()} />
                        }
                    </View>
                </ScrollView>
                <View style={GeneralStyle.roundButtonsContainer}>
                    <RoundButton
                        iconName="add"
                        color="#6200EE"
                        disabled={this.state.fetchingTransactions}
                        onPress={() => this.props.navigation.navigate('NewTransactionScreen')} />
                </View>
                <Dialog.Container visible={this.state.showCreateGroupDialog}>
                    <Dialog.Title>Crea un nuovo gruppo</Dialog.Title>
                    <Dialog.Input
                        onChangeText={(value) => this.setState({ newGroupName: value })}
                        underlineColorAndroid={'black'}
                        label={'Inserisci Nome'}></Dialog.Input>
                    <Dialog.Button label="OK" onPress={this.createGroup} />
                    <Dialog.Button label="ANNULLA" onPress={this.closeCreateGroupDialog} />
                </Dialog.Container>
            </View>
        );
    }
}


export default HomeScreen;