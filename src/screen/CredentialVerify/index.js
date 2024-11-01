import axios from 'axios';
import { Box, Center, HStack, Text, VStack, useTheme } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Button from '../../components/Button';
import Header from '../../components/Header';
import { QRScan, ShareIcon, TickCircle } from '../../components/Icons';
import AlertTriangle from '../../components/Icons/AlertTriangle';
import LoadingPage from '../../components/LoadingPage';
import PdfComponent from '../../components/Pdf';
import OldCertificateAlert from '../../components/VerifyCertificate/OldCertificateAlert';
import useTranslate from '../../i18n/useTranslate';
import { CertNotify } from './CertNotify';

let timer = null;

const CredentialVerify = ({
    navigation,
    route: {
        params: { pdfURL, status, activePDF, qrString, claimant, user, contract },
    },
}) => {
    const [gettingLatest, setGettingLatest] = useState(false);
    const { colors } = useTheme();
    const [paramState, setParamState] = useState({
        pdfURL,
        status,
        activePDF,
        user,
    });
    const [base64Data, setBase64Data] = useState(null);
    const pdfRef = React.useRef(null);
    const [cert, setCert] = useState({});
    const isActive = paramState.status === 'active' || contract?.status === 'completed';

    async function getLatest() {
        if (!paramState.activePDF) {
            return;
        }
        setGettingLatest(true);
        try {
            navigation.replace('CredentialVerify', {
                activePDF: paramState.activePDF,
                pdfURL: paramState.activePDF,
                status: 'active',
                qrString,
                claimant,
                user,
            });
        } catch (error) {}
        setGettingLatest(false);
    }

    async function recheckActivePdf() {
        if (paramState.activePDF) {
            return;
        }
        if (timer) {
            clearTimeout(timer);
        }
        try {
            let { data } = await axios.get(qrString);
            setCert(data);
            if (data.activePDF || data.status === 'active') {
                setParamState({
                    ...data,
                });
                return clearTimeout(timer);
            }
            timer = setTimeout(() => {
                recheckActivePdf();
            }, 10000);
        } catch (error) {
            console.log('error', error);
        }
    }

    useEffect(() => {
        recheckActivePdf();
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [activePDF]);

    const t = useTranslate();
    return (
        <Box h="full">
            {gettingLatest && <LoadingPage bgColor="rgba(73, 96, 108, 0.6)" />}
            <Header title={t('certificate.verification')}>
                {paramState.pdfURL && (
                    <HStack
                        mr="10px"
                        alignItems={'center'}
                        space={1}
                        bgColor={isActive ? 'primary.1000' : 'yellow.700'}
                        p="5px"
                        px="11px"
                        borderRadius={'20px'}
                    >
                        <TickCircle color={'white'} />
                        <Text color={'white'} fontWeight={500} fontSize={'12px'}>
                            {isActive ? t('status.valid') : t('status.superseded')}
                        </Text>
                    </HStack>
                )}
            </Header>
            {paramState.status === 'deprecated' && (
                <OldCertificateAlert
                    getLastest={getLatest}
                    haveNewLastest={Boolean(paramState.activePDF)}
                    userId={user?._id}
                />
            )}

            <Box
                flex={1}
                //  height={(SCREEN_HEIGHT * 5.9) / 8}
            >
                {paramState.pdfURL && (
                    <>
                        <PdfComponent
                            setBase64={setBase64Data}
                            pdfRef={pdfRef}
                            url={paramState.pdfURL}
                            cert={cert}
                        />
                    </>
                )}

                {!paramState.pdfURL && (
                    <Box flex={1} bgColor="white" h="full">
                        <VStack
                            px="20px"
                            pt="44px"
                            pb="30px"
                            mx="20px"
                            borderRadius={'16px'}
                            mt="40%"
                            alignItems={'center'}
                        >
                            <AlertTriangle />
                            <Text fontSize={'14px'} fontWeight={900} mt="25px" mb="8px">
                                {t('certificate.qrCodeNotValid')}
                            </Text>
                            <Text textAlign={'center'} color="#71727A">
                                {t('certificate.pleaseScanOther')}
                            </Text>
                        </VStack>
                        <Center>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.goBack();
                                }}
                            >
                                <LinearGradient
                                    colors={colors.buttonPrimary.bgColor.linearGradient.colors}
                                    start={{ x: 0.0, y: 1.0 }}
                                    end={{ x: 1.0, y: 1.0 }}
                                    style={styles.gradient}
                                >
                                    <Center
                                        variant={'solid'}
                                        bgColor={'white'}
                                        py="13px"
                                        px={'25px'}
                                        borderRadius={'8px'}
                                        flexDirection={'row'}
                                    >
                                        {/* <Center bg={'yellow.300'}> */}
                                        <QRScan color={colors.link} />
                                        <Text
                                            ml="5px"
                                            textAlign={'center'}
                                            fontSize={'14px'}
                                            fontWeight={700}
                                            color={'link'}
                                        >
                                            {t('certificate.scanOther')}
                                        </Text>
                                        {/* </Center> */}
                                    </Center>
                                </LinearGradient>
                            </TouchableOpacity>
                        </Center>
                    </Box>
                )}
            </Box>

            {base64Data && (
                <>
                    <Box h="12%" pb="20px" w="full" px="20px" overflow={'hidden'}>
                        <CertNotify status={paramState.status} />
                        <HStack
                            isAttached
                            variant="solid"
                            size={'sm'}
                            bg="white"
                            mt="20px"
                            borderRadius={'12px'}
                            position={'relative'}
                            space={2}
                            alignItems={'center'}
                            w="full"
                            shadow={9}
                            display={!contract ? 'flex' : 'none'}
                        >
                            <Button
                                variant="outline"
                                borderColor="white"
                                flex={1}
                                onPress={() => {
                                    navigation.navigate('AccountHistory', {
                                        qrString,
                                        claimantId: claimant,
                                    });
                                }}
                            >
                                <HStack alignItems={'center'} space={2}>
                                    <ShareIcon />
                                    <Text fontSize={'14px'} fontWeight={600} color={'black'}>
                                        {t('certificate.seeAccountHistory')}
                                    </Text>
                                </HStack>
                            </Button>
                        </HStack>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default CredentialVerify;

const styles = StyleSheet.create({
    gradient: {
        borderRadius: 8,
        padding: 1,
    },
});
