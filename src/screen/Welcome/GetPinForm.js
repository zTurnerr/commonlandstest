import useTranslate from '../../i18n/useTranslate';
import { Box, Image, ScrollView, Text } from 'native-base';
import React, { useEffect, useState } from 'react';

import Button from '../../components/Button';
import OTPCode from '../OTPCode';
import PhoneInput from '../../components/PhoneInput';
import { StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import logoDark from '../../images/logoColor.png';
import { verifyPhone } from '../../rest_client/authClient';

let interval = '';
export default function Index(props) {
    const {
        children,
        title,
        subTitle,
        bottomTitle,
        bottomSubTitle,
        onBottomClick,
        type,
        containerProps = {},
        hideLogo = false,
        onVerifiedOTP,
        setBackToGetPinFunction,
        saveCountryCode = false,
        containerRef,
        onSendOPT,
        phoneNumberProp = null,
        noPhoneInput = false,
        otpInputStyle = {},
        showSubmitPinButton = true,
        LoadingComponent = null,
        SubmitPinButton,
        OtpCodeContainer,
        showSentCodeMessage = true,
    } = props;
    const t = useTranslate();
    const [value, setValue] = useState('');
    const [formattedValue, setFormattedValue] = useState('');
    const [countryCode, setCountryCode] = useState('');
    const [confirm, setConfirm] = useState(null);
    const [requesting, setRequesting] = useState(false);
    const [getPinRequesting, setGetPinRequesting] = useState(false);
    const [phoneInvalid, setPhoneInvalid] = useState(false);
    const [error, setError] = useState('');
    const [timeLimit, setTimeLimit] = useState(0);

    const userIsExisted = async (phone) => {
        let res = await verifyPhone(phone);
        return res.data;
    };

    const backToGetPin = () => {
        setConfirm(null);
    };
    const startCountTime = () => {
        if (interval) {
            clearInterval(interval);
        }
        interval = setInterval(() => {
            setTimeLimit((timeLimit) => {
                if (timeLimit > 0) {
                    return timeLimit - 1;
                }
                clearInterval(interval);
                return 0;
            });
        }, 1000);
    };
    const handleLogin = async (phone, resend = false) => {
        let newPhone = formattedValue || phone;
        try {
            setGetPinRequesting(true);
            setError('');
            let { isPhoneRegistered, isActive, isBanned } = await userIsExisted(newPhone);
            if (isBanned) {
                throw t('error.phoneAlready');
            }
            if (['resetPassword'].includes(type)) {
                if (!isActive && isPhoneRegistered) {
                    throw t('error.userNotActive');
                }
                if (!isPhoneRegistered) {
                    throw t('error.userNotFound');
                }
            }
            if (!['resetPassword'].includes(type) && isPhoneRegistered) {
                throw t('error.userExits');
            }
            const confirmation = await auth().signInWithPhoneNumber(newPhone, resend);
            // const confirmation = {};
            startCountTime();
            setTimeLimit(60);
            setConfirm(confirmation);
            setBackToGetPinFunction && setBackToGetPinFunction(backToGetPin);
            onSendOPT && onSendOPT();
        } catch (err) {
            console.log('err', err);
            if (typeof err === 'string' && err.indexOf('error_code') >= 0) {
                setGetPinRequesting(false);
                err = JSON.parse(err);
                return;
            }
            if (typeof err === 'string') {
                return setError(err);
            }
            setError(JSON.stringify(err.message));
        } finally {
            setGetPinRequesting(false);
        }
    };

    const onResend = async (resend) => {
        await handleLogin(formattedValue || phoneNumberProp, resend);
    };

    const getIdToken = async () => {
        const idToken = await auth().currentUser.getIdTokenResult();
        setRequesting(false);

        if (onVerifiedOTP) {
            return onVerifiedOTP(formattedValue, idToken?.token);
        }
    };

    // Define an asynchronous function to confirm a code
    const confirmCode = async (code) => {
        try {
            setRequesting(true); // Set the requesting state to true
            setError(''); // Clear any previous errors
            try {
                await confirm.confirm(code); // Try to confirm the code
            } catch (err) {
                // If there's an error indicating a session expiration
                if (err?.message?.indexOf('auth/session-expired') > -1) {
                    try {
                        // Attempt to get user authentication
                        return await getIdToken();
                    } catch (_err) {
                        // If there's an error indicating no current user, throw the original error
                        if (_err?.message?.indexOf('auth/no-current-user') > -1) {
                            throw err;
                        }
                        throw _err; // Otherwise, throw the new error
                    }
                } else {
                    throw err; // If it's not a session expiration error, throw the original error
                }
            }

            await getIdToken(); // After confirmation, get user authentication
        } catch (error) {
            setError(error?.message || error); // Set the error state with the error message
            setRequesting(false); // Set the requesting state to false
        }
    };

    useEffect(() => {
        if (containerRef) {
            containerRef.current = {
                confirm,
                backToGetPin,
            };
        }
    }, []);

    useEffect(() => {
        if (phoneNumberProp) {
            handleLogin(phoneNumberProp);
        }
    }, [phoneNumberProp]);

    return confirm || noPhoneInput ? (
        <OTPCode
            requesting={requesting}
            phoneNumber={formattedValue || phoneNumberProp}
            confirmCode={confirmCode}
            error={error}
            onResend={onResend}
            getPinRequesting={getPinRequesting}
            containerProps={containerProps}
            timeLimit={timeLimit}
            otpInputStyle={otpInputStyle}
            showSubmitButton={showSubmitPinButton}
            LoadingComponent={LoadingComponent}
            SubmitPinButton={SubmitPinButton}
            Container={OtpCodeContainer}
            showSentCodeMessage={showSentCodeMessage}
        />
    ) : (
        <ScrollView
            h="full"
            bg="white"
            px="20px"
            contentContainerStyle={styles.scroll}
            {...containerProps}
            flex={1}
        >
            {!hideLogo && <Image mt="45px" source={logoDark} alt="logo dark" />}
            <Text mt="15px" fontWeight="700" fontSize="18px">
                {title}
            </Text>
            <Text mt="4px" textAlign="center">
                {subTitle}
            </Text>

            <Text mt="45px" w="100%" fontWeight="bold" fontSize="12px">
                {type === 'updateSim' ? t('scanQr.enterNewPhone') : t('components.phoneNumber')}
            </Text>

            <PhoneInput
                value={value}
                onChangeText={(text) => {
                    setValue(text);
                }}
                onChangeFormattedText={(text) => {
                    setFormattedValue(text);
                }}
                onChangeCountry={saveCountryCode ? setCountryCode : () => {}}
                countryCode={countryCode}
                onInvalid={(invalid) => {
                    setPhoneInvalid(invalid);
                    if (invalid) {
                        setError(t('error.phoneInvalid'));
                    } else {
                        setError('');
                    }
                }}
                containerStyle={styles.containerStyle}
                hideError
            />
            <Text mt="12px" color="error.400">
                {error}
            </Text>
            <Text bold>
                {timeLimit > 0
                    ? `${t('others.requestSuspended')} ${timeLimit} ` + `${t('others.seconds')}.`
                    : ''}
            </Text>
            <Button
                _container={{
                    mt: '18px',
                }}
                isDisabled={!value || phoneInvalid || timeLimit > 0}
                onPress={handleLogin}
                isLoading={getPinRequesting}
            >
                {t('button.getPin')}
            </Button>

            <Box flexDirection="row" mt="17px">
                <Text>{bottomTitle}</Text>
                <Text ml="4px" fontWeight="bold" onPress={onBottomClick} color="link">
                    {bottomSubTitle}
                </Text>
            </Box>
            {children}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: {
        alignItems: 'center',
    },
    containerStyle: {
        marginTop: 12,
    },
});
