import { useRoute } from '@react-navigation/native';
import { HStack, Text } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import { EVENT_NAME } from '../../constants/eventName';
import useTranslate from '../../i18n/useTranslate';
import MessageTime from '../Icons/MessageTime';

const ClaimantReqPendingMsg = () => {
    const route = useRoute();
    const t = useTranslate();
    if (!route.params?.isShowButtonEdit) {
        return null;
    }
    if (!route.params?.requestCount) {
        return null;
    }
    return (
        <TouchableOpacity
            onPress={() => {
                EventRegister.emit(EVENT_NAME.refetchPlotData);
                EventRegister.emit(EVENT_NAME.gotoPendingClaimantReq);
            }}
        >
            <HStack bg="yellow.1200" py="8px" px="23px" alignItems={'center'}>
                <MessageTime color="#DB990B" />
                <Text ml="16px" fontWeight={600}>
                    {route.params?.requestCount} {`${t('plot.pending2')}`}{' '}
                    {route.params?.requestCount > 1 ? `${t('plot.requests')}` : t('plot.request')}{' '}
                    {`${t('plot.toBeClaimant')}`}
                </Text>
            </HStack>
        </TouchableOpacity>
    );
};

export default ClaimantReqPendingMsg;
