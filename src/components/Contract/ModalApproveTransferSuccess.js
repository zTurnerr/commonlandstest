import { Box, Text } from 'native-base';

import Button from '../Button';
import Modal from 'react-native-modal';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/core';
import Verify from '../Icons/Verify';
import useTranslate from '../../i18n/useTranslate';

export const useModalApproveTransferSuccess = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);

    const Component = ({ contract }) => {
        return <ModalApproveTransferSuccess isOpen={isOpen} onClose={close} contract={contract} />;
    };

    return { isOpen, open, close, Component };
};

function ModalApproveTransferSuccess({ isOpen, onClose, contract = {} }) {
    const navigation = useNavigation();
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
                    <Text mb="8px" mt="15px" color="black" fontWeight="bold" fontSize="18px">
                        {t('contract.congrat')}
                    </Text>
                    <Text fontSize={'14px'} fontWeight={400} textAlign={'center'} mb="32px">
                        {t('contract.becomeOwner', {
                            contractName: contract?.name,
                        })}
                    </Text>
                    <Button
                        onPress={() => {
                            onClose();
                        }}
                        bg="primary.600"
                    >
                        {t('button.done')}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
