import { Box, Text } from 'native-base';
import React, { useState } from 'react';
import Modal from 'react-native-modal';
import Button from '../../../components/Button';
import FilledTrash from '../../../components/Icons/FilledTrash';
import useTranslate from '../../../i18n/useTranslate';

export const useModalDeleteContract = () => {
    const [isOpen, setIsOpen] = useState(false);

    const open = () => {
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
    };

    const Component = () => {
        return <ModalDeleteContract isOpen={isOpen} onClose={close} />;
    };

    return {
        Component,
        open,
        close,
    };
};

export default function ModalDeleteContract({ isOpen, onClose }) {
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
                <FilledTrash />
                <Box mt="15px" w="full" alignItems="center">
                    <Text mb="8px" color="black" fontWeight="bold" fontSize="18px">
                        Delete {t('components.contract')}
                    </Text>
                    <Text fontSize={'14px'} fontWeight={400} textAlign={'center'} mb="32px">
                        You are about to delete the following contract: No.311CL180. Do you want to
                        continue?
                    </Text>
                    <Button
                        onPress={() => {
                            onClose();
                        }}
                        bgColor="danger.300"
                    >
                        Delete contract
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
