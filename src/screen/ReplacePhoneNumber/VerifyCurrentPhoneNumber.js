import { Box, Text, useDisclose } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Button from '../../components/Button';
import PhoneInput from '../../components/PhoneInput';
import useTranslate from '../../i18n/useTranslate';
import { verifyPhone } from '../../rest_client/authClient';
import { SCREEN_HEIGHT, extractCountryCode } from '../../util/Constants';
import SheetVerifySecretQuestion from './SheetVerifySecretQuestion';

export default function Index({ setStep, formattedValue, setFormattedValue }) {
    const t = useTranslate();
    const { isOpen, onOpen, onClose } = useDisclose();
    const [phoneInvalid, setPhoneInvalid] = useState(false);
    const [empty, setEmpty] = useState(true);
    const [error, setError] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [rawPhoneNumber, setRawPhoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState(null);

    async function onVerify() {
        if (phoneInvalid) return;
        setVerifying(true);
        try {
            let { data } = await verifyPhone(formattedValue);
            let { isPhoneRegistered, isActive } = data;
            if (!isActive && isPhoneRegistered) {
                setError(t('error.userNotActive'));
                throw t('error.userNotActive');
            }
            if (!isPhoneRegistered) {
                setError(t('error.userNotFound'));
                throw t('error.userNotFound');
            }
            onOpen();
        } catch (error) {}
        setVerifying(false);
    }

    useEffect(() => {
        if (phoneInvalid && formattedValue) {
            setError(t('error.phoneInvalid'));
        } else {
            setError('');
        }
    }, [phoneInvalid, formattedValue]);

    useEffect(() => {
        async function getCountryCode() {
            try {
                let countryCode = await extractCountryCode(formattedValue);
                if (!countryCode?.number) return;
                setCountryCode(countryCode.countryCode);
                setRawPhoneNumber(countryCode.number);
            } catch (error) {}
        }
        getCountryCode();
    }, []);

    return (
        <Box h={SCREEN_HEIGHT - 200} alignItems="center" justifyContent="center">
            <Text fontWeight="bold" fontSize="14px">
                {t('replacePhoneNumber.whatPhone')}
            </Text>
            <Text fontWeight="bold" fontSize="14px" mb="25px">
                {t('replacePhoneNumber.associatedAccount')}
            </Text>
            <PhoneInput
                onChangeFormattedText={(text) => {
                    setFormattedValue(text);
                }}
                onInvalid={setPhoneInvalid}
                containerStyle={styles.phoneInput}
                hideError
                setIsEmpty={setEmpty}
                defaultValue={rawPhoneNumber}
                defaultCode={countryCode}
                value={rawPhoneNumber}
                onChangeText={(text) => {
                    setRawPhoneNumber(text);
                }}
                countryCode={countryCode}
            />
            <Text
                h="20px"
                textAlign={'center'}
                w="full"
                my="12px"
                color={error ? 'error.400' : 'white'}
            >
                {error}
            </Text>
            <Button
                disabled={phoneInvalid || empty}
                opacity={phoneInvalid || empty || !formattedValue ? 0.5 : 1}
                isLoading={verifying}
                onPress={onVerify}
            >
                {t('button.verify')}
            </Button>

            {/* Modal */}
            <SheetVerifySecretQuestion
                phoneNumber={formattedValue}
                setStep={setStep}
                isOpen={isOpen}
                onClose={onClose}
            />
        </Box>
    );
}

const styles = StyleSheet.create({
    phoneInput: {
        marginBottom: 0,
    },
});
