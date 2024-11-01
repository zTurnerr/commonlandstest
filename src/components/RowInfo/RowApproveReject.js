import { Box, CheckCircleIcon, HStack, Text, useTheme } from 'native-base';
import { Trans } from 'react-i18next';
import React from 'react';
import Clock3 from '../Icons/Clock3';

const RowApproveReject = ({ info, BottomComponent, borderBottom = true }) => {
    const { colors } = useTheme();
    const ListIcon = {
        approved: {
            Icon: CheckCircleIcon,
            color: colors?.primary[600],
            i18Key: 'components.approvedByUser',
        },
        pending: {
            Icon: Clock3,
            color: colors?.appColors?.primaryYellow,
            i18Key: 'components.pendingApproveByUser',
        },
        rejected: {
            Icon: CheckCircleIcon,
            color: colors?.danger?.[1600],
            i18Key: 'components.rejectedByUser',
        },
    };
    const Element = ListIcon[info?.status];

    return (
        <>
            <HStack space={2}>
                <Box>
                    <Element.Icon
                        color={Element.color}
                        size={'20px'}
                        width={'20px'}
                        height={'20px'}
                    />
                </Box>
                <Text fontSize={12}>
                    <Trans
                        i18nKey={Element?.i18Key}
                        values={{ name: info?.fullName }}
                        components={[<Text fontWeight={600} key={0} />]}
                    ></Trans>
                </Text>
            </HStack>
            <Box
                my={'10px'}
                ml={'10px'}
                minH={'28px'}
                borderLeftWidth={borderBottom ? 1 : 0}
                borderLeftColor={'black:alpha.10'}
            >
                {BottomComponent}
            </Box>
        </>
    );
};

export default RowApproveReject;
