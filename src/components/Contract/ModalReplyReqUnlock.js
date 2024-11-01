import { Box, CloseIcon, HStack, Image, Spinner, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import Modal from 'react-native-modal';
import { EVENT_NAME } from '../../constants/eventName';
import useUserInfo from '../../hooks/useUserInfo';
import useTranslate from '../../i18n/useTranslate';
import { contractCreatorResponseUnlock } from '../../rest_client/apiClient';
import { contractIsDefaulted } from '../../util/contract/isDefaulted';
import { showErr } from '../../util/showErr';
import Button from '../Button';

export const useModalReplyReqUnlock = () => {
    const [isOpen, setIsOpen] = useState(false);

    const open = () => {
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
    };

    const Component = ({ onPress = () => {}, contract }) => {
        return (
            <ModalRelyReqUnlock
                isOpen={isOpen}
                onClose={close}
                onPress={onPress}
                contract={contract}
                open={open}
            />
        );
    };

    return {
        Component,
        open,
        close,
    };
};

export default function ModalRelyReqUnlock({ isOpen, onClose, contract = {}, open = () => {} }) {
    const [loading, setLoading] = useState(false);
    const user = useUserInfo();

    const onAccept = async () => {
        setLoading(true);
        try {
            await contractCreatorResponseUnlock({
                id: contract?.requestToUnlock?.history[0]?._id,
                status: 'APPROVED',
            });
            EventRegister.emit(EVENT_NAME.refreshContract);
            onClose();
            setLoading(false);
        } catch (error) {
            showErr(error);
        }
        setLoading(false);
    };

    const onReject = async () => {
        setLoading(true);
        try {
            await contractCreatorResponseUnlock({
                id: contract?.requestToUnlock?.history[0]?._id,
                status: 'REJECTED',
            });
            EventRegister.emit(EVENT_NAME.refreshContract);
            onClose();
            setLoading(false);
        } catch (error) {
            showErr(error);
        }
        setLoading(false);
        onClose();
    };
    const getReqSigner = () => {
        const signerId = contract?.requestToUnlock?.history[0]?.signerId;
        const signer = contract?.signers?.find((item) => item?.user?._id === signerId);
        return signer;
    };

    useEffect(() => {
        if (
            contract?.requestToUnlock?.isPending &&
            user?._id === contract?.creator?.user?._id &&
            !contractIsDefaulted(contract)
        ) {
            open();
        }
    }, []);

    const t = useTranslate();
    return (
        <Modal isVisible={isOpen} safeAreaTop={true}>
            <Box
                justifyContent="center"
                alignItems="center"
                p="20px"
                borderRadius="8px"
                bgColor="white"
                mt="auto"
            >
                <Box position={'absolute'} top="15px" right={'15px'}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <CloseIcon />
                    </TouchableOpacity>
                </Box>
                <Image
                    source={{ uri: getReqSigner()?.user?.avatar }}
                    alt="avatar"
                    w="72px"
                    h="72px"
                    borderRadius="100px"
                    resizeMode="cover"
                />
                <Box mt="15px" w="full" alignItems="center">
                    <Text fontSize={'16px'} fontWeight={600}>
                        {getReqSigner()?.user?.fullName}
                    </Text>
                    <Text color="gray.700">{getReqSigner()?.user?.phoneNumber}</Text>
                    <Text mt="15px" mb="20px" textAlign={'center'}>
                        {t('contract.unlockContractModal')}
                    </Text>

                    {!loading ? (
                        <HStack space={4}>
                            <Button
                                variant="outline"
                                _container={{
                                    flex: 1,
                                }}
                                onPress={() => {
                                    // console.log('reject');
                                    onReject();
                                }}
                            >
                                {t('button.reject')}
                            </Button>
                            <Button
                                color="custom"
                                _container={{
                                    bg: 'primary.600',
                                    flex: 1,
                                }}
                                textColor="white"
                                onPress={onAccept}
                            >
                                {t('button.unlock')}
                            </Button>
                        </HStack>
                    ) : (
                        <Spinner color="primary.600" />
                    )}
                </Box>
            </Box>
        </Modal>
    );
}

const styles = StyleSheet.create({
    closeButton: {
        padding: 5,
    },
});
