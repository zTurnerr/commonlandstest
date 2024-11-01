import { Avatar, Box, Text } from 'native-base';
import React, { useState } from 'react';
import useTranslate from '../../i18n/useTranslate';

import { StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import Button from '../../components/Button';
import PhoneInput from '../../components/PhoneInput';
import { NEIGHTBORS, getRoleLabel } from '../../util/Constants';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import {
    updateStatusInviteClaimant,
    updateStatusInviteNeightbor,
} from '../../rest_client/apiClient';
import { EventRegister } from 'react-native-event-listeners';
import { EVENT_NAME } from '../../constants/eventName';

export default function Index({ isOpen, onClose, invite, selectedInvite = {} }) {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [error, setError] = useState(true);
    const [requesting, setRequesting] = useState(false);
    const [requestingReject, setRequestingReject] = useState(false);
    const [formattedValue, setFormattedValue] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneInvalid, setPhoneInvalid] = useState(true);

    // action call from step view detail
    const acceptClaimantOrNeightBor = async () => {
        if (selectedInvite.relationship === NEIGHTBORS[0]) {
            await updateStatusInviteNeightbor(
                {
                    inviteID: selectedInvite._id,
                    accept: true,
                },
                navigation,
                dispatch,
            );
        } else {
            await updateStatusInviteClaimant(
                {
                    inviteID: selectedInvite._id,
                    accept: true,
                    isSub: Boolean(selectedInvite.subPlotId),
                },
                navigation,
                dispatch,
            );
        }
        EventRegister.emit(EVENT_NAME.refetchPlotData);
        // renderPlot();
    };
    // action call from step view detail
    const rejectClaimantOrNeightBor = async () => {
        if (selectedInvite.relationship === NEIGHTBORS[0]) {
            await updateStatusInviteNeightbor(
                {
                    inviteID: selectedInvite._id,
                    accept: false,
                },
                navigation,
                dispatch,
            );
        } else {
            await updateStatusInviteClaimant(
                {
                    inviteID: selectedInvite._id,
                    accept: false,
                    isSub: Boolean(selectedInvite.subPlotId),
                },
                navigation,
                dispatch,
            );
        }
        EventRegister.emit(EVENT_NAME.refetchPlotData);
        // renderPlot();
    };

    const _onSubmit = async () => {
        try {
            setRequesting(true);
            setError('');
            await acceptClaimantOrNeightBor();
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
            await rejectClaimantOrNeightBor();
            onClose();
        } catch (err) {
            setError(err);
        } finally {
            resetData();
            setRequestingReject(false);
        }
    };
    const _onClose = () => {
        resetData();
        setError('');
        onClose();
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
                alignItems="flex-start"
                p="20px"
                borderRadius="8px"
                bgColor="white"
            >
                <Text mb="8px" fontWeight="bold" fontSize="18px">
                    Confirm {t('invite.title')}
                </Text>
                <Text mb="20px" textAlign="left">
                    Do you agree to be listed on this plot as a{' '}
                    <Text fontWeight="bold">{getRoleLabel(invite.relationship)}</Text>
                    {invite.inviteePlotID ? ' of ' : ''}
                    {invite.inviteePlotID ? (
                        <Text fontWeight="bold">{invite.inviteePlotID.name}</Text>
                    ) : null}
                    ?
                </Text>
                <Text textAlign="left" w="full" mb="8px">
                    Invite by:
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
                                uri: invite?.createdBy?.avatar,
                            }}
                            alt="avatar"
                        />
                    </Box>
                    <Box ml="18px" flexDirection="row" justifyContent="center" flexDir="column">
                        <Text fontSize="14px" fontWeight="bold" flex={1}>
                            {invite?.createdBy?.fullName}
                        </Text>
                        {true && <Text>Plot: {invite?.plotID?.name}</Text>}
                    </Box>
                </Box>
                <Text mb="8px" textAlign="left" w="full">
                    Enter phone number of{' '}
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
