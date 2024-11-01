import { Avatar, Box, Text, useDisclose } from 'native-base';
import React, { useState } from 'react';
import useTranslate from '../../i18n/useTranslate';

import { StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import Button from '../../components/Button';
import PhoneInput from '../../components/PhoneInput';
import { getRoleLabel } from '../../util/Constants';

export const useModalAcceptNeighbor = () => {
    const {
        isOpen: isOpenModalAcceptNeighbor,
        onOpen: onOpenModalAcceptNeighbor,
        onClose: onCloseModalAcceptNeighbor,
    } = useDisclose();

    const ModalAcceptNeighbor = ({
        onSubmit = () => {},
        onReject = () => {},
        type = 1,
        invite = {},
    }) => {
        return (
            <Index
                isOpen={isOpenModalAcceptNeighbor}
                onClose={onCloseModalAcceptNeighbor}
                onSubmit={onSubmit}
                onReject={onReject}
                type={type}
                invite={invite}
            />
        );
    };

    return {
        ModalAcceptNeighbor,
        onOpenModalAcceptNeighbor,
        onCloseModalAcceptNeighbor,
    };
};

export default function Index({ isOpen, onClose, onSubmit, onReject, type = 1, invite = {} }) {
    const [error, setError] = useState(true);
    const [requesting, setRequesting] = useState(false);
    const [requestingReject, setRequestingReject] = useState(false);

    const [formattedValue, setFormattedValue] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneInvalid, setPhoneInvalid] = useState(true);

    const _onClose = () => {
        resetData();
        setError('');
        onClose();
    };

    const _onSubmit = async () => {
        try {
            setRequesting(true);
            setError('');

            await onSubmit();
            onClose();
        } catch (err) {
            setError(err);
        } finally {
            resetData();
            setRequesting(false);
        }
    };
    const _onReject = async () => {
        try {
            setRequestingReject(true);
            setError('');
            await onReject();
            onClose();
        } catch (err) {
            setError(err);
        } finally {
            resetData();
            setRequestingReject(false);
        }
    };

    const resetData = () => {
        setPhoneNumber('');
        setPhoneInvalid(false);
    };
    const t = useTranslate();
    return (
        <Modal isVisible={isOpen} safeAreaTop={true} onBackdropPress={_onClose}>
            <Box
                justifyContent="center"
                alignItems="center"
                p="20px"
                borderRadius="8px"
                bgColor="white"
            >
                <Text mb="12px" fontWeight="bold" textAlign="left" w="full" fontSize="18px">
                    {t('invite.confirmInvite')}
                </Text>

                <Text mb="16px" textAlign="left" w="full">
                    {type ? (
                        <>
                            {t('invite.pleaseConfirm')}{' '}
                            <Text fontWeight="bold">{invite?.inviteePlotID?.name ?? 'your'}</Text>{' '}
                            {t('invite.toNeighborPlot')} (
                            <Text fontWeight="bold">{invite?.plotID?.name}</Text>)
                        </>
                    ) : (
                        <>
                            {t('invite.doYouAgree')}{' '}
                            <Text fontWeight="bold">{getRoleLabel(invite.relationship)}</Text>?
                        </>
                    )}
                </Text>
                <Text textAlign="left" w="full" mb="8px">
                    {t('invite.inviteBy')}:
                </Text>
                <Box
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="flex-start"
                    w="full"
                    mb="22px"
                >
                    <Box w="40px" h="40px">
                        <Avatar
                            source={{
                                uri: invite?.createdBy?.avatar ? invite?.createdBy?.avatar : null,
                            }}
                            alt="avatar"
                        />
                    </Box>
                    <Box ml="18px" flexDirection="row" justifyContent="center" flexDir="column">
                        <Text fontSize="14px" fontWeight="bold" flex={1}>
                            {invite?.createdBy?.fullName}
                        </Text>
                        <Text>
                            {t('bottomTab.plot')}: {invite?.plotID?.name}
                        </Text>
                    </Box>
                </Box>

                <Text mb="8px" textAlign="left" w="full">
                    {t('invite.enterPhone')}{' '}
                    <Text fontWeight="bold">{invite?.createdBy?.fullName}</Text>{' '}
                    {t('invite.toConfirm')}
                </Text>
                <PhoneInput
                    value={phoneNumber}
                    onChangeText={(text) => {
                        setPhoneNumber(text);
                    }}
                    onChangeFormattedText={(text) => {
                        setFormattedValue(text);
                    }}
                    onInvalid={setPhoneInvalid}
                    containerStyle={styles.phoneInput}
                />
                {Boolean(error) && <Text color="error.400">{error}</Text>}
                <Box w="full" flexDir="row" justifyContent="space-between">
                    <Button
                        _container={{
                            mt: '12px',
                            w: '48%',
                        }}
                        onPress={() => {
                            _onReject();
                        }}
                        isDisabled={requesting}
                        isLoading={requestingReject}
                        variant="outline"
                    >
                        {t('button.reject')}
                    </Button>
                    <Button
                        _container={{
                            mt: '12px',
                            w: '48%',
                        }}
                        onPress={() => {
                            _onSubmit();
                        }}
                        isDisabled={
                            requesting ||
                            requestingReject ||
                            phoneInvalid ||
                            formattedValue !== invite?.createdBy?.phoneNumber
                        }
                        isLoading={requesting}
                    >
                        {t('button.accept')}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

const styles = StyleSheet.create({
    phoneInput: {
        marginBottom: 0,
    },
});
