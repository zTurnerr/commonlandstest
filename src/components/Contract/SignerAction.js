import useTranslate from '../../i18n/useTranslate';
import { Box, Button, HStack, Text } from 'native-base';
import React from 'react';
import Signature from '../Icons/Signature';
import Send from '../Icons/Send';

const SignerAction = ({ onSign = () => {}, onSentInvite = null }) => {
    const t = useTranslate();
    return (
        <HStack w="full" space={2}>
            <Button
                onPress={onSign}
                p="0px"
                borderRadius={'4px'}
                maxH={'34px'}
                flex={3}
                variant={'outline'}
                isDisabled={!onSign}
            >
                <HStack space={1}>
                    <Signature color="#5EC4AC" />
                    <Text color="gray.800" fontWeight={500}>
                        {t('button.sign')}
                    </Text>
                </HStack>
            </Button>
            <Button
                p="0px"
                px="10px"
                borderRadius={'4px'}
                maxH={'34px'}
                flex={4}
                variant={'outline'}
                isDisabled={!onSentInvite}
                onPress={onSentInvite}
            >
                <HStack space={1}>
                    <Send color="#5EC4AC" />
                    <Text color="gray.800" fontWeight={500}>
                        {t('invite.sendInvite2')}
                    </Text>
                </HStack>
            </Button>
            <Box flex={3}></Box>
        </HStack>
    );
};

export default SignerAction;
