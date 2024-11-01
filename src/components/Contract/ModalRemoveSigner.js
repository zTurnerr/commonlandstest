import { Box, Button, Image, Text } from 'native-base';
import React, { useState } from 'react';
import { EventRegister } from 'react-native-event-listeners';
import Modal from 'react-native-modal';
import { EVENT_NAME } from '../../constants/eventName';
import useTranslate from '../../i18n/useTranslate';
import { revokeInvite } from '../../rest_client/apiClient';
import { showErr } from '../../util/showErr';
import Clock3 from '../Icons/Clock3';

export const useModalRemoveSigner = ({ contract }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [curSigner, setCurSigner] = useState({});
    const [loading, setLoading] = useState(false);
    const open = () => {
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
    };

    const onRemoveSigner = (inviteId) => {
        open();
        setCurSigner(inviteId);
    };

    const onConfirmRemoveSigner = async () => {
        setLoading(true);
        try {
            await revokeInvite(
                contract?._id,
                {
                    inviteIds: [curSigner._id],
                },
                null,
                null,
            );
            EventRegister.emit(EVENT_NAME.refreshContract);
        } catch (error) {
            showErr(error);
        }
        setLoading(false);
    };

    const Component = () => {
        return (
            <ModalRemoveSigner
                isOpen={isOpen}
                onClose={close}
                signer={curSigner.receiver}
                onConfirm={onConfirmRemoveSigner}
                loading={loading}
            />
        );
    };

    return {
        Component,
        open,
        close,
        selectedSigner: curSigner,
        setSelectedSigner: setCurSigner,
        onRemoveSigner,
    };
};

export default function ModalRemoveSigner({ isOpen, onClose, signer, onConfirm, loading }) {
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
                <Box mt="15px" w="full" alignItems="center">
                    <Text
                        color="black"
                        fontWeight="600"
                        fontSize="16px"
                        textAlign={'center'}
                        mb="30px"
                    >
                        {t('contract.removeSigner')}
                    </Text>
                    <Box w="60px" h="60px" bg="gray.300" borderRadius={'100px'}>
                        <Image
                            source={{ uri: signer?.avatar }}
                            alt="image base"
                            w="full"
                            h="full"
                            borderRadius={'100px'}
                        />
                        <Box
                            bg="white"
                            borderRadius={'100px'}
                            position={'absolute'}
                            bottom={'0px'}
                            right={'0px'}
                            borderWidth={'2px'}
                            borderColor={'white'}
                        >
                            <Clock3 color="#EAA300" width="16" height="16" />
                        </Box>
                    </Box>
                    <Text mt="15px" fontSize={'14px'} fontWeight={600}>
                        {signer?.fullName}
                    </Text>
                    <Text mb="40px">{signer?.phoneNumber}</Text>
                    <Button
                        onPress={async () => {
                            await onConfirm();
                            onClose();
                        }}
                        color="primary.600"
                        isLoading={loading}
                    >
                        {t('contract.remove')}
                    </Button>
                    <Button
                        onPress={() => {
                            onClose();
                        }}
                        mt="14px"
                        variant="outline"
                    >
                        {t('button.cancel')}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
