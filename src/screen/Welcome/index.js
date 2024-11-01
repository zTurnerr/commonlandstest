import useTranslate from '../../i18n/useTranslate';
import { Box, Image, Text } from 'native-base';

import Button from '../../components/Button';
import React from 'react';
import background from '../../images/background.png';
import logoLight from '../../images/logoLight.png';
import { useNavigation } from '@react-navigation/native';
// import useDetectEnvironmentTraining from '../../hooks/useDetectEnvironmentTranining';
export default function Index({ route }) {
    let params = route?.params || {};
    let navigation = useNavigation();
    const loginPage = () => {
        navigation.navigate('Login', params);
    };
    const signUp = () => {
        navigation.navigate('SignUp', params);
    };
    const guest = () => {
        navigation.navigate('Main');
    };
    const t = useTranslate();
    // const { switchToProduction, switchToTraining, detectIsInProduction } =
    // useDetectEnvironmentTraining();
    // switchToTraining();
    return (
        <Box h="full" bg="white">
            <Image
                source={background}
                width={'100%'}
                h={'100%'}
                zIndex={-1}
                elevation={-1}
                position="absolute"
                alt="background"
            />
            <Box
                h="full"
                // background="rgba(0, 0, 0, 0.4)"
                px="12px"
                justifyContent="flex-end"
                alignItems="center"
            >
                <Image source={logoLight} alt="logo" mb="34px" />
                <Text color="white" fontWeight="700" fontSize="24px" mb="10px">
                    {t('explore.welcomeToCommonlands')}
                </Text>

                <Text color="white" mb="24px" textAlign="center" px="50px">
                    {t('explore.ANewWay')}.
                </Text>

                <Button
                    _container={{
                        mb: '27px',
                    }}
                    onPress={loginPage}
                >
                    {t('button.signIn')}
                </Button>
                <Box mb="27px" flexDirection="row" alignItems="center">
                    <Box borderTopColor="white" borderTopWidth="1px" w="45%"></Box>
                    <Text mx="4px" color="white">
                        {t('others.or')}
                    </Text>
                    <Box borderTopColor="white" borderTopWidth="1px" w="45%"></Box>
                </Box>
                <Button
                    color="secondary"
                    borderColor="white"
                    borderWidth="1px"
                    mb="27px"
                    onPress={signUp}
                >
                    {t('auth.signUpViaPhone')}
                </Button>
                <Button color="secondary" mb="30px" onPress={guest}>
                    {t('auth.continueAsGuest')}
                </Button>
            </Box>
        </Box>
    );
}
