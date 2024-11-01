import {
    Actionsheet,
    Box,
    Center,
    ChevronDownIcon,
    CloseIcon,
    Divider,
    HStack,
    Radio,
    ScrollView,
    Spinner,
    Text,
    useDisclose,
} from 'native-base';
import React, { useEffect, useState } from 'react';
import useTranslate from '../../i18n/useTranslate';
import { getViewCertificationByPlot, requestLandCertificate } from '../../rest_client/apiClient';

import { TouchableOpacity } from 'react-native';
import Share from 'react-native-share';
import Button from '../../components/Button';
import Header from '../../components/Header';
import { DownloadIcon2, FileShield, ShareIcon } from '../../components/Icons';
import PdfComponent from '../../components/Pdf';
import { getUserCert } from '../../rest_client/apiClient';
import CertOption from './CertOption';
import DownloadingModal from './DownloadingModal';
import useDownloadCertToDevice from '../../hooks/Certificate/useDownloadCertToDevice';
import useWaiting from '../../hooks/useWaiting';
import { useRoute } from '@react-navigation/native';
import BlockchainLoadingSection from '../../components/Loading/BlockchainLoadingSection';

let fileNameObj = {};

function getFileName(plotName, isDownload = false) {
    let res = `Plot_${plotName}_commonlands_certificate`;
    if (!isDownload) {
        return res;
    }
    if (fileNameObj[res]) {
        fileNameObj[res] += 1;
        res = `Plot_${plotName}_commonlands_certificate(${fileNameObj[res]})`;
    } else {
        fileNameObj[res] = 1;
    }
    return res;
}

let timeout = null;
export default function Index() {
    const t = useTranslate();
    const pdfRef = React.useRef(null);
    const param = useRoute().params;
    const [pdfURL, setPdfURL] = useState(null);
    const [requesting, setRequesting] = useState(true);
    const [loading, setLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclose();
    const [selectedCert, setSelectedCert] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [certWithClaimant, setCertWithClaimant] = useState(null);
    const [certList, setCertList] = useState([]);
    const [base64Data, setBase64Data] = useState(null);
    const downloadCertToDeviceHook = useDownloadCertToDevice();
    const waitingHook = useWaiting(30000);
    const onSelectCert = (index) => {
        setSelectedIndex(index);
    };

    const onConfirm = () => {
        setSelectedCert(certList[selectedIndex]);
        onClose();
    };

    async function getAllCert() {
        try {
            setRequesting(true);
            const { data } = await getUserCert();
            setCertList(data);
            let nData = data;
            if (nData.length) {
                if (!param?.plotID) {
                    setSelectedIndex(0);
                    setSelectedCert(nData[0]);
                } else {
                    let index = nData.findIndex((item) => item._id === param.plotID);
                    if (index !== -1) {
                        setSelectedIndex(index);
                        setSelectedCert(nData[index]);
                    }
                }
            }
            setRequesting(false);
        } catch (error) {
            console.log('err', error);
            setRequesting(false);
        }
    }
    const _getViewCertificationByPlot = async (plotId) => {
        if (timeout) {
            clearTimeout(timeout);
        }
        try {
            setLoading(true);
            setPdfURL(null);
            const res = await getViewCertificationByPlot(plotId);
            if (
                res.data?.certificates?.length === 0 ||
                res.data.certificates[0]?.status === 'deprecated'
            ) {
                try {
                    const res2 = await requestLandCertificate(plotId);
                    if (res2.data.message === 'Success') {
                        timeout = setTimeout(() => {
                            _getViewCertificationByPlot(plotId);
                        }, 10000);
                    }
                } catch (error) {
                    timeout = setTimeout(() => {
                        _getViewCertificationByPlot(plotId);
                    }, 10000);
                }
                return;
            }
            let data = res.data.certificates[0];
            setCertWithClaimant(data);
            setPdfURL(data.pdfURL);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log('getViewCertificationByPlot', error);
        }
    };
    useEffect(() => {
        waitingHook.resetWaiting();
    }, [selectedCert]);

    useEffect(() => {
        if (selectedCert !== null) {
            _getViewCertificationByPlot(selectedCert._id);
        }
        setBase64Data(null);
    }, [selectedCert]);
    useEffect(() => {
        if (timeout) {
            clearTimeout(timeout);
        }
        getAllCert();
        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    }, []);
    return (
        <Box h="full">
            <DownloadingModal isOpen={downloadCertToDeviceHook.downloading} />
            <Header title={t('profile.myCertificate')}>
                {certList.length > 0 && (
                    <TouchableOpacity
                        onPress={() => {
                            onOpen();
                        }}
                    >
                        <HStack
                            space={2}
                            bg={'primary.200'}
                            mr="13px"
                            py="5px"
                            px="15px"
                            alignItems={'center'}
                            borderRadius={'32px'}
                        >
                            <Text fontSize={'12px'} fontWeight={500}>
                                {selectedCert?.name}
                            </Text>
                            <ChevronDownIcon size="10px" />
                        </HStack>
                    </TouchableOpacity>
                )}
            </Header>
            <Box flex={1} bg="muted.400">
                {requesting && !loading && (
                    <Center flex={1}>
                        <Text mt="12px" fontWeight="bold">
                            {t('certificate.certificateLoading')}...
                        </Text>
                    </Center>
                )}
                {!loading && !requesting && certList.length === 0 && (
                    <Center flex={1}>
                        <Center al bgColor="#5EC4AC1A" w="50px" h="50px" borderRadius="12px">
                            <FileShield color="#5EC4AC" />
                        </Center>
                        <Text mt="12px" fontWeight="bold">
                            {t('certificate.certificateNoIssued')}
                        </Text>
                    </Center>
                )}
                {Boolean(pdfURL) && (
                    <Box borderTopWidth="2px" flex={1} borderTopColor="muted.400">
                        <PdfComponent
                            setBase64={setBase64Data}
                            pdfRef={pdfRef}
                            url={pdfURL}
                            mt="0px"
                            cert={certWithClaimant}
                        />
                    </Box>
                )}
                {loading && (
                    <Center h="80%" px="10%">
                        {waitingHook.overLimit ? (
                            <BlockchainLoadingSection />
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
                {/* </ScrollView> */}
            </Box>
            {Boolean(base64Data) && (
                <Box px="20px" pb="15px" mt="25px" w="full">
                    <HStack
                        isAttached
                        variant="solid"
                        size={'sm'}
                        bg="white"
                        borderRadius={'12px'}
                        position={'relative'}
                        space={2}
                        alignItems={'center'}
                        w="full"
                    >
                        <Button
                            variant="outline"
                            borderColor="white"
                            flex={1}
                            onPress={() => {
                                downloadCertToDeviceHook.onDownload(pdfURL, selectedCert);
                            }}
                        >
                            <HStack alignItems={'center'} space={2}>
                                <DownloadIcon2 color="black" />
                                <Text fontSize={'14px'} fontWeight={600} color={'black'}>
                                    {t('button.download')}
                                </Text>
                            </HStack>
                        </Button>
                        <Divider bg="border.1" orientation="vertical" thickness="1px" h="35px" />
                        <Button
                            onPress={() => {
                                Share.open({
                                    url: 'data:application/pdf;base64,' + base64Data,
                                    type: 'application/pdf',
                                    filename: getFileName(selectedCert.name),
                                });
                            }}
                            variant="outline"
                            borderColor="white"
                            flex={1}
                        >
                            <HStack alignItems={'center'} space={2}>
                                <ShareIcon />
                                <Text fontSize={'14px'} fontWeight={600} color={'black'}>
                                    {t('button.share')}
                                </Text>
                            </HStack>
                        </Button>
                    </HStack>
                </Box>
            )}
            <Actionsheet isOpen={isOpen} onClose={onClose}>
                <Actionsheet.Content>
                    <Box position={'absolute'} top="15px" right="15px">
                        <TouchableOpacity onPress={onClose}>
                            <Box p="5px">
                                <CloseIcon size="5" />
                            </Box>
                        </TouchableOpacity>
                    </Box>
                    <Box pb="30px" w="full" pl="20px">
                        <Text fontSize={'16px'} fontWeight={700} textAlign={'left'}>
                            {t('certificate.certificates')}
                        </Text>
                    </Box>
                    <ScrollView maxH={'100%'} w="full">
                        <Radio.Group
                            name="cert list"
                            accessibilityLabel="select an option"
                            value={selectedIndex}
                            aria-label="radio group"
                            onChange={(value) => setSelectedIndex(value)}
                        >
                            {certList.map((item, index) => {
                                return (
                                    <CertOption
                                        key={index}
                                        onPress={() => onSelectCert(index)}
                                        index={index}
                                        data={item}
                                    />
                                );
                            })}
                        </Radio.Group>
                    </ScrollView>
                    <Box w="full" pt="30px">
                        <Button onPress={onConfirm}>{t('button.confirm')}</Button>
                    </Box>
                </Actionsheet.Content>
            </Actionsheet>
        </Box>
    );
}
