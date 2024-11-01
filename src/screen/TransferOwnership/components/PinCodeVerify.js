import auth from '@react-native-firebase/auth';
import { Box, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import OPTInput from '../../../components/OTPInput';
import useTranslate from '../../../i18n/useTranslate';

const PinCodeVerify = ({ refPinOTP, phoneNumber, onVerifiedOTP, errorOutside, setRequesting }) => {
    const [code, setCode] = useState('');
    const [confirm, setConfirm] = useState(null);
    const [error, setError] = useState('');
    const [, setGetPinRequesting] = useState(false);

    const onChangeCode = (code) => {
        setCode(code);
        refPinOTP.current.code = code;
    };
    const t = useTranslate();

    const onSendOTP = async (resend = true) => {
        try {
            setGetPinRequesting(true);
            const confirmation = await auth().signInWithPhoneNumber(phoneNumber, resend);
            setConfirm(confirmation);
        } catch (err) {
            if (typeof err === 'string' && err.indexOf('error_code') >= 0) {
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

    useEffect(() => {
        refPinOTP.current.error = error;
    }, [error]);

    refPinOTP.current.sendOTP = onSendOTP;

    // Define an asynchronous function to confirm a code
    const confirmCode = async (code) => {
        try {
            setRequesting(true); // Set the requesting state to true
            setError(''); // Clear any previous errors
            try {
                if (confirm === null) {
                    setError(t('auth.waitForPinCode'));
                    setRequesting(false);
                    return;
                }
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
    refPinOTP.current.confirmCode = confirmCode;

    const getIdToken = async () => {
        if (!auth().currentUser) {
            throw new Error(t('auth.pinCodeExpired'));
        }
        const idToken = await auth().currentUser.getIdTokenResult();
        setRequesting(false);
        refPinOTP.current.idToken = idToken?.token;
        if (onVerifiedOTP) {
            return onVerifiedOTP(phoneNumber, idToken?.token);
        }
        return idToken?.token;
    };

    return (
        <Box mb={5}>
            <OPTInput code={code} style={style.OPT} onCodeChanged={onChangeCode} />

            {errorOutside.length > 0 ? (
                <Text mt="12px" color="error.400">
                    {errorOutside}
                </Text>
            ) : (
                error.length > 0 && (
                    <Text mt="12px" color="error.400">
                        {error}
                    </Text>
                )
            )}
        </Box>
    );
};

const style = StyleSheet.create({
    OPT: {
        height: 50,
        width: '100%',
    },
});

export default PinCodeVerify;
