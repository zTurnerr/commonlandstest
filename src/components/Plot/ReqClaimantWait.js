import { useRoute } from '@react-navigation/native';
import { Text, VStack } from 'native-base';
import React from 'react';
import useTranslate from '../../i18n/useTranslate';
import ClockCheck from '../Icons/ClockCheck';

const ReqClaimantWait = () => {
    const route = useRoute();
    const t = useTranslate();

    if (!route.params?.requestorPendingReq) {
        return null;
    }

    return (
        <VStack alignItems={'center'} py="26px">
            <ClockCheck color="#DB990B" width="24" height="24" />
            <Text mt="11px" fontWeight={500}>
                {t('plot.requestSent2')}
            </Text>
            <Text fontWeight={500}>{t('plot.requestSent3')}</Text>
        </VStack>
    );
};

export default ReqClaimantWait;
