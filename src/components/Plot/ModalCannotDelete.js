import { Box, Button, Center, Text } from 'native-base';
import React, { useState } from 'react';
import Modal from 'react-native-modal';
import useTranslate from '../../i18n/useTranslate';
import Danger from '../Icons/Danger';

export const useModalCannotDelete = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSigner, setSelectedSigner] = useState({});

    const open = () => {
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
    };

    const onRemoveSigner = () => {
        open();
    };

    const Component = ({ onConfirm = () => {}, plotData = {} }) => {
        return (
            <ModalCannotDelete
                isOpen={isOpen}
                onClose={close}
                onConfirm={onConfirm}
                plotData={plotData}
            />
        );
    };

    return {
        Component,
        open,
        close,
        selectedSigner,
        setSelectedSigner,
        onRemoveSigner,
    };
};

export default function ModalCannotDelete({ isOpen, onClose, onConfirm, plotData }) {
    const t = useTranslate();

    const renderDescription = () => {
        if (plotData?.hasOwnershipWithdrawalRequest) {
            return t('plot.pendingOwnershipWithdrawal');
        }
        if (plotData?.hasOwnershipTransferRequest) {
            return t('plot.pendingOwnershipTransfer');
        }
        return t('plot.cannotDeletePlot2');
    };
    let canGotoWithdrawal =
        !plotData?.hasOwnershipWithdrawalRequest && !plotData?.hasOwnershipTransferRequest;

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
                    <Danger />
                </Center>
                <Box mt="15px" w="full" alignItems="center">
                    <Text
                        color="black"
                        fontWeight="600"
                        fontSize="16px"
                        textAlign={'center'}
                        mb="15px"
                    >
                        {t('plot.cannotDeletePlot')}
                    </Text>

                    <Text fontSize={'14px'} textAlign={'center'} mb="40px">
                        {renderDescription()}
                    </Text>
                    {canGotoWithdrawal && (
                        <Button
                            onPress={() => {
                                onClose();
                                onConfirm();
                            }}
                            // bgColor="primary.600"
                        >
                            {t('plot.withdrawalFromPlot')}
                        </Button>
                    )}
                    <Button
                        onPress={() => {
                            onClose();
                        }}
                        mt="14px"
                        variant="outline"
                    >
                        {canGotoWithdrawal ? t('button.cancel') : t('button.okay')}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
