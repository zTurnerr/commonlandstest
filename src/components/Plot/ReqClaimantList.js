import { useRoute } from '@react-navigation/native';
import { Box, Button, ChevronDownIcon, ChevronUpIcon, HStack, Image, Text } from 'native-base';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { CLAIMANT_AVT_SIZE } from '../../constants/claimantItem';
import useUserInfo from '../../hooks/useUserInfo';
import useTranslate from '../../i18n/useTranslate';
import PlotRole from '../PlotRole';
import { useModalAcceptClaimantReq } from './ModalAcceptClaimantReq';
import { useModalDeclineClaimantReq } from './ModalDeclineClaimantReq';
import ReqClaimantAcceptedList from './ReqClaimantAcceptedList';

const ClaimantItem = ({ onAccept = () => {}, claimantReq = {}, onDecline = () => {} }) => {
    const [openAcceptStatus, setOpenAcceptStatus] = useState(false);
    const [loading] = useState(false);
    const user = useUserInfo();
    const approvedCount = claimantReq?.requests?.filter((item) => item?.isApproved).length;
    const reqUser = claimantReq?.requests?.find((item) => item?.phoneNumber === user?.phoneNumber);
    const t = useTranslate();

    const styles = StyleSheet.create({
        applyButton: {
            display: claimantReq?.isOwnerApproved ? 'flex' : 'none',
        },
    });

    return (
        <Box w="full" bg="white" mt="5px">
            <Box p="18px">
                <HStack mb="14px" alignItems={'center'}>
                    <Box w={CLAIMANT_AVT_SIZE} h={CLAIMANT_AVT_SIZE} bg="gray.200">
                        <Image
                            source={{ uri: claimantReq?.avatar }}
                            alt="image base"
                            resizeMode="cover"
                            w="full"
                            h="full"
                            borderRadius="100px"
                        />
                    </Box>
                    <Box ml="10px" flex={1}>
                        <Text fontWeight={600} fontSize={'14px'}>
                            {claimantReq?.fullName}
                        </Text>
                        <Text>{claimantReq?.phoneNumber}</Text>
                    </Box>
                    <PlotRole role={claimantReq?.requestRole} />
                </HStack>
                {/* <VStack space="12px">
                    <FlatList
                        data={[
                            {
                                icon: (
                                    <MaterialCommunityIcons
                                        name="clock-check-outline"
                                        size={16}
                                        color={theme.colors.warning[300]}
                                    />
                                ),
                                text: t('invite.pendingApproval'),
                            },
                            {
                                icon: (
                                    <MaterialCommunityIcons
                                        name="history"
                                        size={16}
                                        color={theme.colors.warning[300]}
                                    />
                                ),
                                text: t('invite.expireIn', { time: expireTime }),
                            },
                        ]}
                        renderItem={({ item, index }) => (
                            <IconChip {...item} key={index} colorScheme="warning" mr="5px" />
                        )}
                        horizontal
                    />

                    <HStack>
                        <Button size="sm" variant="outline" onPress={handleCancelInvite}>
                            {t('invite.cancelInvite')}
                        </Button>
                    </HStack>
                </VStack> */}
                {!reqUser?.isApproved && (
                    <HStack space={3} w="full">
                        <Button
                            onPress={() => {
                                onDecline(claimantReq);
                            }}
                            h="40px"
                            ml="40px"
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
                                onAccept(claimantReq);
                            }}
                            h="40px"
                            w="80px"
                            isDisabled={loading}
                        >
                            <Text color="white" fontWeight={600}>
                                {t('button.accept')}
                            </Text>
                        </Button>
                        <Box flex={1}></Box>
                    </HStack>
                )}
            </Box>
            <TouchableOpacity
                onPress={() => {
                    setOpenAcceptStatus(!openAcceptStatus);
                }}
                style={styles.applyButton}
            >
                <Box px="20px">
                    <HStack justifyContent={'space-between'} py="8px" alignItems={'center'}>
                        <Text fontWeight={600} fontSize={'14px'}>
                            {claimantReq.requests?.length > 1
                                ? t('plot.acceptedBy2', {
                                      number: approvedCount,
                                      total: claimantReq.requests?.length,
                                  })
                                : t('plot.acceptedBy3', {
                                      number: approvedCount,
                                      total: claimantReq.requests?.length,
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
                    {openAcceptStatus && <ReqClaimantAcceptedList req={claimantReq} />}
                </Box>
            </TouchableOpacity>
            {/* Divider */}
            <Box w="full" h="1px" bg="gray.400"></Box>
        </Box>
    );
};

const ReqClaimantList = () => {
    const modalAcceptHook = useModalAcceptClaimantReq();
    const modalDeclineHook = useModalDeclineClaimantReq();
    const route = useRoute();
    let claimantReqList = route.params?.claimantReq;
    return (
        <Box>
            {claimantReqList?.map?.((item, index) => (
                <ClaimantItem
                    key={index}
                    claimantReq={item}
                    onAccept={modalAcceptHook.open}
                    onDecline={modalDeclineHook.open}
                />
            ))}

            {modalAcceptHook.Component()}
            {modalDeclineHook.Component()}
        </Box>
    );
};

export default ReqClaimantList;
