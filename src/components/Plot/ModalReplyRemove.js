/* eslint-disable react-native/no-inline-styles */
import { Box, Button, CloseIcon, HStack, Text } from 'native-base';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import useTranslate from '../../i18n/useTranslate';

import { useRoute } from '@react-navigation/native';
import { EventRegister } from 'react-native-event-listeners';
import { EVENT_NAME } from '../../constants/eventName';
import { voteRemoveClaimantSelf } from '../../rest_client/apiClient';
import { showErr } from '../../util/showErr';
import ExpireTag from '../Tag/ExpireTag/ExpireTag';

export const useModalReplyRemove = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [selectedSigner, setSelectedSigner] = useState({});

    const open = (signer) => {
        setIsOpen(true);
        setSelectedSigner(signer);
    };

    const close = () => {
        setIsOpen(false);
    };

    const Component = ({
        isCancel,
        signingContract,
        onSubmit,
        contract,
        onApprove,
        onDecline,
        expiresTime,
    }) => {
        return (
            <ModalReplyRemove
                isVisible={isOpen}
                onClose={close}
                onSubmit={onSubmit}
                isCancel={isCancel}
                signingContract={signingContract}
                signer={selectedSigner}
                contract={contract}
                onApprove={onApprove}
                onDecline={onDecline}
                expiresTime={expiresTime}
            />
        );
    };

    return {
        open,
        close,
        Component,
    };
};

let lock = false;

const ModalReplyRemove = ({ isVisible, onClose }) => {
    const t = useTranslate();
    const { params } = useRoute();
    const [approveLoading, setApproveLoading] = useState(false);
    const [declineLoading, setDeclineLoading] = useState(false);
    const handelCloseModal = () => {
        onClose?.();
    };

    const approve = async () => {
        if (lock) return;
        lock = true;

        setApproveLoading(true);
        try {
            await voteRemoveClaimantSelf(params?.removingClaimants[0]?._id, {
                approve: true,
            });
            EventRegister.emit(EVENT_NAME.refetchPlotData);
            EventRegister.emit(EVENT_NAME.refetchRemoveClaimantReq);
            onClose();
        } catch (error) {
            if (JSON.stringify(error).includes('User is not a claimant of the plot')) {
                return;
            }
            showErr(error);
        }
        setApproveLoading(false);
        lock = false;
    };

    const decline = async () => {
        if (lock) return;
        lock = true;
        setDeclineLoading(true);
        try {
            console.log('decline');
            await voteRemoveClaimantSelf(params?.removingClaimants[0]?._id, {
                approve: false,
            });
            EventRegister.emit(EVENT_NAME.refetchPlotData);
            EventRegister.emit(EVENT_NAME.refetchRemoveClaimantReq);
            onClose();
        } catch (error) {
            if (JSON.stringify(error).includes('User is not a claimant of the plot')) {
                return;
            }
            showErr(error);
        }
        setDeclineLoading(false);
        lock = false;
    };

    return (
        <Modal style={styles.modal} isVisible={isVisible} onBackdropPress={handelCloseModal}>
            <Box
                px="20px"
                py="15px"
                mt="auto"
                pt={'50px'}
                backgroundColor={'white'}
                borderRadius={16}
                shadow={1}
            >
                <Box position={'absolute'} top="15px" right={'15px'}>
                    <TouchableOpacity onPress={onClose} style={{ padding: 5 }}>
                        <CloseIcon size="md" />
                    </TouchableOpacity>
                </Box>
                <Text fontSize={'16px'} mb="20px" textAlign={'center'} fontWeight={500}>
                    {t('plot.leavePlotMsg')}
                </Text>

                <Text fontSize={'14px'} mb="20px" textAlign={'center'} fontWeight={400}>
                    {t('plot.leavePlotMsg2')}
                </Text>
                <HStack justifyContent={'center'} w="full">
                    <ExpireTag time={params?.removingClaimants[0]?.expiredAt} />
                </HStack>
                <HStack mt="25px" mb="10px" w={'full'} alignItems="flex-end">
                    <Button
                        onPress={() => {
                            if (approveLoading || declineLoading) return;
                            decline();
                        }}
                        flex={1}
                        variant={'outline'}
                        isDisabled={approveLoading || declineLoading}
                        isLoading={declineLoading}
                    >
                        {t('button.decline')}
                    </Button>
                    <Button
                        onPress={() => {
                            if (approveLoading || declineLoading) return;
                            approve();
                        }}
                        flex={1}
                        ml="20px"
                        isLoading={approveLoading}
                        isDisabled={approveLoading || declineLoading}
                    >
                        {t('button.agree')}
                    </Button>
                </HStack>
            </Box>
        </Modal>
    );
};

export default ModalReplyRemove;

const styles = StyleSheet.create({
    // btnTypeContract: {
    //     height: 40,
    //     borderRadius: 32,
    //     width: '96%',
    //     justifyContent: 'center',
    //     paddingLeft: 16,
    // },
    // btnStatusContract: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     marginBottom: 15,
    // },
    // icCloseModal: {
    //     position: 'absolute',
    //     right: 0,
    //     top: -20,
    // },
    modal: {
        margin: 22,
    },
});
