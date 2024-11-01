import { Box, CheckCircleIcon, HStack, Spinner, Text } from 'native-base';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import FilledDanger from '../../components/Icons/FilledDanger';
import PhoneInput from '../../components/PhoneInput';
import useTranslate from '../../i18n/useTranslate';

const usePhoneInput1 = ({ loading = false, accepted = false }) => {
    const [phoneValue, setPhoneValue] = useState('');
    const [phoneValueNoCountry, setPhoneValueNoCountry] = useState('');
    const [err, setErr] = useState('');
    const isValid = !!phoneValue && !err && !loading && accepted;
    const t = useTranslate();

    const styles = StyleSheet.create({
        phoneInput: {
            paddingRight: 50,
            ...(err
                ? {
                      borderLeftWidth: 1,
                      borderColor: '#DA3B01',
                  }
                : {}),
            ...(isValid
                ? {
                      borderLeftWidth: 1,
                      borderColor: '#2AB848',
                  }
                : {}),
        },
    });

    const Component = () => {
        return (
            <Box>
                <Box maxH="48px">
                    <PhoneInput
                        value={phoneValueNoCountry}
                        onChangeFormattedText={setPhoneValue}
                        onChangeText={setPhoneValueNoCountry}
                        textContainerStyle={styles.phoneInput}
                        containerStyle={{
                            ...(err
                                ? {
                                      borderWidth: 1,
                                      borderColor: '#DA3B01',
                                  }
                                : {}),
                            ...(isValid
                                ? {
                                      borderWidth: 1,
                                      borderColor: '#2AB848',
                                  }
                                : {}),
                        }}
                        hideError={true}
                        setParentError={setErr}
                    />
                    {err && (
                        <HStack position={'absolute'} h="full" alignItems={'center'} right={2}>
                            <FilledDanger />
                        </HStack>
                    )}
                    {isValid && (
                        <HStack position={'absolute'} h="full" alignItems={'center'} right={2}>
                            <CheckCircleIcon color="#2AB848" />
                        </HStack>
                    )}
                    {loading && (
                        <HStack position={'absolute'} h="full" alignItems={'center'} right={2}>
                            <Spinner />
                        </HStack>
                    )}
                </Box>
                {!!err && (
                    <Text mt="12px" fontSize="12px" color="error.400">
                        {err}
                    </Text>
                )}
                {!!isValid && (
                    <Text mt="12px" fontSize="12px" color="success.400">
                        {t('plot.phoneClaimantCorrect')}
                    </Text>
                )}
            </Box>
        );
    };

    return {
        Component,
        phoneValue,
        err,
        setErr,
    };
};

export default usePhoneInput1;
