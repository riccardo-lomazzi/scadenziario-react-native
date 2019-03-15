import { AsyncStorage, Dimensions } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

const port = ':4000';
const protocol = 'http://'
const host = '192.168.1.110'; //indirizzo macchina che hosta il server
const hostAddress = protocol + host + port;
// const loginAddress = "/auth/login";
// const transactionsAddress = "/deadlines";
// const userDataAddress = "/users";

export const actualUrls = (urlRewrite) => {
    let actualUrl = hostAddress + urlRewrite;
    console.log('actualUrl', actualUrl);
    return actualUrl;
}

export const arraysEqual = (arr1, arr2) => {
    if (!arr1 || !arr2) return false;
    if (arr1.length !== arr2.length)
        return false;
    for (var i = arr1.length; i--;) {
        if (arr1[i] !== arr2[i])
            return false;
    }

    return true;
}

export const isEmpty = (obj) => {
    return !obj || Object.keys(obj).length === 0;
}

export const customFetch = async ({ url, method = 'POST', useToken = false, body = null, headers = { "Content-Type": "application/json", }, navigation = undefined }) => {
    // if (global.talkingToWS) { console.warn("Chiamata già avviata"); return; }
    try {
        // global.talkingToWS = true;
        if (useToken) {
            let authToken = (await AsyncStorage.getItem("token"));
            headers = Object.assign(headers, { "Authorization": "Bearer " + authToken });
        }

        let response = await RNFetchBlob.fetch(
            method,
            actualUrls(url),
            headers,
            body,
        );

        let jsonResp = response.json();
        if (jsonResp.token) await AsyncStorage.setItem('token', jsonResp.token); //se arriva il token salvalo
        // global.talkingToWS = false;
        let status = response.info().status;
        if (status === 401) {
            await AsyncStorage.removeItem("token");
            if (navigation) navigation.navigate('AuthStackNavigator');
            let obj = {
                message: jsonResp.message,
                data: (jsonResp.token) ? jsonResp.token : jsonResp.data,
                status,
            };
            console.log("obj", obj);
            return obj;
        }

        // console.log('jsonResp', jsonResp);

        return {
            message: jsonResp.message,
            data: (jsonResp.token) ? jsonResp.token : jsonResp.data,
            status,
        };
    } catch (err) {
        console.error(err);
        return;
    }
}

export const groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};


export const getTimestamp = (str) => {
    if (str.length <= 0) return null;

    let ymd = str.match(/^(\d+)-(\d+)-(\d+)$/);
    if (ymd) {
        const matches = [...ymd].map(x => parseInt(x));
        const d = new Date(matches[1], matches[2] - 1, matches[3]);
        return d.getTime();
    }

    let ymdhms = str.match(/^(\d+)-(\d+)-(\d+)T(\d+):(\d+):(\d+)\.(\d+)Z$/);
    if (ymdhms) {
        const matches = [...ymdhms].map(x => parseInt(x));
        const d = new Date(matches[1], matches[2] - 1, matches[3], matches[4], matches[5], matches[6]);
        return d.getTime();
    }

    console.error("Can't parse this thing: " + str);
    return 0;
}

export const formatDate = (timestamp) => {
    var dateobj = new Date(timestamp);
    // console.log('Normal', dateobj.getDate(), 'UTC', dateobj.getUTCDate())
    var result = dateobj.getDate().toString() + " " + months[dateobj.getMonth()] + " " + dateobj.getFullYear().toString();
    // console.log('formatDate result', result)
    return result;
};

export const formatYearMonthDay = (timestamp) => {
    var date = new Date(timestamp);
    var dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
        .toISOString()
        .split("T")[0];
    return dateString;
}

export const isInToday = (inputDate) => {
  var today = new Date();
  if(today.setHours(0,0,0,0) == inputDate.setHours(0,0,0,0)){ return true; }
  else { return false; }  
}

export const months = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];

export const isDebug = false;

export const PAGE_WIDTH = 2480;
export const PAGE_HEIGHT = 3508;

export const WIN_WIDTH = Dimensions.get('window').width;
export const WIN_HEIGHT = Dimensions.get('window').height;

