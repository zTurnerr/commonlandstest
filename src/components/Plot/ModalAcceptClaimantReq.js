import { Box, Button, HStack, Text } from 'native-base';
import React, { useState } from 'react';
import { EventRegister } from 'react-native-event-listeners';
import Modal from 'react-native-modal';
import { EVENT_NAME } from '../../constants/eventName';
import useTranslate from '../../i18n/useTranslate';
import { approveClaimant } from '../../rest_client/apiClient';
import { showErr } from '../../util/showErr';
import EditPen2 from '../Icons/EditPen2';

export const useModalAcceptClaimantReq = () => {
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
            await approveClaimant(req._id);
            EventRegister.emit(EVENT_NAME.refetchPlotData);

            close();
        } catch (error) {
            showErr(error);
        }
        setLoading(false);
    };

    const Component = () => {
        return (
            <ModalAcceptClaimantReq
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

export default function ModalAcceptClaimantReq({ isOpen, onClose, onConfirm, loading, req = {} }) {
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
                    <EditPen2 />
                </Box>
                <Box mt="15px" w="full" alignItems="center">
                    <Text
                        color="black"
                        fontWeight="600"
                        fontSize="16px"
                        textAlign={'center'}
                        mb="30px"
                    >
                        {t('plot.confirmClaimantReqTxt', {
                            fullName: req?.fullName,
                            role: TYPE[req?.requestRole],
                        })}
                    </Text>
                    <HStack space={4}>
                        <Button
                            onPress={() => {
                                onClose();
                            }}
                            flex={1}
                            variant="outline"
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
                            {t('button.accept')}
                        </Button>
                    </HStack>
                </Box>
            </Box>
        </Modal>
    );
}
