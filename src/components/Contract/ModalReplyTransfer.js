/* eslint-disable react-native/no-inline-styles */
import useTranslate from '../../i18n/useTranslate';
import { Box, Center, CloseIcon, HStack, Image, Text, Button } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

import ExpireTag from '../Tag/ExpireTag';
import { replyTransferReq } from '../../rest_client/apiClient';
import { EventRegister } from 'react-native-event-listeners';
import { EVENT_NAME } from '../../constants/eventName';
import { showErr } from '../../util/showErr';
import useUserInfo from '../../hooks/useUserInfo';

export const useModalReplyTransfer = ({ transferReqHook }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSigner, setSelectedSigner] = useState({});
    const user = useUserInfo();

    const open = (signer) => {
        setIsOpen(true);
        setSelectedSigner(signer);
    };

    const close = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        if (
            transferReqHook.isExistPending() &&
            transferReqHook.transferReqs[0]?.newCreator === user?._id
        ) {
            open();
        }
    }, [transferReqHook.transferReqs]);

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
            <ModalReplyTransfer
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

const ModalReplyTransfer = ({
    isVisible,
    onClose,
    contract = {},
    onApprove = () => {},
    onDecline = () => {},
    expiresTime,
}) => {
    const t = useTranslate();
    const [loading, setLoading] = useState(false);
    const handelCloseModal = () => {
        onClose?.();
    };

    const approveWithoutPof = async () => {
        setLoading(true);
        try {
            await replyTransferReq(contract?._id, {
                accept: true,
            });
            EventRegister.emit(EVENT_NAME.refreshContract);
            onClose();
        } catch (error) {
            showErr(error);
        }
        setLoading(false);
    };

    if (contract?.status === 'completed') {
        return null;
    }

    return (
        <Modal style={styles.modal} isVisible={isVisible} onBackdropPress={handelCloseModal}>
            <Box
                px="20px"
                py="15px"
                mt="auto"
                pt={'10px'}
                backgroundColor={'white'}
                borderRadius={16}
                shadow={1}
            >
                <Box position={'absolute'} top="15px" right={'15px'}>
                    <TouchableOpacity onPress={onClose} style={{ padding: 5 }}>
                        <CloseIcon size="md" />
                    </TouchableOpacity>
                </Box>
                <Center mt="20px" mb="25px">
                    <Box w="60px" h="60px" bg="gray.300" borderRadius={'100px'}>
                        <Image
                            source={{ uri: contract?.creator?.user?.avatar }}
                            w="full"
                            h="full"
                            borderRadius={'100px'}
                            alt="image"
                        />
                    </Box>
                    <Text mt="15px" fontSize={'14px'} fontWeight={600}>
                        {contract?.creator?.user?.fullName}
                    </Text>
                    <Text>{contract?.creator?.user?.phoneNumber}</Text>
                </Center>
                <Text fontSize={'14px'} mb="30px" textAlign={'center'} fontWeight={500}>
                    {`${t('contract.modalReplyTransferTitle', {
                        contractName: contract?.name,
                        name: contract?.creator?.user?.fullName,
                    })}`}
                </Text>
                <HStack justifyContent={'center'} w="full">
                    <ExpireTag time={expiresTime} />
                </HStack>
                <HStack mt="25px" mb="10px" w={'full'} alignItems="flex-end">
                    <Button
                        onPress={() => {
                            onClose();
                            onDecline();
                        }}
                        flex={1}
                        variant={'outline'}
                        isDisabled={loading}
                    >
                        {t('button.decline')}
                    </Button>
                    <Button
                        onPress={() => {
                            if (contract?.status === 'created') {
                                approveWithoutPof();
                                return;
                            }
                            onApprove();
                        }}
                        isLoading={loading}
                        isDisabled={loading}
                        flex={1}
                        ml="20px"
                    >
                        {t('button.approve')}
                    </Button>
                </HStack>
            </Box>
        </Modal>
    );
};

export default ModalReplyTransfer;

const styles = StyleSheet.create({
    modal: {
        margin: 22,
    },
});
