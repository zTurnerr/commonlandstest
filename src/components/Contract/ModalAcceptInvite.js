import { Box, Center, Text } from 'native-base';
import React, { useState } from 'react';
import Modal from 'react-native-modal';
import Button from '../../components/Button';
import useTranslate from '../../i18n/useTranslate';
import Signature from '../Icons/Signature';

export const useModalAcceptInvite = () => {
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

    const Component = () => {
        return <ModalAcceptInvite isOpen={isOpen} onClose={close} />;
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

export default function ModalAcceptInvite({ isOpen, onClose }) {
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
                    <Signature color="#5EC4AC" width="40" height="40" />
                </Center>
                <Box mt="15px" w="full" alignItems="center">
                    <Text
                        color="black"
                        fontWeight="600"
                        fontSize="16px"
                        textAlign={'center'}
                        mb="15px"
                    >
                        {t('contract.addCertAndSign')}
                    </Text>

                    <Text fontSize={'14px'} textAlign={'center'} mb="40px">
                        {`${t('contract.lockCertWarning2')}`}
                    </Text>
                    <Button
                        onPress={() => {
                            onClose();
                        }}
                        bgColor="primary.600"
                    >
                        {`${t('button.accept')} and sign`}
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
