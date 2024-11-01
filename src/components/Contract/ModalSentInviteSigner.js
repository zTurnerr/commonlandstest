import { Box, Center, CloseIcon, HStack, Image, Text, useTheme } from 'native-base';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import Modal from 'react-native-modal';
import { EVENT_NAME } from '../../constants/eventName';
import useTranslate from '../../i18n/useTranslate';
import { inviteContractSigners } from '../../rest_client/apiClient';
import { showErr } from '../../util/showErr';
import Button from '../Button';
import Clock3 from '../Icons/Clock3';
import Send from '../Icons/Send';

export const useModalSentInviteSigner = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSigner, setSelectedSigner] = useState({});

    const open = (signer) => {
        setIsOpen(true);
        setSelectedSigner(signer);
    };

    const close = () => {
        setIsOpen(false);
    };

    const Component = ({ isCancel, signingContract, onSubmit, contract }) => {
        return (
            <ModalSendInviteSigner
                isVisible={isOpen}
                onClose={close}
                onSubmit={onSubmit}
                isCancel={isCancel}
                signingContract={signingContract}
                signer={selectedSigner}
                contract={contract}
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

const ModalSendInviteSigner = ({ isVisible, onClose, signer = {}, contract = {} }) => {
    const t = useTranslate();
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const handelCloseModal = () => {
        onClose?.();
    };

    const onSendInvite = async () => {
        if (lock) {
            return;
        }
        lock = true;
        setLoading(true);
        try {
            await inviteContractSigners(contract._id, {
                inviteePhoneNumbers: [signer?.receiver?.phoneNumber],
            });
            EventRegister.emit(EVENT_NAME.refreshContract);
            onClose?.();
        } catch (error) {
            showErr(error);
        }
        setLoading(false);
        setTimeout(() => {
            lock = false;
        }, 3000);
    };

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
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <CloseIcon size="md" />
                    </TouchableOpacity>
                </Box>
                <Text mb="50px" fontSize={'16px'} fontWeight={600}>
                    {t('contract.sendInviteToSigner')}
                </Text>
                <Center mb="25px">
                    <Box w="60px" h="60px" bg="gray.300" borderRadius={'100px'}>
                        <Image
                            source={{ uri: signer?.receiver?.avatar }}
                            w="full"
                            h="full"
                            borderRadius={'100px'}
                            alt="image"
                        />
                        <Box
                            bg="white"
                            borderRadius={'100px'}
                            position={'absolute'}
                            bottom={'0px'}
                            right={'0px'}
                            borderWidth={2}
                            borderColor={'white'}
                        >
                            <Clock3 color="#EAA300" width="16" height="16" />
                        </Box>
                    </Box>
                    <Text mt="15px" fontSize={'14px'} fontWeight={600}>
                        {signer?.receiver?.fullName}
                    </Text>
                    <Text>{signer?.receiver?.phoneNumber}</Text>
                </Center>
                <Text mb="30px" px="20px" textAlign={'center'} fontWeight={500}>
                    {`${t('contract.sendInviteToSignerModal')}`}
                </Text>

                <Button
                    _container={{
                        alignSelf: 'center',
                        mb: '24px',
                        bg: 'primary.600',
                    }}
                    textColor={theme.colors.white}
                    color="custom"
                    onPress={() => {
                        onSendInvite();
                    }}
                    isLoading={loading}
                >
                    <HStack alignItems={'center'} space={2}>
                        <Send color="white" width={24} height={24} />
                        <Text color="white" fontSize={'14px'} fontWeight={700}>
                            {t('invite.sendInvite2')}
                        </Text>
                    </HStack>
                </Button>
            </Box>
        </Modal>
    );
};

export default ModalSendInviteSigner;

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
    closeButton: {
        padding: 5,
    },
});
