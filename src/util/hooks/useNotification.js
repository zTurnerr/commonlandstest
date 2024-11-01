import notifee, {
    AndroidBadgeIconType,
    AndroidImportance,
    AndroidVisibility,
    EventType,
} from '@notifee/react-native';
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';
import { _deleteFcmToken, registerFcmToken } from '../../rest_client/apiClient';

import messaging from '@react-native-firebase/messaging';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { useDispatch } from 'react-redux';
import { useFlagAndUnFlag } from '../../hooks/useFlagAndUnFlag';
import { getAllNo } from '../../redux/actions/notification';
import { fetchAllUserPlots } from '../../redux/actions/user';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import { notificationsSliceActions } from '../../redux/reducer/notifications';
import { markReadNotification } from '../../rest_client/apiClient';
import TYPES from '../../screen/Notifications/NotificationConstants';
import {
    handleAttestNoti,
    handleEditPolygonSuccessNoti,
    handleReqClaimantNoti,
} from '../noti/noti';

const IS_ANDROID = Platform.OS === 'android';
export const SHOULD_REQUEST_NOTIFICATION_ANDROID = IS_ANDROID && Platform.Version >= 33;

const NOTIFICATION_APPROVED_STATUSES = [messaging.AuthorizationStatus.AUTHORIZED];

const displayNotification = async ({ id, title, body, data, androidImage } = {}) => {
    try {
        // Create a channel (required for Android)
        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
            importance: AndroidImportance.HIGH,
            visibility: AndroidVisibility.PUBLIC,
        });
        // Request permissions (required for iOS)
        await notifee.requestPermission();

        const attachments = data?.fcm_options?.image
            ? [
                  {
                      url: data?.fcm_options?.image,
                  },
              ]
            : [];

        const androidConfig = {
            channelId,
            badgeIconType: AndroidBadgeIconType.LARGE,
            importance: AndroidImportance.HIGH,
            visibility: AndroidVisibility.PUBLIC,
            smallIcon: 'ic_launcher',
            pressAction: {
                id: 'default',
            },
        };

        const officialAndroidConfig = androidImage
            ? {
                  ...androidConfig,
                  largeIcon: androidImage,
              }
            : androidConfig;

        // Display a notification
        await notifee.displayNotification({
            title,
            body,
            data,
            id,
            ios: {
                attachments,
            },
            android: officialAndroidConfig,
        });
    } catch (error) {}
};

const incrementBadgeCount = () => {
    try {
        notifee.incrementBadgeCount();
    } catch (error) {}
};

const decrementBadgeCount = () => {
    try {
        notifee.decrementBadgeCount();
    } catch (error) {}
};

const clearBadgeCount = () => {
    try {
        notifee.setBadgeCount(0);
    } catch (error) {}
};

const setBadgeCount = (count) => {
    try {
        const formattedCount = typeof count === 'number' ? count : Number(count);
        notifee.setBadgeCount(formattedCount >= 0 ? formattedCount : 0);
    } catch (error) {}
};

const requestNotificationPermission = async ({
    successCallback = () => {},
    failureCallback = () => {},
} = {}) => {
    try {
        // only request notification on android version 33+
        // for android < 33, you do not need to request user permission
        if (SHOULD_REQUEST_NOTIFICATION_ANDROID) {
            const requestAndroidResult = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
            if (requestAndroidResult === RESULTS.GRANTED) {
                successCallback?.();
                getFCMToken();
            } else {
                failureCallback?.();
            }
            return requestAndroidResult;
        }

        //only call with android < 33
        const _checkNotificationPermission = await checkNotificationPermission();
        if (!_checkNotificationPermission) {
            return RESULTS.BLOCKED;
        }
        const notificationStatus = await messaging().requestPermission({
            provisional: false,
        });
        // console.log('requestNotificationPermission', notificationStatus);
        const isGranted = NOTIFICATION_APPROVED_STATUSES.includes(notificationStatus);

        if (isGranted) {
            successCallback?.();
            getFCMToken();
        } else {
            failureCallback?.();
        }
        return convertNotificationStatusToResult(notificationStatus);
    } catch (error) {}
};

const STATUS_MAPPING_TO_RESULT = {
    AUTHORIZED: RESULTS.GRANTED,
    DENIED: RESULTS.DENIED,
};
const convertNotificationStatusToResult = (notificationStatus) => {
    for (let key in messaging.AuthorizationStatus) {
        if (messaging.AuthorizationStatus[key] === notificationStatus) {
            return STATUS_MAPPING_TO_RESULT[key] ? STATUS_MAPPING_TO_RESULT[key] : key;
        }
    }
};
const requestNotificationProvisional = async () => {
    try {
        const notificationStatus = await messaging().requestPermission({
            provisional: true,
        });
        const isGranted = notificationStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (isGranted) {
            getFCMToken(true);
        }
    } catch (error) {}
};

const checkNotificationPermission = async (returnType) => {
    try {
        if (SHOULD_REQUEST_NOTIFICATION_ANDROID) {
            const android33AuthStatus = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
            if (returnType) {
                return android33AuthStatus;
            }
            return android33AuthStatus === RESULTS.GRANTED;
        }
        const notificationStatus = await messaging().hasPermission();
        // console.log('checkNotificationPermission', notificationStatus);

        if (returnType) {
            return convertNotificationStatusToResult(notificationStatus);
        }
        const isGranted = NOTIFICATION_APPROVED_STATUSES.includes(notificationStatus);
        return isGranted;
    } catch (error) {
        console.log(error);
    }
};

const getFCMToken = async (isProvisional = false) => {
    console.log('getFCMToken', isProvisional);

    try {
        if (!IS_ANDROID) {
            const isRegisteredRemote = messaging().isDeviceRegisteredForRemoteMessages;
            if (!isRegisteredRemote) {
                await messaging().registerDeviceForRemoteMessages();
            }
        }
        const fcmToken = await messaging().getToken();
        const deviceId = await DeviceInfo.getUniqueId();
        let data = {
            fcmToken,
            deviceId,
        };
        try {
            await registerFcmToken(data);
        } catch (error) {}
    } catch (error) {}
};

const deleteFCMToken = async (userID) => {
    try {
        await messaging().deleteToken();
        const deviceId = await DeviceInfo.getUniqueId();
        await _deleteFcmToken({
            userID,
            deviceId,
        });
    } catch (error) {}
};

const checkNotificationOnActiveState = async (callback = () => {}) => {
    try {
        const isGranted = await checkNotificationPermission();

        const isAndroidBelow33Granted = !SHOULD_REQUEST_NOTIFICATION_ANDROID && isGranted;

        const isGrantedOnIOSAndAndroid33 = isGranted;

        if (isAndroidBelow33Granted || isGrantedOnIOSAndAndroid33) {
            getFCMToken();
        }

        if (isGranted) {
        }

        callback?.(isGranted);
    } catch (error) {}
};

const useNotification = ({ successCallback, failureCallback } = {}) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const getAllNotification = () => dispatch(getAllNo());
    const userInfo = useShallowEqualSelector((state) => state.user.userInfo);
    const { goToPlotInfo } = useFlagAndUnFlag();
    const handleFetchDataIfNeed = async (remoteMessage) => {
        try {
            handleReqClaimantNoti(remoteMessage.data);
            handleAttestNoti(remoteMessage.data);
            handleEditPolygonSuccessNoti(remoteMessage.data, {
                callBack: async () => {
                    await dispatch(await fetchAllUserPlots(userInfo, navigation));
                },
            });
            switch (remoteMessage?.data?.type) {
                case TYPES.flaggedPlot:
                case TYPES.unflaggedPlot:
                    dispatch(fetchAllUserPlots(userInfo, navigation));
                    break;
                default:
                    break;
            }
            successCallback?.(remoteMessage);
        } catch (error) {
            console.log(error);
            failureCallback?.(error);
        }
    };

    // request provisional IOS
    useEffect(() => {
        if (!IS_ANDROID) {
            requestNotificationProvisional();
        }
    }, []);

    // check status first for android below 33
    useEffect(() => {
        if (!SHOULD_REQUEST_NOTIFICATION_ANDROID) {
            checkNotificationOnActiveState((granted) => {
                if (granted) {
                }
            });
        }
    }, []);

    // message arrived
    useEffect(() => {
        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
            const { messageId, data, notification } = remoteMessage;
            const { title, body, android } = notification || {};
            getAllNotification();
            handleFetchDataIfNeed(remoteMessage);
            await displayNotification({
                id: messageId,
                title,
                body,
                data,
                androidImage: android?.imageUrl,
            });
        });

        return () => unsubscribe();
    }, []);

    // android background state and quit state
    useEffect(() => {
        // open notification from background state
        let unSub = messaging().onNotificationOpenedApp((remoteMessage) => {
            getAllNotification();
            handleFetchDataIfNeed(remoteMessage);
            _handleNotificationPress(remoteMessage.data);
        });
        return () => {
            unSub();
        };
    }, []);

    // onTokenRefresh
    useEffect(() => {
        messaging().onTokenRefresh(async (token) => {
            console.log('onTokenRefresh', token);
        });
    }, []);
    const _markReadNotification = async (id) => {
        try {
            await markReadNotification({ notificationIDs: [id] });
            dispatch(notificationsSliceActions.markRead({ id: id }));
        } catch (error) {
            console.log(error);
        }
    };
    const _handleNotificationPress = (data) => {
        _markReadNotification(data?._id);
        switch (data?.type) {
            case TYPES.flaggedPlot:
            case TYPES.unflaggedPlot:
                goToPlotInfo({ data, type: data?.type });
                break;
            default:
                navigation.navigate('Alerts');
                break;
        }
    };
    // Subscribe to events
    useEffect(() => {
        const unsubscribe = notifee.onForegroundEvent(async ({ type, detail }) => {
            const { notification } = detail;
            const { data, title } = notification || {};

            console.log('Title', title);

            switch (type) {
                case EventType.DISMISSED:
                    if (notification?.id) {
                        await notifee.cancelNotification(notification?.id);
                    }
                    break;
                case EventType.PRESS:
                    await notifee.cancelNotification(notification?.id);
                    _handleNotificationPress(data);
                    break;
                case EventType.DELIVERED:
                    break;
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return {};
};

const TYPE_NOTIFICATIONS = {};
const inboxVar = () => {};

const handleNavigateNotification = async ({ remoteMessage, isInApp }) => {
    const notifyData =
        typeof remoteMessage?.data === 'string'
            ? JSON.parse(remoteMessage?.data)
            : remoteMessage?.data;
    const notifyPayload = notifyData?.payload ? JSON.parse(notifyData?.payload) : null;

    // events.emit('reloadTotalNotify');

    if (notifyData?.type === TYPE_NOTIFICATIONS.NEW_MESSAGE) {
        //reloadMailBox
    }

    if (isInApp) {
        const title = remoteMessage?.notification?.title;
        const body = remoteMessage?.notification?.body;
        const inboxId = inboxVar();
        if (inboxId) {
            if (inboxId === notifyPayload?.inboxId) {
                //reloadMessage
                return null;
            }
        }
        displayNotification({
            title,
            body,
            data: notifyData,
        });
    } else {
        // redirectNotify({
        //     data: notifyPayload,
        //     notificationType: notifyData?.type,
        //     createdAt: undefined,
        //     id: '',
        //     isHidden: false,
        //     isRead: false,
        //     message: '',
        //     updatedAt: undefined,
        //     userId: '',
        // });
    }
};

export {
    checkNotificationPermission,
    clearBadgeCount,
    decrementBadgeCount,
    deleteFCMToken,
    displayNotification,
    getFCMToken,
    handleNavigateNotification,
    incrementBadgeCount,
    requestNotificationPermission,
    setBadgeCount,
    useNotification,
};
