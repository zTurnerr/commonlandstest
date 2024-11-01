import { Box, Button, Text } from 'native-base';
import React, { useState } from 'react';
import { EventRegister } from 'react-native-event-listeners';
import Modal from 'react-native-modal';
import DefaultTag from '../../../components/Tag/DefaultTag';
import { EVENT_NAME } from '../../../constants/eventName';
import useTranslate from '../../../i18n/useTranslate';
import { markContract } from '../../../rest_client/apiClient';
import { showErr } from '../../../util/showErr';

export const useModalChangeToDefault = () => {
    const [isOpen, setIsOpen] = useState(false);

    const open = () => {
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
    };

    const Component = ({ onPress = () => {}, contract }) => {
        return (
            <ModalChangeToDefault
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

export default function ModalChangeToDefault({ isOpen, onClose, contract }) {
    const t = useTranslate();
    const [loading, setLoading] = useState(false);

    const onConfirm = async () => {
        setLoading(true);
        try {
            await markContract(contract?._id, {
                status: 'defaulted',
            });
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
                {/* <ShieldSlash color="#AD1457" width="48" height="48" /> */}
                <DefaultTag
                    _container={{
                        my: '27px',
                    }}
                />

                <Box mt="20px" w="full" alignItems="center">
                    <Text mb="8px" color="black" fontWeight="bold" fontSize="18px">
                        {t('contract.markContractAsIn')}
                    </Text>
                    <Text fontSize={'14px'} fontWeight={400} textAlign={'center'} mb="32px">
                        {t('contract.warningDefault')}
                    </Text>
                    <Button
                        onPress={() => {
                            onConfirm();
                        }}
                        color="custom"
                        bg="danger.400"
                        textColor="white"
                        isLoading={loading}
                        isDisabled={loading}
                        _pressed={{
                            bg: 'danger.400A',
                        }}
                    >
                        {t('contract.agreeAndChange')}
                    </Button>
                    <Button
                        onPress={() => {
                            onClose();
                        }}
                        mt="14px"
                        variant="outline"
                        isDisabled={loading}
                    >
                        {t('button.cancel')}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
