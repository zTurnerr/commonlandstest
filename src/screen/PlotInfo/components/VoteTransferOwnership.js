import { Box, HStack, Text } from 'native-base';
import React, { useState } from 'react';
import Button from '../../../components/Button';
import useTranslate from '../../../i18n/useTranslate';
import useShallowEqualSelector from '../../../redux/customHook/useShallowEqualSelector';
import { voteTransferOwnership } from '../../../rest_client/apiClient';
import { SCREEN_WIDTH } from '../../../util/Constants';

const initLoading = {
    accept: false,
    decline: false,
};

const VoteTransferOwnership = ({ plot, initData, userId, transferOwner, name = 'User' }) => {
    const t = useTranslate();
    const [loading, setLoading] = useState(initLoading);
    const voters = transferOwner?.voters || [];
    const user = useShallowEqualSelector((state) => state.user.userInfo);
    const [error, setError] = useState('');
    const vote = voters.find((item) => {
        return item?.owner === user?._id;
    });

    const checkNeedToVote = () => {
        return userId === transferOwner?.currentOwner &&
            user?._id !== transferOwner?.nominatedOwner?._id &&
            vote
            ? true
            : false;
    };

    if (!checkNeedToVote()) {
        return null;
    }

    const onResponse = async (accept) => {
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
            const res = await voteTransferOwnership({
                data: {
                    approve: accept,
                    requestTOId: transferOwner?._id,
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

    const onAccept = async () => {
        await onResponse(true);
    };

    const onReject = async () => {
        await onResponse(false);
    };

    const numberApproval = voters.filter((item) => {
        return item?.vote === 'approve';
    });

    return (
        <Box pr={4} pt={3} pb={1} w={SCREEN_WIDTH} bg={'appColors.bgYellow'} ml={-2}>
            {vote?.vote === 'pending' ? (
                <HStack alignItems={'center'} justifyContent={'space-between'}>
                    <Text fontSize={11} fontWeight={600} flex={1} pl={4} pr={'5px'}>
                        {t('transferOwnership.voteTransfer', {
                            name: name,
                            phoneNumber: transferOwner?.nominatedOwner?.phoneNumber,
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
                </HStack>
            ) : (
                <Text pl={'10px'} fontSize={11} fontWeight={600} flex={1} pr={'5px'}>
                    {t('transferOwnership.approvedVoteTransfer', {
                        name: name,
                        phoneNumber: transferOwner?.nominatedOwner?.phoneNumber,
                    })}
                </Text>
            )}
            <Text fontWeight={600} fontSize={10} textAlign={'right'} mt={2}>
                {t('transferOwnership.approvedOwners', {
                    number: numberApproval.length + 1,
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

export default VoteTransferOwnership;
