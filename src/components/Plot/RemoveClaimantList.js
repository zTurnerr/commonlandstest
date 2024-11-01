/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { Box, Text, HStack, Button, ChevronDownIcon, ChevronUpIcon, Image } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import PlotRole from '../PlotRole';
import useUserInfo from '../../hooks/useUserInfo';
import useTranslate from '../../i18n/useTranslate';
import PendingRemoveTag from '../Tag/RemoveTag/PendingRemoveTag';
import ExpireTag from '../Tag/ExpireTag/ExpireTag';
import { CLAIMANT_AVT_SIZE, CLAIMANT_ITEM_PX } from '../../constants/claimantItem';
import { useModalApproveRemoveClaimant } from './ModalApproveRemoveClaimant';
import useRemoveClaimantReq from '../../hooks/Plot/useRemoveClaimantReq';
import { useModalDeclineRmClaimantReq } from './ModalDeclineRmClaimantReq';
import RemoveClaimantVoteList from './RemoveClaimantVoteList';

const ClaimantItem = ({ onAccept = () => {}, removeClaimantReq = {}, onDecline = () => {} }) => {
    const { params } = useRoute();
    const [openAcceptStatus, setOpenAcceptStatus] = useState(false);
    const [loading] = useState(false);
    const user = useUserInfo();
    const approvedCount = removeClaimantReq?.voters?.filter((item) => item?.isApproved).length;
    const onlyOneVoter =
        removeClaimantReq?.voters?.length === 1 && removeClaimantReq?.voters?.[0]?.isApproved;

    // const reqUser = removeClaimantReq?.find((item) => item?.phoneNumber === user?.phoneNumber);
    const t = useTranslate();

    const getClaimantById = (id) => {
        return params?.plotClaimants?.find((item) => item?._id === id);
    };

    const canVote = () => {
        const tmpVoter = removeClaimantReq?.voters?.find((item) => item?.voter === user?._id);
        if (!tmpVoter) {
            return false;
        }
        if (tmpVoter.isVoted) {
            return false;
        }
        return true;
    };

    const removedUser = getClaimantById(removeClaimantReq?.claimant);

    const AvtCol = (
        <Box w={CLAIMANT_AVT_SIZE} h={CLAIMANT_AVT_SIZE}>
            <Image
                source={{ uri: removedUser?.avatar }}
                alt="image base"
                resizeMode="cover"
                w="full"
                h="full"
                borderRadius="100px"
            />
        </Box>
    );

    const UserInfoCol = (
        <Box flex={1}>
            <Text fontWeight={600} fontSize={'14px'}>
                {removedUser?.fullName}
            </Text>
            <Text>{removedUser?.phoneNumber}</Text>
        </Box>
    );

    const StatusSection = (
        <HStack mt="10px" space={1} flexWrap={'wrap'}>
            <PendingRemoveTag />
            <ExpireTag time={removeClaimantReq?.expiredAt} />
        </HStack>
    );

    const GroupBtn = (
        <HStack my="20px" space={3} w="full">
            <Button
                onPress={() => {
                    onDecline({
                        claimant: getClaimantById(removeClaimantReq?.claimant),
                        ...removeClaimantReq,
                    });
                }}
                h="40px"
                w="80px"
                py="0px"
                variant={'outline'}
                isLoading={loading}
                isDisabled={loading}
                borderColor="danger.300"
            >
                <Text color="danger.300" fontWeight={600}>
                    {t('button.decline')}
                </Text>
            </Button>
            <Button
                onPress={() => {
                    onAccept({
                        req: {
                            ...removeClaimantReq,
                            claimant: getClaimantById(removeClaimantReq?.claimant),
                        },
                    });
                }}
                h="40px"
                w="80px"
                isDisabled={loading}
            >
                <Text color="white" fontWeight={600}>
                    {t('button.approve')}
                </Text>
            </Button>
            <Box flex={1}></Box>
        </HStack>
    );

    return (
        <Box w="full" bg="white" mt="5px" py={CLAIMANT_ITEM_PX}>
            <Box px={CLAIMANT_ITEM_PX}>
                <HStack mb="14px">
                    {AvtCol}
                    <Box ml="10px" flex={1}>
                        <HStack flex={1}>
                            {UserInfoCol}
                            <PlotRole role={removedUser?.role} />
                        </HStack>
                        {StatusSection}
                        {canVote() && GroupBtn}
                    </Box>
                </HStack>
            </Box>
            {!onlyOneVoter && <Box w="full" h="1px" bg="gray.400"></Box>}

            <TouchableOpacity
                onPress={() => {
                    setOpenAcceptStatus(!openAcceptStatus);
                }}
                style={{
                    display: !onlyOneVoter ? 'flex' : 'none',
                }}
            >
                <Box px={CLAIMANT_ITEM_PX}>
                    <HStack justifyContent={'space-between'} py="8px" alignItems={'center'}>
                        <Text fontWeight={600} fontSize={'14px'}>
                            {t('transferOwnership.approvedOwners', {
                                number: approvedCount,
                                total: removeClaimantReq?.voters?.length,
                            })}
                        </Text>
                        <Box
                            bg="white"
                            borderRadius={'100px'}
                            borderWidth={'1px'}
                            p="5px"
                            borderColor={'black'}
                        >
                            {openAcceptStatus ? (
                                <ChevronUpIcon size="10px" />
                            ) : (
                                <ChevronDownIcon size="10px" />
                            )}
                        </Box>
                    </HStack>
                    {openAcceptStatus && (
                        <RemoveClaimantVoteList
                            getClaimantById={getClaimantById}
                            req={removeClaimantReq}
                        />
                    )}
                </Box>
            </TouchableOpacity>
            {/* Divider */}
        </Box>
    );
};

const RemoveClaimantList = () => {
    const modalAcceptHook = useModalApproveRemoveClaimant();
    const modalDeclineHook = useModalDeclineRmClaimantReq();
    const { params } = useRoute();
    const removeClaimantHook = useRemoveClaimantReq(params?.plotID);

    if (removeClaimantHook.removeClaimantReqs.length === 0) {
        return null;
    }
    return (
        <Box>
            {/* {claimantReqList?.map?.((item, index) => (
                <ClaimantItem
                    key={index}
                    claimantReq={item}
                    onAccept={() => {
                        modalAcceptHook.open({
                            claimant: item,
                        });
                    }}
                    onDecline={modalDeclineHook.open}
                />
            ))} */}
            {removeClaimantHook.removeClaimantReqs?.map?.((item, index) => (
                <ClaimantItem
                    key={index}
                    onAccept={(data) => {
                        modalAcceptHook.open(data);
                    }}
                    onDecline={modalDeclineHook.open}
                    removeClaimantReq={item}
                />
            ))}

            {modalAcceptHook.Component()}
            {modalDeclineHook.Component()}
        </Box>
    );
};

export default RemoveClaimantList;
