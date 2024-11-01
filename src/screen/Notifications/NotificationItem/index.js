import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { getPlotIdFromNotiObj } from '../../../util/noti/noti';
import TYPES from '../NotificationConstants';
import AssignPlot from './AssignPlot';
import ClosestPlot from './ClosestPlot';
import ContractNotiItem from './ContractNotiItem';
import DefaultItem from './DefaultItem';
import FlagAndUnFlag from './FlagAndUnFlag';
import InviteClaimant from './InviteClaimant';
import InviteNeightbor from './InviteNeightbor';
import InviteSubPlot from './InviteSubPlot';
import OwnershipItem from './OwnershipItem';
import WithdrawItem from './WithdrawItem';
import PolygonEditingItem from './PolygonEditingItem';
import useUserInfo from '../../../hooks/useUserInfo';

export default function Index({ data, getData = () => {}, setLoading = () => {} }) {
    const navigation = useNavigation();
    const user = useUserInfo();

    switch (data.type) {
        case TYPES.unflaggedPlot:
        case TYPES.flaggedPlot:
            return <FlagAndUnFlag data={data} />;
        case TYPES.issueCertificate:
            return (
                <DefaultItem
                    data={data}
                    onPress={() => {
                        const plotUserId = JSON.parse(data.data)?.plotUserID;
                        if (user?._id === plotUserId) {
                            navigation.navigate('MyCert', {
                                plotID: getPlotIdFromNotiObj(data),
                            });
                        }
                    }}
                />
            );
        case TYPES.requestToBeClaimantAccepted:
        case TYPES.requestToBeClaimant:
        case TYPES.closestPlot:
        case TYPES.removeClaimantVoting:
        case TYPES.removeClaimantVotingApproved:
        case TYPES.removeClaimantSelfVoting:
        case TYPES.removeClaimantRequestRejected:
        case TYPES.removeClaimantRequestAccepted:
        case TYPES.removeClaimantRequestVoting:
        case TYPES.removeClaimantRejected:
        case TYPES.attestPlot:
            return (
                <DefaultItem
                    data={data}
                    onPress={() => {
                        navigation.navigate('PlotInfo', { plotID: getPlotIdFromNotiObj(data) });
                    }}
                />
            );
        case TYPES.createdLoanContract:
        case TYPES.sentUnderwriter:
        case TYPES.requestToUnlock:
        case TYPES.acceptOrDeclineRequestToUnlock:
        case TYPES.requestCmlUnlock:
        case TYPES.contractUnlocked:
        case TYPES.activateContract:
        case TYPES.signerAccept:
        case TYPES.signerInvitation:
        case TYPES.signerDecline:
        case TYPES.autoMarkContract:
        case TYPES.contractRightsRequest:
        case TYPES.contractRating:
            return (
                <ContractNotiItem
                    getData={getData}
                    data={data}
                    showBtnGroup={data?.actions.length > 0 && !data?.chosenAction}
                    setLoading={setLoading}
                />
            );

        case TYPES.inviteSubPlotClaimant:
            return <InviteSubPlot data={data} />;
        case TYPES.acceptInviteNeighbour:
        case TYPES.inviteNeighbour:
            return <InviteNeightbor data={data} />;
        case TYPES.acceptInviteClaimant:
        case TYPES.inviteClaimant:
            return <InviteClaimant data={data} />;
        case TYPES.withdrawOwnershipVotingRejected:
        case TYPES.withdrawOwnershipVoting:
            return <WithdrawItem data={data} />;
        case TYPES.editPlotRequest:
        case TYPES.editPlotUpdated:
            return <PolygonEditingItem data={data} />;
        case TYPES.ownershipRequest:
        case TYPES.ownershipRequestVotingApproved:
        case TYPES.ownershipRequestVotingRejected:
        case TYPES.ownershipRequestAccepted:
        case TYPES.ownershipRequestVoting:
        case TYPES.ownershipRequestRejected:
            return <OwnershipItem data={data} setLoading={setLoading} />;
        case TYPES.plotAssigned:
            return <AssignPlot data={data} />;
        case TYPES.closestPlot:
            return <ClosestPlot data={data} />;
        default:
            return <DefaultItem data={data} />;
    }
}
