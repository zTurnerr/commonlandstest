import useTranslate from '../../i18n/useTranslate';
import { HStack, Text } from 'native-base';
import React from 'react';
import ClockCheck from '../Icons/ClockCheck';

const WaitingActiveTag = ({ _container }) => {
    const t = useTranslate();

    return (
        <HStack
            p="5px"
            space={1}
            alignItems={'center'}
            borderRadius={'8px'}
            bg="yellow.300"
            w="full"
            {..._container}
        >
            <ClockCheck color="#EAA300" />
            <Text flex={1} fontWeight={600} color="yellow.100">
                {t('contract.contractBeingActivated')}
            </Text>
        </HStack>
    );
};

export default WaitingActiveTag;
