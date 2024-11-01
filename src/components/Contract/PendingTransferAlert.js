import React from 'react';
import { Box, Text, HStack } from 'native-base';
import ClockCheck from '../Icons/ClockCheck';
import useTranslate from '../../i18n/useTranslate';
import { TouchableOpacity } from 'react-native';

const PendingTransferAlert = ({ onSeeMore = () => {}, show = false }) => {
    const t = useTranslate();
    if (!show) return null;
    return (
        <HStack
            mx="15px"
            mb="15px"
            borderRadius={'16px'}
            bg="yellow.900"
            p="15px"
            alignItems={'center'}
            shadow={9}
        >
            <ClockCheck height="25" width="25" color="#AC9054" />
            <Text flex={1} ml="10px" fontSize={'14px'} fontWeight={700} color="yellow.1000">
                {t('contract.pendingTransferApproval')}
            </Text>
            <TouchableOpacity onPress={onSeeMore}>
                <Text fontSize={'14px'} textDecorationLine="underline" color="yellow.1000">
                    {t('button.seeMore')}
                </Text>
            </TouchableOpacity>
        </HStack>
    );
};

export default PendingTransferAlert;
