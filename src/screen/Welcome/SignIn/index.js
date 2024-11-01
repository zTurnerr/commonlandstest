import useTranslate from '../../../i18n/useTranslate';
import { Box, Center, Input, Image, ScrollView, Spinner, Text } from 'native-base';
import Constants, { extractCountryCode, setStorage } from '../../../util/Constants';
import React, { useEffect, useState } from 'react';

import Button from '../../../components/Button';
import DeviceInfo from 'react-native-device-info';
import ListAccount from './ListAccount';
import PhoneInput from '../../../components/PhoneInput';
import { StyleSheet } from 'react-native';
import { fetchRequiredData } from '../../../redux/actions';
import { handleUserData } from '../../../util/script';
import logoDark from '../../../images/logoColor.png';
import { authLogin, signInWithPassword } from '../../../rest_client/authClient';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { userSliceActions } from '../../../redux/reducer/user';
import Ring1 from '../../../components/Icons/Ring1';
import { useFaceDetect } from '../../../components/FaceRecognition';
import HeaderPage from '../../../components/HeaderPage';
import { showErr } from '../../../util/showErr';
import { searchByPhone } from '../../../rest_client/apiClient';
import useDetectEnvironmentTraining from '../../../hooks/useDetectEnvironmentTranining';

export default function Index({ route, containerProps }) {
    const t = useTranslate();

    const [value, setValue] = useState('');
    const [countryCode, setCountryCode] = useState('');
    const [phoneInvalid, setPhoneInvalid] = useState(false);
    const [searchingPhone, setSearchingPhone] = useState(false);
    const [formattedValue, setFormattedValue] = useState('');
    const [openFaceDetect, setOpenFaceDetect] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loginWithPassword, setLoginWithPassword] = useState(false);
    const [password, setPassword] = useState('');
    const faceDetectHook = useFaceDetect();
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const params = route?.params || {};
    const updatePhoneNumber = () => {
        navigation.navigate('ReplacePhoneNumber');
    };
    const { updateMap } = useDetectEnvironmentTraining();

    const signUp = () => {
        navigation.navigate('SignUp');
    };
    // const forgotPassword = () => {
    //     navigation.navigate('ForgotPassword');
    // };
    const disabled = !formattedValue || phoneInvalid || loading;
    const onSubmit = async () => {
        try {
            setLoading(true);
            const deviceId = await DeviceInfo.getUniqueId();
            const deviceName = await DeviceInfo.getDeviceName();
            let res = await authLogin({
                phoneNumber: faceDetectHook?.otpToken ? formattedValue : null,
                deviceId,
                deviceName,
                faceToken: faceDetectHook?.faceToken,
                idToken: faceDetectHook?.otpToken,
            });
            await handleLogin(res.data);
        } catch (err) {
            showErr(err);
            if (err === 'User with the given public key/seed phrase/phone number does not exists') {
                err = t('auth.userNotExists');
            }
            setLoading(false);
            setOpenFaceDetect(false);
        }
    };
    const _loginWithPassword = async () => {
        try {
            setLoading(true);
            const deviceId = await DeviceInfo.getUniqueId();
            const deviceName = await DeviceInfo.getDeviceName();
            let res = await signInWithPassword({
                phoneNumber: formattedValue,
                deviceId,
                deviceName,
                password,
            });
            await handleLogin(res.data);
        } catch (err) {
            showErr(err);
            setLoading(false);
        }
    };
    const initPhoneNumber = async ({ phoneNumber }) => {
        try {
            if (phoneNumber) {
                let phone = await extractCountryCode(phoneNumber);
                setFormattedValue(phoneNumber);
                setValue(phone.number);
                setCountryCode(phone.countryCode);
            }
        } catch (err) {}
    };
    const handleLogin = async (data) => {
        await setStorage(Constants.STORAGE.access_token, data.accessToken);
        await handleUserData({ ...data.user, accessToken: data.accessToken });
        await updateMap();
        dispatch(
            fetchRequiredData(data.user, params?.plotID ? '' : navigation, () => {
                setLoading(false);
                if (params?.plotID) {
                    navigation.reset({
                        index: 11,
                        routes: [
                            {
                                name: 'PlotInfo',
                                params: params,
                            },
                        ],
                    });
                }
                if (data?.user?.blockedPlots?.length) {
                    dispatch(
                        userSliceActions.setShowWarning({
                            showWarning: true,
                        }),
                    );
                }
            }),
        );
    };

    // useEffect(() => {
    //     if (__DEV__) setPassword('123456');
    // }, [formattedValue]);

    // useEffect(() => {
    //     if (password && formattedValue && __DEV__) onSubmit();
    // }, [password, formattedValue]);

    useEffect(() => {
        if (faceDetectHook?.faceToken || faceDetectHook?.otpToken) {
            onSubmit();
        }
    }, [faceDetectHook?.faceToken, faceDetectHook?.otpToken]);

    const MainScreen = (
        <ScrollView
            {...styles.scrollView}
            contentContainerStyle={styles.contentContainerStyle}
            {...containerProps}
        >
            <Box {...styles.header}>
                <Image mt="45px" source={logoDark} alt="logo dark" />
                <Text {...styles.titlePage}>{t('auth.welcomeBack')}</Text>
                <Text mt="4px">{t('auth.enterAccount')}</Text>
            </Box>
            <Box w="full" mt="42px">
                <Text {...styles.title}>{t('components.phoneNumber')}</Text>
                <PhoneInput
                    value={value}
                    onChangeText={(text) => {
                        setValue(text);
                    }}
                    onChangeFormattedText={(text) => {
                        setFormattedValue(text);
                    }}
                    countryCode={countryCode}
                    onInvalid={(invalid) => {
                        setPhoneInvalid(invalid);
                    }}
                />
                {loginWithPassword && (
                    <Box>
                        <Text {...styles.title}>{t('components.password')}</Text>
                        <Input
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            placeholder={t('changePass.enterYourPass')}
                            type="password"
                            disabled={loading}
                        />
                    </Box>
                )}
                <Box mt="18px">
                    {loginWithPassword ? (
                        <Button disabled={disabled || !password} onPress={_loginWithPassword}>
                            {t('button.login')}
                        </Button>
                    ) : (
                        <Button
                            _container={{
                                opacity: disabled ? 0.5 : 1,
                            }}
                            bg="primary.600"
                            isLoading={loading || searchingPhone}
                            onPress={() => {
                                setLoginWithPassword(true);
                            }}
                            disabled={disabled}
                        >
                            {t('button.loginWithPassword')}
                        </Button>
                    )}
                </Box>
                <Box mt="10px" mb="12px">
                    <Button
                        _container={{
                            opacity: disabled ? 0.5 : 1,
                        }}
                        bg="primary.600"
                        isLoading={loading || searchingPhone}
                        onPress={async () => {
                            try {
                                setSearchingPhone(true);
                                let { data } = await searchByPhone({
                                    phoneNumber: formattedValue,
                                });
                                if (!data?.user || data?.user?.reviewInfo?.inReview) {
                                    showErr(t('faceDetect.notFoundOrUnderReview'));
                                    throw new Error(t('subplot.userNotFound'));
                                }
                                setOpenFaceDetect(true);
                            } catch (err) {}
                            setSearchingPhone(false);
                        }}
                        disabled={disabled}
                    >
                        {t('button.loginWithFaceRecognition')}
                    </Button>
                    <Center h="full" position={'absolute'} w="30px" left={'15px'} top={0}>
                        <Ring1 />
                    </Center>
                </Box>
            </Box>

            <Box {...styles.subTitle}>
                <Text fontSize="12px" mr="4px">
                    {t('auth.noAccount')}
                </Text>
                <Text ml="4px" fontWeight="bold" onPress={signUp} color="link">
                    {t('auth.signUp')}
                </Text>
            </Box>
            <Box {...styles.subTitle}>
                <Text fontSize="12px" mr="4px">
                    {t('auth.lostSimCard')}
                </Text>
                <Text ml="4px" fontWeight="bold" onPress={updatePhoneNumber} color="link">
                    {t('auth.updateNew')}
                </Text>
            </Box>
            <ListAccount route={route} setAccountSelected={initPhoneNumber} />
        </ScrollView>
    );

    return (
        <Box {...styles.container}>
            <HeaderPage
                onPress={() => {
                    if (openFaceDetect) {
                        if (faceDetectHook.step === 1) {
                            faceDetectHook.setStep(0);
                            return;
                        }
                        setOpenFaceDetect(false);
                    } else {
                        navigation.goBack();
                    }
                }}
                title={
                    openFaceDetect
                        ? faceDetectHook.step === 1
                            ? t('replacePhoneNumber.pinVerification')
                            : t('button.login')
                        : null
                }
            />
            {!openFaceDetect && MainScreen}
            {openFaceDetect && !loading && (
                <Box px="20px" h="full">
                    {faceDetectHook.Component({
                        phoneNumber: formattedValue,
                        needTakePhoto: false,
                        mainBtnText: 'faceDetect.signInWithOTP',
                        isModalFail: true,
                    })}
                </Box>
            )}
            {loading && (
                <Box h="full" w="full" position="absolute" bg="white">
                    <Center h="full">
                        <Spinner color="primary.600" />
                    </Center>
                </Box>
            )}
            {/* <SetUpYourPassword /> */}
        </Box>
    );
}

const styles = StyleSheet.create({
    container: {
        h: 'full',
        bg: 'white',
    },
    title: {
        mb: '8px',
        fontWeight: 'bold',
        fontSize: 12,
    },
    header: {
        alignItems: 'center',
        w: 'full',
    },
    scrollView: {
        h: 'full',
        bg: 'white',
        px: '20px',
        pb: '20px',
    },
    contentContainerStyle: {
        alignItems: 'center',
    },
    titlePage: {
        mt: '15px',
        fontWeight: '700',
        fontSize: '18px',
    },
    subTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        mt: '4px',
    },
});
