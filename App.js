/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import { Linking, StatusBar, useColorScheme } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { Provider, useDispatch } from 'react-redux';
import { getSecretQuestion, getVersionAppApi } from './src/rest_client/apiClient';
import Constants, { getStorage, setStorage } from './src/util/Constants';

import { useNetInfo } from '@react-native-community/netinfo';
import { useDisclose } from 'native-base';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import Theme from './Theme';
import LoadingPage from './src/components/LoadingPage';
import ShowWarning from './src/components/ShowWarning';
import ToastContainer from './src/components/Toast';
import { fetchRequiredData } from './src/redux/actions';
import useShallowEqualSelector from './src/redux/customHook/useShallowEqualSelector';
import { mapSliceActions } from './src/redux/reducer/map';
import { settingsSliceActions } from './src/redux/reducer/settings';
import { userSliceActions } from './src/redux/reducer/user';
import rootReducer from './src/redux/store';
import { getDeviceIp } from './src/rest_client/apiClient';
import { verifyAccessToken } from './src/rest_client/authClient';
import routes from './src/routes';
import CheckVersionApp from './src/screen/Explore/CheckVersionApp';
import CheckUseOfflineMap from './src/screen/MyOfflinePlot/CheckUseOfflineMap';
import { handleUserData } from './src/util/script';
import CommonGoodAlert from './src/components/Alert/CommonGoodAlert';
import useDetectEnvironmentTraining from './src/hooks/useDetectEnvironmentTranining';
import CommonGoodAlert2 from './src/components/Alert/CommonGoodAlert2';
import ClaimrankSheet from './src/components/ActionSheet/Rating/ClaimrankSheet';

const Stack = createNativeStackNavigator();

const App = () => {
    const [isRequireUpdate, setIsRequireUpdate] = useState(false);
    const [isVisibleUpdate, setIsVisibleUpdate] = useState(false);
    const [internet, setInternet] = useState(null);
    const [newAppVersion, setNewAppVersion] = useState('');
    const { isOpen: openOffline, onClose: onCloseOffline, onOpen: onOpenOffline } = useDisclose();
    //path of deep link
    const path = useRef();

    const { isFetching, isLogged } = useShallowEqualSelector((state) => state.user);
    const map = useShallowEqualSelector((state) => state.map);
    const dispatch = useDispatch();

    const { fetchEnvironmentTraining } = useDetectEnvironmentTraining();
    const getGeoData = async () => {
        try {
            const data = await getDeviceIp();
            dispatch(
                mapSliceActions.updateMap({
                    countryCode: data?.countryCode || 'UG',
                }),
            );
        } catch (error) {}
    };

    const getVersionApp = async () => {
        try {
            const currentVersion = DeviceInfo.getBuildNumber();
            const response = await getVersionAppApi();
            if (response?.data) {
                dispatch(
                    mapSliceActions.updateMap({
                        worthwhileNumber: response?.data?.claimchainFnCThreshold,
                        limitPlot: response?.data?.maxPlotPerUser,
                        haveFetchData: true,
                    }),
                );

                if (Number(response?.data?.versionCode) > Number(currentVersion)) {
                    openModalCheckVersion();
                    setNewAppVersion(response?.data?.version);
                }
                setIsRequireUpdate(response?.data?.isRequired && !__DEV__);
            }
        } catch (err) {
            console.log(err);
        }
    };
    const _getSecretQuestion = async () => {
        try {
            const response = await getSecretQuestion();
            dispatch(settingsSliceActions.receiveQuestion(response.data.questions));
        } catch (err) {
            console.log(err);
        }
    };
    const openModalCheckVersion = () => {
        setIsVisibleUpdate(true);
    };

    const closeModalCheckVersion = () => {
        setIsVisibleUpdate(false);
    };

    // const initUser = async () => {
    //     try {
    //         let access_token = await getStorage(Constants.STORAGE.access_token);
    //         let trainer_token = await getStorage(Constants.STORAGE.trainer_token);
    //         if (trainer_token) {
    //             await setStorage(Constants.STORAGE.access_token, trainer_token);
    //             try {
    //                 let resTrainer = await verifyAccessToken({
    //                     accessToken: trainer_token,
    //                 });
    //                 dispatch(
    //                     userSliceActions.setData({
    //                         trainer: resTrainer.data.user,
    //                     }),
    //                 );
    //             } catch (err) {
    //                 console.log('err ', err);
    //                 access_token = '';
    //             }
    //             await setStorage(Constants.STORAGE.access_token, access_token);
    //         }
    //         if (!access_token) {
    //             throw 'No access token';
    //         }
    //         let res = await verifyAccessToken({
    //             accessToken: access_token,
    //         });

    //         dispatch(
    //             userSliceActions.setLogged({
    //                 isLogged: true,
    //             }),
    //         );
    //         setTimeout(() => {
    //             if (path.current) {
    //                 Linking.openURL(path.current);
    //             }
    //         }, 1000);
    //         await handleUserData(res.data.user);
    //         dispatch(
    //             fetchRequiredData(res.data.user, null, () => {
    //                 setTimeout(() => {
    //                     if (res.data.user.blockedPlots.length) {
    //                         dispatch(
    //                             userSliceActions.setShowWarning({
    //                                 showWarning: true,
    //                             }),
    //                         );
    //                     }
    //                 }, 1000);
    //             }),
    //         );
    //     } catch (err) {
    //         console.log('err', err);
    //         dispatch(
    //             userSliceActions.setFetching({
    //                 isFetching: false,
    //             }),
    //         );
    //     }
    // };
    const netInfo = useNetInfo();

    const checkInternetConnection = async () => {
        if (netInfo.isConnected == false && netInfo.isInternetReachable == false) {
            setInternet(false);
            onOpenOffline();
            // navigation.navigate('OfflineCreatePlot');
        } else if (netInfo.isConnected && netInfo.isInternetReachable) {
            if (!map.haveFetchData) {
                await fetchEnvironmentTraining();
                const response = await getVersionAppApi();
                if (response?.data) {
                    dispatch(
                        mapSliceActions.updateMap({
                            worthwhileNumber: response?.data?.claimchainFnCThreshold,
                            limitPlot: response?.data?.maxPlotPerUser,
                            haveFetchData: true,
                        }),
                    );
                }
            }
            setInternet(true);
        }
    };
    useEffect(() => {
        // THIS IS THE MAIN POINT OF THIS ANSWER
        const navigateToInitialUrl = async () => {
            const initialUrl = await Linking.getInitialURL();
            if (initialUrl) {
                path.current = initialUrl;
            }
        };
        navigateToInitialUrl();
    }, []);

    const navigation = useNavigation();

    useEffect(() => {
        checkInternetConnection();
    }, [netInfo]);

    const initialApp = async () => {
        SplashScreen.hide();
        await fetchEnvironmentTraining();
        const timers = [];
        const initUser = async () => {
            try {
                // If user has logged in before, get temporary data from storage
                // This data will be replaced by the real data after verifying the access token
                // This will help to show the user's data faster
                const lastLoggedAccount = await getStorage(Constants.STORAGE.lastLoggedAccount);
                if (lastLoggedAccount) {
                    dispatch(
                        userSliceActions.updateUserInfo({
                            userInfo: JSON.parse(lastLoggedAccount),
                        }),
                    );
                    dispatch(
                        userSliceActions.setLogged({
                            isLogged: true,
                        }),
                    );
                    dispatch(
                        userSliceActions.setFetching({
                            isFetching: false,
                        }),
                    );
                }

                let access_token = await getStorage(Constants.STORAGE.access_token);
                let trainer_token = await getStorage(Constants.STORAGE.trainer_token);
                if (trainer_token) {
                    await setStorage(Constants.STORAGE.access_token, trainer_token);
                    try {
                        let resTrainer = await verifyAccessToken({
                            accessToken: trainer_token,
                        });
                        dispatch(
                            userSliceActions.setData({
                                trainer: resTrainer.data.user,
                            }),
                        );
                    } catch (err) {
                        console.log('err ', err);
                        access_token = '';
                    }
                    await setStorage(Constants.STORAGE.access_token, access_token);
                }
                if (!access_token) {
                    throw 'No access token';
                }
                let res = await verifyAccessToken({
                    accessToken: access_token,
                });

                dispatch(
                    userSliceActions.setLogged({
                        isLogged: true,
                    }),
                );
                await setStorage(
                    Constants.STORAGE.lastLoggedAccount,
                    JSON.stringify(res.data.user),
                );
                timers.push(
                    setTimeout(() => {
                        if (path.current) {
                            Linking.openURL(path.current);
                        }
                    }, 1000),
                );
                await handleUserData(res.data.user);
                dispatch(
                    fetchRequiredData(res.data.user, null, () => {
                        timers.push(
                            setTimeout(() => {
                                if (res.data.user.blockedPlots.length) {
                                    dispatch(
                                        userSliceActions.setShowWarning({
                                            showWarning: true,
                                        }),
                                    );
                                }
                            }, 1000),
                        );
                    }),
                );
            } catch (err) {
                if (isLogged) {
                    // If user has logged in before, but the access token is invalid
                    dispatch(userSliceActions.setLogged({ isLogged: false }));
                    navigation.navigate('Welcome');
                }
                console.log('err', err);
            } finally {
                dispatch(
                    userSliceActions.setFetching({
                        isFetching: false,
                    }),
                );
            }
        };

        initUser();
        checkInternetConnection();
        getVersionApp();

        timers.push(
            setTimeout(() => {
                getGeoData();
            }, 1000),
        );
        _getSecretQuestion();
        return {
            timers,
        };
    };

    useEffect(() => {
        const { timers } = initialApp();
        return () => timers?.forEach((timer) => clearTimeout(timer));
    }, []);

    const isDarkMode = useColorScheme() === 'dark';

    return (
        <>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <SafeAreaView style={{ height: '100%' }}>
                    <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                    {isFetching && <LoadingPage />}

                    <ShowWarning isVisibleUpdate={isVisibleUpdate} />
                    <CheckVersionApp
                        newVersion={newAppVersion}
                        onClose={closeModalCheckVersion}
                        isOpen={isVisibleUpdate}
                        isRequireUpdate={isRequireUpdate}
                    />
                    <CheckUseOfflineMap
                        isOpen={openOffline}
                        onClose={onCloseOffline}
                        status="offline"
                    />
                    {!isFetching && (
                        <Stack.Navigator
                            initialRouteName={isLogged ? 'Main' : internet ? 'Welcome' : 'Welcome'}
                        >
                            {routes.map((item, index) => {
                                return <Stack.Screen {...item} key={index} />;
                            })}
                        </Stack.Navigator>
                    )}
                    <CommonGoodAlert />
                    <CommonGoodAlert2 />
                    <ClaimrankSheet />
                </SafeAreaView>
            </GestureHandlerRootView>
            <ToastContainer />
        </>
    );
};

/**
 * @type {import('native-base').INativebaseConfig}
 */
const config = {
    dependencies: {
        'linear-gradient': require('react-native-linear-gradient').default,
    },
};

export default function Container(props) {
    const linking = {
        prefixes: ['commonlands://'],
        config: {
            screens: {
                PlotInfo: {
                    path: 'invites/:plotID/:longlat',
                },
            },
        },
    };

    return (
        <Provider store={rootReducer}>
            <NativeBaseProvider theme={Theme} config={config}>
                <NavigationContainer linking={linking} fallback={<LoadingPage></LoadingPage>}>
                    <App {...props} />
                </NavigationContainer>
            </NativeBaseProvider>
        </Provider>
    );
}
