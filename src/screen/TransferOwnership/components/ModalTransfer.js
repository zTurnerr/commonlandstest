import { Box, Spinner, Text, useTheme } from 'native-base';
import React, { useState } from 'react';
import Modal from 'react-native-modal';
import Button from '../../../components/Button';
import {
    ExternalTransferIcon,
    InternalTransferIcon,
    WithdrawOwnershipIcon,
} from '../../../components/Icons';
import useTranslate from '../../../i18n/useTranslate';
import useShallowEqualSelector from '../../../redux/customHook/useShallowEqualSelector';
import { hidePhoneNumber } from '../../../util/utils';
import PinCodeVerify from './PinCodeVerify';

const modalState = {
    internal: {
        text: 'transferOwnership.internalTransfer',
        description: 'transferOwnership.modalTransfer',
        Icon: InternalTransferIcon,
        button: 'transferOwnership.transferNow',
    },
    external: {
        text: 'transferOwnership.externalTransfer',
        description: 'transferOwnership.modalTransfer',
        Icon: ExternalTransferIcon,
        button: 'transferOwnership.transferNow',
    },
    withdraw: {
        text: 'transferOwnership.withdrawOwnership',
        description: 'transferOwnership.modalWithdraw',
        Icon: WithdrawOwnershipIcon,
        iconColor: 'appColors.primaryRed',
        button: 'transferOwnership.withdrawOwnership',
        buttonColor: 'appColors.primaryRed',
        _pressedColor: 'appColors.primaryRedPressed',
    },
    pinCodeVerify: {
        text: 'replacePhoneNumber.pinVerification',
        description: 'transferOwnership.pinCodeVerify',
        Icon: WithdrawOwnershipIcon,
        button: 'auth.submitPin',
        Component: PinCodeVerify,
    },
    pinCodeWithdrawVerify: {
        text: 'replacePhoneNumber.pinVerification',
        description: 'transferOwnership.pinCodeWithdrawVerify',
        Icon: WithdrawOwnershipIcon,
        button: 'auth.submitPin',
        Component: PinCodeVerify,
    },
};

const ModalTransfer = ({
    isOpen,
    state,
    onVerifiedOTP,
    onCancel,
    onClick,
    plotName,
    name,
    refPinOTP,
    error,
}) => {
    const t = useTranslate();
    const Icon = modalState[state].Icon;
    const Component = modalState[state].Component;
    const { user } = useShallowEqualSelector((state) => ({
        user: state.user.userInfo,
    }));
    const { colors } = useTheme();
    const [requesting, setRequesting] = useState(false);

    return (
        <Modal
            isVisible={isOpen}
            onBackdropPress={() => {
                !requesting && onCancel();
            }}
            safeAreaTop={true}
        >
            <Box
                justifyContent={'center'}
                alignItems={'center'}
                p={'20px'}
                bgColor={'white'}
                borderRadius={'8px'}
            >
                <Icon
                    height={40}
                    width={40}
                    strokeWidth={1.5}
                    color={
                        modalState[state].iconColor === 'appColors.primaryRed'
                            ? colors.appColors.primaryRed
                            : colors.appColors.primary
                    }
                />

                <Text fontWeight={700} fontSize={16} mt={5} mb={2}>
                    {t(modalState[state].text)}
                </Text>
                <Text textAlign={'center'} mx={6} mb={3}>
                    {t(modalState[state].description, {
                        plotName: plotName,
                        name: name,
                        phoneNumber: hidePhoneNumber(user?.phoneNumber),
                    })}
                </Text>

                {Component && (
                    <Component
                        onVerifiedOTP={onVerifiedOTP}
                        refPinOTP={refPinOTP}
                        phoneNumber={user?.phoneNumber}
                        setRequesting={setRequesting}
                        errorOutside={error}
                    />
                )}

                <Button
                    onPress={onClick}
                    bgColor={
                        modalState[state].buttonColor
                            ? modalState[state].buttonColor
                            : 'primary.600'
                    }
                    color="custom"
                    _pressed={{ bg: modalState[state]?._pressedColor || 'primary.700' }}
                    isDisabled={requesting}
                >
                    <Text color={'white'} fontWeight={700} fontSize={14}>
                        {requesting ? <Spinner></Spinner> : t(modalState[state].button)}
                    </Text>
                </Button>
                <Button
                    variant="outline"
                    mt="15px"
                    onPress={onCancel}
                    isDisabled={requesting}
                    borderColor="black"
                >
                    <Text fontWeight={700} fontSize={14} color={'black'}>
                        {t('button.cancel')}
                    </Text>
                </Button>
            </Box>
        </Modal>
    );
};

export default ModalTransfer;
