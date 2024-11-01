import useTranslate from '../../../i18n/useTranslate';
import GetPinForm from '../GetPinForm';
import React from 'react';
import Header from '../../../components/Header';
import { useNavigation } from '@react-navigation/native';
export default function Index({ route }) {
    let navigation = useNavigation();
    let params = route?.params || {};
    const t = useTranslate();
    return (
        <>
            <Header title={''} />
            <GetPinForm
                title={t('explore.welcomeToCommonlands')}
                subTitle={t('auth.pleaseEnterPhone')}
                bottomTitle={t('auth.alreadyAccount')}
                bottomSubTitle={t('button.signIn')}
                onBottomClick={() => {
                    if (params.agent) {
                        navigation.goBack();
                    } else {
                        navigation.navigate('Login');
                    }
                }}
                type="signup"
                onVerifiedOTP={(phoneNumber, idToken) => {
                    navigation.navigate('TakeAPhoto', {
                        phoneNumber: phoneNumber,
                        otp: idToken,
                        deepLink: params,
                        agent: params?.agent,
                        assignToOffline: params?.assignToOffline,
                    });
                }}
            />
        </>
    );
}
