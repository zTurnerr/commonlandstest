import useTranslate from '../../i18n/useTranslate';
import { HStack, Text } from 'native-base';
import React from 'react';
import ClockCheck from '../Icons/ClockCheck';
import moment from 'moment';

const ExpireTag = ({ _container, time }) => {
    const t = useTranslate();
    return (
        <HStack
            p="5px"
            space={1}
            alignItems={'center'}
            borderRadius={'8px'}
            bg="yellow.300"
            {..._container}
        >
            <ClockCheck color="#EAA300" />
            <Text fontWeight={600} color="yellow.100">
                {(moment(time).isBefore(moment())
                    ? t('components.expired')
                    : t('components.expires')) +
                    ' ' +
                    moment(time).fromNow()}
            </Text>
        </HStack>
    );
};

export default ExpireTag;
