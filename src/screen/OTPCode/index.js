/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import { Box, Center, ScrollView, Spinner, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Button from '../../components/Button';
import OPTInput from '../../components/OTPInput';
import useTranslate from '../../i18n/useTranslate';
import { EventRegister } from 'react-native-event-listeners';
import { EVENT_NAME } from '../../constants/eventName';

export default function Index({
    confirmCode,
    phoneNumber,
    requesting,
    error,
    onResend,
    containerProps = {},
    timeLimit,
    otpInputStyle = {},
    getPinRequesting = false,
    showSubmitButton = true,
    LoadingComponent = null,
    SubmitPinButton = Button,
    Container = ScrollView,
    showSentCodeMessage = true,
}) {
    const phone = phoneNumber;
    const [code, setCode] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [sending, setSending] = useState(false);

    const handleResend = async () => {
        try {
            setShowMessage(false);
            setSending(true);
            await onResend(true);
            setShowMessage(true);
            setSending(false);
        } catch (e) {
            console.log(e);
        }
    };

    const onSubmitPin = () => {
        confirmCode(code);
    };

    const t = useTranslate();

    useEffect(() => {
        const listener = EventRegister.addEventListener(EVENT_NAME.submitOtp, () => {
            onSubmitPin();
        });
        return () => {
            EventRegister.removeEventListener(listener);
        };
    }, [code]);

    if (getPinRequesting) {
        if (LoadingComponent) {
            return LoadingComponent;
        }
        return (
            <Center h="400px">
                <Spinner />
            </Center>
        );
    }

    return (
        <Container
            h="full"
            bg="white"
            px="10px"
            contentContainerStyle={styles.scroll}
            {...containerProps}
        >
            {showSentCodeMessage && (
                <>
                    <Text mt="80px">{t('auth.numberDigit')} </Text>
                    <Text mb="40px">{phone}</Text>
                </>
            )}
            <OPTInput otpInputStyle={otpInputStyle} code={code} onCodeChanged={setCode} />
            <Text mt="12px" color="error.400">
                {error}
            </Text>
            <TouchableOpacity
                onPress={handleResend}
                disabled={sending || timeLimit > 0}
                flexDir="row"
                style={styles.btnResend}
            >
                <Text>{`${t('auth.NoReceiveCode')} `}</Text>
                <Box flexDir="row">{sending && <Spinner mr="4px" />}</Box>
                <Text bold color="link">
                    {t('button.resend')}
                </Text>
            </TouchableOpacity>
            <Text mb={'12px'} bold color="link">
                {timeLimit >= 60
                    ? '01:00'
                    : `00:${
                          timeLimit === 0 ? '00' : timeLimit >= 10 ? timeLimit : `0${timeLimit}`
                      }`}
            </Text>

            {showMessage && <Text mb="12px">{t('auth.newPinSent')} ✔</Text>}
            {showSubmitButton && (
                <SubmitPinButton
                    isDisabled={!code || code.length !== 6}
                    onPress={onSubmitPin}
                    isLoading={requesting}
                >
                    {t('auth.submitPin')}
                </SubmitPinButton>
            )}
        </Container>
    );
}

const styles = StyleSheet.create({
    scroll: {
        alignItems: 'center',
        minHeight: '100%',
    },
    btnResend: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
});
