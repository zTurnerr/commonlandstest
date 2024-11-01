import {
    Box,
    CheckCircleIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    FlatList,
    HStack,
    Text,
    useDisclose,
    useTheme,
} from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import ApproveRejectTag from '../../components/Tag/ApproveRejectTag';
import Clock3 from '../../components/Icons/Clock3';
import useTranslate from '../../i18n/useTranslate';
import { StopIcon } from '../../components/Icons';

const RowApproveNeighbor = ({ item, onViewReason }) => {
    const { isOpen, onToggle } = useDisclose();
    const { colors } = useTheme();
    const t = useTranslate();
    const ICON_LIST = {
        approved: {
            Icon: CheckCircleIcon,
            color: colors.primary[600],
        },
        rejected: {
            Icon: StopIcon,
            color: colors.danger[700],
        },
        pending: {
            Icon: Clock3,
            color: colors.appColors.primaryYellow,
        },
    };

    const IconType = ICON_LIST[item?.status];

    return (
        <Box
            borderRadius={'12px'}
            borderWidth={1}
            borderColor={!isOpen ? 'gray.2310' : 'black:alpha.10'}
            bgColor={!isOpen ? 'gray.2310' : 'white'}
            px={'20px'}
            py={'15px'}
            mb={'15px'}
        >
            <TouchableOpacity onPress={onToggle}>
                <HStack alignItems={'center'}>
                    <HStack flex={1} alignItems={'center'} space={2}>
                        <Text fontWeight={700} fontSize={12}>
                            {item?.fullName}
                        </Text>
                        <IconType.Icon
                            color={IconType.color}
                            width={20}
                            height={20}
                            size={'20px'}
                        />
                    </HStack>
                    {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </HStack>
            </TouchableOpacity>
            {isOpen && (
                <FlatList
                    data={item?.rowUser}
                    renderItem={({ item: itemMember }) => (
                        <Box pt={'10px'}>
                            <HStack alignItems={'center'}>
                                <Box flex={1} mr={'10px'}>
                                    <Text fontSize={12} fontWeight={500} flex={1}>
                                        {itemMember?.name}
                                    </Text>
                                    <Text fontSize={12} color={'black:alpha.50'}>
                                        {itemMember?.role}
                                    </Text>
                                </Box>
                                <ApproveRejectTag status={itemMember?.status} />
                            </HStack>
                            {itemMember?.reason && (
                                <TouchableOpacity
                                    onPress={() =>
                                        onViewReason({ plotName: item?.fullName, ...itemMember })
                                    }
                                >
                                    <Text fontWeight={500} color={'primary.600'}>
                                        {t('components.viewReason')}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </Box>
                    )}
                    ItemSeparatorComponent={() => <Box bgColor={'black:alpha.10'} h={'1px'}></Box>}
                />
            )}
        </Box>
    );
};

export default RowApproveNeighbor;
