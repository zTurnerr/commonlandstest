import { Box, Text, useTheme } from 'native-base';
import React, { memo } from 'react';
import useTranslate from '../i18n/useTranslate';
import { checkBgColor } from '../util/Tools';

const RenderViewStatus = ({ status, dotColor = 'white', textColor = 'white' }) => {
    const theme = useTheme();
    const t = useTranslate();

    const mappingStatus = {
        created: t('contract.pendingContract'),
        pending: t('contract.pendingContract'),
        active: t('contract.activeContract'),
        completed: t('contract.unlockedContract'),
    };
    return (
        <Box
            py={'5px'}
            px={'12px'}
            borderRadius={'17px'}
            flexDirection={'row'}
            alignItems={'center'}
            // maxW={'139px'}
            backgroundColor={checkBgColor(status)}
            overflow={'hidden'}
        >
            <Box
                marginRight={'5px'}
                w={'10px'}
                h={'10px'}
                borderRadius={5}
                backgroundColor={dotColor || theme.colors.white}
            />
            <Text fontWeight={'500'} color={textColor || theme.colors.white} fontSize={'12px'}>
                {mappingStatus[status] || status}
            </Text>
        </Box>
    );
};

export default memo(RenderViewStatus);
