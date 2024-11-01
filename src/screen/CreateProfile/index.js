import { Box, Checkbox, Image, ScrollView, Text } from 'native-base';
import React, { useState } from 'react';
import useTranslate from '../../i18n/useTranslate';
import { authRegister, signupForReview, verifyAccessToken } from '../../rest_client/authClient';
import Constants, { setStorage } from '../../util/Constants';
import { createWallet, getCurrentAccount } from '../../util/script';

import { useNavigation } from '@react-navigation/core';
import { StyleSheet } from 'react-native';
import bip39 from 'react-native-bip39';
import DeviceInfo from 'react-native-device-info';
import { useDispatch } from 'react-redux';
import Button from '../../components/Button';
import ProfileForm from '../../components/ProfileForm';
import { fetchRequiredData } from '../../redux/actions';
import { userSliceActions } from '../../redux/reducer/user';
import { signinFromTrainer } from '../../rest_client/apiClient';
import { deleteFCMToken } from '../../util/hooks/useNotification';
import { addAccountToStorage } from '../../util/script';
import { showErr } from '../../util/showErr';
import { showGoodAlert } from '../../components/Alert/CommonGoodAlert';

export default function Index(props) {
    let {
        uri,
        phoneNumber,
        otpHash,
        otp,
        deepLink,
        password,
        agent,
        assignToOffline,
        matchId: matchUserId,
    } = props.route?.params || {};

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');
    const [isChecked, setChecked] = useState(false);
    const [requesting, setRequesting] = useState(false);
    const [data, setData] = useState({
        fullName: '',
        phoneNumber,
        // email: '',
        gender: 'male',
        // address: '',
        secretQuestion: 1,
        secretAnswer: '',
    });

    const upload = async ({ paymentAddr, seedPhrase }) => {
        try {
            let photo = {
                uri,
                type: 'image/jpeg',
                name: `${data.fullName}.jpg`,
            };

            let form = new FormData();
            form.append('image', photo);
            form.append('publicKey', paymentAddr);
            form.append('otpHash', otpHash);
            form.append('idToken', otp);
            form.append('seedPhrase', seedPhrase);
            form.append('questionID', data.secretQuestion);
            form.append('answer', data.secretAnswer);
            form.append('password', password);
            if (matchUserId) {
                form.append('matchUserId', matchUserId);
            }
            for (let key in data) {
                form.append(key, data[key]);
            }
            return form;
        } catch (err) {
            throw err;
        }
    };
    const account = async (registerFunc = authRegister) => {
        try {
            setError();
            setRequesting(true);
            let _mnemonic = await bip39.generateMnemonic(256);
            let success = await createWallet(data, _mnemonic);
            if (success) {
                let _account = await getCurrentAccount();
                let { paymentAddr, seedPhrase } = _account;
                // return;
                let _data = await upload({ paymentAddr, seedPhrase });
                let res = await registerFunc(_data);
                if (assignToOffline) {
                    sendPhoneBackToAssignOffline();
                } else if (agent) {
                    await signInFromTrainer();
                } else {
                    await setStorage(Constants.STORAGE.access_token, res.accessToken);
                    let res2 = await verifyAccessToken({
                        accessToken: res.accessToken,
                    });
                    await addAccountToStorage({ ...res2.data.user, accessToken: res.accessToken });
                    dispatch(
                        fetchRequiredData(
                            res2.data.user,
                            deepLink?.plotID ? '' : navigation,
                            () => {
                                setRequesting(false);
                                if (deepLink?.plotID) {
                                    navigation.reset({
                                        index: 11,
                                        routes: [
                                            {
                                                name: 'PlotInfo',
                                                params: deepLink,
                                            },
                                        ],
                                    });
                                }
                            },
                        ),
                    );
                }
            }
        } catch (e) {
            console.log(e, 'err');
            let err = '';
            if (typeof e !== 'string') {
                err = e.message;
            } else {
                err = e;
            }
            setError(err);
            setRequesting(false);
        }
    };

    const signInFromTrainer = async () => {
        const deviceId = await DeviceInfo.getUniqueId();
        const deviceName = await DeviceInfo.getDeviceName();
        let res = await signinFromTrainer({
            phoneNumber: phoneNumber,
            password,
            deviceId,
            deviceName,
        });

        await setStorage(Constants.STORAGE.access_token, res.data.userAccessToken);
        await setStorage(Constants.STORAGE.trainer_token, res.data.trainerAccessToken);
        dispatch(userSliceActions.setData({ trainer: res.data.trainer, user: res.data.user }));
        await deleteFCMToken(res?.data?.trainer?._id);
        await addAccountToStorage({ ...res.data.user, accessToken: res.data.userAccessToken });

        dispatch(
            fetchRequiredData(res.data.user, deepLink?.plotID ? '' : navigation, () => {
                if (deepLink?.plotID) {
                    navigation.reset({
                        index: 11,
                        routes: [
                            {
                                name: 'PlotInfo',
                                params: deepLink,
                            },
                        ],
                    });
                }
                if (res.data?.user?.blockedPlots?.length) {
                    dispatch(
                        userSliceActions.setShowWarning({
                            showWarning: true,
                        }),
                    );
                }
            }),
        );
    };

    const sendPhoneBackToAssignOffline = () => {
        navigation.navigate({
            name: 'uploadOfflinePlotAssign',
            params: { phoneToAdd: phoneNumber },
            merge: true,
        });
    };

    const signupUnderReview = async () => {
        try {
            setRequesting(true);
            let _mnemonic = await bip39.generateMnemonic(256);
            let success = await createWallet(data, _mnemonic);
            if (success) {
                let _account = await getCurrentAccount();
                let { paymentAddr, seedPhrase } = _account;
                let _data = await upload({
                    paymentAddr,
                    seedPhrase,
                    // matchUserId: matchId,
                });
                await signupForReview(_data);
                showGoodAlert(t('faceDetect.accountSubmitted'));
                navigation.navigate('Login');
            }
        } catch (error) {
            console.log(error);
            showErr(error);
        }
        setRequesting(false);
    };

    const isDisabled = () => {
        return !data.fullName || !isChecked || !data.secretAnswer || !data.secretAnswer;
    };
    const t = useTranslate();
    return (
        <>
            <ScrollView h="full" bg="white" px="20px" contentContainerStyle={styles.scroll}>
                <Box
                    mt="41px"
                    w="120px"
                    h="120px"
                    overflow="hidden"
                    borderRadius="60px"
                    bg="muted.400"
                >
                    <Image source={{ uri }} alt="profile" w="full" h="full" />
                </Box>
                <ProfileForm
                    onChangeData={setData}
                    onChangeFiles={setFiles}
                    files={files}
                    data={data}
                />
            </ScrollView>
            <Box
                w="full"
                px="20px"
                position="absolute"
                bottom={0}
                bgColor="white"
                py="12px"
                borderWidth="1px"
                borderColor="gray.100"
                shadow={9}
            >
                <Text textAlign="center" color="error.400">
                    {error}
                </Text>
                <Box flexDirection="row" alignItems="center">
                    <Checkbox
                        value={isChecked}
                        onChange={(e) => {
                            setChecked(e);
                        }}
                        // style={styles.checkbox}
                        accessibilityLabel="I've read and agree with the Terms and Conditions and the Privacy
              Policy."
                    />
                    <Text ml="12px">
                        {t('profile.readPolicy1')}
                        <Text color="blue.700" fontWeight="bold">
                            {' ' + t('profile.readPolicy2') + ' '}
                        </Text>
                        {t('profile.readPolicy3')}
                        <Text color="blue.700" fontWeight="bold">
                            {' ' + t('profile.privacyPolicy') + ' '}
                        </Text>
                        .
                    </Text>
                </Box>
                <Button
                    isLoading={requesting}
                    isDisabled={isDisabled()}
                    // onPress={account}
                    onPress={async () => {
                        try {
                            setRequesting(true);
                            if (matchUserId) {
                                await signupUnderReview();
                            } else {
                                await account();
                            }
                        } catch (error) {}
                        setRequesting(false);
                    }}
                    _container={{
                        mt: '12px',
                    }}
                >
                    {t('profile.createAccount')}
                </Button>
            </Box>
        </>
    );
}

const styles = StyleSheet.create({
    scroll: {
        alignItems: 'center',
        minHeight: '100%',
        paddingBottom: 140,
    },
});
