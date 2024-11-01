import { Box, Center, Text, Button } from 'native-base';

import Modal from 'react-native-modal';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/core';
import useTranslate from '../../i18n/useTranslate';
import Danger from '../Icons/Danger';
import { showErr } from '../../util/showErr';
import { replyTransferReq } from '../../rest_client/apiClient';

export const useModalDeclineTransfer = (contract) => {
    const [isOpen, setIsOpen] = useState(false);

    const open = () => {
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
    };

    const Component = () => {
        return <ModalDeclineTransfer isOpen={isOpen} onClose={close} contract={contract} />;
    };

    return {
        Component,
        open,
        close,
    };
};

export default function ModalDeclineTransfer({ isOpen, onClose, contract }) {
    const navigation = useNavigation();
    const t = useTranslate();
    const [loading, setLoading] = useState(false);

    const onConfirm = async () => {
        setLoading(true);
        try {
            await replyTransferReq(contract?._id, {
                accept: false,
            });
            onClose();
        } catch (error) {
            showErr(error);
        }
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
                    <Box p="10px" bg="danger.1400" borderRadius={'16px'}>
                        <Danger />
                    </Box>
                </Center>
                <Box mt="15px" w="full" alignItems="center">
                    <Text
                        color="black"
                        fontWeight="600"
                        fontSize="16px"
                        textAlign={'center'}
                        mb="15px"
                    >
                        {t('contract.declineTransfer')}
                    </Text>

                    <Text fontSize={'14px'} textAlign={'center'} mb="40px">
                        {t('contract.declineTransferContent')}
                    </Text>
                    <Button
                        onPress={() => {
                            onConfirm();
                        }}
                        isLoading={loading}
                        isDisabled={loading}
                        bg="danger.300"
                        _pressed={{
                            opacity: 0.8,
                            bg: 'danger.300',
                        }}
                    >
                        {t('button.decline')}
                    </Button>
                    <Button
                        onPress={() => {
                            onClose();
                        }}
                        mt="14px"
                        variant="outline"
                        borderColor="black"
                    >
                        {t('button.back')}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
