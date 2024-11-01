import { Box, Text } from 'native-base';

import { useRoute } from '@react-navigation/native';
import React, { useEffect, useMemo } from 'react';
import { EventRegister } from 'react-native-event-listeners';
import RemoveClaimantList from '../../../components/Plot/RemoveClaimantList';
import ReqClaimantList from '../../../components/Plot/ReqClaimantList';
import Tabs from '../../../components/Tabs';
import { EVENT_NAME } from '../../../constants/eventName';
import useUserInfo from '../../../hooks/useUserInfo';
import useTranslate from '../../../i18n/useTranslate';
import { INVITE_STATUS, NEIGHTBORS } from '../../../util/Constants';
import Relationship from '../../CreatePlot/ReviewPlot/RelationshipTab';

export default function ManagerClaimants({
    plotData,
    plotsInvites,
    onDeleteInvite,
    onDeleteClaimant,
    permissions,
}) {
    const [tab, setTab] = React.useState(0);
    const t = useTranslate();

    const invitesPending = useMemo(
        () =>
            plotsInvites?.created
                ?.filter((i) => i.status === INVITE_STATUS.sent && i.relationship !== NEIGHTBORS[0])
                ?.map((i) => ({
                    ...i,
                    phoneNumber: i.inviteePhoneNumber,
                    inviteID: i._id,
                })),
        [plotsInvites?.created],
    );

    const TABS = [
        {
            label: `${t('invite.claimants')} (${plotData?.claimants?.length})`,
        },
        {
            label: `${t('invite.pendingApproval')} (${invitesPending?.length})`,
        },
    ];

    useEffect(() => {
        let listener = EventRegister.addEventListener(EVENT_NAME.gotoPendingClaimantReq2, () => {
            setTab(1);
        });
        return () => EventRegister.removeEventListener(listener);
    }, []);

    return (
        <>
            <Tabs items={TABS} activeIndex={tab} onTabChange={(index) => setTab(index)} />
            <Box>
                {tab === 0 && <ClaimantsTab plotData={plotData} />}
                {tab === 0 && <RemoveClaimantList />}

                <Box>
                    {tab === 1 && (
                        <PendingTab
                            plotsInvites={plotsInvites}
                            onDeleteInvite={onDeleteInvite}
                            onDeleteClaimant={onDeleteClaimant}
                            permissions={permissions}
                            invitesPending={invitesPending}
                        />
                    )}
                </Box>
            </Box>
            {tab === 1 && <ReqClaimantList />}
        </>
    );
}

const ClaimantsTab = ({ plotData }) => {
    const t = useTranslate();
    const plotStatus = plotData?.plot?.status;
    const user = useUserInfo();
    const userClaimant = plotData?.claimants?.find((c) => c?._id === user?._id);

    let isAllowRemove = () => {
        if (!plotData) {
            return false;
        }
        if (userClaimant?.role === 'owner' || userClaimant?.role === 'co-owner') {
            return true;
        }
        return false;
    };

    let isDisableRemove = () => {
        if (plotData?.hasOwnershipTransferRequest || plotData.hasOwnershipWithdrawalRequest) {
            return true;
        }
        if (plotStatus === 'defaulted' || plotStatus === 'locked') {
            return true;
        }
        return false;
    };

    return (
        <Box bg="gray.1500">
            <Box px="20px">
                <Text fontWeight="600" fontSize="14px" mb="22px" mt="12px">
                    {t('invite.addPeopleRelated')}
                </Text>
            </Box>
            <Relationship
                display="flex"
                space={1}
                showRemoveDetail={true}
                claimants={plotData?.claimants}
                flex={1}
                disableRemove={isDisableRemove()}
                canRemove={isAllowRemove()}
            />
        </Box>
    );
};

const PendingTab = ({ onDeleteClaimant, onDeleteInvite, permissions, invitesPending }) => {
    const t = useTranslate();
    const route = useRoute();

    const totalClaimants = route.params?.claimantReq.length + invitesPending.length;
    return (
        <Relationship
            invitesPending={invitesPending}
            onDeleteInvite={onDeleteInvite}
            onDeleteClaimant={onDeleteClaimant}
            permissions={permissions}
            canRemove={false}
            emptyText={t('invite.noPendingApproval')}
            isEmpty={!totalClaimants}
        />
    );
};
