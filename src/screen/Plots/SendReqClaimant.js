import { Box, Button, CloseIcon, HStack, Text, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import HeaderPage from '../../components/HeaderPage';
import { TickCircle } from '../../components/Icons';
import { EVENT_NAME } from '../../constants/eventName';
import usePhoneInput1 from '../../hooks/PhoneInput/usePhoneInput1';
import useTranslate from '../../i18n/useTranslate';
import { becomeClaimant, checkClaimantOfPlot } from '../../rest_client/apiClient';
import { showErr } from '../../util/showErr';

const SendReqClaimant = ({ route, navigation }) => {
    const t = useTranslate();
    const claimantOptions = [
        {
            label: t('claimants.owner'),
            value: 'owner',
        },
        // {
        //     label: t('claimants.coOwner'),
        //     value: 'co-owner',
        // },
        {
            label: t('claimants.renter'),
            value: 'renter',
        },
        {
            label: t('claimants.rightOfUse'),
            value: 'rightOfUse',
        },
    ];
    const [selectedRole, setSelectedRole] = useState(claimantOptions[0].value);
    const { plotData } = route?.params || {};
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [acceptByServer, setAcceptByServer] = useState(false);
    const phoneInputHook = usePhoneInput1({ loading: loading, accepted: acceptByServer });

    const onValidPhoneNumber = async () => {
        setLoading(true);
        try {
            await checkClaimantOfPlot(plotData.plot._id, {
                phoneNumber: phoneInputHook.phoneValue,
            });
            setAcceptByServer(true);
        } catch (error) {
            phoneInputHook.setErr(error);
        }
        setLoading(false);
    };

    const sendReq = async () => {
        setLoading(true);
        try {
            await becomeClaimant(plotData.plot._id, {
                claimantType: selectedRole,
                phoneNumberOfClaimant: phoneInputHook.phoneValue,
            });
            EventRegister.emit(EVENT_NAME.reqClaimantSuccess);
            EventRegister.emit(EVENT_NAME.refetchPlotData);
            navigation.goBack();
        } catch (error) {
            showErr(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        setAcceptByServer(false);
        if (phoneInputHook.phoneValue && !phoneInputHook.err && !acceptByServer) {
            onValidPhoneNumber();
        }
    }, [phoneInputHook.phoneValue]);

    const InputPhoneStep = (
        <Box px="17px">
            <Text fontSize={'16px'} fontWeight={600} mb="20px">
                {t('plot.enterPhoneClaimant')}
            </Text>
            {phoneInputHook.Component({
                loading: loading,
            })}
        </Box>
    );
    const JoinPlotStep = (
        <Box px="17px">
            <Text fontSize={'16px'} fontWeight={600} mb="20px">
                {t('plot.joinPlotAs')}
            </Text>
            <VStack>
                {claimantOptions.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => setSelectedRole(item.value)}>
                        <HStack
                            borderRadius={'24px'}
                            borderWidth={1}
                            py="12px"
                            px="21px"
                            space={4}
                            alignItems="center"
                            justifyContent="space-between"
                            mb="21px"
                            bg={selectedRole === item.value ? 'primary.600' : 'white'}
                            borderColor={selectedRole === item.value ? 'primary.600' : 'gray.400'}
                        >
                            <Text
                                fontWeight={500}
                                color={selectedRole === item.value ? 'white' : 'black'}
                            >
                                {item.label}
                            </Text>
                            {selectedRole === item.value && <TickCircle color="white" size="24" />}
                        </HStack>
                    </TouchableOpacity>
                ))}
            </VStack>
        </Box>
    );

    return (
        <Box h="full">
            <HeaderPage title={t('plot.claimantReqHeader')} backIcon={<CloseIcon />} />
            <Box bg="white" flex={1}>
                <HStack px="17px" w="full" space={1}>
                    <Box flex={1}>
                        <Box w="full" h="3px" bg={'primary.600'}></Box>
                        <Text mt="15px" fontSize={'14px'} fontWeight={700}>
                            {`${t('others.step')} 1`}
                        </Text>
                        <Text>{t('plot.requestAccess')}</Text>
                    </Box>
                    <Box flex={1}>
                        <Box w="full" h="3px" bg={step === 0 ? 'gray.400' : 'primary.600'}></Box>
                        <Text mt="15px" fontSize={'14px'} fontWeight={700}>
                            {`${t('others.step')} 2`}
                        </Text>
                        <Text>{t('button.sendRequest')}</Text>
                    </Box>
                </HStack>
                {/*  Divide */}
                <Box w="full" h="1px" bg="gray.400" mt="15px" mb="38px"></Box>
                {step === 0 && InputPhoneStep}
                {step === 1 && JoinPlotStep}
                {/* Group button */}
                <HStack px="17px" mt="auto" mb="20px" space={8}>
                    <Button
                        flex={1}
                        variant="outline"
                        borderColor="primary.500"
                        colorScheme="primary"
                        onPress={() => {
                            if (step === 0) {
                                navigation.goBack();
                            } else {
                                setStep(0);
                            }
                        }}
                    >
                        {step === 0 ? t('button.cancel') : t('button.back')}
                    </Button>
                    <Button
                        disabled={!!phoneInputHook.err || !phoneInputHook.phoneValue}
                        opacity={phoneInputHook.err || !phoneInputHook.phoneValue ? 0.5 : 1}
                        colorScheme="primary"
                        flex={1}
                        isLoading={loading}
                        onPress={() => {
                            if (loading) {
                                return;
                            }
                            if (step === 0) {
                                setStep(1);
                            } else {
                                sendReq();
                            }
                        }}
                    >
                        {step === 0 ? t('button.next') : t('button.sendRequest')}
                    </Button>
                </HStack>
            </Box>
        </Box>
    );
};

export default SendReqClaimant;
