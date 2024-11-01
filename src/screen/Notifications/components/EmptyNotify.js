import useTranslate from '../../../i18n/useTranslate';
import { Box, Text, useTheme } from 'native-base';
import React from 'react';
import { Bell } from '../../../components/Icons';

const EmptyNotify = () => {
    const { colors } = useTheme();

    const t = useTranslate();
    return (
        <Box w={'full'} h={'full'} flex={1} justifyContent={'center'} alignItems={'center'}>
            <Box
                backgroundColor={colors.primary[200]}
                w={'48px'}
                h={'48px'}
                justifyContent={'center'}
                alignItems={'center'}
                borderRadius={'12px'}
            >
                <Bell name="bell-outline" size={30} color={colors.primary[600]} />
            </Box>
            <Text fontSize={'14px'} fontWeight={'500'} mt={'16px'}>
                {t('notification.empty')}
            </Text>
        </Box>
    );
};

export default EmptyNotify;
