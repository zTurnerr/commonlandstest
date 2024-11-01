import useTranslate from '../../i18n/useTranslate';
/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import React, { useState } from 'react';
import { Text, Modal, useDisclose } from 'native-base';
import Button from '../../components/Button';
import PhoneInput from '../../components/PhoneInput';
import { StyleSheet } from 'react-native';

export const useModalInviteNeighbor = () => {
    const {
        isOpen: isOpenModalInvite,
        onOpen: onOpenModalInvite,
        onClose: onCloseModalInvite,
    } = useDisclose();

    const ModalInviteNeighbor = ({ onSubmit = () => {} }) => {
        return (
            <Index isOpen={isOpenModalInvite} onClose={onCloseModalInvite} onSubmit={onSubmit} />
        );
    };

    return {
        ModalInviteNeighbor,
        isOpenModalInvite,
        onOpenModalInvite,
        onCloseModalInvite,
    };
};

export default function Index({ isOpen, onClose, onSubmit }) {
    const [formattedValue, setFormattedValue] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneInvalid, setPhoneInvalid] = useState(true);
    const [error, setError] = useState(true);
    const [requesting, setRequesting] = useState(false);
    const submit = async () => {
        try {
            setRequesting(true);
            setError('');
            await onSubmit(formattedValue);
            setPhoneNumber('');
            setFormattedValue('');
            setPhoneInvalid(true);
            onClose();
        } catch (err) {
            setError(err);
        } finally {
            setRequesting(false);
        }
    };
    const _onClose = () => {
        setError('');
        setPhoneNumber('');
        setPhoneInvalid(false);
        onClose();
    };
    const t = useTranslate();
    return (
        <Modal isOpen={isOpen} safeAreaTop={true} onClose={_onClose}>
            <Modal.Content>
                <Modal.Body justifyContent="center" alignItems="center" p="20px">
                    <Text mt="20px" mb="12px" fontWeight="bold" fontSize="18px">
                        {t('invite.recognizeNeighbor')}
                    </Text>
                    <Text mb="20px" textAlign="center">
                        {t('invite.enterPhoneContinue')}
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
                        autoFocus
                    />
                    {Boolean(error) && <Text color="error.400">{error}</Text>}
                    <Button
                        _container={{
                            mt: '12px',
                        }}
                        onPress={() => {
                            submit();
                        }}
                        isDisabled={!phoneNumber || phoneInvalid || requesting}
                        isLoading={requesting}
                    >
                        {t('button.submit')}
                    </Button>
                </Modal.Body>
            </Modal.Content>
        </Modal>
    );
}

const styles = StyleSheet.create({
    phoneInput: {
        marginBottom: 0,
    },
});
