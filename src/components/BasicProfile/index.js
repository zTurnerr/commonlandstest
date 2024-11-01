import { Box, Text } from 'native-base';

import Avatar from '../../components/Avatar';
import React from 'react';
import useTranslate from '../../i18n/useTranslate';

export default function Index({ data, hideName, active, ...other }) {
    const t = useTranslate();
    return (
        <Box py="25px" w="full" alignItems="center" bg="primary.100" {...other}>
            <Avatar uri={data.avatar} width={74} height={74} />
            {!hideName && (
                <Text fontWeight="600" fontSize="18px" mt="12px">
                    {data.fullName}
                </Text>
            )}
            <Text fontSize="14px" mt="12px">
                {data.phoneNumber}
            </Text>
            {active && (
                <Box
                    px="12px"
                    py="4px"
                    bg={'green.400'}
                    // borderWidth="1px"
                    // borderColor="green.400"
                    borderRadius="30px"
                    mt="4px"
                >
                    <Text color="white">{t('components.active')}</Text>
                </Box>
            )}
        </Box>
    );
}
