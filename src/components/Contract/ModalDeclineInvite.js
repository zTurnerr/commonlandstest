import { useNavigation } from '@react-navigation/core';
import { Box, Center, Text } from 'native-base';
import React, { useState } from 'react';
import Modal from 'react-native-modal';
import Button from '../../components/Button';
import useTranslate from '../../i18n/useTranslate';
import { acceptOrRejectInvite } from '../../rest_client/apiClient';
import { showErr } from '../../util/showErr';
import EditPen3 from '../Icons/EditPen3';

export const useModalDeclineInvite = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSigner, setSelectedSigner] = useState({});

    const open = () => {
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
    };

    const Component = ({ contract }) => {
        return <ModalDeclineInvite isOpen={isOpen} onClose={close} contract={contract} />;
    };

    return {
        Component,
        open,
        close,
        selectedSigner,
        setSelectedSigner,
    };
};

export default function ModalDeclineInvite({ isOpen, onClose, contract }) {
    const navigation = useNavigation();
    const t = useTranslate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await acceptOrRejectInvite(contract._id, {
                accept: false,
            });
            setLoading(false);
            onClose();
            navigation.navigate('Contract', {
                excludeId: contract._id,
            });
        } catch (error) {
            showErr(error);
            setLoading(false);
        }
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
                    <EditPen3 />
                </Center>
                <Box mt="15px" w="full" alignItems="center">
                    <Text
                        color="black"
                        fontWeight="600"
                        fontSize="16px"
                        textAlign={'center'}
                        mb="15px"
                    >
                        {t('contract.declineInvitation')}
                    </Text>

                    <Text fontSize={'14px'} textAlign={'center'} mb="40px">
                        {t('contract.declineInvitationModal')}
                    </Text>
                    <Button
                        onPress={() => {
                            handleSubmit();
                        }}
                        bgColor="primary.600"
                        isLoading={loading}
                    >
                        {t('button.reject')}
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
