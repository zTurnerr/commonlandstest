import { Box, Center, Text } from 'native-base';

import { useNavigation } from '@react-navigation/core';
import React, { useState } from 'react';
import Modal from 'react-native-modal';
import Button from '../../components/Button';
import useTranslate from '../../i18n/useTranslate';
import Danger from '../Icons/Danger';

export const useModalQuitCreateContract = () => {
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
        return <ModalQuitCreateContract isOpen={isOpen} onClose={close} />;
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

export default function ModalQuitCreateContract({ isOpen, onClose }) {
    const navigation = useNavigation();
    const t = useTranslate();

    const onConfirm = async () => {
        navigation.goBack();
    };

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
                    <Danger />
                </Center>
                <Box mt="15px" w="full" alignItems="center">
                    <Text
                        color="black"
                        fontWeight="600"
                        fontSize="16px"
                        textAlign={'center'}
                        mb="15px"
                    >
                        {t('contract.cancelContractCreation')}
                    </Text>

                    <Text fontSize={'14px'} textAlign={'center'} mb="40px">
                        {t('contract.cancelContractCreationModal')}
                    </Text>
                    <Button
                        onPress={() => {
                            onClose();
                            onConfirm();
                        }}
                        bgColor="primary.600"
                    >
                        {t('contract.yesSure')}
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
