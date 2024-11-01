import { Box, HStack, Text } from 'native-base';
import React from 'react';
import useTranslate from '../../i18n/useTranslate';

const Switch1 = ({ isOn = true }) => {
    const t = useTranslate();
    const StateOn = (
        <HStack px="6px" py="6px" bg="primary.600" borderRadius={'100px'}>
            <Text color="white" fontWeight={600}>
                {t('components.on')}
            </Text>
            <Box
                bg="white"
                borderRadius={'100px'}
                h="18px"
                w="18px"
                ml="8px"
                borderWidth={'2px'}
                borderColor={'white'}
            />
        </HStack>
    );

    const StateOff = (
        <HStack px="6px" py="6px" bg="gray.400" borderRadius={'100px'}>
            <Box
                bg="white"
                borderRadius={'100px'}
                h="18px"
                w="18px"
                mr="8px"
                borderWidth={'2px'}
                borderColor={'white'}
            />
            <Text color="white" opacity={0} fontWeight={600}>
                {t('components.off')}
            </Text>
        </HStack>
    );

    return <>{isOn ? StateOn : StateOff}</>;
};

export default Switch1;
