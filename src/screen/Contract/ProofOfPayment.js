import { useFocusEffect } from '@react-navigation/native';
import { ArrowBackIcon, ArrowForwardIcon, Box, HStack, Text, useTheme } from 'native-base';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Button from '../../components/Button';
import HeaderPage from '../../components/HeaderPage';
import Upload from '../../components/Icons/Upload';
import ImageWithLoading from '../../components/ImageWithLoading/ImageWithLoading';
import RenderViewStatus from '../../components/RenderViewStatus';
import useTranslate from '../../i18n/useTranslate';
import { getContractByDID } from '../../rest_client/apiClient';
import { useModalCreatorUnlock } from './components/ModalCreatorUnlock';

const ProofOfPayment = ({ route, navigation }) => {
    const t = useTranslate();
    const { contract, type } = route.params;
    const [index, setIndex] = useState(1);
    const [tab, setTab] = useState(0);
    const tabType = ['creator', 'borrower'];
    const modalCreatorUnlockContract = useModalCreatorUnlock();
    const theme = useTheme();
    const requestUnlockObj = contract?.requestToUnlock?.history?.[0];

    const refetchContract = async () => {
        try {
            let { data } = await getContractByDID(contract.did);
            navigation.setParams({
                contract: data?.contract,
            });
        } catch (error) {
            console.log('error', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            refetchContract();
        }, []),
    );

    const getProofList = () => {
        if (!requestUnlockObj) {
            return [];
        }
        if (tab === 1) {
            return [requestUnlockObj?.proofByBorrower[index - 1]];
        } else {
            return [requestUnlockObj?.proofByUnderwriter[index - 1]];
        }
    };

    const getTotalImage = () => {
        if (tab === 1) {
            return requestUnlockObj?.proofByBorrower?.length;
        } else {
            return requestUnlockObj?.proofByUnderwriter?.length;
        }
    };

    useEffect(() => {
        setIndex(1);
    }, [tab]);

    return (
        <Box flex={1}>
            <HeaderPage
                isRight
                onPress={() => navigation.goBack()}
                title={`${t('contract.proofOfPayment')}`}
            >
                <RenderViewStatus status={t('contract.pendingVerify')} />
            </HeaderPage>
            {/* <ContractTransactionInfo /> */}
            <Box bg="white" flexDir={'row'} alignItems={'center'} justifyContent={'space-between'}>
                <TouchableOpacity
                    style={styles.headerItem}
                    activeOpacity={1}
                    onPress={() => setTab(0)}
                >
                    <Text
                        fontSize={'12px'}
                        fontWeight={'600'}
                        mb={'11px'}
                        color={tab === 0 ? theme.colors.appColors.primary : theme.colors.gray[700]}
                    >{`${t('contract.contractCreator')}`}</Text>
                    <Box
                        w={'100%'}
                        h={'2px'}
                        backgroundColor={tab === 0 ? theme.colors.appColors.primary : 'transparent'}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.headerItem}
                    activeOpacity={1}
                    onPress={() => setTab(1)}
                >
                    <Text
                        color={tab === 1 ? theme.colors.appColors.primary : theme.colors.gray[700]}
                        fontSize={'12px'}
                        fontWeight={'600'}
                        mb={'11px'}
                    >{`${t('contract.borrower')}`}</Text>
                    <Box
                        w={'100%'}
                        h={'2px'}
                        backgroundColor={tab === 1 ? theme.colors.appColors.primary : 'transparent'}
                    />
                </TouchableOpacity>
            </Box>
            {getProofList()?.[0] && (
                <>
                    <Box m="10px" flex={1} bg="white">
                        {getProofList().map((item, index) => {
                            return <ImageWithLoading uri={item?.url} h="100%" key={index} />;
                            {
                                /* <Image
                                    key={index}
                                    source={{ uri: item?.url }}
                                    alt="image"
                                    w="100%"
                                    h="100%"
                                    resizeMode="contain"
                                    loadingIndicatorSource={<Spinner />}
                                /> */
                            }
                        })}
                    </Box>
                    {getProofList().map((item, index) => {
                        return (
                            <Text key={index} w="full" textAlign={'center'} color="gray.700">
                                {item?.identifier.split('-')[1]}
                            </Text>
                        );
                    })}

                    <HStack
                        w="130px"
                        mx="auto"
                        bg="white"
                        mt="24px"
                        mb="40px"
                        justifyContent={'space-between'}
                        p="5px"
                        borderRadius={'32px'}
                        alignItems={'center'}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                if (index > 1) {
                                    setIndex(index - 1);
                                }
                            }}
                        >
                            <Box p="12px" bg="gray.1200" borderRadius={'150px'}>
                                <ArrowBackIcon />
                            </Box>
                        </TouchableOpacity>
                        <Text fontWeight={600} fontSize={'12px'}>
                            {`${index}/${getTotalImage()}`}
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                if (index < getTotalImage()) {
                                    setIndex(index + 1);
                                }
                            }}
                        >
                            <Box p="12px" bg="gray.1200" borderRadius={'150px'}>
                                <ArrowForwardIcon />
                            </Box>
                        </TouchableOpacity>
                    </HStack>
                </>
            )}
            {type === tabType[tab] && getProofList()?.[0] && (
                <Box bg={'white'} p="20px">
                    <Button
                        onPress={() => {
                            navigation.navigate('RequestUnlock', {
                                contract: contract,
                                type: type,
                            });
                        }}
                    >
                        {t('button.editProof')}
                    </Button>
                </Box>
            )}
            {!getProofList()?.[0] && (
                <Box pb="50%" flex={1} justifyContent={'center'} alignItems={'center'}>
                    <Box p="12px" bg="primary.200" borderRadius={'8px'} mb="23px">
                        <Upload color={theme.colors.primary[600]} />
                    </Box>
                    <Text fontSize={'12px'} fontWeight={400} color="gray.1300">
                        {t('contract.pendingUploadProof')}
                    </Text>
                </Box>
            )}

            {modalCreatorUnlockContract.Component({})}
        </Box>
    );
};
const styles = StyleSheet.create({
    headerItem: {
        justifyContent: 'center',
        width: '50%',
        alignItems: 'center',
        paddingTop: 20,
    },
});

export default ProofOfPayment;
