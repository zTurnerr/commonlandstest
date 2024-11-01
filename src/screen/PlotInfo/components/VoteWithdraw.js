import { Box, HStack, Text } from 'native-base';
import React, { useState } from 'react';
import Button from '../../../components/Button';
import useTranslate from '../../../i18n/useTranslate';
import useShallowEqualSelector from '../../../redux/customHook/useShallowEqualSelector';
import { voteWithdrawOwnership } from '../../../rest_client/apiClient';
import { SCREEN_WIDTH } from '../../../util/Constants';

const initLoading = {
    accept: false,
    decline: false,
};

const VoteWithdraw = ({ voteForWho, withdrawalOwnershipRequest, plot, initData }) => {
    const [error, setError] = useState('');
    const user = useShallowEqualSelector((state) => state.user);
    const [loading, setLoading] = useState(initLoading);
    const voters = withdrawalOwnershipRequest?.voters || [];
    const t = useTranslate();
    const voter = voters.find((item) => {
        return item?.owner === user?.userInfo?._id;
    });
    if (!voter) return null;
    if (voteForWho?._id !== withdrawalOwnershipRequest?.owner) return null;
    const approver = voters.filter((item) => {
        return item?.vote === 'approve';
    });

    const onAccept = async () => {
        await onResponse(true);
    };

    const onReject = async () => {
        await onResponse(false);
    };

    const onResponse = async (accept) => {
        try {
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
            setError('');
            const res = await voteWithdrawOwnership({
                data: {
                    approve: accept,
                    requestWOId: withdrawalOwnershipRequest?._id,
                },
                plotId: plot._id,
            });
            if (res?.data && initData) {
                await initData();
            }
        } catch (e) {
            console.log(e);
            setError(e);
        }
        setLoading(initLoading);
    };

    return (
        <Box pr={4} pt={3} pb={1} w={SCREEN_WIDTH} bg={'appColors.bgYellow'} ml={-2}>
            <HStack alignItems={'center'}>
                {voter?.vote === 'pending' ? (
                    <>
                        <Text fontSize={11} fontWeight={600} flex={1} pl={4} pr={'5px'}>
                            {t('withdrawal.ownerWanToWithdraw', {
                                name: voteForWho?.fullName,
                            })}
                        </Text>
                        <HStack w={'160px'}>
                            <Button
                                borderRadius={4}
                                variant="outline"
                                width="60"
                                height="8"
                                py={0}
                                mr={4}
                                onPress={onReject}
                                borderColor={'appColors.primaryRed'}
                                isDisabled={loading.decline || loading.accept}
                                isLoading={loading.decline}
                                _spinner={{ color: 'appColors.primaryRed' }}
                            >
                                <Text fontSize={10} fontWeight={600} color={'appColors.primaryRed'}>
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
                    </>
                ) : (
                    <Text pl={'10px'} fontSize={11} fontWeight={600} flex={1} pr={'5px'}>
                        {t('withdrawal.youHaveApprovedWithdraw', {
                            name: voteForWho?.fullName,
                        })}
                    </Text>
                )}
            </HStack>
            <Text fontWeight={600} fontSize={10} textAlign={'right'} mt={2}>
                {t('transferOwnership.approvedOwners', {
                    number: approver.length + 1,
                    total: voters?.length + 1,
                })}
            </Text>

            {error.length > 0 && (
                <Text ml={'16px'} mt={'0px'} fontWeight={600} fontSize={11} color={'error.400'}>
                    {error}
                </Text>
            )}
        </Box>
    );
};

export default VoteWithdraw;
