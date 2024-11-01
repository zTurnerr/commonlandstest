import { HStack, Text } from 'native-base';
import React from 'react';
import useTranslate from '../../i18n/useTranslate';
import LockOpen from '../Icons/LockOpen';

const UnlockedTag = () => {
    const t = useTranslate();
    return (
        <HStack bg="primary.1500" p="5px" px="10px" borderRadius={'17px'} space={2}>
            <LockOpen />
            <Text color="primary.1400" fontWeight={500}>
                {t('contract.unlocked')}
            </Text>
        </HStack>
    );
};

export default UnlockedTag;
