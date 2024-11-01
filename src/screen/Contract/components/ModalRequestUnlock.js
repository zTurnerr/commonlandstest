import { Box, Center, Text } from 'native-base';
import React, { useState } from 'react';
import { EventRegister } from 'react-native-event-listeners';
import Modal from 'react-native-modal';
import Button from '../../../components/Button';
import Send2 from '../../../components/Icons/Send2';
import { EVENT_NAME } from '../../../constants/eventName';
import useTranslate from '../../../i18n/useTranslate';
import { borrowerRequestUnlock } from '../../../rest_client/apiClient';
import { showErr } from '../../../util/showErr';

export const useModalRequestUnlock = () => {
    const [isOpen, setIsOpen] = useState(false);

    const open = () => {
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
    };

    const Component = ({ onPress = () => {}, contract = {} }) => {
        return (
            <ModalRequestUnlock
                isOpen={isOpen}
                onClose={close}
                onPress={onPress}
                contract={contract}
            />
        );
    };

    return {
        Component,
        open,
        close,
    };
};

export default function ModalRequestUnlock({ isOpen, onClose, contract }) {
    const t = useTranslate();
    const [loading, setLoading] = useState(false);

    const onReq = async () => {
        setLoading(true);
        try {
            await borrowerRequestUnlock(contract.did);
            EventRegister.emit(EVENT_NAME.refreshContract);
            onClose();
        } catch (error) {
            showErr(error);
        }
        setLoading(false);
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
                    <Send2 width={'40'} height={'40'} />
                </Center>
                <Box mt="15px" w="full" alignItems="center">
                    <Text mb="8px" color="black" fontWeight="bold" fontSize="18px">
                        {t('contract.requestUnlock')}
                    </Text>
                    <Text fontSize={'14px'} fontWeight={400} textAlign={'center'} mb="32px">
                        {t('contract.modalRequestUnlock')}
                    </Text>
                    <Button
                        onPress={() => {
                            onReq();
                        }}
                        color="custom"
                        _container={{
                            bg: 'primary.600',
                        }}
                        textColor={'white'}
                        isLoading={loading}
                    >
                        {t('button.sendRequest')}
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
