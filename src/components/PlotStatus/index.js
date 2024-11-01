import { getPlotStatus } from 'cml-script';
import { Box, Text } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';
import useTranslate from '../../i18n/useTranslate';
import {
    BoundaryDisputeIcon,
    Contract,
    LockedIcon,
    OwnershipDisputeIcon,
    Radar,
    ShieldTick,
} from '../Icons';
import FlaggedIcon from '../Icons/FlaggedIcon';
import Mask from '../Icons/Mask';
import NoteRemove from '../Icons/NoteRemove';

export const ownershipDisputeBgColor = 'rgba(255, 112, 112, 1)';
export const boundaryDisputeBgColor = 'rgba(255, 195, 41, 1)';
export { getPlotStatus };

export default function Index({
    status = 0,
    hideIcon = false,
    _textStyle = {},
    _iconStyle = {},
    backgroundColor,
    ...other
}) {
    const t = useTranslate();
    const RANK = [
        {
            label: t('plotStatus.freeAndClear'),
            bgColor: 'primary.500',
            color: 'white',
            icon: ShieldTick,
        },
        {
            label: t('plotStatus.pending'),
            bgColor: 'rgba(255, 249, 193, 1)',
            color: 'black',
            icon: Radar,
        },
        {
            label: t('plotStatus.ownershipDispute'),
            bgColor: ownershipDisputeBgColor,
            color: 'white',
            icon: OwnershipDisputeIcon,
        },
        {
            label: t('plotStatus.boundaryDispute'),
            bgColor: boundaryDisputeBgColor,
            color: 'white',
            icon: BoundaryDisputeIcon,
        },
        {
            label: t('plotStatus.locked'),
            certificateLabel: t('plotStatus.certificateLocked'),
            bgColor: 'rgba(97, 199, 223, 1)',
            color: 'white',
            icon: LockedIcon,
        },
        {
            label: t('plotStatus.default'),
            certificateLabel: t('plotStatus.certificateInDefault'),
            bgColor: '#AD1457',
            color: 'white',
            icon: NoteRemove,
        },
        {
            label: t('plotStatus.havingLoanContract'),
            bgColor: 'rgba(97, 199, 223, 1)',
            // bgColor: '#5E7BC4',
            color: 'white',
            icon: Contract,
        },
        {
            label: t('plotStatus.onHold'),
            bgColor: '#49606C',
            color: 'white',
            icon: Mask,
        },
    ];

    let data = RANK[status];
    if (!data) {
        return null;
    }
    let { icon: Icon } = data;
    let { width: iconWidth, height: iconHeight } = _iconStyle;

    const styles = StyleSheet.create({
        icon: {
            marginRight: 4,
            ..._iconStyle,
        },
    });
    return (
        <Box
            flexDirection="row"
            borderRadius="30px"
            backgroundColor={backgroundColor ? backgroundColor : data.bgColor}
            h="36px"
            minW="80px"
            justifyContent="center"
            alignItems="center"
            px="12px"
            {...other}
        >
            {!hideIcon && (
                <Icon
                    color={data.color}
                    width={iconWidth || 20}
                    height={iconHeight || 20}
                    style={styles.icon}
                />
            )}
            <Text
                {..._textStyle}
                fontWeight="600"
                color={data.color}
                {...(status === 7 || status === 5 ? { ml: '5px' } : {})}
            >
                {data.label}
            </Text>
        </Box>
    );
}

export const FlaggedStatus = ({ showStatusScale }) => {
    const t = useTranslate();
    return (
        <Box
            bgColor="rgb(250, 189, 58)"
            flexDirection="row"
            borderRadius="30px"
            h="36px"
            minW="80px"
            // justifyContent="center"
            alignItems="center"
            px="12px"
            width={showStatusScale ? '80px' : '100px'}
        >
            <FlaggedIcon
                color="white"
                width={showStatusScale ? 16 : 20}
                height={showStatusScale ? 16 : 20}
            />
            <Text
                color="white"
                ml="4px"
                fontSize={showStatusScale ? '10px' : '12px'}
                fontWeight="600"
            >
                {t('plotStatus.flagged')}
            </Text>
        </Box>
    );
};

export const CertificateStatus = ({
    status = 0,
    hideIcon = false,
    _textStyle = {
        fontSize: '10px',
        marginLeft: '3px',
    },
    _iconStyle = {
        width: 16,
        height: 16,
    },
    backgroundColor,
    ...other
}) => {
    const t = useTranslate();
    const RANK = [
        {
            label: t('plotStatus.freeAndClear'),
            bgColor: 'primary.500',
            color: 'white',
            icon: ShieldTick,
        },
        {
            label: t('plotStatus.pending'),
            bgColor: 'rgba(255, 249, 193, 1)',
            color: 'black',
            icon: Radar,
        },
        {
            label: t('plotStatus.ownershipDispute'),
            bgColor: ownershipDisputeBgColor,
            color: 'white',
            icon: OwnershipDisputeIcon,
        },
        {
            label: t('plotStatus.boundaryDispute'),
            bgColor: boundaryDisputeBgColor,
            color: 'white',
            icon: BoundaryDisputeIcon,
        },
        {
            label: t('plotStatus.locked'),
            certificateLabel: t('plotStatus.certificateLocked'),
            bgColor: 'rgba(97, 199, 223, 1)',
            color: 'white',
            icon: LockedIcon,
        },
        {
            label: t('plotStatus.default'),
            certificateLabel: t('plotStatus.certificateInDefault'),
            bgColor: '#AD1457',
            color: 'white',
            icon: Contract,
        },
        {
            label: t('plotStatus.havingLoanContract'),
            bgColor: 'rgba(97, 199, 223, 1)',
            // bgColor: '#5E7BC4',
            color: 'white',
            icon: Contract,
        },
        {
            label: t('plotStatus.onHold'),
            bgColor: '#49606C',
            color: 'white',
            icon: Mask,
        },
    ];
    if (![4, 5].includes(status)) {
        return null;
    }
    let data = RANK[status];
    if (!data) {
        return null;
    }
    let { icon: Icon } = data;
    let { width: iconWidth, height: iconHeight } = _iconStyle;

    const styles = StyleSheet.create({
        icon: {
            marginRight: 4,
            ..._iconStyle,
        },
    });

    return (
        <Box
            flexDirection="row"
            borderRadius="30px"
            backgroundColor={backgroundColor ? backgroundColor : data.bgColor}
            h="24px"
            minW="80px"
            justifyContent="center"
            alignItems="center"
            px="8px"
            {...other}
        >
            {!hideIcon && (
                <Icon
                    color={data.color}
                    width={iconWidth}
                    height={iconHeight}
                    style={styles.icon}
                />
            )}
            <Text {..._textStyle} fontWeight="600" color={data.color}>
                {data.certificateLabel}
            </Text>
        </Box>
    );
};
