import React, { Component } from 'react';
import { View, ScrollView, Text, Alert, TouchableOpacity } from 'react-native';
import GenerateForm from 'react-native-form-builder';
import RoundButton from '../custom/RoundButton';
import { GeneralStyle, CustomHeaderStyle, TransactionScreenStyle } from '../../Styles';
import { formatYearMonthDay, customFetch, getTimestamp } from '../../Helpers';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Validator from 'validatorjs';
import en from 'validatorjs/src/lang/en';


class NewTransactionScreen extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft:
                <View style={CustomHeaderStyle.menuIconContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} >
                        <Icon name="arrow-back" style={GeneralStyle.iconStyle} />
                    </TouchableOpacity>
                </View>,
            headerTitle:
                <View style={CustomHeaderStyle.searchbarContainer}>
                    <Text style={CustomHeaderStyle.headerTitle}>
                        {(navigation.getParam('transactionId')) ? 'Movimento' : 'Nuovo movimento'}
                    </Text>
                </View>,
            headerRight:
                <View style={CustomHeaderStyle.rightIconsContainer}>
                </View>,
            headerStyle: {
                backgroundColor: '#6200EE',
            }
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            sendButtonDisabled: true,
            editMode: (this.props.navigation.getParam('transactionId')) ? false : true,
        };
    }

    componentDidMount() {
        let transactionId = this.props.navigation.getParam('transactionId');
        let transactionItem = undefined;
        if (transactionId)
            transactionItem = this.props.screenProps.data.transactions.find(x => x.idmovimento === transactionId);
        const fields = [
            {
                type: 'text',
                name: 'nome',
                required: true,
                label: 'Nome',
                defaultValue: (transactionItem) ? transactionItem.nome : '',
            },
            {
                type: 'text',
                name: 'dettagli',
                required: true,
                label: 'Dettagli',
                defaultValue: (transactionItem) ? transactionItem.dettagli : '',
            },
            {
                type: 'select',
                name: 'idgruppo',
                multiple: false,
                objectType: true,
                labelKey: 'nome',
                primaryKey: 'idgruppo',
                defaultValue: (transactionItem) ?
                    this.props.screenProps.data.groups.find(x => x.idgruppo === transactionItem.idgruppo)
                    :
                    this.props.screenProps.data.groups[0],
                label: 'Gruppo',
                options: this.props.screenProps.data.groups,
            },
            {
                type: 'picker',
                name: 'tipomovimento',
                mode: 'dialog',
                defaultValue: (transactionItem) ? transactionItem.tipomovimento : '',
                label: 'Tipo movimento',
                options: ['DARE', 'AVERE'],
            },
            {
                type: 'number',
                name: 'importo',
                required: true,
                label: 'Importo',
                defaultValue: (transactionItem) ? transactionItem.importo : '',
            },
            {
                type: 'picker',
                name: 'valuta',
                mode: 'dialog',
                required: true,
                label: 'Valuta',
                defaultValue: (transactionItem) ? transactionItem.valuta : '€',
                options: ['€', '$'],
            },
            {
                type: 'date',
                name: 'datamovimento',
                required: true,
                mode: 'date',
                label: 'Data del movimento',
                defaultValue: (transactionItem) ? transactionItem.datamovimento : '',
            },
        ];

        const rules = {
            tipomovimento: 'required|alpha',
            importo: 'required|numeric',
            valuta: 'required',
            nome: 'required|max:255',
            datamovimento: 'required',
            dettagli: 'max:255',
        };
        this.setState({ fields, rules });
    }

    customValidator = (field) => {
        let error = false;
        let errorMsg = '';
        if (field.name === 'idgruppo') return { error, errorMsg };
        Validator.setMessages('en', en);
        let validation = new Validator(
            { [field.name]: [field.value] },
            { [field.name]: this.state.rules[field.name] },
            {
                required: 'Campo obbligatorio',
                numeric: 'Il campo non è numerico',
                alpha: 'Il campo non contiene solo lettere',
                max: "Il campo non deve superare i 255 caratteri"
            });
        if (validation.fails()) {
            error = true;
            errorMsg = validation.errors.get(field.name);
            this.setState({ sendButtonDisabled: true });
        }
        // console.log('error', { error, errorMsg });
        return { error, errorMsg };
    }

    validateAll = () => {
        if (!this.formGenerator) return;
        let fields = this.formGenerator.getValues();
        // console.log('validateAll', fields);
        Validator.setMessages('en', en);
        let validation = new Validator(
            fields,
            this.state.rules
        );
        if (validation.passes()) {
            this.setState({ sendButtonDisabled: false });
        }
    }

    async sendFormData() {

        let fields = this.formGenerator.getValues();

        //prepare notification
        let dettagli = (fields.dettagli.length > 15) ? fields.dettagli.splice(0, 15) + '...' : fields.dettagli;
        this.props.screenProps.appendNotification({
            dateTimestamp: fields.datamovimento.setHours(0, 0, 0, 0),
            message: fields.nome + ' - ' +
                ((fields.dettagli) ? (dettagli + ' - ') : '') +
                'Importo: ' +
                ((fields.tipomovimento === 'AVERE') ? '+' : '-') +
                ' ' + fields.importo + ' ' + fields.valuta
        });

        fields.idgruppo = fields.idgruppo.idgruppo; //questo perché formGenerator prende l'intero oggetto con la primaryKey indicata
        //format date for sending to server
        fields.datamovimento = formatYearMonthDay(Date.parse(fields.datamovimento));

        let body = JSON.stringify(fields);
        // let idmovimento = 'new';
        let idmovimento = '/' + this.props.navigation.getParam('transactionId', 'new');
        let response = await customFetch({
            method: 'PUT',
            useToken: true,
            url: '/deadlines/' + idmovimento,
            body,
        });
        // console.log('response', response);
        switch (response.status) {
            case 201:
                console.log('success');
                this.setState({ hasEdited: false });
                this.props.navigation.goBack();
                return null;
            case 400:
                Alert.alert(
                    'Attenzione',
                    response.message,
                    [
                        { text: 'OK', onPress: () => { } },
                    ]
                );
                break;
            default:
                console.log("errore invio", response.message);
                break;
        }




    }

    render() {
        let transactionId = this.props.navigation.getParam('transactionId');
        let transactionItem = {}, gruppo = '';
        if (transactionId) {
            transactionItem = this.props.screenProps.data.transactions.find(x => x.idmovimento === transactionId);
            gruppo = this.props.screenProps.data.groups.find(x => x.idgruppo === transactionItem.idgruppo).nome;
        }
        return (
            <View>
                <ScrollView>
                    {(this.state.fields && this.state.rules && this.state.editMode) ?
                        <GenerateForm
                            ref={(c) => {
                                this.formGenerator = c;
                            }}
                            fields={this.state.fields}
                            onValueChange={this.validateAll}
                            customValidation={this.customValidator}
                        />
                        :
                        <View style={TransactionScreenStyle.mainContainer}>
                            <View style={TransactionScreenStyle.fieldContainer}>
                                <Text style={TransactionScreenStyle.fieldName}>Nome</Text>
                                <Text style={TransactionScreenStyle.fieldValue}>{transactionItem.nome}</Text>
                            </View>
                            <View style={TransactionScreenStyle.fieldContainer}>
                                <Text style={TransactionScreenStyle.fieldName}>Dettagli</Text>
                                <Text style={TransactionScreenStyle.fieldValue || '<Campo vuoto>'}>{transactionItem.dettagli}</Text>
                            </View>
                            <View style={TransactionScreenStyle.fieldContainer}>
                                <Text style={TransactionScreenStyle.fieldName}>Tipo movimento</Text>
                                <Text style={TransactionScreenStyle.fieldValue}>{transactionItem.tipomovimento}</Text>
                            </View>
                            <View style={TransactionScreenStyle.fieldContainer}>
                                <Text style={TransactionScreenStyle.fieldName}>Gruppo</Text>
                                <Text style={TransactionScreenStyle.fieldValue}>{gruppo}</Text>
                            </View>
                            <View style={TransactionScreenStyle.fieldContainer}>
                                <Text style={TransactionScreenStyle.fieldName}>Importo</Text>
                                <Text style={TransactionScreenStyle.fieldValue}>{transactionItem.importo + ' ' + transactionItem.valuta}</Text>
                            </View>
                            <View style={TransactionScreenStyle.fieldContainer}>
                                <Text style={TransactionScreenStyle.fieldName}>Data movimento</Text>
                                <Text style={TransactionScreenStyle.fieldValue}>{transactionItem.datamovimento}</Text>
                            </View>
                        </View>
                    }
                    <View style={GeneralStyle.emptyBox}></View>
                </ScrollView>
                <View style={GeneralStyle.roundButtonsContainer}>
                    {
                        (this.state.editMode) ?
                            <RoundButton
                                iconName="done"
                                disabled={this.state.sendButtonDisabled}
                                onPress={() => this.sendFormData()} />
                            :
                            <RoundButton
                                iconName="edit"
                                onPress={() => { this.setState({ editMode: true }) }} />
                    }
                </View>
            </View>
        );
    }

}

export default NewTransactionScreen;