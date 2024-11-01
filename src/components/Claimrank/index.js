import useTranslate from '../../i18n/useTranslate';
/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import React from 'react';
import { Box, Text } from 'native-base';
import { Claimrank } from '../Icons';

const RANK = [
    {
        label: 'Pending',
        bgColor: 'gray.300',
        color: 'white',
    },
    {
        label: 'Very Poor',
        bgColor: 'yellow.600',
        color: 'white',
    },
    {
        label: 'Poor',
        bgColor: 'yellow.400',
        color: 'white',
    },
    {
        label: 'Okay',
        bgColor: 'primary.500',
        color: 'white',
    },
    {
        label: 'Good',
        bgColor: 'primary.700',
        color: 'white',
    },
    {
        label: 'Excellent',
        bgColor: 'primary.800',
        color: 'white',
    },
];

export default function Index({ rank = 0, hideIcon = false, hideTitle = false, ...other }) {
    let data = RANK[rank];
    const t = useTranslate();
    return (
        <Box
            flexDirection="row"
            borderRadius="30px"
            backgroundColor={data.bgColor}
            // borderColor={data.color}
            // borderWidth="1px"
            h="36px"
            alignItems="center"
            px="12px"
            justifyContent="center"
            {...other}
        >
            {!hideIcon && (
                <Box
                    w="26px"
                    h="30px"
                    alignItems="center"
                    justifyContent="center"
                    mr="-4px"
                    // backgroundColor="primary.400"
                >
                    <Claimrank color="white" />
                </Box>
            )}
            <Text fontWeight="600" color={data.color}>
                {hideTitle ? null : t('components.myClaimrank')} {data.label}
            </Text>
        </Box>
    );
}
