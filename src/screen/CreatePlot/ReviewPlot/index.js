import useTranslate from '../../../i18n/useTranslate';
/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import { Box, ScrollView, Skeleton, Text } from 'native-base';
import React, { useEffect, useMemo, useState } from 'react';
import { CLAIMANTS, NEIGHTBORS } from '../../../util/Constants';

import { TouchableOpacity } from 'react-native';
import ClaimantReqPendingMsg from '../../../components/Plot/ClaimantReqPendingMsg';
import ReqClaimantWait from '../../../components/Plot/ReqClaimantWait';
import PlotInfoForm from '../../../components/PlotInfoForm';
import DisputedPlotTab from './DisputedPlotTab';
import NeightborsTab from './NeightborsTab';
import PhotoTab from './PhotoTab';
import PendingRemoveClaimantAlert from '../../../components/Alert/PendingRemoveClaimantAlert';
import ClaimantsTab from './RelationshipTab';

export default function Index({
    plotData = {},
    invitesPending = [],
    userInfo,
    setInvitePeople,
    images,
    neightbors = [],
    numberClaimchain = 1,
    showPlotID = true,
    onDeleteClaimant,
    claimants,
    transferOwnershipRequest,
    withdrawalOwnershipRequest,
    initData,
    permissions,
    status,
    onImagePress,
    imageActive,
    isLoading = false,
    disputedPlot = [],
    onPlotPress,
    onChangeTab,
    isFlagged,
    plot,
    tab = 1,
    onDeleteInvite,
    disabledPressPlotStatus = false,
    setStep,
    onOpenClaimantManagement,
    _container = {},
    hideShare = false,
}) {
    const t = useTranslate();

    const TABS = [
        {
            label: t('claimants.claimants'),
            value: 1,
        },
        {
            label: t('claimants.neighbors'),
            value: 2,
        },
        {
            label: t('claimants.disputed'),
            value: 3,
        },
        {
            label: t('claimants.photos'),
            value: 4,
        },
    ];

    const TABS_FLAGGED = [
        {
            label: t('claimants.claimants'),
            value: 1,
        },
        {
            label: t('claimants.photos'),
            value: 4,
        },
    ];

    const claimantsItems = useMemo(() => {
        return invitesPending.filter((i) => CLAIMANTS.includes(i.relationship));
    }, [invitesPending]);

    const neightborsPending = useMemo(() => {
        return invitesPending.filter((i) => NEIGHTBORS.includes(i.relationship));
    }, [invitesPending]);
    const [_tab, setTab] = useState(tab || 1);
    useEffect(() => {
        setTab(tab);
    }, [tab]);
    const getCount = (_tab) => {
        switch (_tab) {
            case 1:
                return claimantsItems?.length + (userInfo?._id ? 1 : 0) + (claimants?.length || 0);
            case 2:
                return neightbors?.length + neightborsPending?.length;
            case 3:
                return disputedPlot?.length;
            case 4:
                return images?.length || 0;
            default:
                return 0;
        }
    };

    return (
        <>
            <Box
                w="full"
                px="15px"
                // mt="12px"
                borderBottomColor={'divider'}
                borderBottomWidth={'1px'}
                bg="white"
                {..._container}
            >
                {isLoading ? (
                    <>
                        <Skeleton.Text lines={4} />
                        <Box flexDir="row">
                            <Skeleton mt="12px" w="100px" borderRadius={'30px'} />
                            <Skeleton mt="12px" w="100px" borderRadius={'30px'} ml="12px" />
                        </Box>
                    </>
                ) : (
                    <PlotInfoForm
                        showPlotID={showPlotID}
                        plotData={{ plot: isFlagged ? plot : { ...plotData, status } }}
                        numberClaimchain={numberClaimchain}
                        onInvitePress={setInvitePeople}
                        showStatus={isFlagged ? false : true}
                        permissions={permissions}
                        isLoading={isLoading}
                        isFlagged={isFlagged}
                        disabledPressPlotStatus={disabledPressPlotStatus}
                        showClaimrank={true}
                        hideShare={hideShare}
                    />
                )}

                <ScrollView
                    w="full"
                    flexDirection="row"
                    mt="12px"
                    // borderBottomColor="divider"
                    // borderBottomWidth="1px"
                    horizontal
                >
                    {(isFlagged ? TABS_FLAGGED : TABS).map((item) => {
                        let active = _tab === item.value;
                        return (
                            <Box p="8px" pb="0px" w={120} key={item.value}>
                                <TouchableOpacity
                                    onPress={() => {
                                        onChangeTab?.(item.value);
                                        setTab(item.value);
                                    }}
                                >
                                    <Text
                                        textAlign="center"
                                        fontWeight="bold"
                                        color={!active ? 'gray.500' : 'primary.900'}
                                        pb="8px"
                                    >
                                        {item.label} ({getCount(item.value)})
                                    </Text>
                                    <Box
                                        borderBottomColor={active ? 'primary.900' : 'transparent'}
                                        borderBottomWidth="4px"
                                        borderRadius="4px"
                                        h="0"
                                    />
                                </TouchableOpacity>
                            </Box>
                        );
                    })}
                </ScrollView>
            </Box>

            <Box flex={1} bg="gray.1500" w="full" pb={'20px'}>
                {_tab === 1 && (
                    <PendingRemoveClaimantAlert
                        onSeeMore={() => {
                            setStep(1);
                        }}
                    />
                )}
                {_tab === 1 && (
                    <ClaimantsTab
                        invitesPending={claimantsItems}
                        ownerInfo={userInfo}
                        onDeleteClaimant={onDeleteClaimant}
                        onDeleteInvite={onDeleteInvite}
                        claimants={claimants || plot?.claimants}
                        isLoading={isLoading}
                        permissions={permissions}
                        transferOwnershipRequest={transferOwnershipRequest}
                        withdrawalOwnershipRequest={withdrawalOwnershipRequest}
                        initData={initData}
                        plotData={plotData}
                        canRemove={false}
                        showBanner
                        onOpenClaimantManagement={onOpenClaimantManagement}
                    />
                )}
                {_tab === 2 && (
                    <NeightborsTab
                        neightbors={neightbors}
                        neightborsPending={neightborsPending}
                        onDelete={() => {}}
                        isLoading={isLoading}
                        onPlotPress={onPlotPress}
                        onDeleteInvite={onDeleteInvite}
                        permissions={permissions}
                    />
                )}
                {_tab === 3 && (
                    <DisputedPlotTab
                        disputedPlot={disputedPlot}
                        isLoading={isLoading}
                        onPlotPress={onPlotPress}
                    />
                )}
                {_tab === 4 && (
                    <PhotoTab
                        isLoading={isLoading}
                        images={images || plot?.images}
                        onImagePress={onImagePress}
                        imageActive={imageActive}
                    />
                )}
                {_tab === 1 && <ReqClaimantWait />}
                {_tab === 1 && <ClaimantReqPendingMsg />}
            </Box>
        </>
    );
}
