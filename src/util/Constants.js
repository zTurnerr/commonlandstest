import i18n from 'i18next';
import { Alert, Dimensions, Linking, Platform } from 'react-native';
import { PERMISSIONS, check, request } from 'react-native-permissions';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllCountries } from 'react-native-country-picker-modal';
import deviceInfoModule from 'react-native-device-info';
import ImagePicker from 'react-native-image-crop-picker';
import Snackbar from 'react-native-snackbar';
import { initI18n } from '../i18n/index';
import { getBackendServer } from '../rest_client';

export const subplotColor = 'rgba(129, 23, 194, 0.72)';
export const newPolygonColor = 'rgba(12, 140, 212, 1)';
export const OVERLAP_ERROR = 'overlap';
export * from 'cml-script';
const { width, height } = Dimensions.get('window');
export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;
export const DEFAULT_LANGUAGE = 'en';
export const LANGUAGE = Object.freeze({
    EN: 'en',
});

export const RN_MAPBOX_ACCESS_TOKEN =
    'pk.eyJ1Ijoia2hvaWZ1aXhsYWJzIiwiYSI6ImNsZ2E4bzMzYzA5OHEzbnBhY3R4MnJ3amwifQ.2PzgKhOB8Sec_pJXGy9RfQ';

export const LIST_LANGUAGE = [{ id: 'en', label: 'language.english', isActive: false }];
export const ALL_STATUS = {
    value: 'all',
    label: 'All',
};
export const SEND_TYPE = {
    createDraw: 'createDraw',
    addSource: 'addSource',
    addSourceV2: 'addSourceV2',
    renderCluster: 'renderCluster',
    deleteDraw: 'deleteDraw',
    flyTo: 'flyTo',
    getCenterZoom: 'getCenterZoom',
    addControlSearch: 'addControlSearch',
    styleMap: 'styleMap',
    setCenter: 'setCenter',
    enableSnap: 'enableSnap',
    disableSnap: 'disableSnap',
    polygonListChange: 'polygonListChange',
    snapPoint: 'snapPoint',
    fitBoundsByPolygon: 'fitBoundsByPolygon',
    disabledFeatures: 'disabledFeatures',
    removeControl: 'removeControl',
    enableSelectedPolygon: 'enableSelectedPolygon',
    setSelectPolygon: 'setSelectPolygon',
    geolocateControl: 'geolocateControl',
    addMarker: 'addMarker',
    resetPolygon: 'resetPolygon',
    enableFeatures: 'enableFeatures',
    addControl: 'addControl',
    updateDrawPolygon: 'updateDrawPolygon',
    removeSL: 'removeSL',
};
export const RECEIVE_TYPE = {
    online: 'online',
    polygonUpdate: 'polygonUpdate',
    pointClick: 'pointClick',
    mapViewLog: 'mapViewLog',
    moveend: 'moveend',
    touchStart: 'touchStart',
    touchEnd: 'touchEnd',
    polygonClick: 'polygonClick',
    getCenterZoom: 'getCenterZoom',
    hideSnapButton: 'hideSnapButton',
    showSnapButton: 'showSnapButton',
};
export const NODE = {
    mainnet: 'https://cardano-mainnet.blockfrost.io/api/v0',
    testnet: 'https://cardano-testnet.blockfrost.io/api/v0',
};

export const NETWORK_ID = {
    mainnet: 'mainnet',
    testnet: 'testnet',
};
export const getStorage = (key) => AsyncStorage.getItem(key);
export const setStorage = (key, value) => AsyncStorage.setItem(key, value);

export const compareArray = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
};

export const setCenter = ({ ref, long, lat, zoom }) => {
    try {
        if (!long || !lat || !ref) {
            return;
        }
        let data = {
            geometry: {
                coordinates: [long, lat],
            },
        };
        if (zoom) {
            data.zoom = zoom;
        }
        ref?.current?.postMessage(
            JSON.stringify({
                type: SEND_TYPE.setCenter,
                coordinates: data,
            }),
        );
    } catch (e) {
        console.log(e);
    }
    ref?.current?.postMessage(JSON.stringify(data));
    let data = {
        geometry: {
            coordinates: [long, lat],
        },
    };
    if (zoom) {
        data.zoom = zoom;
    }
    ref?.current?.postMessage(
        JSON.stringify({
            type: SEND_TYPE.setCenter,
            coordinates: data,
        }),
    );
};
export const uppercaseFirstChar = (string = '') => {
    return string[0].toLocaleUpperCase() + string.substr(1, string.length - 1);
};
export const deepClone = (object = {}) => {
    return JSON.parse(JSON.stringify(object));
};
export const validateImages = (images = []) => {
    for (let i = 0; i < images.length; i++) {
        if (!['image/jpeg', 'image/png'].includes(images[i].type)) {
            throw i18n.t('error.fileNotSupported');
        }
    }
};

initI18n();

export const CLAIMANTS = ['renter', 'owner', 'rightOfUse', 'co-owner'];
export const CLAIMANTS_OPTIONS = [
    {
        label: i18n.t('claimants.renter'),
        value: 'renter',
    },
    {
        label: i18n.t('claimants.owner'),
        value: 'owner',
    },
    {
        label: i18n.t('claimants.rightOfUse'),
        value: 'rightOfUse',
    },
    // {
    //     label: i18n.t('claimants.coOwner'),
    //     value: 'co-owner',
    // },
];
export const NEIGHTBORS = ['neighbor'];
export const NEIGHTBORS_OPTIONS = [{ label: i18n.t('claimants.neighbor'), value: 'neighbor' }];
export const INVITE_STATUS = {
    sent: 'sent',
    pending: 'pending',
    overwritten: 'overwritten',
    accepted: 'accepted',
    rejected: 'rejected',
    receive: 'receive',
    expired: 'expired',
    cancelled: 'cancelled',
};
export const getRoleLabel = (value) => {
    let data = NEIGHTBORS_OPTIONS.concat(CLAIMANTS_OPTIONS);
    let option = data.find((item) => item.value === value);
    return option ? option.label : value;
};
export const isArrayNotEmpty = (array) => {
    return Array.isArray(array) && array.length;
};
export function capitalizeFirstLetter(string) {
    try {
        return string.charAt(0).toUpperCase() + string.slice(1);
    } catch (e) {
        console.log(e);
        return string;
    }
}

export const maxDistance = 200;
export const getUrlShare = ({ id, longlat }) => {
    return getBackendServer() + `app?to=commonlands://invites/${id}/${longlat}`;
};
export const getDownloadUrl = (id) => {
    return getBackendServer() + `api/pdf/certificate/download?plotID=${id}`;
};
export const extractCountryCode = async (phoneNumber = '') => {
    let allCode = await getAllCountries();
    let _phoneNumber = phoneNumber,
        countryCode = {},
        number = '';
    if (phoneNumber[0] === '+') {
        _phoneNumber = _phoneNumber.substr(1).trim();
    }
    for (let i = 0; i < allCode.length; i++) {
        allCode[i].callingCode.forEach((code) => {
            if (_phoneNumber.indexOf(code) === 0) {
                countryCode = allCode[i];
                number = _phoneNumber.replace(code, '');
            }
        });
    }
    return { countryCode, number };
};
export const cameraOption = {
    android: PERMISSIONS.ANDROID.CAMERA,
    ios: PERMISSIONS.IOS.CAMERA,
};
const OsVer = deviceInfoModule.getSystemVersion();

export const galleryOption = {
    android:
        Number(OsVer) < 13
            ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
            : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
    ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
};
export const requestPermission = async (onPress, options) => {
    const result = await request(Platform.select(options));
    if (result === RESULTS.GRANTED || result === RESULTS.LIMITED) {
        if (typeof onPress === 'function') {
            onPress();
        }
    }
    return result;
};
export const RESULTS = Object.freeze({
    UNAVAILABLE: 'unavailable',
    BLOCKED: 'blocked',
    DENIED: 'denied',
    GRANTED: 'granted',
    LIMITED: 'limited',
});
export const openPicker = async (config = {}) => {
    try {
        let images = await ImagePicker.openPicker(config);
        let data = [];
        if (!images) {
            return data;
        }
        if (Array.isArray(images)) {
            return (data = images.map((image) => ({
                uri: image.path,
                type: image.mime,
                fileName:
                    image.modificationDate + image.path.substring(image.path.lastIndexOf('/') + 1),
                size: image.size,
            })));
        }
        if (images.path) {
            return [
                {
                    uri: images.path,
                    type: images.mime,
                    fileName:
                        images.modificationDate +
                        images.path.substring(images.path.lastIndexOf('/') + 1),
                },
            ];
        }
        return data;
    } catch (err) {
        throw err;
    }
};
export const allowPermissionCamera = ({ onPress }) => {
    allowPermission({
        onPress: () => {
            if (typeof onPress === 'function') {
                onPress();
            }
        },
        options: cameraOption,
        title: i18n.t('shareAndPermission.titleCamera'),
        message: i18n.t('shareAndPermission.contentCamera'),
        confirmationText: i18n.t('shareAndPermission.goToSettings'),
        dismissText: i18n.t('button.cancel'),
    });
};
export const allowPermissionPhotos = ({ onPress }) => {
    allowPermission({
        onPress: () => {
            if (typeof onPress === 'function') {
                onPress();
            }
        },
        options: galleryOption,
        title: i18n.t('others.commonlandsWouldLike'),
        message: i18n.t('shareAndPermission.titlePhoto'),
        confirmationText: i18n.t('shareAndPermission.goToSettings'),
        dismissText: i18n.t('button.cancel'),
    });
};
export const openCamera = async (config = {}) => {
    try {
        let images = await ImagePicker.openCamera(config);
        let data = [];
        if (!images) {
            return data;
        }
        if (Array.isArray(images)) {
            return (data = images.map((image) => ({
                uri: image.path,
                type: image.mime,
                fileName:
                    image.modificationDate + image.path.substring(image.path.lastIndexOf('/') + 1),
            })));
        }
        if (images.path) {
            return [
                {
                    uri: images.path,
                    type: images.mime,
                    fileName:
                        images.modificationDate +
                        images.path.substring(images.path.lastIndexOf('/') + 1),
                },
            ];
        }
        return data;
    } catch (err) {
        if (err.code === 'E_PICKER_CANCELLED') {
            return;
        } else {
            Alert.alert(`Commonlands`, err.message || i18n.t('error.takePhotoFailed'));
        }
    }
};
export const allowPermission = async ({ onPress, options, title, message }) => {
    const result = await check(Platform.select(options));
    switch (result) {
        case RESULTS.GRANTED:
            if (typeof onPress === 'function') {
                onPress();
            }
            return result;
        case RESULTS.DENIED:
            await requestPermission(onPress, options);
            break;
        case RESULTS.LIMITED:
            await requestPermission(onPress, options);
            break;
        case RESULTS.BLOCKED:
            Alert.alert(
                `Commonlands ${title}`,
                message,
                [
                    { text: i18n.t('button.yes'), onPress: () => Linking.openSettings() },
                    { text: i18n.t('button.no'), onPress: () => {}, style: 'cancel' },
                ],
                {
                    cancelable: true,
                },
            );
            break;
        default:
            break;
    }
    return result;
};
export const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
export const isShowCluster = (zoom) => {
    return zoom <= Constants.minZoomShowCluster;
};

export const PROGRESS_OPTIONS = {
    // 1: [
    //     { text: 'Creating plot data...', maxValue: 33, addValue: 8 },
    //     { text: 'Uploading images...', maxValue: 66, addValue: 0.8 },
    //     { text: 'Inviting claimants...', maxValue: 96, addValue: 2 },
    // ],
    // 2: [
    //     { text: 'Creating plot data...', maxValue: 50, addValue: 10 },
    //     { text: 'Uploading images...', maxValue: 96, addValue: 1 },
    // ],
    3: [
        { text: `${i18n.t('progressOption.creatingPlot')}...`, maxValue: 50, addValue: 10 },
        { text: `${i18n.t('progressOption.invitingClaimant')}...`, maxValue: 96, addValue: 3 },
    ],
    4: [{ text: `${i18n.t('progressOption.creatingPlot')}...`, maxValue: 89, addValue: 12 }],
};

export const STEPS_CREATE_PLOT = [
    {
        label: i18n.t('components.addPolygon'),
        value: 0,
    },
    {
        label: i18n.t('components.invitePeople'),
        value: 1,
    },
    {
        label: i18n.t('components.review'),
        value: 2,
    },
];
export const showMessage = (props) => {
    return Snackbar.show({
        marginBottom: height - 46,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'rgba(58, 175, 105, 1)',
        ...props,
    });
};

export const offlineMapsConstant = {
    plotCreated: 'plotCreated',
    plotSelected: 'plotSelected',
    plotDispute: 'plotDispute',
};

const Constants = {
    STORAGE: {
        encryptedKey: 'encryptedKey',
        network: 'network',
        currency: 'currency',
        accounts: 'accounts',
        currentAccount: 'currentAccount',
        access_token: 'access_token',
        trainer_token: 'trainer_token',
        snapStatus: 'snapStatus',
        seedPhrase: 'seedPhrase',
        doNotShowSetUpPassword: 'doNotShowSetUpPassword',
        lastLoggedAccount: 'lastLoggedAccount',
        trainingEnvironment: 'trainingEnvironment',
    },
    network: {
        mainnet: 1,
        testnet: 0,
    },
    apiKey: {
        mainnet: 'mainnetUxZ1oGgRnSRbrsR0DUuyNY2hCL5tGqBy',
        testnet: 'testnetJe6W7FM1Jwkh0PxNMZt9OzNND3T1mS1T',
    },
    contactEmail: 'connect@commonlands.org',
    getStorage,
    setStorage,
    isManager: (role) => role === 3,
    backendServer: 'https://staging.commonlands.org', //Release
    // backendServer: 'https://training.commonlands.org',
    // backendServer: 'https://commonlands-dev.fuixlabs.xyz',
    backendTestServer: 'https://training.commonlands.org',

    didServer: 'https://cml-resolver.ap.ngrok.io/resolver/',
    helpCenterURI: 'https://commonlands.zendesk.com',
    freeIpApi: 'https://freeipapi.com/api/json',
    worthwhileNumber: 150,
    limitPlot: 300,
    minZoomShowCluster: 13,
};

export const CONTRACT_TYPE = Object.freeze({
    ACTIVE: 'Active Contract',
    DEFAULT: 'Default',
    PEN_DING: 'created',
    TRANSFERRED: 'Transferred',
    UNLOCK: 'completed',
});

export const logObject = (object) => {
    console.log(JSON.stringify(object, null, 2));
};
export default Constants;

/**
 * @description Events used by DeviceEventEmitter
 * @example
 * import { DeviceEventEmitter } from 'react-native';
 * import { deviceEvents } from 'src/util/Constants';
 *
 * // Listen for the event
 * DeviceEventEmitter.addListener(deviceEvents.explore.centroid, (data) => {
 *    // do something with the data
 * });
 *
 * // Emit the event
 * DeviceEventEmitter.emit(deviceEvents.explore.centroid, [long, lat]);
 */
export const deviceEvents = {
    /**
     * @description Global app events
     */
    app: {
        /**
         * @description Show a toast message
         */
        toast: 'app:toast',
    },
    /**
     * @description Events for explore screen
     */
    explore: {
        /**
         * @description Set centroid of the map to the given coordinates [long, lat]
         */
        centroid: 'explore:centroid',
        /**
         * @description Set filter for the plots on the map
         */
        filter: 'explore:filter',
    },
    /**
     * @description Events for plots screen
     */
    plots: {
        /**
         * @description Select a polygon on the map
         */
        selectPolygon: 'plots:selectPolygon',
        /**
         * @description Unselect a polygon on the map
         */
        unSelectPolygon: 'plots:unSelectPolygon',
    },
    /**
     * @description Plot events
     */
    plot: {
        /**
         * @description Set the tab for the plot screen
         */
        managementClaimants: {
            /**
             * @description Set the tab for the plot screen
             */
            setTab: 'plot:managementClaimants:setTab',
        },
    },
};
