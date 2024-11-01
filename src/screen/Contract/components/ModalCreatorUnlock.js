import { Box, Spinner, Text } from 'native-base';
import React, { useState } from 'react';
import { EventRegister } from 'react-native-event-listeners';
import Modal from 'react-native-modal';
import Button from '../../../components/Button';
import Unlock from '../../../components/Icons/Unlock';
import { EVENT_NAME } from '../../../constants/eventName';
import useTranslate from '../../../i18n/useTranslate';
import { unlockContract } from '../../../rest_client/apiClient';
import { showErr } from '../../../util/showErr';

export const useModalCreatorUnlock = () => {
    const [isOpen, setIsOpen] = useState(false);

    const open = () => {
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
    };

    const Component = ({ onPress = () => {}, contract }) => {
        return (
            <ModalCreatorUnlock
                isOpen={isOpen}
                onClose={close}
                onPress={onPress}
                contract={contract}
            />
        );
    };

    return {
        Component,
        open,
        close,
    };
};

export default function ModalCreatorUnlock({ isOpen, onClose, contract = {} }) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await unlockContract(contract._id);
            EventRegister.emit(EVENT_NAME.refreshContract);
            onClose();
        } catch (error) {
            if (error.includes('mint')) {
                EventRegister.emit(EVENT_NAME.beingActiveContract);
                return;
            }
            showErr(error);
        }
    };

    const t = useTranslate();
    return (
        <Modal isVisible={isOpen} safeAreaTop={true}>
            <Box
                justifyContent="center"
                alignItems="center"
                p="20px"
                borderRadius="8px"
                bgColor="white"
            >
                <Unlock color="#5EC4AC" width="40" height="40" />
                <Box mt="15px" w="full" alignItems="center">
                    <Text
                        mb="8px"
                        color="black"
                        fontWeight="bold"
                        textAlign={'center'}
                        fontSize="18px"
                    >
                        {t('contract.closeContract2')}
                    </Text>
                    <Text fontSize={'14px'} fontWeight={400} textAlign={'center'} mb="32px">
                        {t('contract.unlockWarning')}
                    </Text>
                    {loading ? (
                        <Spinner />
                    ) : (
                        <>
                            <Button
                                onPress={async () => {
                                    await handleSubmit();
                                    onClose();
                                    setLoading(false);
                                }}
                                color="custom"
                                _container={{
                                    bg: 'primary.600',
                                }}
                                textColor="white"
                            >
                                {t('button.releaseCert')}
                            </Button>
                            <Button
                                onPress={async () => {
                                    onClose();
                                    setLoading(false);
                                }}
                                mt="14px"
                                variant="outline"
                            >
                                {t('button.cancel')}
                            </Button>
                        </>
                    )}
                </Box>
            </Box>
        </Modal>
    );
}
