/* eslint-disable react-native/no-inline-styles */
import { useNavigation } from '@react-navigation/native';
import {
    ArrowBackIcon,
    ArrowForwardIcon,
    Box,
    Center,
    Flex,
    HStack,
    Image,
    Spinner,
    Text,
    useTheme,
} from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import HeaderPage from '../../components/HeaderPage';
import LoadingPage from '../../components/LoadingPage';
import PdfComponent from '../../components/Pdf';
import useTranslate from '../../i18n/useTranslate';
import { getAllUserCert, requestLandCertificateByClaimant } from '../../rest_client/apiClient';
import { showErr } from '../../util/showErr';
import useWaiting from '../../hooks/useWaiting';
import useUserInfo from '../../hooks/useUserInfo';
import BlockchainLoadingSection from '../../components/Loading/BlockchainLoadingSection';

let timeout = null;

const ViewCertificate = ({ route }) => {
    const t = useTranslate();
    const navigate = useNavigation();
    const { item } = route?.params || {};
    const user = useUserInfo();
    const theme = useTheme();
    const [loadingImage, setLoadingImage] = useState(true);
    const [certList, setCertList] = useState([]);
    const [fetchingCertList, setFetchingCertList] = useState(true);
    const [certIndex, setCertIndex] = useState(0);
    const [tabIndex, setTabIndex] = useState(0);
    const waitingHook = useWaiting(30000);

    const goBack = () => {
        navigate.goBack();
    };

    const getHeaderTitle = () => {
        return t('contract.signerCert');
    };

    //pdf ref
    const pdfRef = useRef(null);
    // fetch certificate
    const [resCert, setResCert] = useState({});

    const fetchCertList = async () => {
        try {
            let { data } = await getAllUserCert(item?.receiver?._id);
            setCertList(data?.certificates);
        } catch (error) {
            navigate.goBack();
            showErr(error);
        }
        setFetchingCertList(false);
    };

    const fetchCertificate = async (item) => {
        timeout && clearTimeout(timeout);
        try {
            const { data } = await requestLandCertificateByClaimant(item?.claimantId, null, null);
            if (data?.status == 'requesting') {
                timeout = setTimeout(() => {
                    fetchCertificate(item);
                }, 5000);
                return;
            }
            setResCert(data);
        } catch (error) {
            timeout && clearTimeout(timeout);
            timeout = setTimeout(() => {
                fetchCertificate(item);
            }, 5000);
        }
    };
    useEffect(() => {
        // fetchCertificate();
        fetchCertList();
        return () => {
            timeout && clearTimeout(timeout);
        };
    }, []);

    useEffect(() => {
        if (certList.length === 0) return;
        setResCert({});
        fetchCertificate(certList[certIndex]);
        waitingHook.resetWaiting();
    }, [certIndex, certList]);
    // end fetch certificate
    const onChangeTabIndex = (idx) => {
        if (idx !== tabIndex) {
            setTabIndex(idx);
            if (idx === 1) {
                setLoadingImage(true);
            }
        }
    };

    const titleColor =
        tabIndex === 0 ? theme.colors.appColors.primary : theme.colors.appColors.textGrey;
    const titleColorPhoto =
        tabIndex === 1 ? theme.colors.appColors.primary : theme.colors.appColors.textGrey;

    return (
        <Flex flex={1}>
            <HeaderPage
                onPress={goBack}
                title={getHeaderTitle()}
                _container={{
                    zIndex: 100,
                }}
            />
            {fetchingCertList && <LoadingPage />}
            <Box
                pt="10px"
                flexDir={'row'}
                alignItems={'center'}
                justifyContent={'space-between'}
                bg="white"
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.headerItem}
                    onPress={() => onChangeTabIndex(0)}
                >
                    <Text fontSize={'12px'} fontWeight={'600'} color={titleColor} mb={'11px'}>{`${t(
                        'contract.cert',
                    )}`}</Text>
                    <Box
                        w={'100%'}
                        h={'2px'}
                        backgroundColor={
                            tabIndex === 0 ? theme.colors.appColors.primary : 'transparent'
                        }
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.headerItem}
                    onPress={() => onChangeTabIndex(1)}
                >
                    <Text
                        fontSize={'12px'}
                        fontWeight={'600'}
                        color={titleColorPhoto}
                        mb={'11px'}
                    >{`${t('contract.photoOfFace2')}`}</Text>
                    <Box
                        w={'100%'}
                        h={'2px'}
                        backgroundColor={
                            tabIndex === 1 ? theme.colors.appColors.primary : 'transparent'
                        }
                    />
                </TouchableOpacity>
            </Box>
            {tabIndex === 0 ? (
                <Box flex={1} bg="muted.400">
                    <Box h="85%">
                        {resCert?.pdfURL ? (
                            <PdfComponent cert={resCert} pdfRef={pdfRef} url={resCert?.pdfURL} />
                        ) : (
                            <Center h="80%" px="10%">
                                {waitingHook.overLimit ? (
                                    <BlockchainLoadingSection
                                        isSendNoti={user?._id === item?.receiver?._id}
                                    />
                                ) : (
                                    <>
                                        <Spinner color="primary.500" size={32} />
                                        <Text
                                            mt="10px"
                                            textAlign={'center'}
                                            fontWeight={600}
                                            fontSize={'16px'}
                                        >
                                            {t('certificate.loadingCertificate')}...
                                        </Text>
                                        <Text
                                            mt="5px"
                                            textAlign={'center'}
                                            fontWeight={400}
                                            fontSize={'14px'}
                                        >
                                            {t('certificate.certificateCreated')}
                                        </Text>
                                    </>
                                )}
                            </Center>
                        )}
                    </Box>
                    <HStack
                        bg="backdrop.2"
                        py="40px"
                        flex={1}
                        px="32px"
                        alignItems={'flex-end'}
                        justifyContent={'space-between'}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                setCertIndex((prev) => (prev === 0 ? 0 : prev - 1));
                            }}
                            disabled={certIndex === 0}
                            style={{
                                opacity: certIndex === 0 ? 0.5 : 1,
                            }}
                        >
                            <Center w="40px" h="40px" borderRadius={'1000px'} bg="white">
                                <ArrowBackIcon color={theme.colors.primary[600]} />
                            </Center>
                        </TouchableOpacity>
                        <Center bg="white" px="15px" h="35px" borderRadius={'32px'}>
                            <Text color="black" fontSize={'14px'} fontWeight={700}>
                                {certList.length === 1
                                    ? t('others.countOfItems2', {
                                          count: certIndex + 1,
                                      })
                                    : t('others.countOfItems', {
                                          count: certIndex + 1,
                                          total: certList.length,
                                      })}
                            </Text>
                        </Center>
                        <TouchableOpacity
                            onPress={() => {
                                setCertIndex((prev) =>
                                    prev === certList.length - 1 ? prev : prev + 1,
                                );
                            }}
                            disabled={certIndex === certList.length - 1}
                            style={{
                                opacity: certIndex === certList.length - 1 ? 0.5 : 1,
                            }}
                        >
                            <Center w="40px" h="40px" borderRadius={'1000px'} bg="white">
                                <ArrowForwardIcon color={theme.colors.primary[600]} />
                            </Center>
                        </TouchableOpacity>
                    </HStack>
                </Box>
            ) : (
                <Box flex={1}>
                    <Image
                        alt=""
                        source={{
                            uri: item?.pof,
                        }}
                        w={'100%'}
                        h={'80%'}
                        display={loadingImage ? 'none' : 'flex'}
                        onLoad={() => {
                            setLoadingImage(false);
                        }}
                    />
                    {loadingImage && (
                        <Center flex={1}>
                            <Spinner />
                        </Center>
                    )}
                </Box>
            )}
        </Flex>
    );
};

export default ViewCertificate;

const styles = StyleSheet.create({
    headerItem: {
        justifyContent: 'center',
        width: '50%',
        alignItems: 'center',
    },
});
