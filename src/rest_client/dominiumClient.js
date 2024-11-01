import Client from './baseClient';
import Constants from '../util/Constants';

const http = new Client(Constants.didServer);

export const getDidDocument = (did, navigation, dispatch) => {
    return http.get('commonlands/document/' + did, null, navigation, dispatch);
};

export const verifyCredential = (did, hash, navigation, dispatch) => {
    return http.get(
        `commonlands/document/qrcode-verify?did=${did}&hash=${hash}`,
        null,
        navigation,
        dispatch,
    );
};

export const getLastestVersionDocument = (did, navigation, dispatch) => {
    return http.get(`commonlands/document/lastest-version?did=${did}`, null, navigation, dispatch);
};
