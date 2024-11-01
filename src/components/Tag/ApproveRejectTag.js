import { HStack, Text } from 'native-base';
import React from 'react';
import useTranslate from '../../i18n/useTranslate';

const ApproveRejectTag = ({ status }) => {
    const t = useTranslate();
    const STATUS = {
        approved: {
            color: 'primary.1400',
            bgColor: 'primary.1400:alpha.20',
            text: t('components.approved'),
        },
        rejected: {
            color: 'danger.1700',
            text: t('components.declined'),
            bgColor: 'danger.1700:alpha.20',
        },
        pending: {
            color: 'yellow.1700',
            bgColor: 'yellow.1800',
            text: t('components.pending'),
        },
    };

    const type = STATUS[status];

    return (
        <HStack
            px={'10px'}
            py={'4px'}
            bgColor={type.bgColor}
            borderRadius={'100px'}
            alignItems={'center'}
        >
            <Text color={type.color}>{type.text}</Text>
        </HStack>
    );
};

export default ApproveRejectTag;
