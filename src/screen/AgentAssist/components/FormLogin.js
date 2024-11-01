import { useNavigation } from '@react-navigation/native';
import { Box, Center, Input, ScrollView, Spinner, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { useDispatch } from 'react-redux';
import Button from '../../../components/Button';
import PhoneInput from '../../../components/PhoneInput';
import useTranslate from '../../../i18n/useTranslate';
import { fetchRequiredData } from '../../../redux/actions';
import useShallowEqualSelector from '../../../redux/customHook/useShallowEqualSelector';
import { userSliceActions } from '../../../redux/reducer/user';
import {
    searchByPhone,
    signinFromTrainer,
    signinFromTrainerWithPassword,
} from '../../../rest_client/apiClient';
import Constants, { extractCountryCode, setStorage } from '../../../util/Constants';
import { deleteFCMToken } from '../../../util/hooks/useNotification';
import { handleUserData } from '../../../util/script';
import ListAccount from '../../Welcome/SignIn/ListAccount';
import Ring1 from '../../../components/Icons/Ring1';
import { useFaceDetect } from '../../../components/FaceRecognition';
import Header from '../../../components/Header';
import ButtonInfoAgent from './ButtonInfoAgent';
import { showErr } from '../../../util/showErr';

export default function Index({ route, containerProps }) {
    const user = useShallowEqualSelector((state) => state.user);
    const t = useTranslate();

    const [value, setValue] = useState('');
    const [countryCode, setCountryCode] = useState('');
    const [phoneInvalid, setPhoneInvalid] = useState(false);
    const [formattedValue, setFormattedValue] = useState('');
    const [loading, setLoading] = useState(false);
    const faceDetectHook = useFaceDetect();
    const [openFaceDetect, setOpenFaceDetect] = useState(false);
    const [loginWithPassword, setLoginWithPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [searchingPhone, setSearchingPhone] = useState(false);

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const signUp = () => {
        navigation.navigate('SignUp', {
            agent: true,
        });
    };
    const disabled = !formattedValue || phoneInvalid || loading;

    // eslint-disable-next-line no-unused-vars
    const handleLogin = async (trainer, user) => {
        await setStorage(Constants.STORAGE.access_token, user.accessToken);
        await setStorage(Constants.STORAGE.trainer_token, trainer.accessToken);
        dispatch(userSliceActions.setData({ trainer: trainer, user: user }));
        await deleteFCMToken(trainer?._id);
        await handleUserData({ ...user, accessToken: user.accessToken });
        dispatch(
            fetchRequiredData(user, navigation, () => {
                setLoading(false);
                if (user?.blockedPlots?.length) {
                    dispatch(
                        userSliceActions.setShowWarning({
                            showWarning: true,
                        }),
                    );
                }
            }),
        );
    };

    const _loginWithPassword = async () => {
        try {
            setLoading(true);
            await onSubmit(signinFromTrainerWithPassword);
        } catch (err) {
            showErr(err);
            setLoading(false);
        }
    };

    const onSubmit = async (signinFunc = signinFromTrainer) => {
        try {
            setLoading(true);
            const deviceId = await DeviceInfo.getUniqueId();
            const deviceName = await DeviceInfo.getDeviceName();
            let res = await signinFunc(
                {
                    phoneNumber:
                        faceDetectHook?.otpToken || signinFunc !== signinFromTrainer
                            ? formattedValue
                            : null,
                    password,
                    deviceId,
                    deviceName,
                    idToken: faceDetectHook?.otpToken,
                    faceToken: faceDetectHook?.faceToken,
                },
                navigation,
                dispatch,
            );
            await handleLogin(
                {
                    accessToken: res.data.trainerAccessToken,
                    ...res.data.trainer,
                },
                {
                    accessToken: res.data.userAccessToken,
                    ...res.data.user,
                },
            );
        } catch (err) {
            console.log(err);
            if (err === 'User with the given public key/seed phrase/phone number does not exists') {
                err = t('auth.userNotExists');
            } else if (err === 'Trainer cannot use this API to login to their own account') {
                err = t('auth.trainerCannotLoginTwice');
            }
            if (signinFunc !== signinFromTrainer) {
                throw new Error(err);
            }
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
                <Text {...styles.titlePage} mt={'45px'}>
                    {t('agentAssist.login')}
                </Text>
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
                <Box my="20px">
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
                <Box mb="12px">
                    <Button
                        _container={{
                            opacity: disabled ? 0.5 : 1,
                        }}
                        bg="primary.600"
                        onPress={async () => {
                            try {
                                if (user?.userInfo?.phoneNumber === formattedValue) {
                                    showErr(t('auth.trainerCannotLoginTwice'));
                                    throw new Error(t('auth.trainerCannotLoginTwice'));
                                }
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
                        isLoading={loading || searchingPhone}
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
                <Text ml="4px" fontWeight="bold" onPress={signUp} color="primary.600">
                    {t('auth.signUp')}
                </Text>
            </Box>
            <ListAccount
                exception={user?.userInfo}
                route={route}
                setAccountSelected={initPhoneNumber}
            />
        </ScrollView>
    );

    return (
        <Box {...styles.container}>
            <Header
                title="Agent Assist"
                onBack={() => {
                    if (openFaceDetect) {
                        setOpenFaceDetect(false);
                    } else {
                        navigation.goBack();
                    }
                }}
            >
                <ButtonInfoAgent />
            </Header>
            {!openFaceDetect && MainScreen}
            {openFaceDetect && !loading && (
                <Box px="20px" h="full">
                    {faceDetectHook.Component({
                        phoneNumber: formattedValue,
                        needTakePhoto: false,
                    })}
                </Box>
            )}
            {loading && <Center h="full">{<Spinner />}</Center>}
            {/* <SetUpYourPassword /> */}
        </Box>
    );
}

const styles = StyleSheet.create({
    container: {
        h: 'full',
        paddingBottom: 10,
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
    },
    contentContainerStyle: {
        alignItems: 'center',
    },
    titlePage: {
        fontWeight: '600',
        fontSize: '16px',
        maxWidth: '177px',
        textAlign: 'center',
    },
    // error: {
    //     color: 'red.500',
    //     mt: '4px',
    //     textAlign: 'center',
    // },
    subTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        mt: '4px',
    },
});
