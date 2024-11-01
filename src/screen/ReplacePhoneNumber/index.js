import { Box, Text, useDisclose } from 'native-base';
import React, { useState } from 'react';
import useTranslate from '../../i18n/useTranslate';
import Constants, { setStorage } from '../../util/Constants';
import { addAccountToStorage, getAccounts, updateAccountToStorage } from '../../util/script';

import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import Header from '../../components/Header';
import { fetchRequiredData } from '../../redux/actions';
import { faceCompare, replacePhoneNumber } from '../../rest_client/apiClient';
import { verifyAccessToken } from '../../rest_client/authClient';
import ModalConfirm from './ModalConfirm';
import UpdateNewPhoneNumber from './UpdateNewPhoneNumber';
import VerifyCurrentPhoneNumber from './VerifyCurrentPhoneNumber';
import { useFaceDetect } from '../../components/FaceRecognition';
import TakeAPhoto from '../../screen/TakeAPhoto';
import { showErr } from '../../util/showErr';

export const UpdateSimContext = React.createContext();

export default function Index(props) {
    const t = useTranslate();

    const dispatch = useDispatch();
    const [requesting, setRequesting] = useState(false);
    const navigation = useNavigation();
    const { isOpen: isOpenConfirm, onClose: onCloseConfirm } = useDisclose();
    const [secretQuestionData, setSecretQuestionData] = useState({
        secretQuestion: 1,
        secretAnswer: '',
    });
    const _onCloseConfirm = () => {
        setStep(2);
        onCloseConfirm();
    };
    const [formattedValue, setFormattedValue] = useState('');
    const [backToGetPinFunction, setBackToGetPinFunction] = useState(null);
    const [newFormattedValue, setNewFormattedValue] = useState('');
    const [error, setError] = useState(''); //error from api
    const [step, setStep] = useState(1);
    const faceDetectHook = useFaceDetect();
    const onBack = () => {
        if (requesting) return;
        if (step == 2 && backToGetPinFunction) {
            backToGetPinFunction();
            setBackToGetPinFunction(null);
            return;
        }
        if (step > 1) {
            setStep(step - 1);
            return;
        }
        if (props.navigation.canGoBack()) {
            props.navigation.goBack();
        }
    };

    const checkFace = async (uri) => {
        try {
            const formSubmit = new FormData();
            formSubmit.append('phoneNumber', formattedValue);
            formSubmit.append('file', {
                uri: uri,
                type: 'image/jpeg',
                name: 'image.jpg',
            });
            let { data } = await faceCompare(formSubmit);
            if (data?.error_code) {
                throw new Error(data?.error_detail || data?.error_message);
            }
            return data?.objectKey;
        } catch (error) {
            if (JSON.stringify(error?.message || error).includes('Something went wrong')) {
                throw new Error('Face check failed.');
            }
            throw error;
        }
    };

    const submit = async (uri) => {
        // console.log('helu');
        // return;
        setRequesting(true);
        setError('');

        try {
            //face compare
            const imgKey = await checkFace(uri);
            const form = {
                newPofKey: imgKey,
                currentPhoneNo: formattedValue,
                newPhoneNo: newFormattedValue,
                questionID: secretQuestionData.secretQuestion,
                answer: secretQuestionData.secretAnswer,
                // idToken: faceDetectHook?.otpToken ? faceDetectHook?.otpToken : null,
                // phoneNumber: faceDetectHook?.otpToken ? formattedValue : null,
                // faceToken: faceDetectHook?.faceToken,
            };
            let res = await replacePhoneNumber(form);
            //get all header
            let token = res.headers['authorization']?.split(' ')[1];
            await setStorage(Constants.STORAGE.access_token, token);
            let res2 = await verifyAccessToken({
                accessToken: token,
            });
            await addAccountToStorage(res2.data.user);
            dispatch(
                fetchRequiredData(res2.data.user, navigation, () => {
                    setRequesting(false);
                    // navigation.navigate('Main');
                    navigation.navigate('EditProfile');
                }),
            );
            let accounts = await getAccounts();
            if (accounts) {
                let index = accounts.findIndex((item) => item.phoneNumber === formattedValue);
                if (index > -1) {
                    updateAccountToStorage(
                        {
                            phoneNumber: newFormattedValue,
                        },
                        index,
                    );
                }
            }
            // onOpenSuccess();
        } catch (err) {
            showErr(err?.message || err);
        }
        setRequesting(false);
    };
    const getTitle = () => {
        switch (step) {
            case 1:
                return t('replacePhoneNumber.verifyAccount');
            case 2:
                return backToGetPinFunction
                    ? t('replacePhoneNumber.pinVerification')
                    : t('replacePhoneNumber.updateNewPhone');
            case 3:
                return t('replacePhoneNumber.faceRecognition');
            case 4:
                return t('replacePhoneNumber.faceRecognition');
            default:
                return t('replacePhoneNumber.verifyAccount');
        }
    };
    return (
        <UpdateSimContext.Provider
            value={{ secretQuestionData, setSecretQuestionData, setBackToGetPinFunction }}
        >
            <Box h="full" bgColor={'white'}>
                <Header title={getTitle()} onBack={onBack} />
                <Box h="full" px="24px" contentContainerStyle={styles.container}>
                    {step == 1 && (
                        <VerifyCurrentPhoneNumber
                            step={step}
                            setStep={setStep}
                            formattedValue={formattedValue}
                            setFormattedValue={setFormattedValue}
                        />
                    )}
                    {step == 2 && (
                        <UpdateNewPhoneNumber
                            onVerifiedOTP={(value) => {
                                setNewFormattedValue(value);
                                setBackToGetPinFunction(null);
                                setStep(4);
                            }}
                        />
                    )}

                    {step == 3 && (
                        <Box pt="30px" alignItems="center" flex={1}>
                            {faceDetectHook.Component({
                                onVerified: () => {
                                    setStep(4);
                                },
                                phoneNumber: formattedValue,
                                needTakePhoto: false,
                            })}
                            <Text color="error.400" mt="12px">
                                {error}
                            </Text>
                        </Box>
                    )}
                    {step === 4 && (
                        <TakeAPhoto
                            showHeader={false}
                            _container={{
                                pb: '50px',
                                pt: '50px',
                            }}
                            snapBtnColor="primary.600"
                            faceRecognition={true}
                            submitButton={{
                                label: t('button.submit'),
                                onPress: (uri) => {
                                    submit(uri);
                                },
                                isLoading: requesting,
                            }}
                        />
                    )}
                </Box>
                <ModalConfirm
                    isLoading={requesting}
                    isOpen={isOpenConfirm}
                    onClose={_onCloseConfirm}
                    onConfirm={submit}
                />
            </Box>
        </UpdateSimContext.Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 20,
        paddingHorizontal: 22,
    },
});
