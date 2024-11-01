import { Box } from 'native-base';
import React from 'react';
import useTranslate from '../../../i18n/useTranslate';
import { INVITE_STATUS } from '../../../util/Constants';
import ManagerClaimants from './ManagerClaimants';
import ManagerNeightbors from './ManagerNeightbors';

export default function InvitePeople({
    renderPlot,
    sendMessage,
    plotsN,
    onOpenAccept,
    setIDMarkerActive,
    setSelectedIndex,
    onOpen,
    plotData,
    iDMarkerActive,
    plotsInvites,
    // onInvited,
    isFlagged = false,
    tab,
    onDeleteInvite,
    onDeleteClaimant,
    ...style
}) {
    const permissions = plotData?.permissions;
    const t = useTranslate();

    const getStatusData = (status) => {
        switch (status) {
            case INVITE_STATUS.sent:
                return {
                    button: {
                        color: 'secondary',
                        variant: 'outline',
                        label: t('button.sent'),
                        isDisabled: true,
                        onPress: (p) => {
                            onDeleteInvite(p);
                        },
                    },
                    text: {
                        value: t('invite.pendingApproval'),
                        color: 'yellow.400',
                    },
                };
            case INVITE_STATUS.receive:
                return {
                    button: {
                        color: 'primary',
                        variant: 'outline',
                        label: t('button.confirm'),
                        isDisabled: !plotData?.permissions?.acceptNeighborInvitation,
                        onPress: ({ index }) => {
                            onOpenAccept();
                            setSelectedIndex(index);
                        },
                    },
                    text: {
                        value: t('invite.waitingApproval'),
                        color: 'yellow.400',
                    },
                };
            case INVITE_STATUS.accepted:
                return {
                    text: {
                        value: t('invite.connected'),
                        color: 'green.400',
                    },
                    button: {
                        color: 'secondary',
                        variant: 'outline',
                        label: t('button.sent'),
                        isDisabled: true,
                        borderColor: '#FF675E',
                        _text: {
                            color: '#FF675E',
                        },
                        // onPress: (p) => {
                        // onDeleteClaimant(p);
                        // },
                    },
                };

            default:
                return {
                    button: {
                        color: 'primary',
                        variant: 'outline',
                        label: t('invite.sendInvite'),
                        isDisabled: !plotData?.permissions?.inviteNeighbor,
                        onPress: ({ index }) => {
                            onOpen();
                            setSelectedIndex(index);
                        },
                    },
                    text: {
                        value: t('invite.notConnected'),
                        color: 'text.secondary',
                    },
                };
        }
    };

    return (
        <Box {...style}>
            {isFlagged ? (
                <ManagerClaimants
                    plotData={plotData}
                    plotsInvites={plotsInvites}
                    onDeleteInvite={onDeleteInvite}
                    onDeleteClaimant={onDeleteClaimant}
                    permissions={permissions}
                />
            ) : (
                <>
                    {tab === 2 ? (
                        <ManagerNeightbors
                            plotsN={plotsN}
                            plotData={plotData}
                            iDMarkerActive={iDMarkerActive}
                            getStatusData={getStatusData}
                            setIDMarkerActive={setIDMarkerActive}
                            renderPlot={renderPlot}
                            sendMessage={sendMessage}
                            onDeleteInvite={onDeleteInvite}
                        />
                    ) : (
                        <>
                            <ManagerClaimants
                                plotData={plotData}
                                plotsInvites={plotsInvites}
                                onDeleteInvite={onDeleteInvite}
                                onDeleteClaimant={onDeleteClaimant}
                                permissions={permissions}
                            />
                        </>
                    )}
                </>
            )}
        </Box>
    );
}
