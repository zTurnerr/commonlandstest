import { Box, Text, useTheme } from 'native-base';
import React, { useState } from 'react';
import Modal from 'react-native-modal';
import Button from '../../../components/Button';
import ShieldTick from '../../../components/Icons/ShieldTick';
import useTranslate from '../../../i18n/useTranslate';

export const useModalTxPermissionRequest = () => {
    const [isOpen, setIsOpen] = useState(true);

    const open = () => {
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
    };

    const Component = () => {
        return <ModalTxPermissionRequest isOpen={isOpen} onClose={close} />;
    };

    return {
        Component,
        open,
        close,
    };
};

export default function ModalTxPermissionRequest({ isOpen, onClose }) {
    const t = useTranslate();
    const theme = useTheme();
    return (
        <Modal isVisible={isOpen} safeAreaTop={true}>
            <Box
                justifyContent="center"
                alignItems="center"
                p="20px"
                borderRadius="8px"
                bgColor="white"
            >
                <ShieldTick width="40" height="40" color={theme.colors.primary[600]} />
                <Box mt="15px" w="full" alignItems="center">
                    <Text mb="8px" color="black" fontWeight="bold" fontSize="18px">
                        {t('contract.permissionReq')}
                    </Text>
                    <Text fontSize={'14px'} fontWeight={400} textAlign={'center'} mb="32px">
                        {t('contract.modalPermissionReq')}
                    </Text>
                    <Button
                        onPress={() => {
                            onClose();
                        }}
                    >
                        {t('button.proceedToAgree')}
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
