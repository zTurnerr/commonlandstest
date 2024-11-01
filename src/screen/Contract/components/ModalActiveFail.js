import { Box, Text } from 'native-base';
import React, { useState } from 'react';
import Modal from 'react-native-modal';
import Button from '../../../components/Button';
import Information from '../../../components/Icons/Information';
import useTranslate from '../../../i18n/useTranslate';

export const useModalActiveFail = () => {
    const [isOpen, setIsOpen] = useState(false);

    const open = () => {
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
    };

    const Component = ({ onActive = () => {} }) => {
        return <ModalActiveFail isOpen={isOpen} onClose={close} onActive={onActive} />;
    };

    return {
        Component,
        open,
        close,
    };
};

export default function ModalActiveFail({ isOpen, onClose }) {
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
                <Information />
                <Box mt="15px" w="full" alignItems="center">
                    <Text mb="8px" color="black" fontWeight="bold" fontSize="18px">
                        {t('contract.feePaymentFail')}
                    </Text>
                    <Text fontSize={'14px'} fontWeight={400} textAlign={'center'} mb="32px">
                        {t('contract.feePaymentFailModal')}
                    </Text>
                    <Button
                        onPress={() => {
                            onClose();
                        }}
                    >
                        {t('button.payAgain')}
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
