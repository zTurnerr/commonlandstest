import useTranslate from '../../../i18n/useTranslate';
import { Box, HStack, Text, useTheme } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import RenderViewStatus from '../../../components/RenderViewStatus';
import moment from 'moment';
import EditPen from '../../../components/Icons/EditPen';
import VerifiedContractAlert from './VerifiedContractAlert';

const ProofOfPayment1 = ({ contract, navigation, type, hideEditBtn = false }) => {
    const theme = useTheme();
    const showProof = () => {
        let unlockStatusObj = contract?.requestToUnlock;
        if (unlockStatusObj?.isPending && unlockStatusObj?.history?.[0]?.requestType == 'CML') {
            return true;
        }
        return false;
    };

    const getNewestRequestTime = () => {
        let unlockStatusObj = contract?.requestToUnlock;
        return unlockStatusObj?.history?.[0]?.createdAt;
    };

    const isCmlApproved = () => {
        let unlockStatusObj = contract?.requestToUnlock;
        if (
            !unlockStatusObj?.isPending &&
            unlockStatusObj?.history?.[0]?.requestType === 'CML' &&
            unlockStatusObj?.history?.[0]?.status === 'APPROVED'
        ) {
            return true;
        }
        return false;
    };
    const t = useTranslate();

    return (
        <>
            {(showProof() || isCmlApproved()) && (
                <TouchableOpacity
                    onPress={() => {
                        if (isCmlApproved()) {
                            return;
                        }
                        navigation.navigate('ProofOfPayment', {
                            contract: contract,
                            type: type,
                        });
                    }}
                >
                    <HStack
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        space={3}
                        bg="white"
                        p="15px"
                        mt="5px"
                    >
                        <Box w={'full'}>
                            <Text fontSize={'12px'} fontWeight={700}>
                                {t('contract.proofOfPayment')}
                            </Text>
                            <Text mb="10px" fontSize={'11px'} mt="2px" color="gray.700">
                                {`${t('components.submittedAt')} ${moment(
                                    getNewestRequestTime(),
                                ).format('MMM DD, YYYY')}`}
                            </Text>
                            {!isCmlApproved() && (
                                <HStack>
                                    <RenderViewStatus status={t('contract.pendingVerify')} />
                                    <Box flex={1}></Box>
                                </HStack>
                            )}
                            {isCmlApproved() && <VerifiedContractAlert type={type} />}
                        </Box>
                        {!hideEditBtn && !isCmlApproved() && (
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate('RequestUnlock', {
                                        contract: contract,
                                        type: type,
                                    });
                                }}
                            >
                                <HStack space={1} alignItems={'center'}>
                                    <EditPen color={theme.colors.primary[600]} />
                                    <Text fontSize={'14px'} fontWeight={700} color="primary.600">
                                        {t('contract.editProof2')}
                                    </Text>
                                </HStack>
                            </TouchableOpacity>
                        )}
                    </HStack>
                </TouchableOpacity>
            )}
        </>
    );
};

export default ProofOfPayment1;
