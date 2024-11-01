import useTranslate from '../../../i18n/useTranslate';
import { Box, ScrollView } from 'native-base';
import React, { useRef, useState } from 'react';

import GetPinForm from '../GetPinForm';
import Header from '../../../components/Header';
import ResetPasswordForm from './ResetPasswordForm';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Index({ route }) {
    const t = useTranslate();

    const [userData, setUserData] = useState(null);
    const getPinRef = useRef(null);
    const navigation = useNavigation();
    const [step, setStep] = useState(1);
    const onBack = () => {
        if (getPinRef?.current?.confirm) {
            getPinRef?.current?.backToGetPin();
            getPinRef.current = null;
            setStep(1);
            return;
        }
        if (step === 3) {
            setStep(1);
            return setUserData(null);
        }
        navigation.goBack();
    };

    const getTitle = () => {
        if (step === 3) {
            return t('forgotPass.resetPassword');
        }
        if (step === 2) {
            return t('replacePhoneNumber.pinVerification');
        }
        return t('forgotPass.forgotPassword');
    };
    return (
        <Box {...styles.container}>
            <Header title={getTitle()} onBack={onBack} />
            <ScrollView flex={1}>
                <Box pt="22px">
                    {[1, 2].includes(step) ? (
                        <GetPinForm
                            hideLogo
                            subTitle={t('forgotPass.sendVerificationCode')}
                            onVerifiedOTP={(phoneNumber, idToken) => {
                                setUserData({
                                    phoneNumber,
                                    idToken,
                                });
                                setStep(3);
                                getPinRef.current = null;
                            }}
                            type="resetPassword"
                            containerRef={getPinRef}
                            onSendOPT={() => setStep(2)}
                            saveCountryCode
                        />
                    ) : (
                        <ResetPasswordForm
                            idToken={userData?.idToken}
                            phoneNumber={userData?.phoneNumber}
                            agent={route.params?.agent}
                        />
                    )}
                </Box>
            </ScrollView>
        </Box>
    );
}

const styles = StyleSheet.create({
    container: {
        h: 'full',
        backgroundColor: 'white',
    },
});
