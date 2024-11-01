import { Box, Text } from 'native-base';
import React, { useState } from 'react';
import Modal from 'react-native-modal';
import Button from '../../../components/Button';
import FilledUnlock from '../../../components/Icons/FilledUnlock';
import useTranslate from '../../../i18n/useTranslate';

export const useModalRequestCmlUnlock = () => {
    const [isOpen, setIsOpen] = useState(false);

    const open = () => {
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
    };

    const Component = ({ onPress = () => {} }) => {
        return <ModalRequestCmlUnlock isOpen={isOpen} onClose={close} onPress={onPress} />;
    };

    return {
        Component,
        open,
        close,
    };
};

export default function ModalRequestCmlUnlock({ isOpen, onClose, onPress }) {
    const [loading] = useState(false);
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
                <FilledUnlock />
                <Box mt="15px" w="full" alignItems="center">
                    <Text mb="8px" color="black" fontWeight="bold" fontSize="18px">
                        {t('contract.requestCmlUnlock')}
                    </Text>
                    <Text fontSize={'14px'} fontWeight={400} textAlign={'center'} mb="32px">
                        {t('contract.modalRequestCml')}
                    </Text>
                    <Button
                        onPress={async () => {
                            onPress?.();
                            onClose();
                        }}
                        isLoading={loading}
                    >
                        {t('button.proceedToUnlock')}
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
