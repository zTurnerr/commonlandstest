import { useNavigation } from '@react-navigation/core';
import { Box, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { useDispatch } from 'react-redux';
import Button from '../../components/Button';
import PhoneInput from '../../components/PhoneInput';
import VerifySecretQuestion from '../../components/VerifySecretQuestion';
import useTranslate from '../../i18n/useTranslate';
import { logout } from '../../redux/actions/user';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import { verifyPhone } from '../../rest_client/authClient';
import { extractCountryCode } from '../../util/Constants';
import { useFaceDetect } from '../../components/FaceRecognition';
import useUploadImg from '../../hooks/useUploadImg';
import { checkFace } from '../../util/faceSearch/faceCheck';
import ReviewPhotoStep from '../Contract/SignByPass/ReviewPhotoStep';
import { showErr } from '../../util/showErr';
let interval = '';
const time = 15;
export default function Index({ isOpen, onClose, onSubmit, userPhoneNumber }) {
    const t = useTranslate();
    const user = useShallowEqualSelector((state) => state.user.userInfo);
    const [error, setError] = useState(true);
    const [requesting, setRequesting] = useState(false);
    const [formattedValue, setFormattedValue] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState('');
    const [phoneInvalid, setPhoneInvalid] = useState(true);
    const [success, setSuccess] = useState(false);
    const [countdown, setCountdown] = useState(time);
    const [verifiedFace, setVerifiedFace] = React.useState(null);

    const faceDetectHook = useFaceDetect();
    const uploadImgHook = useUploadImg();
    // const [count, setCount] = useState(1);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [step, setStep] = useState(1);

    const _logout = async () => {
        onClose();
        dispatch(logout(navigation));
    };
    const userIsExisted = async (phone) => {
        let res = await verifyPhone(phone);
        let { isPhoneRegistered, isActive, isBanned } = res.data;

        if (isBanned) {
            setError(t('error.phoneAlready'));
            return true;
        }

        if (
            (isPhoneRegistered && isActive) ||
            (isPhoneRegistered && !isActive && !user.oldNumbers.includes(formattedValue))
        ) {
            setError(t('error.phoneExits'));
            return true;
        }
        return false;
    };

    const initPhoneNumber = async () => {
        try {
            let phone = await extractCountryCode(userPhoneNumber);
            setFormattedValue(userPhoneNumber);
            setPhoneNumber(phone.number);
            setCountryCode(phone.countryCode);
            setSuccess(false);
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        if (success) {
            if (interval) {
                clearInterval(interval);
            }
            interval = setInterval(() => {
                setCountdown((countdown) => {
                    if (countdown === 0) {
                        clearInterval(interval);
                        _logout();
                        return 0;
                    }
                    return countdown - 1;
                });
            }, 1000);
        }
        return () => {
            clearInterval(interval);
        };
    }, [success]);
    useEffect(() => {
        initPhoneNumber();
        setStep(2);
        setError('');
    }, [isOpen]);

    const _onSubmit = async () => {
        try {
            setCountdown(time);
            setRequesting(true);
            setError('');
            let key = verifiedFace?.objectKey;
            if (!key) {
                key = await uploadImgHook.uploadImg(verifiedFace?.referenceImage);
                await checkFace(key);
            }
            let data = {
                newPhoneNo: formattedValue,
                newPofKey: key,
                phoneNumber: faceDetectHook?.otpToken ? user?.phoneNumber : null,
                idToken: faceDetectHook?.otpToken ? faceDetectHook?.otpToken : null,
                faceToken: verifiedFace?.accessToken,
            };

            await onSubmit(data);
            setSuccess(true);
            setStep(4);
        } catch (err) {
            showErr(err);
        } finally {
            setRequesting(false);
        }
    };
    const _onClose = () => {
        if (requesting) return;
        resetData();
        setError('');
        setVerifiedFace(null);
        onClose();
    };
    const resetData = () => {
        setPhoneNumber('');
        setPhoneInvalid(false);
    };
    const step2Press = async () => {
        try {
            setRequesting(true);
            setError('');
            let isExisted = await userIsExisted(formattedValue);
            if (!isExisted) {
                setStep(3);
            }
            setRequesting(false);
        } catch (err) {
            setError(err);
            setRequesting(false);
        }
    };
    return (
        <Modal
            isVisible={success ? true : isOpen}
            safeAreaTop={true}
            onBackdropPress={success ? null : _onClose}
        >
            <Box
                justifyContent="center"
                alignItems="center"
                p="20px"
                borderRadius="8px"
                bgColor="white"
            >
                {step === 1 && (
                    <VerifySecretQuestion
                        onVerified={() => setStep(2)}
                        onCancel={() => {
                            onClose();
                        }}
                    />
                )}
                {step === 2 && (
                    <>
                        <Text mb="12px" textAlign="left" w="full" fontWeight="bold" fontSize="14px">
                            {t('components.phoneNumber')}
                        </Text>
                        <PhoneInput
                            defaultValue={userPhoneNumber}
                            value={phoneNumber}
                            countryCode={countryCode}
                            onChangeText={(text) => {
                                setPhoneNumber(text);
                            }}
                            onChangeFormattedText={(text) => {
                                setFormattedValue(text);
                            }}
                            onInvalid={setPhoneInvalid}
                            containerStyle={styles.phoneInput}
                            disabled={success}
                        />

                        {Boolean(error) && <Text color="error.400">{error}</Text>}
                        <Box w="full" flexDir="row" justifyContent="space-between">
                            <Button
                                onPress={onClose}
                                isDisabled={requesting}
                                _container={{
                                    mt: '12px',
                                    w: '48%',
                                }}
                                variant="outline"
                            >
                                {t('button.cancel')}
                            </Button>
                            <Button
                                _container={{
                                    mt: '12px',
                                    w: '48%',
                                }}
                                onPress={() => {
                                    step2Press();
                                }}
                                isDisabled={
                                    requesting || phoneInvalid || userPhoneNumber === formattedValue
                                }
                                isLoading={requesting}
                            >
                                {t('button.next')}
                            </Button>
                        </Box>
                    </>
                )}

                {step === 3 && !verifiedFace && (
                    <>
                        {/* <FaceRecognition
                            onVerified={(data) => {
                                _onSubmit(data);
                            }}
                        ></FaceRecognition> */}
                        {faceDetectHook.Component({
                            onVerified: (data) => {
                                setVerifiedFace(data);
                            },
                            needTakePhoto: true,
                        })}

                        {Boolean(error) && <Text color="error.400">{error}</Text>}
                    </>
                )}
                {step === 3 && verifiedFace && (
                    <Box px="20px" w="full">
                        <ReviewPhotoStep
                            // eslint-disable-next-line react-native/no-inline-styles
                            _containerStyle={{
                                w: 'full',
                            }}
                            showTxt={false}
                            uri={verifiedFace.referenceImage}
                            onSubmit={_onSubmit}
                            onRetake={() => {
                                setVerifiedFace(null);
                            }}
                            showRetake={faceDetectHook.step === 2}
                            loadingProp={requesting}
                        />
                    </Box>
                )}
                {step === 4 && success && (
                    <>
                        <Box w="full">
                            <Text color="success.500">{t('components.changePhoneSuccess')}</Text>
                            <Text>
                                {t('components.autoLogout')}: {countdown || 0}s
                            </Text>
                        </Box>
                        <Button
                            _container={{
                                mt: '12px',
                                w: '48%',
                            }}
                            onPress={() => {
                                _logout();
                            }}
                        >
                            {t('button.logout')}
                        </Button>
                    </>
                )}
            </Box>
        </Modal>
    );
}

const styles = StyleSheet.create({
    phoneInput: {
        marginBottom: 0,
    },
});
