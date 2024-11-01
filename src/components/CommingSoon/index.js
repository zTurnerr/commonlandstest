import { Box, Text } from 'native-base';
import React from 'react';
import useTranslate from '../../i18n/useTranslate';

export default function Index() {
    const t = useTranslate();
    return (
        <Box w="full" h="full" alignItems="center" justifyContent="center">
            <Text bold fontSize="21px" textAlign="center">
                {t('components.comingSoon')}
            </Text>
        </Box>
    );
}
