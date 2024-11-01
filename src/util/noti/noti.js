import { EventRegister } from 'react-native-event-listeners';
import TYPES from '../../screen/Notifications/NotificationConstants';
import { EVENT_NAME } from '../../constants/eventName';
import { DeviceEventEmitter } from 'react-native';
import { deviceEvents } from '../Constants';
import refetchUserInfo from '../../hooks/userInfo/useRefetchUserInfo';

export const getPlotIdFromNotiObj = (notiObj) => {
    let res = JSON.parse(notiObj.data).newPlotID;
    if (!res) {
        res = JSON.parse(notiObj.data).plotID;
    }
    if (!res) {
        res = JSON.parse(notiObj.data).plotId;
    }
    if (!res) {
        res = JSON.parse(notiObj.rootPlotId).plotId;
    }
    return res;
};

export const handleEditPolygonSuccessNoti = async (notiObj, { callBack }) => {
    switch (notiObj.type) {
        case TYPES.editPlotUpdated: {
            EventRegister.emit(EVENT_NAME.refetchPlotData);
            EventRegister.emit(EVENT_NAME.refreshMap);
            callBack && (await callBack());
            DeviceEventEmitter.emit(deviceEvents.plots.unSelectPolygon);
            break;
        }
    }
};

export const handleReqClaimantNoti = (notiObj) => {
    switch (notiObj.type) {
        case TYPES.requestToBeClaimantAccepted:
        case TYPES.requestToBeClaimant:
        case TYPES.removeClaimantVoting:
        case TYPES.removeClaimantVotingApproved:
        case TYPES.removeClaimantSelfVoting:
        case TYPES.removeClaimantRequestRejected:
        case TYPES.removeClaimantRequestAccepted:
        case TYPES.removeClaimantRequestVoting:
            EventRegister.emit(EVENT_NAME.refetchPlotData);
            EventRegister.emit(EVENT_NAME.refetchRemoveClaimantReq);
    }
};

export const handleAttestNoti = (notiObj) => {
    switch (notiObj.type) {
        case TYPES.createAuthenticator:
        case TYPES.removeAuthenticator:
            refetchUserInfo();
            break;
    }
};
