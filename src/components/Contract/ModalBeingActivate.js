import { Box, Center, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { EventRegister } from 'react-native-event-listeners';
import Modal from 'react-native-modal';
import Button from '../../components/Button';
import { EVENT_NAME } from '../../constants/eventName';
import useTranslate from '../../i18n/useTranslate';
import BellRing from '../Icons/BellRing';

export const useModalBeingActivate = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSigner, setSelectedSigner] = useState({});

    const open = () => {
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
    };

    const onRemoveSigner = () => {
        open();
    };

    useEffect(() => {
        let listener = EventRegister.addEventListener(EVENT_NAME.beingActiveContract, () => {
            open();
        });
        return () => {
            EventRegister.removeEventListener(listener);
        };
    }, []);

    const Component = () => {
        return <ModalBeingActivate isOpen={isOpen} onClose={close} />;
    };

    return {
        Component,
        open,
        close,
        selectedSigner,
        setSelectedSigner,
        onRemoveSigner,
    };
};

export default function ModalBeingActivate({ isOpen, onClose }) {
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
                <Center>
                    <BellRing />
                </Center>
                <Box mt="15px" w="full" alignItems="center">
                    <Text
                        color="black"
                        fontWeight="600"
                        fontSize="16px"
                        textAlign={'center'}
                        mb="15px"
                    >
                        {t('contract.contractActived')}
                    </Text>

                    <Text fontSize={'14px'} textAlign={'center'} mb="40px">
                        {t('contract.waitActive')}
                    </Text>
                    <Button
                        onPress={() => {
                            onClose();
                        }}
                        bgColor="primary.600"
                    >
                        {t('button.okay')}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
