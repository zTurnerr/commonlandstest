import { HStack, Text, useTheme } from 'native-base';
import React from 'react';
import moment from 'moment';
import useTranslate from '../../../i18n/useTranslate';
import Clock2 from '../../Icons/Clock2';

const ExpireTag = ({ _container, time }) => {
    const t = useTranslate();
    const theme = useTheme();
    return (
        <HStack
            p="5px"
            space={1}
            alignItems={'center'}
            borderRadius={'8px'}
            bg="yellow.300"
            {..._container}
        >
            <Clock2 color={theme.colors.yellow[100]} />
            <Text fontWeight={600} color="yellow.100">
                {t('components.expires') + ' ' + moment(time).fromNow()}
            </Text>
        </HStack>
    );
};

export default ExpireTag;
