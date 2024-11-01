import { Box, Text, theme } from 'native-base';
import useTranslate from '../../i18n/useTranslate';

import { useRoute } from '@react-navigation/native';
import { SecurityUser } from 'iconsax-react-native';
import React from 'react';

export default function Index({ type, role, ...style }) {
    const t = useTranslate();
    const TYPE = {
        owner: t('claimants.owner'),
        renter: t('claimants.renter'),
        rightOfUse: t('claimants.rightOfUse'),
        'co-owner': t('claimants.coOwner'),
        creator: t('components.creator'),
    };
    const route = useRoute();
    let { numberOwner } = route?.params || {};
    if (!numberOwner) {
        numberOwner = 0;
    }

    const getType = () => {
        let newRole = type || role;
        if (numberOwner === 1 && newRole === 'owner') {
            return 'owner';
        }
        if (numberOwner > 1 && newRole === 'owner') {
            return 'co-owner';
        }
        return newRole;
    };

    return (
        <Box {...styles.container} {...style}>
            <SecurityUser variant="Bold" size={16} color={theme.colors.white} />
            <Text {...styles.text}>{TYPE[getType()]}</Text>
        </Box>
    );
}

const styles = {
    container: {
        h: '32px',
        flexDirection: 'row',
        alignItems: 'center',
        px: '8px',
        bg: 'primary.900',
        borderRadius: '30px',
    },
    text: {
        fontSize: '12px',
        ml: '4px',
        color: 'white',
    },
};
