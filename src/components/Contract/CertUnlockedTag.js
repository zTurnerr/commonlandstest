import { HStack, Text } from 'native-base';
import React from 'react';
import useTranslate from '../../i18n/useTranslate';
import Note2Outline from '../Icons/Note2Outline';

const CertUnlockedTag = () => {
    const t = useTranslate();
    return (
        <HStack p="5px" space={1} alignItems={'center'} borderRadius={'8px'} bg="primary.1500">
            <Note2Outline color="#00803A" />
            <Text fontWeight={600} color="primary.1400">
                {t('contract.certificateUnlocked')}
            </Text>
        </HStack>
    );
};

export default CertUnlockedTag;
