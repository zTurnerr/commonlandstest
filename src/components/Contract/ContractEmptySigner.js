import { Center, Text } from 'native-base';
import React from 'react';
import useTranslate from '../../i18n/useTranslate';
import UserEdit from '../Icons/UserEdit';

const ContractEmptySigner = () => {
    const t = useTranslate();
    return (
        <Center py="70px">
            <UserEdit />
            <Text maxW={'150px'} textAlign={'center'} mt="10px" color="gray.1300">
                {t('contract.extendInvitations')}
            </Text>
        </Center>
    );
};

export default ContractEmptySigner;
