import { Box, IconButton, ScrollView, Text } from 'native-base';
import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import Trash from '../../components/Icons/Trash';
import PhoneInput from '../../components/PhoneInput';
import useTranslate from '../../i18n/useTranslate';
import { searchByPhone } from '../../rest_client/apiClient';
import RowTransfer from './components/RowTransfer';

const DeleteIconButton = ({ onPress }) => {
    return (
        <IconButton onPress={onPress} borderRadius={'20px'}>
            <Trash height={20} width={20} />
        </IconButton>
    );
};

const ExternalTransfer = ({ onClickTransfer, claimants }) => {
    const t = useTranslate();
    const [data, setData] = useState({
        phoneNumber: '',
    });
    const [externalUser, setExternalUser] = useState([]);
    const [error, setError] = useState('');

    const deleteExternalUser = (index) => {
        const newExternalUser = [...externalUser];
        newExternalUser.splice(index, 1);
        setExternalUser(newExternalUser);
    };

    const addPhoneNumber = async (phoneNumber) => {
        try {
            let res = await searchByPhone({ phoneNumber: phoneNumber });
            if (res.data.user) {
                const newExternalUser = [res.data.user];
                setExternalUser(newExternalUser);
            } else {
                setExternalUser([]);
                throw new Error(t('error.phoneInvalid'));
            }
        } catch (error) {
            setError(error?.message || t('error.phoneInvalid'));
        }
    };

    const debounce = (func, wait) => {
        let timeout;
        return function (...args) {
            const context = this;
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                timeout = null;
                func.apply(context, args);
            }, wait);
        };
    };

    const debouncedOnChangeText = useCallback(
        debounce(async (phoneNumber) => {
            try {
                setError('');
                addPhoneNumber(phoneNumber);
            } catch (_error) {
                setError(_error?.message || '');
            }
        }, 500),
        [],
    );

    const checkTypeRole = () => {
        const item = claimants.find((item) => item.phoneNumber === externalUser[0].phoneNumber);
        if (item) return item.role;
        else return null;
    };

    return (
        <Box flexGrow={2}>
            <Box px={5} pt={5} pb={0} bg={'white'} mt={1}>
                <Text mb={3}>{t('transferOwnership.enterPhoneNumber')}</Text>
                <PhoneInput
                    value={data.phoneNumber}
                    onChangeText={(text) => {
                        setData({ ...data, phoneNumber: text });
                    }}
                    onChangeFormattedText={(text) => {
                        debouncedOnChangeText(text);
                    }}
                    containerStyle={styles.phoneInput}
                    hideError
                />
                {error.length > 0 && (
                    <Text color={'error.400'} mt={-1} mb={4}>
                        {error}
                    </Text>
                )}
            </Box>
            <Text pl={5} fontWeight={600} fontSize={12} my={3.5}>
                {t('transferOwnership.userSelected')}:
            </Text>
            <ScrollView h={'40%'}>
                {externalUser.map((item, index) => (
                    <RowTransfer
                        info={item}
                        key={index}
                        button={<DeleteIconButton onPress={() => deleteExternalUser(index)} />}
                        onClickTransfer={onClickTransfer}
                        type={checkTypeRole()}
                    />
                ))}
            </ScrollView>
        </Box>
    );
};

export default ExternalTransfer;

const styles = StyleSheet.create({
    phoneInput: {
        marginBottom: 14,
        borderColor: '#5EC4AC',
    },
});
