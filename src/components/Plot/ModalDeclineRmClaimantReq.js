import { Box, Image, Text, Button, HStack } from 'native-base';
import { EventRegister } from 'react-native-event-listeners';
import Modal from 'react-native-modal';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/core';
import useTranslate from '../../i18n/useTranslate';
import { approveClaimant, rejectClaimant, voteRemoveClaimant } from '../../rest_client/apiClient';
import { showErr } from '../../util/showErr';
import { EVENT_NAME } from '../../constants/eventName';
import EditPen3 from '../Icons/EditPen3';

export const useModalDeclineRmClaimantReq = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [req, setReq] = useState({});
    const open = (req) => {
        setReq(req);
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
    };

    const onConfirm = async () => {
        setLoading(true);
        try {
            let { data } = await voteRemoveClaimant(req._id, {
                approve: false,
            });
            EventRegister.emit(EVENT_NAME.refetchPlotData);
            EventRegister.emit(EVENT_NAME.refetchRemoveClaimantReq);
            close();
        } catch (error) {
            showErr(error);
        }
        setLoading(false);
    };

    const Component = () => {
        return (
            <ModalDeclineRmClaimantReq
                isOpen={isOpen}
                onClose={close}
                loading={loading}
                req={req}
                onConfirm={onConfirm}
            />
        );
    };

    return {
        Component,
        open,
        close,
    };
};

export default function ModalDeclineRmClaimantReq({ isOpen, onClose, onConfirm, loading }) {
    const navigation = useNavigation();
    const t = useTranslate();
    const TYPE = {
        owner: t('claimants.owner'),
        renter: t('claimants.renter'),
        rightOfUse: t('claimants.rightOfUse'),
        'co-owner': t('claimants.coOwner'),
        creator: t('components.creator'),
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
                <Box>
                    <EditPen3 />
                </Box>
                <Box mt="15px" w="full" alignItems="center">
                    <Text
                        color="black"
                        fontWeight="600"
                        fontSize="16px"
                        textAlign={'center'}
                        mb="30px"
                    >
                        {t('plot.confirmDeclineReqTxt')}
                    </Text>
                    <HStack space={4}>
                        <Button
                            onPress={() => {
                                if (loading) return;
                                onClose();
                            }}
                            flex={1}
                            variant="outline"
                            isDisabled={loading}
                        >
                            {t('button.cancel')}
                        </Button>
                        <Button
                            onPress={async () => {
                                if (loading) return;
                                await onConfirm();
                            }}
                            isDisabled={loading}
                            flex={1}
                            color="primary.600"
                            isLoading={loading}
                        >
                            {t('button.confirm')}
                        </Button>
                    </HStack>
                </Box>
            </Box>
        </Modal>
    );
}
