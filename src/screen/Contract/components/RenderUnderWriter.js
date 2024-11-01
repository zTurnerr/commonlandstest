import { Avatar, Box, Text } from 'native-base';
import React from 'react';
import useTranslate from '../../../i18n/useTranslate';

const RenderUnderWriter = ({ user }) => {
    const t = useTranslate();
    return (
        <Box mt={'24px'}>
            <Text fontSize={'12px'} fontWeight={'700'} mb={'16px'}>
                {t('contract.contractCreator')}
            </Text>
            <Box
                flexDirection={'row'}
                alignItems={'center'}
                borderRadius={'32px'}
                w={'100%'}
                py={'3px'}
                mr={'11px'}
            >
                <Avatar size={'34px'} source={{ uri: user?.avatar }} />
                <Box pl="10px">
                    <Text flex={1} fontSize={'12px'} fontWeight={'700'}>
                        {user?.fullName}
                    </Text>
                    <Text>{user?.phoneNumber}</Text>
                </Box>
            </Box>
        </Box>
    );
};

export default RenderUnderWriter;
