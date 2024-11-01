import useTranslate from '../../i18n/useTranslate';
import { HStack, Text } from 'native-base';
import React from 'react';
import ClockCheck from '../Icons/ClockCheck';

const PendingTransferTag = ({ _container, contract = {} }) => {
    const t = useTranslate();

    if (contract?.status === 'completed') {
        return null;
    }

    return (
        <HStack
            p="5px"
            space={1}
            alignItems={'center'}
            borderRadius={'8px'}
            bg="yellow.300"
            {..._container}
        >
            <ClockCheck color="#EAA300" />
            <Text fontWeight={600} color="yellow.100">
                {t('contract.pendingTransferApproval')}
            </Text>
        </HStack>
    );
};

export default PendingTransferTag;
