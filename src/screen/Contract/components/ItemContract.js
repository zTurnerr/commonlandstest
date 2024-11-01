import { Button, HStack, Skeleton, Spinner, Text, VStack } from 'native-base';
import React, { memo } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import DefaultPendingTag from '../../../components/Contract/DefaultPendingTag';
import PendingTransferTag from '../../../components/Contract/PendingTransferTag';
import ReqUnlockPendingTag from '../../../components/Contract/ReqUnlockPendingTag';
import ContractInfo from '../../../components/ContractInfo';
import StatusContractComponent from '../../../components/StatusContractComponent';
import useTranslate from '../../../i18n/useTranslate';
import { contractIsDefaulted } from '../../../util/contract/isDefaulted';
import { extractContractStatus } from '../../../util/contract/showContractStatusTag';
import Star from '../../../components/Icons/Star';
import useUserInfo from '../../../hooks/useUserInfo';
import WaitingActiveTag from '../../../components/Contract/WaitingActiveTag';

const ItemContract = ({ item, onPress }) => {
    const user = useUserInfo();
    const { status } = item || {};
    const isPendingUnlock = () => {
        return item?.requestToUnlock?.isPending;
    };
    const signerIds = item?.signers?.map((e) => e?.user?._id);

    const getRatingBlockTxt = () => {
        if (user?._id === item?.creator?.user?._id) {
            // user is creator
            if (item?.rating?.signerRating?.length > 1) {
                return t('contract.satisfiedSigners');
            } else {
                return t('contract.satisfiedSigner');
            }
        } else {
            return t('contract.satisfiedCreator');
        }
    };

    const isShowRatingBlock = () => {
        if (user?._id === item?.creator?.user?._id) {
            // user is creator

            let allSignerRated = true;
            item?.rating?.signerRating?.forEach((ratingItem) => {
                if (!signerIds?.includes(ratingItem?.signer)) {
                    return;
                }
                if (ratingItem?.isRated === false) {
                    allSignerRated = false;
                }
            });
            return !allSignerRated;
        } else {
            return !item?.rating?.creatorRating?.find(
                (ratingItem) => ratingItem?.signerRating === user?._id,
            )?.isRated;
        }
    };

    const t = useTranslate();

    const RatingBlock = (
        <HStack
            alignItems={'center'}
            mt="10px"
            p="5px"
            bg="primary.200"
            w="100%"
            borderRadius={'8px'}
            justifyContent={'space-between'}
        >
            <Text flex={1} fontSize={'11px'} fontWeight={500}>
                {getRatingBlockTxt()}
            </Text>
            <Button onPress={onPress} display={'flex'} w="102px" h="36px">
                <HStack alignItems={'center'}>
                    <Star />
                    <Text ml="7px" fontWeight={600} color="white" fontSize={'11px'}>
                        {t('contract.rateNow')}
                    </Text>
                </HStack>
            </Button>
        </HStack>
    );
    const relatedUserIds = item?.signers?.map((e) => e?.user?._id);
    relatedUserIds?.push?.(item?.creator?.user?._id);

    if (item?.status !== 'created' && !relatedUserIds?.includes(user?._id)) {
        return null;
    }

    return (
        <TouchableOpacity
            onPress={item?.status == 'pending' ? () => null : onPress}
            style={styles.container}
        >
            <StatusContractComponent
                status={status}
                item={item}
                showCopyDid={item?.status != 'pending'}
            />
            {item?.status == 'pending' ? (
                <VStack py="20px" space={3}>
                    <HStack>
                        <Spinner size="sm" />
                        <Text ml="2">{t('contract.waitingForCreate')}</Text>
                    </HStack>
                    <Skeleton height="60px" width="100%" borderRadius={10} />
                    <Skeleton height="20px" width="100%" borderRadius={10} />
                    <Skeleton height="20px" width="50%" borderRadius={10} />
                </VStack>
            ) : (
                <>
                    <ContractInfo item={item} title={`${t('components.contract')} ${item?.name}`} />
                    {isPendingUnlock() && !contractIsDefaulted(item) && <ReqUnlockPendingTag />}
                    {extractContractStatus(item) === 'markedDefaulted' && <DefaultPendingTag />}
                    {item?.pendingTransfer && (
                        <HStack>
                            <PendingTransferTag contract={item} />
                        </HStack>
                    )}
                    {item?.isActivating && (
                        <HStack>
                            <WaitingActiveTag />
                        </HStack>
                    )}

                    {status === 'completed' && isShowRatingBlock() && RatingBlock}
                </>
            )}
        </TouchableOpacity>
    );
};

export default memo(ItemContract);

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        paddingTop: 10,
        paddingBottom: 20,
        paddingHorizontal: 16,
        marginHorizontal: 16,
        borderRadius: 12,
    },
});
