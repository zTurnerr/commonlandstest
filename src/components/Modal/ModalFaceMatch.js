import { Box, Center, HStack, Text } from 'native-base';

import React, { useState } from 'react';
import Modal from 'react-native-modal';
import Button from '../../components/Button';
import useTranslate from '../../i18n/useTranslate';
import Danger from '../Icons/Danger';

export const useModalFaceMatch = () => {
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

    const Component = ({ onUpdateAccount, onProceed, loading }) => {
        return (
            <ModalFaceMatch
                isOpen={isOpen}
                onClose={close}
                onUpdateAccount={onUpdateAccount}
                onProceed={onProceed}
                loading={loading}
            />
        );
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

const Bullet = () => {
    return (
        <Box p="6px" pt="9px">
            <Box w="4px" h="4px" borderRadius="100px" bgColor="black" />
        </Box>
    );
};

export default function ModalFaceMatch({
    isOpen,
    onClose,
    onUpdateAccount = () => {},
    onProceed = () => {},
    loading,
}) {
    const t = useTranslate();

    return (
        <Modal isVisible={isOpen} safeAreaTop={true}>
            <Box p="20px" borderRadius="8px" bgColor="white">
                <Center width={'48px'} height={'48px'} bg="danger.light" borderRadius={'12px'}>
                    <Danger width="32" height="32" />
                </Center>
                <Box mt="20px" w="full">
                    <Text color="black" fontWeight="700" fontSize="16px" mb="15px">
                        {t('faceDetect.conflictingAccount')}
                    </Text>

                    <Text fontSize={'14px'}>{t('faceDetect.conflictAccount1')}</Text>
                    <HStack>
                        <Bullet />
                        <Text flex={1} fontSize={'14px'}>
                            {t('faceDetect.conflictAccount2')}
                        </Text>
                    </HStack>
                    <HStack>
                        <Bullet />
                        <Text flex={1} fontSize={'14px'} mb="15px">
                            {t('faceDetect.conflictAccount3')}
                        </Text>
                    </HStack>
                    <Text fontWeight={700}>{t('faceDetect.pleaseNote') + ':'}</Text>
                    <HStack>
                        <Bullet />
                        <Text flex={1} fontSize={'14px'}>
                            {t('faceDetect.conflictAccount4')}
                        </Text>
                    </HStack>
                    <HStack mb="20px">
                        <Bullet />
                        <Text flex={1} fontSize={'14px'}>
                            {t('faceDetect.conflictAccount5')}
                        </Text>
                    </HStack>
                    <Button
                        onPress={() => {
                            onClose();
                            onProceed();
                        }}
                        bgColor="primary.600"
                        _pressed={{ bgColor: 'primary.200' }}
                        isLoading={loading}
                    >
                        {t('button.proceed')}
                    </Button>
                    <Button
                        onPress={() => {
                            onClose();
                            onUpdateAccount();
                        }}
                        mt="14px"
                        variant="outline"
                        isDisabled={loading}
                    >
                        {t('button.updateAccount')}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
