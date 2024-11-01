import { HStack, Text } from 'native-base';
import React from 'react';
import useTranslate from '../../i18n/useTranslate';
import Note2Outline from '../Icons/Note2Outline';

const CertLockTag = () => {
    const t = useTranslate();
    return (
        <HStack p="5px" space={1} alignItems={'center'} borderRadius={'8px'} bg="appColors.bgBlue">
            <Note2Outline color="#61C7DF" />
            <Text fontWeight={600} color="appColors.primaryBlue">
                {t('contract.certLocked')}
            </Text>
        </HStack>
    );
};

export default CertLockTag;
