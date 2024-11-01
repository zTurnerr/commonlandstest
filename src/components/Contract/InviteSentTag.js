import { HStack, Text } from 'native-base';
import React from 'react';
import useTranslate from '../../i18n/useTranslate';
import ClockCheck from '../Icons/ClockCheck';

const InviteSentTag = () => {
    const t = useTranslate();
    return (
        <HStack
            maxH="30px"
            p="5px"
            space={1}
            alignItems={'center'}
            borderRadius={'8px'}
            bg="yellow.300"
        >
            <ClockCheck color="#EAA300" />
            <Text fontWeight={600} color="yellow.100">
                {t('contract.inviteSent')}
            </Text>
        </HStack>
    );
};

export default InviteSentTag;