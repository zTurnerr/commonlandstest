import { Box, CloseIcon, HStack, IconButton, Text, WarningIcon, useTheme } from 'native-base';
import React, { useEffect, useState } from 'react';
import { TickCircle } from '../../components/Icons';
import useTranslate from '../../i18n/useTranslate';
import { SCREEN_WIDTH } from '../../util/Constants';

export const CertNotify = ({ status }) => {
    const [show, setShow] = useState(true);
    const theme = useTheme();
    useEffect(() => {
        setTimeout(() => {
            setShow(false);
        }, 3000);
    }, []);

    const t = useTranslate();
    if (!show) return null;
    return (
        <Box
            position={'absolute'}
            bottom="20px"
            left="0px"
            right="0px"
            w={SCREEN_WIDTH}
            pb="15px"
            px="20px"
            zIndex={1}
        >
            <HStack p="13px" alignItems={'center'} bg="white" borderRadius={'13px'} shadow={9}>
                {status == 'deprecated' ? (
                    <WarningIcon color={theme.colors.yellow['700']} />
                ) : (
                    <TickCircle color={theme.colors.primary['1000']} />
                )}
                <Text flex={1} ml="13px" fontSize={'14px'} fontWeight={600}>
                    {status == 'deprecated' ? t('certificate.superseded') : t('certificate.valid')}
                </Text>
                <IconButton
                    onPress={() => setShow(false)}
                    icon={<CloseIcon color="gray.500" />}
                    borderRadius={'full'}
                    size={'sm'}
                    color="black"
                />
            </HStack>
        </Box>
    );
};
