import Constants, { getStorage, setStorage } from '../../util/Constants';
import { getAllPlotFlagged, getUserPlots, logoutApi } from '../../rest_client/apiClient';
import { logout as reduxLogout } from '../../redux/actions/user';
import DeviceInfo from 'react-native-device-info';
import auth from '@react-native-firebase/auth';
import { mapSliceActions } from '../reducer/map';
import { userSliceActions } from '../reducer/user';
import { fetchRequiredData } from '.';
import { getFCMToken } from '../../util/hooks/useNotification';
import { showErr } from '../../util/showErr';

export const logout = (navigation) => {
    return async (dispatch) => {
        auth()
            .signOut()
            .then(() => {
                console.log('logout success');
            })
            .catch(() => {})
            .finally(async () => {
                if (navigation) {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Welcome' }],
                    });
                }
                try {
                    const deviceId = await DeviceInfo.getUniqueId();
                    let data = { deviceId };
                    await logoutApi(data);
                } catch (error) {
                    console.log('error logout', error);
                }
                dispatch(userSliceActions.reset());
                dispatch(mapSliceActions.reset());

                await setStorage(Constants.STORAGE.access_token, '');
                await setStorage(Constants.STORAGE.trainer_token, '');
            });
        await setStorage(Constants.STORAGE.lastLoggedAccount, '');
    };
};

export const signOutTrainer = ({ navigation, trainer, t }) => {
    return async (dispatch) => {
        auth()
            .signOut()
            .then(() => {
                console.log('signOutTrainer success');
            })
            .catch(() => {})
            .finally(async () => {
                if (navigation) {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Main' }],
                    });
                }
                try {
                    const deviceId = await DeviceInfo.getUniqueId();
                    let data = { deviceId };
                    await logoutApi(data);
                } catch (error) {
                    console.log('error logout', error);
                }
                // dispatch(userSliceActions.reset());
                // dispatch(mapSliceActions.reset());
                try {
                    const trainerToken = await getStorage(Constants.STORAGE.trainer_token);
                    await setStorage(Constants.STORAGE.access_token, trainerToken);
                    await setStorage(Constants.STORAGE.trainer_token, '');
                    await getFCMToken();
                } catch (error) {
                    showErr(t?.('error.sessionExpired') || 'Session expired. Please login again');
                    dispatch(reduxLogout(navigation));
                    dispatch(userSliceActions.setData({ trainer: {} }));
                    dispatch(
                        fetchRequiredData(trainer, null, () => {
                            setTimeout(() => {
                                if (trainer.blockedPlots.length) {
                                    dispatch(
                                        userSliceActions.setShowWarning({
                                            showWarning: true,
                                        }),
                                    );
                                }
                            }, 1000);
                        }),
                    );
                    return;
                }
                dispatch(userSliceActions.setData({ trainer: {} }));
                dispatch(
                    fetchRequiredData(trainer, null, () => {
                        setTimeout(() => {
                            if (trainer.blockedPlots.length) {
                                dispatch(
                                    userSliceActions.setShowWarning({
                                        showWarning: true,
                                    }),
                                );
                            }
                        }, 1000);
                    }),
                );
            });
    };
};

export const fetchAllUserPlots = (userInfo, navigation) => {
    return async (dispatch) => {
        try {
            let resUserPlots = await getUserPlots(userInfo._id, navigation, dispatch);
            let response = await getAllPlotFlagged();
            let dataUpdate = {};
            if (resUserPlots.data) {
                dataUpdate.plots = resUserPlots?.data;
            }
            if (response?.data) {
                dataUpdate.plotFlagged = response?.data;
            }
            dispatch(userSliceActions.setData(dataUpdate));
        } catch (err) {
            console.log(err);
        }
    };
};
