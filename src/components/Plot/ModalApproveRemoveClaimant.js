import { Box, Center, Text, Button } from 'native-base';

import Modal from 'react-native-modal';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/core';
import useTranslate from '../../i18n/useTranslate';
import Danger from '../Icons/Danger';
import { EventRegister } from 'react-native-event-listeners';
import { EVENT_NAME } from '../../constants/eventName';
import { voteRemoveClaimant } from '../../rest_client/apiClient';

export const useModalApproveRemoveClaimant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedReq, setSelectedReq] = useState({});
    const open = ({ req }) => {
        setIsOpen(true);
        setSelectedReq(req);
    };

    const close = () => {
        setIsOpen(false);
    };

    const [loading, setLoading] = useState(false);
    const onApprove = async () => {
        setLoading(true);
        try {
            let { data } = await voteRemoveClaimant(selectedReq?._id, {
                approve: true,
            });
            EventRegister.emit(EVENT_NAME.refetchRemoveClaimantReq);
            EventRegister.emit(EVENT_NAME.refetchPlotData);
            close();
            EventRegister.emit(EVENT_NAME.removeClaimantSuccess);
        } catch (error) {}
        setLoading(false);
    };

    const Component = () => {
        return (
            <>
                <ModalApproveRemoveClaimant
                    isOpen={isOpen}
                    onClose={close}
                    req={selectedReq}
                    onApprove={onApprove}
                    loading={loading}
                />
            </>
        );
    };

    return {
        Component,
        open,
        close,
        selectedReq,
        setSelectedReq,
    };
};

export default function ModalApproveRemoveClaimant({ isOpen, onClose, req, onApprove, loading }) {
    const navigation = useNavigation();
    const t = useTranslate();
    const { params } = useRoute();

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
                            name: req?.claimant?.fullName,
                        })}
                    </Text>

                    <Text fontSize={'14px'} textAlign={'center'} mb="40px">
                        {t('plot.removeClaimant4', {
                            name: req?.claimant?.fullName,
                            plotName: params?.plotName,
                        })}
                    </Text>
                    <Button
                        onPress={() => {
                            onApprove();
                        }}
                        bg="danger.300"
                        _pressed={{ opacity: 0.8, bg: 'danger.300' }}
                        isLoading={loading}
                        isDisabled={loading}
                    >
                        {t('plot.removeClaimant1')}
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
