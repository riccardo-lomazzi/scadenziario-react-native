import jwt_decode from 'jwt-decode';
import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { customFetch } from './app/Helpers';
import AppContainer from './app/Navigators';
import NotifService from './app/NotifService';

class App extends Component {
  constructor() {
    super();

    this.state = { data: undefined, }
    this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this));
  }

  onRegister(token) { /*serve solo per la notifService*/ }

  onNotif(notif) { /*serve solo per la notifService*/ }

  onLogin = async ({ username, password, token }) => {
    try {
      let useToken = false;
      if (username && password) {
        let body = JSON.stringify({ 'username': username, 'password': password });
        let signInResponse = await customFetch({ body, url: '/auth/login', });
        if (signInResponse.status != 200) {
          // 'Impossibile connettersi. Riprova fra qualche minuto'
          throw new Error(`${signInResponse.status}, ${signInResponse.message}`);
        }
        token = signInResponse.data;

      }
      let userID = jwt_decode(token).userID;
      let userData = await customFetch({ method: 'GET', url: '/users/' + userID, useToken: true, });
      if (userData.status != 200) {
        // 'Impossibile connettersi. Riprova fra qualche minuto'
        throw new Error(`${userData.status}, ${userData.message}`);
      }

      let user = userData.data.user;
      let transactions = userData.data.movimenti;
      let groups = userData.data.groups;

      // let notifications = this.notificationsUpdate(transactions);

      this.setState({ data: { user, groups, transactions, } });

      return true;
    } catch (e) {
      //se esiste un campo message, c'è un errore e lo restituisco (per ora fa vedere anche i messaggi d'errore del db, quindi andrà personalizzato, ma lato PHP)
      console.error(e);
      return false;
    }
  }

  transactionsUpdate = async () => {
    let userTransactionsResponse = await customFetch({ method: 'GET', url: '/deadlines/all', useToken: true, });
    this.setState(prevState => {
      let prevData = prevState.data;
      prevData.transactions = userTransactionsResponse.data;
      return { data: prevData };
    });
    return userTransactionsResponse;
  }

  groupsUpdate = async () => {
    let userGroupsResponse = await customFetch({ method: 'GET', url: '/groups/', useToken: true, });
    this.setState(prevState => {
      let prevData = prevState.data;
      prevData.groups = userGroupsResponse.data;
      return { data: prevData };
    });
    return userGroupsResponse;
  }

  appendNotification = (notification) => {
    //append notif 
    this.notif.scheduleNotif({ date: new Date(notification.dateTimestamp), message: notification.message });
  }

  logout = async () => {
    await AsyncStorage.removeItem('token');
  }

  render() {
    return (
      <AppContainer
        screenProps={
          {
            data: this.state.data,
            onLogin: this.onLogin,
            logout: this.logout,
            transactionsUpdate: this.transactionsUpdate,
            groupsUpdate: this.groupsUpdate,
            appendNotification: this.appendNotification,
          }
        } />
    );
  }

}

export default App;