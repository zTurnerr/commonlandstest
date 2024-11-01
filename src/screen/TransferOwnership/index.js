import { StackActions, useNavigation } from '@react-navigation/native';
import { Box, HStack, Text, useTheme } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import Button from '../../components/Button';
import Header from '../../components/Header';
import { WithdrawOwnershipIcon } from '../../components/Icons';
import Tabs from '../../components/Tabs';
import useTranslate from '../../i18n/useTranslate';
import { requestWithdrawOwnership, transferOwnershipToClaimant } from '../../rest_client/apiClient';
import { showMessage } from '../../util/Constants';
import ExternalTransfer from './ExternalTransfer';
import InternalTransfer from './InternalTransfer';
import ModalTransfer from './components/ModalTransfer';

const Index = ({ route }) => {
    const t = useTranslate();
    const { plotId, claimants, plotName, goBack } = route.params || {};
    const [info, setInfo] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [openTransfer, setOpenTransfer] = useState(false);
    const [error, setError] = useState('');
    const [stateModal, setStateModal] = useState('internal');
    const theme = useTheme();
    const refPinOTP = useRef({});
    const navigation = useNavigation();

    const onClickTransfer = (info) => {
        const claimantInfo = claimants.find((item) => item._id === info._id);
        if (claimantInfo) {
            setStateModal('internal');
        } else {
            setStateModal('external');
        }
        setOpenTransfer(true);
        setInfo(info);
    };

    const onCancel = () => {
        setOpenTransfer(false);
        setError('');
        refPinOTP.current = {};
    };

    const onClick = async () => {
        if (stateModal !== 'pinCodeVerify' && stateModal !== 'pinCodeWithdrawVerify') {
            if (stateModal === 'withdraw') {
                setStateModal('pinCodeWithdrawVerify');
            } else {
                setStateModal('pinCodeVerify');
            }
        } else if (stateModal === 'pinCodeVerify' || stateModal === 'pinCodeWithdrawVerify') {
            const pinCode = refPinOTP.current?.code?.length || 0;
            if (pinCode < 6) {
                setError(t('auth.missingPinCode'));
                return;
            } else {
                setError('');
            }
            await refPinOTP.current.confirmCode(refPinOTP.current.code);
        }
    };

    useEffect(() => {
        if (stateModal === 'pinCodeVerify' || stateModal === 'pinCodeWithdrawVerify') {
            refPinOTP.current.sendOTP();
        }
    }, [stateModal]);

    const onVerifiedOTP = async (phoneNumber, token) => {
        if (stateModal === 'pinCodeVerify') {
            await transferOwner(token);
        } else if (stateModal === 'pinCodeWithdrawVerify') {
            await withdrawOwnership(token);
        }
    };

    const popAction = StackActions.pop(claimants?.length === 1 ? 2 : 1);

    const transferOwner = async (idToken) => {
        try {
            setError('');
            await transferOwnershipToClaimant({
                plotId,
                data: {
                    nominatedOwnerId: info?._id,
                    idToken: idToken,
                },
            });
            if (goBack) {
                goBack();
            }
            navigation.goBack();
        } catch (error) {
            console.log(error);
            setError(error);
        }
    };

    const withdrawOwnership = async (idToken) => {
        try {
            setError('');
            await requestWithdrawOwnership({
                plotId,
                data: {
                    idToken: idToken,
                },
            });
            if (goBack) {
                goBack();
            }
            navigation.dispatch(popAction);
            if (claimants.length === 1) {
                showMessage({
                    text: t('transferOwnership.withdrawOwnershipSuccess'),
                });
            }
        } catch (error) {
            console.log(error);
            setError(error);
        }
    };

    // useEffect(() => {
    //     if (activeTab === 0) {
    //         setStateModal('internal');
    //     } else {
    //         setStateModal('external');
    //     }
    // }, [activeTab]);

    return (
        <>
            <Header title={`${t('bottomTab.plot')} ${plotName} ${t('plot.transferOwnership')}`} />
            <Tabs
                items={[
                    { label: t('transferOwnership.internalTransfer'), value: 0 },
                    { label: t('transferOwnership.externalTransfer'), value: 1 },
                ]}
                activeIndex={activeTab}
                onTabChange={setActiveTab}
                bg="white"
                mt="0px"
            />
            {activeTab === 0 ? (
                <InternalTransfer claimants={claimants} onClickTransfer={onClickTransfer} />
            ) : (
                <ExternalTransfer onClickTransfer={onClickTransfer} claimants={claimants} />
            )}
            <Box px={5} py={2}>
                <Button
                    variant="outline"
                    onPress={() => {
                        setOpenTransfer(true);
                        setStateModal('withdraw');
                    }}
                    borderColor={'appColors.primaryRed'}
                    _pressed={{ bgColor: 'appColors.outlinePrimaryRedPressed' }}
                >
                    <HStack alignItems={'center'}>
                        <WithdrawOwnershipIcon color={theme.colors.appColors.primaryRed} />
                        <Text ml={2} fontSize={14} fontWeight={700} color={'appColors.primaryRed'}>
                            {t('transferOwnership.withdrawOwnership')}
                        </Text>
                    </HStack>
                </Button>
            </Box>
            <ModalTransfer
                isOpen={openTransfer}
                onClose={() => setOpenTransfer(false)}
                tab={activeTab}
                state={stateModal}
                onCancel={onCancel}
                onClick={onClick}
                plotName={plotName}
                name={info?.fullName}
                phoneNumber={info?.phoneNumber}
                refPinOTP={refPinOTP}
                onVerifiedOTP={onVerifiedOTP}
                error={error}
            />
        </>
    );
};

export default Index;
