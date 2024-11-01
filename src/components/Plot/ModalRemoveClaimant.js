import { Box, Center, Text, Button } from 'native-base';

import Modal from 'react-native-modal';
import React, { useState } from 'react';
import { useRoute } from '@react-navigation/core';
import useTranslate from '../../i18n/useTranslate';
import Danger from '../Icons/Danger';
import { showErr } from '../../util/showErr';
import { removeClaimant } from '../../rest_client/apiClient';
import { EventRegister } from 'react-native-event-listeners';
import { EVENT_NAME } from '../../constants/eventName';

export const useModalRemoveClaimant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedClaimant, setSelectedClaimant] = useState({});

    const open = ({ claimant }) => {
        setIsOpen(true);
        setSelectedClaimant(claimant);
    };

    const close = () => {
        setIsOpen(false);
    };

    const Component = () => {
        return <ModalRemoveClaimant isOpen={isOpen} onClose={close} claimant={selectedClaimant} />;
    };

    return {
        Component,
        open,
        close,
        selectedClaimant,
        setSelectedClaimant,
    };
};

export default function ModalRemoveClaimant({ isOpen, onClose, claimant }) {
    const { params } = useRoute();
    const t = useTranslate();

    const [loading, setLoading] = useState(false);
    const onConfirm = async () => {
        setLoading(true);
        try {
            await removeClaimant({
                claimantId: claimant?._id,
                plotId: params?.plotID,
            });
            EventRegister.emit(EVENT_NAME.refetchPlotData);
            EventRegister.emit(EVENT_NAME.refetchRemoveClaimantReq);
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
                    <Box p="10px" bg="danger.1200" borderRadius={'2xl'}>
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
                        {t('plot.removeClaimant2', {
                            name: claimant?.fullName,
                        })}
                    </Text>

                    <Text fontSize={'14px'} textAlign={'center'} mb="40px">
                        {t('plot.removeClaimant3')}
                    </Text>
                    <Button
                        onPress={() => {
                            onClose();
                            onConfirm();
                        }}
                        isLoading={loading}
                        isDisabled={loading}
                        bg="danger.300"
                        _pressed={{ opacity: 0.8, bg: 'danger.300' }}
                    >
                        {t('plot.removeClaimant1')}
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
