import { Box, CheckCircleIcon, HStack, Icon, IconButton, Text, useTheme } from 'native-base';
import React, { useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../../components/Button';
import { ExternalTransferIcon } from '../../../components/Icons';
import Clock3 from '../../../components/Icons/Clock3';
import useTranslate from '../../../i18n/useTranslate';
import useShallowEqualSelector from '../../../redux/customHook/useShallowEqualSelector';
import { responseToTransferOwnership } from '../../../rest_client/apiClient';
import BottomWrapper from './BottomWrapper';

const TextAnnouncement = ({ children, ...others }) => {
    return (
        <Text fontWeight={600} fontSize={11} flex={1} {...others}>
            {children}
        </Text>
    );
};

const RowApprovePending = ({
    // children,
    dividerHorizontal,
    // claimants,
    item,
    owner = false,
    name = 'user',
    // ...others
}) => {
    const { colors } = useTheme();
    const t = useTranslate();

    return (
        <>
            {dividerHorizontal && (
                <Box ml={'7px'} my={'4px'} w={'1px'} h={'19px'} bgColor={'gray.1400'}></Box>
            )}
            <Box flexDir={'row'} alignItems={'center'}>
                {item?.vote === 'pending' ? (
                    <>
                        <Clock3 color={colors.appColors.primaryYellow} width="14" height="14" />
                        <Text ml={'10px'} fontSize={11} fontWeight={400}>
                            {t('transferOwnership.pendingApproveByName')}
                            <Text fontWeight={600}>{name}</Text>
                        </Text>
                    </>
                ) : (
                    <>
                        <CheckCircleIcon color={colors.primary[600]} size={14} />
                        <Text ml={'10px'} fontSize={11} fontWeight={400}>
                            {owner
                                ? t('transferOwnership.transferredByName')
                                : t('transferOwnership.approvedFromVoter')}
                            <Text fontWeight={600}>{name}</Text>
                        </Text>
                    </>
                )}
            </Box>
        </>
    );
};

const initLoading = {
    accept: false,
    decline: false,
};

const ResponseToTransferOwnership = ({
    plot,
    transferRequest,
    initData,
    claimants,
    setResponseTransfer,
    step,
    tab,
}) => {
    const user = useShallowEqualSelector((state) => state.user);
    const [loading, setLoading] = useState(initLoading);
    const t = useTranslate();
    const [error, setError] = useState('');
    const [openApproval, setOpenApproval] = useState(false);
    const { colors } = useTheme();

    if (!(step === 4 || (step === 0 && tab === 1) || (step === 1 && tab === 1))) return null;

    const numberOwner = claimants.filter((item) => {
        return item?.role === 'owner' || item?.role === 'co-owner';
    }).length;

    const onResponse = async (accept, callBack = () => {}) => {
        try {
            setError('');
            if (accept) {
                setLoading({
                    ...initLoading,
                    accept: true,
                });
            } else {
                setLoading({
                    ...initLoading,
                    decline: true,
                });
            }
            const res = await responseToTransferOwnership({
                data: {
                    accept: accept,
                },
                plotId: plot._id,
            });
            if (accept && numberOwner <= 1) {
                callBack();
            } else if (!accept) {
                callBack();
            }
            if (res?.data && initData) {
                await initData();
            }
        } catch (e) {
            console.log(e);
            setError(e);
        }
        setLoading(initLoading);
    };

    const claimantTransfer = claimants.find((item) => {
        return item?._id === transferRequest?.currentOwner;
    });

    const onAccept = async () => {
        // modalCongratulationRef.current.announce('success');
        await onResponse(true, () => {
            setResponseTransfer({
                visible: true,
                status: 'success',
            });
        });
    };

    const onReject = async () => {
        // modalCongratulationRef.current.announce('fail');
        await onResponse(false, () => {
            setResponseTransfer({
                visible: true,
                status: 'fail',
            });
        });
    };

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

    const checkSameUserNominated = () => {
        if (transferRequest?.nominatedOwner?._id === user?.userInfo._id) {
            return true;
        }
        return false;
    };
    if (checkSameUserNominated()) {
        if (transferRequest?.status === 'pending') {
            return (
                <BottomWrapper>
                    <HStack alignItems={'center'} justifyContent={'space-between'}>
                        <TextAnnouncement pr="5px">
                            {t('transferOwnership.plotDecision', {
                                name: claimantTransfer?.fullName || 'user',
                            })}
                        </TextAnnouncement>

                        <HStack w={'160px'}>
                            <Button
                                borderRadius={4}
                                variant="outline"
                                width="60"
                                height="8"
                                py={0}
                                mr={4}
                                onPress={onReject}
                                borderColor={'danger.300'}
                                isDisabled={loading.decline || loading.accept}
                                isLoading={loading.decline}
                                _spinner={{ color: 'appColors.primaryRed' }}
                            >
                                <Text fontSize={10} fontWeight={600} color={'danger.300'}>
                                    {t('button.decline')}
                                </Text>
                            </Button>
                            <Button
                                borderRadius={4}
                                w="65"
                                height="8"
                                py={0}
                                _container={{ w: 65, h: 8, borderRadius: 4, py: 0 }}
                                onPress={onAccept}
                                bg={'primary.600'}
                                isDisabled={loading.decline || loading.accept}
                                color="custom"
                                isLoading={loading.accept}
                                _spinner={{ color: 'white' }}
                            >
                                <Text fontSize={10} fontWeight={600} color={'white'}>
                                    {t('button.approve')}
                                </Text>
                            </Button>
                        </HStack>
                    </HStack>
                    {error.length > 0 && (
                        <Text
                            fontSize={11}
                            fontWeight={600}
                            color={'error.400'}
                            textAlign={'center'}
                            mt={'4px'}
                        >
                            {error}
                        </Text>
                    )}
                </BottomWrapper>
            );
        } else if (transferRequest?.status === 'voting') {
            const voters = transferRequest?.voters.sort(customSort);
            const approved = voters?.filter((item) => item?.vote === 'approve');
            return (
                <BottomWrapper>
                    <Box flexDir={'row'} px={'10px'}>
                        <ExternalTransferIcon color={colors.primary[600]} />
                        <Box ml={'10px'} flex={1}>
                            <Text fontSize={11}>{t('transferOwnership.approvedAndWaiting')}</Text>
                            <TextAnnouncement mt={'6px'} fontSize={11}>
                                {t('transferOwnership.approvedOwners', {
                                    number: approved?.length + 1 || 0,
                                    total: voters?.length + 1 || 0,
                                })}
                            </TextAnnouncement>

                            {openApproval && (
                                <Box mt={'10px'}>
                                    <RowApprovePending owner name={claimantTransfer?.fullName} />
                                    {voters?.map((item, index) => {
                                        const claimant = claimants.find(
                                            (c) => c?._id === item?.owner,
                                        );
                                        return (
                                            <RowApprovePending
                                                key={index}
                                                item={item}
                                                dividerHorizontal
                                                name={claimant?.fullName}
                                            />
                                        );
                                    })}
                                </Box>
                            )}
                        </Box>
                        <Box>
                            <IconButton
                                icon={
                                    <Icon
                                        as={MaterialCommunityIcons}
                                        name={openApproval ? 'chevron-up' : 'chevron-down'}
                                        color={'black'}
                                    />
                                }
                                borderRadius={'full'}
                                color={'black'}
                                borderWidth={1}
                                borderColor={'gray.1400'}
                                onPress={() => setOpenApproval(!openApproval)}
                                size={7}
                            />
                        </Box>
                    </Box>
                </BottomWrapper>
            );
        }
    }
    const numberOwnerFromClaimants = claimants.filter(
        (i) => i.role === 'owner' || i.role === 'co-owner',
    ).length;
    if (
        claimantTransfer?._id === user?.userInfo._id &&
        (numberOwnerFromClaimants === 1 || transferRequest?.status === 'voting')
    ) {
        return (
            <BottomWrapper>
                <HStack alignItems={'center'}>
                    <ExternalTransferIcon width={30} height={30} color={colors.primary[600]} />
                    <TextAnnouncement ml={'10px'}>
                        {transferRequest?.status === 'voting'
                            ? t('transferOwnership.youHaveTransferred', {
                                  phoneNumber: transferRequest?.nominatedOwner?.phoneNumber,
                              })
                            : t('transferOwnership.youHaveTransferred2', {
                                  phoneNumber: transferRequest?.nominatedOwner?.phoneNumber,
                              })}
                    </TextAnnouncement>
                </HStack>
            </BottomWrapper>
        );
    }

    const _claimant = claimants.find((item) => item?._id === user?.userInfo._id);
    if (
        _claimant &&
        (_claimant?.role === 'owner' || _claimant?.role === 'co-owner') &&
        !transferRequest?.voters.find((item) => item.owner === user?.userInfo._id)
    ) {
        return (
            <BottomWrapper>
                <HStack alignItems={'center'}>
                    <ExternalTransferIcon width={30} height={30} color={colors.primary[600]} />
                    <TextAnnouncement ml={'10px'}>
                        {t('transferOwnership.plotOnTransferOwnership', {
                            phoneNumber: transferRequest?.nominatedOwner?.phoneNumber,
                        })}
                    </TextAnnouncement>
                </HStack>
            </BottomWrapper>
        );
    }

    return null;
};

export default ResponseToTransferOwnership;
