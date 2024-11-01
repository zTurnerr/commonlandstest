import { HStack, Text } from 'native-base';
import React from 'react';
import useTranslate from '../../../i18n/useTranslate';
import ClockCheck from '../../Icons/ClockCheck';

const PendingRemoveTag = () => {
    const t = useTranslate();
    return (
        <HStack bg="danger.1200" p="5px" px="5px" borderRadius={'6px'} space={2}>
            <ClockCheck color="#D76050" />
            <Text color="danger.1300" fontWeight={600}>
                {t('tag.pendingRemove')}
            </Text>
        </HStack>
    );
};

export default PendingRemoveTag;
