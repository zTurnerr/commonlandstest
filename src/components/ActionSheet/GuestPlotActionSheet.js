import React, { useState } from 'react';
import { Actionsheet, Box, Text, HStack, CloseIcon, useTheme } from 'native-base';
import { TouchableOpacity } from 'react-native';
import useTranslate from '../../i18n/useTranslate';
import MailSent from '../Icons/MailSent';
import CheckCircle from '../Icons/CheckCircle';
import Export2 from '../Icons/Export2';
import { canAttestPlot } from '../../util/plot/attestation';
import useUserInfo from '../../hooks/useUserInfo';
import { useNavigation, useRoute } from '@react-navigation/native';
import { EventRegister } from 'react-native-event-listeners';
import { EVENT_NAME } from '../../constants/eventName';
import useSignatoryList from '../../hooks/Contract/useSignatoryList';

export const useGuestPlotActionSheet = () => {
    const [isOpen, setIsOpen] = useState(false);

    const Component = ({ plotData = {}, onShare = () => {} }) => {
        return (
            <GuestPlotSheet
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                plotData={plotData}
                onShare={onShare}
            />
        );
    };

    const close = () => {
        setIsOpen(false);
    };

    const open = () => {
        setIsOpen(true);
    };

    return {
        Component,
        close,
        open,
    };
};

const GuestPlotSheet = ({ isOpen, onClose, plotData, onShare }) => {
    const t = useTranslate();
    const theme = useTheme();
    const user = useUserInfo();
    const navigation = useNavigation();
    const route = useRoute();
    const signatoryHook = useSignatoryList();

    const isInDefaultContract = () => {
        const res = signatoryHook.invites?.find((e) => e?.contract?.status === 'defaulted');
        return !!res;
    };
    const isDefaulted = plotData?.plot?.status === 'defaulted' || isInDefaultContract();

    const canReq = () => {
        if (isDefaulted) return false;
        let res = true;

        if (route.params?.requestorPendingReq) {
            return false;
        }
        if (!plotData) return false;
        plotData?.invites?.forEach((e) => {
            if (e.inviteePhoneNumber === user.phoneNumber) {
                res = false;
            }
        });
        plotData?.claimants?.forEach((e) => {
            if (e.phoneNumber === user.phoneNumber) {
                res = false;
            }
        });
        return res;
    };

    return (
        <Actionsheet isOpen={isOpen} onClose={onClose}>
            <Actionsheet.Content bg="white" alignItems="flex-start">
                <Box w="full" bg="white">
                    <HStack
                        px="20px"
                        pr="30px"
                        justifyContent={'space-between'}
                        alignItems={'center'}
                    >
                        <Text w="full" textAlign={'left'} fontSize={'16px'} fontWeight={600}>
                            {t('plotInfo.settings')}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Box>
                                <CloseIcon color="black" />
                            </Box>
                        </TouchableOpacity>
                    </HStack>
                    <Box px="20px" pb="15px"></Box>
                </Box>
                <Actionsheet.Item
                    bg="white"
                    onPress={() => {
                        navigation.navigate('SendReqClaimant', {
                            plotData: plotData,
                        });
                        onClose();
                    }}
                    isDisabled={!canReq()}
                >
                    <HStack alignItems={'center'}>
                        <Box bg="primary.200" borderRadius={100} p="8px" mr="10px">
                            <MailSent />
                        </Box>
                        <Text fontSize={'12px'} fontWeight={600}>
                            {t('plot.sendRequestToBeClaimant')}
                        </Text>
                    </HStack>
                </Actionsheet.Item>

                <Actionsheet.Item
                    bg="white"
                    onPress={() => {
                        EventRegister.emit(EVENT_NAME.openAttestModal);
                        onClose();
                    }}
                    isDisabled={!canAttestPlot(user, plotData)}
                >
                    <HStack alignItems={'center'}>
                        <Box bg="primary.200" borderRadius={100} p="8px" mr="10px">
                            <CheckCircle color={theme.colors.primary[600]} />
                        </Box>
                        <Text fontSize={'12px'} fontWeight={600}>
                            {t('plot.attestThisPlot')}
                        </Text>
                    </HStack>
                </Actionsheet.Item>
                {onShare && (
                    <Actionsheet.Item bg="white" onPress={onShare}>
                        <HStack alignItems={'center'}>
                            <Box bg="primary.200" borderRadius={100} p="8px" mr="10px">
                                <Export2 color={theme.colors.primary[600]} />
                            </Box>
                            <Text fontSize={'12px'} fontWeight={600}>
                                {t('plotInfo.sharePlot')}
                            </Text>
                        </HStack>
                    </Actionsheet.Item>
                )}
            </Actionsheet.Content>
        </Actionsheet>
    );
};

export default GuestPlotSheet;
