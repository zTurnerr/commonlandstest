import { Box, HStack, Icon, IconButton, Text, useTheme } from 'native-base';
import React, { useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { WithdrawOwnershipIcon } from '../../../components/Icons';
import TimeLine from '../../../components/Timeline';
import useTranslate from '../../../i18n/useTranslate';
import useShallowEqualSelector from '../../../redux/customHook/useShallowEqualSelector';
import BottomWrapper from './BottomWrapper';

function customSort(a, b) {
    // Move items with status 'approve' to the front
    if (a.vote === 'approve' && b.vote !== 'approve') {
        return -1;
    } else if (a.vote !== 'approve' && b.vote === 'approve') {
        return 1;
    } else {
        // Maintain the original order for other items
        return 0;
    }
}

const RenderItem = ({ item }) => {
    const t = useTranslate();
    if (item.fromOwner)
        return (
            <Text ml={'10px'}>
                {t('withdrawal.withdrawFromOwner')} <Text fontWeight={600}>{item.name}</Text>
            </Text>
        );
    if (item._status === 'pending')
        return (
            <Text ml={'10px'}>
                {t('withdrawal.pendingApprove')} <Text fontWeight={600}>{item.name}</Text>
            </Text>
        );
    return (
        <Text ml={'10px'}>
            {t('withdrawal.approveBy')} <Text fontWeight={600}>{item.name}</Text>
        </Text>
    );
};

const AnnounceWithdrawal = ({ withdrawalOwnershipRequest, claimants, step, tab }) => {
    const [open, setOpen] = useState(false);
    const user = useShallowEqualSelector((state) => state.user);
    const { colors } = useTheme();
    const t = useTranslate();
    if (!withdrawalOwnershipRequest?.status) return null;
    if (withdrawalOwnershipRequest?.owner !== user?.userInfo?._id) return null;
    if (!(step === 4 || (step === 0 && tab === 1) || (step === 1 && tab === 1))) return null;
    const _tmp = [
        ...withdrawalOwnershipRequest.voters,
        {
            owner: withdrawalOwnershipRequest.owner,
            _status: 'approve',
            vote: 'approve',
            fromOwner: true,
        },
    ];
    const voters = _tmp.map((item) => {
        const claimant = claimants.find((claimant) => claimant._id === item.owner);
        return {
            ...item,
            _status: item?.vote,
            name: claimant?.fullName,
        };
    });
    const approved = voters.filter((item) => item.vote === 'approve');
    return (
        <BottomWrapper>
            <HStack px={'10px'}>
                <WithdrawOwnershipIcon color={colors.primary[600]} />
                <Box flex={1} ml={'10px'}>
                    <Text>{t('withdrawal.withdrawWaitConfirm')}</Text>
                    <Text mt={'6px'} fontWeight={'bold'}>
                        {t('transferOwnership.approvedOwners', {
                            number: approved?.length || 0,
                            total: voters?.length || 0,
                        })}
                    </Text>
                    {open && <TimeLine data={voters.sort(customSort)} RenderItem={RenderItem} />}
                </Box>
                <IconButton
                    icon={
                        <Icon
                            as={MaterialCommunityIcons}
                            name={open ? 'chevron-up' : 'chevron-down'}
                            color={'black'}
                        />
                    }
                    borderRadius={'full'}
                    color={'black'}
                    borderWidth={1}
                    borderColor={'gray.1400'}
                    onPress={() => setOpen(!open)}
                    size={7}
                />
            </HStack>
        </BottomWrapper>
    );
};

export default AnnounceWithdrawal;
