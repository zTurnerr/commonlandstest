import { HStack, Text } from 'native-base';
import React from 'react';
import useTranslate from '../../i18n/useTranslate';
import Note2Outline from '../Icons/Note2Outline';

const CertDefaultTag = () => {
    const t = useTranslate();
    return (
        <HStack p="5px" space={1} alignItems={'center'} borderRadius={'8px'} bg="danger.900">
            <Note2Outline color="#AD1457" />
            <Text fontWeight={600} color="danger.400">
                {t('contract.certificateDefault')}
            </Text>
        </HStack>
    );
};

export default CertDefaultTag;
