import { HStack, Text } from 'native-base';
import React from 'react';
import useTranslate from '../../i18n/useTranslate';
import Clock2 from '../Icons/Clock2';

const PendingTag = () => {
    const t = useTranslate();
    return (
        <HStack bg="yellow.200" p="5px" px="10px" borderRadius={'17px'} space={2}>
            <Clock2 color="#EAA300" />
            <Text color="yellow.100" fontWeight={500}>
                {t('plot.pending')}
            </Text>
        </HStack>
    );
};

export default PendingTag;
