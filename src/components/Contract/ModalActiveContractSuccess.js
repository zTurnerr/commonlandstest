import { Box, Text } from 'native-base';
import React, { useEffect } from 'react';
import { EventRegister } from 'react-native-event-listeners';
import Modal from 'react-native-modal';
import { EVENT_NAME } from '../../constants/eventName';
import useTranslate from '../../i18n/useTranslate';
import Button from '../Button';
import Verify from '../Icons/Verify';

export const useModalActiveContractSuccess = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);

    useEffect(() => {
        const listener = EventRegister.addEventListener(EVENT_NAME.activeContractSuccess, () => {
            open();
        });
        return () => {
            EventRegister.removeEventListener(listener);
        };
    }, []);

    const Component = () => {
        return <ModalContractCreatorSignSuccess isOpen={isOpen} onClose={close} />;
    };

    return { isOpen, open, close, Component };
};

function ModalContractCreatorSignSuccess({ isOpen, onClose }) {
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
                <Verify />
                <Box w="full" alignItems="center">
                    <Text mb="8px" color="black" fontWeight="bold" fontSize="18px">
                        {t('contract.congrat')}
                    </Text>
                    <Text fontSize={'14px'} fontWeight={400} textAlign={'center'} mb="32px">
                        {t('contract.congratModal')}
                    </Text>
                    <Button
                        onPress={() => {
                            onClose();
                        }}
                    >
                        {t('button.done')}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
