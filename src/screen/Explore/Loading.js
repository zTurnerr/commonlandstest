import React from 'react';
import { Box, Text, Spinner } from 'native-base';
import useTranslate from '../../i18n/useTranslate';
export default function Index({ show = false }) {
    const t = useTranslate();
    return (
        show && (
            <Box
                position={'absolute'}
                flexDir={'row'}
                bottom={0}
                left={0}
                zIndex={2}
                bgColor={'#267385'}
                px="8px"
                py="4px"
                borderTopRightRadius="12px"
            >
                <Spinner />
                <Text color="white" ml="4px">
                    {t('explore.loading')} https://map.commonlands.org...
                </Text>
            </Box>
        )
    );
}
