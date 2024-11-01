import { Box, Button, HStack, Text, VStack, useTheme } from 'native-base';
import useTranslate from '../../../i18n/useTranslate';

import { useRoute } from '@react-navigation/native';
import { getCertificateStatus } from 'cml-script';
import { Danger } from 'iconsax-react-native';
import React, { useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AvatarAndInfo from '../../../components/AvatarAndInfo';
import Banner from '../../../components/Banner';
import ConfirmModal from '../../../components/ConfirmModal';
import ClockCheck from '../../../components/Icons/ClockCheck';
import { useModalRemoveClaimant } from '../../../components/Plot/ModalRemoveClaimant';
import PlotRole from '../../../components/PlotRole';
import { CertificateStatus } from '../../../components/PlotStatus';
import ExpireTag from '../../../components/Tag/ExpireTag/ExpireTag';
import PendingRemoveTag from '../../../components/Tag/RemoveTag/PendingRemoveTag';
import { toast } from '../../../components/Toast';
import { CLAIMANT_AVT_SIZE, CLAIMANT_ITEM_PX } from '../../../constants/claimantItem';
import { EVENT_NAME } from '../../../constants/eventName';
import useMapUserByPhoneNumber from '../../../hooks/useMapUserByPhoneNumber';
import useShallowEqualSelector from '../../../redux/customHook/useShallowEqualSelector';
import { isExpired } from '../../../util/time/isExpired';
import VoteTransferOwnership from '../../PlotInfo/components/VoteTransferOwnership';
import VoteWithdraw from '../../PlotInfo/components/VoteWithdraw';
import UserRow from '../InvitePeople/UserRow';

export default function Index({
    invitesPending = [],
    claimants = [],
    transferOwnershipRequest = {},
    withdrawalOwnershipRequest = {},
    initData,
    ownerInfo,
    onDeleteInvite = async () => {},
    // onDeleteClaimant = () => {},
    plotData,
    canRemove = true,
    disableRemove = false,
    showRemoveDetail = false,
    permissions,
    emptyText = 'No claimants',
    showBanner = false,
    onOpenClaimantManagement,
    isEmpty = false,
    ...style
}) {
    const [cancelInviteId, setCancelInviteId] = useState(null);
    const [isCancelInviteSubmitting, setIsCancelInviteSubmitting] = useState(false);
    const theme = useTheme();
    const t = useTranslate();
    const { colors } = useTheme();

    const modalRemoveClaimantHook = useModalRemoveClaimant();
    const { params } = useRoute();

    const user = useShallowEqualSelector((state) => state.user);

    const handleCancelInvite = async () => {
        try {
            setIsCancelInviteSubmitting(true);
            await onDeleteInvite(cancelInviteId);
            EventRegister.emit(EVENT_NAME.refetchPlotData);
            toast.success(t('invite.cancelInviteSuccess'));
        } catch (error) {
            toast.error(error);
        } finally {
            setIsCancelInviteSubmitting(false);
            setCancelInviteId(null);
        }
    };

    const hasInvitePending = useMemo(() => {
        return invitesPending.reduce((prev, current) => !!current.expiredAt || prev, false);
    }, [invitesPending]);

    const { users: mappedInvitesPending, isLoading } = useMapUserByPhoneNumber(invitesPending);

    return (
        <VStack {...style}>
            {modalRemoveClaimantHook.Component({})}
            {ownerInfo ? (
                <Wrapper>
                    <UserRow mb="0px" info={ownerInfo} owner type={ownerInfo.role} />
                </Wrapper>
            ) : null}
            {!!permissions?.inviteClaimant &&
                showBanner &&
                hasInvitePending &&
                !params?.creatingSubPlot && (
                    <Banner
                        icon={<MaterialCommunityIcons name="clock-check-outline" size={18} />}
                        message={t('invite.pendingApprovalInviteClaimant')}
                        colorScheme="warning"
                        action={
                            <TouchableOpacity
                                onPress={() => {
                                    onOpenClaimantManagement();
                                    setTimeout(
                                        () =>
                                            EventRegister.emit(EVENT_NAME.gotoPendingClaimantReq2),
                                        100,
                                    );
                                }}
                            >
                                <Text fontSize="12px" color="#DB990B" lineHeight="22px" underline>
                                    {t('button.view')}
                                </Text>
                            </TouchableOpacity>
                        }
                    />
                )}
            {mappedInvitesPending.map((item, index) => {
                return (
                    <Wrapper key={item._id || index}>
                        <AvatarAndInfo
                            primary={item.fullName || 'Unknown'}
                            secondary={item.phoneNumber}
                            secondaryStyles={styles.invitePendingAvatarSecondary}
                            actions={[
                                item.button,
                                // permissions?.inviteClaimant && (
                                //     <Button
                                //         {...styles.buttonCancel}
                                //         onPress={() => onDeleteInvite(item)}
                                //         key={1}
                                //     >
                                //         {t('button.cancel')}
                                //     </Button>
                                // ),
                            ]}
                            isLoading={isLoading}
                            pending={!!item.willExpireAfter}
                            willExpireAfter={item.willExpireAfter}
                            onCancelInvite={() => setCancelInviteId(item.inviteID)}
                            endAdornment={<PlotRole key="role" type={item.relationship} />}
                            canCancel={item.createdBy?._id === user?.userInfo?._id}
                        />
                    </Wrapper>
                );
            })}
            {claimants?.map((item, index) => {
                // check removing
                let req = params?.removingClaimants?.find(
                    (i) => i?.claimant === item?._id && !isExpired(i.expiredAt),
                );
                if (req && showRemoveDetail) {
                    return null;
                }

                //
                const hideInfo = Boolean(item.type);
                const tmpRemoving = params?.removingClaimants?.find(
                    (i) => i?.claimant === item?._id,
                );
                return (
                    <Wrapper key={index}>
                        <AvatarAndInfo
                            avatar={hideInfo ? '' : item.avatar}
                            primary={hideInfo ? '' : item.fullName}
                            secondary={hideInfo ? '' : item.phoneNumber}
                            secondaryStyles={styles.claimantAvatarSecondary}
                            actions={[<PlotRole key={0} type={item.type || item.role} />]}
                            endAdornment={<PlotRole key={0} type={item.type || item.role} />}
                        >
                            {hideInfo && (
                                <>
                                    <Box {...styles.hiddenBox}></Box>
                                    <Box {...styles.hiddenBox}></Box>
                                </>
                            )}
                            {/* {permissions.inviteClaimant &&
                                ['rightOfUse', 'renter'].includes(item.role) && (
                                    <Button
                                        {...styles.buttonRemove}
                                        onPress={() => onDeleteClaimant(item)}
                                        key={1}
                                    >
                                        Remove
                                    </Button>
                                )} */}
                            <CertificateStatus
                                status={getCertificateStatus(item.claimantStatus)}
                                mt="6px"
                            />
                            {item?.status === 'pending' && (
                                <Box
                                    bgColor={'appColors.bgYellow'}
                                    flexDir={'row'}
                                    alignItems={'center'}
                                    px={'10px'}
                                    py={'6px'}
                                    borderRadius={'8px'}
                                    mt={'6px'}
                                >
                                    <ClockCheck color={colors.appColors.iconYellow} />
                                    <Text
                                        ml={'6px'}
                                        color={'appColors.iconYellow'}
                                        fontWeight={600}
                                    >
                                        Pending approval
                                    </Text>
                                </Box>
                            )}
                        </AvatarAndInfo>
                        {transferOwnershipRequest && (
                            <VoteTransferOwnership
                                name={item?.fullName}
                                userId={item?._id}
                                plot={plotData}
                                transferOwner={transferOwnershipRequest}
                                initData={initData}
                            />
                        )}
                        <VoteWithdraw
                            voteForWho={item}
                            withdrawalOwnershipRequest={withdrawalOwnershipRequest}
                            plot={plotData}
                            initData={initData}
                        />
                        {canRemove && item?._id !== user?.userInfo?._id && (
                            <HStack w="full" pl="53px" mb="20px">
                                <Button
                                    maxH="45px"
                                    flex={1}
                                    disabled={
                                        disableRemove || params?.removingClaimants?.length > 0
                                    }
                                    variant={'outline'}
                                    borderColor={'danger.1100'}
                                    borderWidth={2}
                                    _pressed={{ opacity: 0.5, bg: 'white' }}
                                    onPress={() => {
                                        modalRemoveClaimantHook.open({
                                            claimant: item,
                                        });
                                    }}
                                    opacity={
                                        disableRemove || params?.removingClaimants?.length ? 0.5 : 1
                                    }
                                >
                                    <Text color="danger.1100" fontSize={'14px'} fontWeight={600}>
                                        {t('plot.removeClaimant')}
                                    </Text>
                                </Button>
                                <Box flex={1}></Box>
                            </HStack>
                        )}
                        {tmpRemoving && (
                            <HStack
                                pl={CLAIMANT_AVT_SIZE}
                                ml="5px"
                                mb="10px"
                                space={2}
                                flexWrap={'wrap'}
                            >
                                <PendingRemoveTag />
                                <ExpireTag time={tmpRemoving?.expiredAt} />
                            </HStack>
                        )}
                    </Wrapper>
                );
            })}
            {isEmpty && (
                <Box alignItems="center" justifyContent="center" h="200px">
                    <Text fontSize="12" fontWeight="bold" opacity={0.65} textAlign="center">
                        {emptyText}
                    </Text>
                </Box>
            )}
            <ConfirmModal
                isOpen={!!cancelInviteId}
                icon={<Danger size={32} color={theme.colors.error[600]} />}
                colorScheme="error"
                title={t('invite.cancelInviteTitle')}
                description={t('invite.cancelInviteClaimantDescription')}
                confirmText={t('invite.cancelInvite')}
                cancelText={t('button.back')}
                isLoading={isCancelInviteSubmitting}
                onConfirm={handleCancelInvite}
                onCancel={() => setCancelInviteId(null)}
                onClose={() => setCancelInviteId(null)}
            />
        </VStack>
    );
}

const Wrapper = ({ children }) => {
    return (
        <Box
            borderBottomColor={'rgba(0, 0, 0, 0.10)'}
            borderBottomWidth="1px"
            px={CLAIMANT_ITEM_PX}
            bg="white"
        >
            {children}
        </Box>
    );
};

const styles = StyleSheet.create({
    hiddenBox: {
        bgColor: 'gray.300',
        w: '80%',
        h: '20px',
        borderRadius: '4px',
        mb: '4px',
    },
    invitePendingAvatarSecondary: {
        color: 'rgba(0, 0, 0, 0.65)',
    },
    claimantAvatarSecondary: {
        color: 'rgba(0, 0, 0, 0.65)',
    },
    // buttonRemove: {
    //     w: '80px',
    //     h: '24px',
    //     py: '0px',
    //     borderRadius: '8px',
    //     variant: 'outline',
    //     borderColor: '#FF675E',
    //     mt: '2px',
    //     _text: {
    //         color: '#FF675E',
    //         fontSize: '12px',
    //     },
    // },
    // buttonCancel: {
    //     w: '80px',
    //     h: '38px',
    //     py: '0px',
    //     variant: 'outline',
    //     _text: {
    //         color: '#606060',
    //         fontSize: '12px',
    //     },
    // },
});
