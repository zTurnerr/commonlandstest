import { Box, Spinner, Text, useTheme } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import useTranslate from '../../i18n/useTranslate';

import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import Button from '../../components/Button';
import { CancelLeft, WithdrawOwnershipIcon } from '../../components/Icons';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import { requestWithdrawOwnership } from '../../rest_client/apiClient';
import { showMessage } from '../../util/Constants';
import { hidePhoneNumber } from '../../util/utils';
import PinCodeVerify from '../TransferOwnership/components/PinCodeVerify';

export default function ModalWithdrawalPlot({ plotData, isOpen, onClose, _getPlotData }) {
    const user = useShallowEqualSelector((state) => state?.user);
    const [error, setError] = useState('');
    const [step, setStep] = useState(0);
    const [requesting, setRequesting] = useState(false);
    const { colors } = useTheme();
    const t = useTranslate();
    const pinCodeRef = useRef({});
    const navigation = useNavigation();

    const StateModal = [
        {
            Icon: CancelLeft,
            iconColor: colors.black,
            description: 'withdrawal.givingUpControl',
            button: 'button.agreeProceed',
            title: 'plot.withdrawalFromPlot',
        },
        {
            Icon: WithdrawOwnershipIcon,
            description: 'withdrawal.confirmPinCode',
            iconColor: colors.primary[600],
            button: 'auth.submitPin',
            title: 'replacePhoneNumber.pinVerification',
        },
    ];

    const onClick = async () => {
        if (step === 0) {
            setStep(1);
        } else {
            const pinCode = pinCodeRef.current?.code?.length || 0;
            if (pinCode < 6) {
                setError(t('auth.missingPinCode'));
                return;
            } else {
                setError('');
            }

            await pinCodeRef.current.confirmCode(pinCodeRef.current.code);
        }
    };

    const onVerifiedOTP = async (phoneNumber, idToken) => {
        try {
            setError('');
            await requestWithdrawOwnership({
                plotId: plotData?.plot?._id,
                data: {
                    idToken: idToken,
                },
            });
            showMessage({
                text: t('withdrawal.withdrawFromPlotSuccess'),
            });
            if (plotData?.claimants?.length === 1) {
                navigation.goBack();
            }
            onCancel();
            _getPlotData();
        } catch (error) {
            console.log(error);
            setError(error);
        }
    };

    const onCancel = () => {
        onClose();
        setError('');
        pinCodeRef.current = {};
        setStep(0);
    };
    useEffect(() => {
        if (step === 1) {
            pinCodeRef.current.sendOTP();
        }
    }, [step]);
    const Icon = StateModal[step].Icon;

    return (
        <Modal
            isVisible={isOpen}
            safeAreaTop={true}
            onBackdropPress={() => {
                if (requesting) return;
                onCancel();
            }}
        >
            <Box
                justifyContent="center"
                alignItems="center"
                px="20px"
                py="40px"
                borderRadius="8px"
                bgColor="white"
            >
                <Icon color={StateModal[step].iconColor} width="40px" height="40px" />
                <Text fontWeight={700} fontSize={16} mt={3}>
                    {t(StateModal[step].title)}
                </Text>
                <Text fontSize={14} textAlign={'center'} px={'20px'} mt={2} mb={4}>
                    {t(StateModal[step].description, {
                        plot: plotData?.plot?.name,
                        phoneNumber: hidePhoneNumber(user?.userInfo?.phoneNumber),
                    })}
                </Text>
                {step === 1 && (
                    <PinCodeVerify
                        refPinOTP={pinCodeRef}
                        setRequesting={setRequesting}
                        phoneNumber={user?.userInfo?.phoneNumber}
                        errorOutside={error}
                        onVerifiedOTP={onVerifiedOTP}
                    />
                )}
                <Button
                    onPress={onClick}
                    bgColor={'primary.600'}
                    _pressed={{ bgColor: 'primary.700' }}
                    isDisabled={requesting}
                >
                    <Text color={'white'} fontWeight={700} fontSize={14}>
                        {requesting ? <Spinner></Spinner> : t(StateModal[step].button)}
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
}
