import { Alert, Box, Button, Center, Slide, Text } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import useTranslate from '../../i18n/useTranslate';

import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { RNCamera } from 'react-native-camera';
import { QRreader } from 'react-native-qr-decode-image-camera';
import IconClose from 'react-native-vector-icons/MaterialCommunityIcons';
import Camera from '../../components/Camera';
import CameraBottomLeftSvg from '../../components/Icons/CameraBottomLeft';
import CameraBottomRightSvg from '../../components/Icons/CameraBottomRight';
import CameraTopLeftSvg from '../../components/Icons/CameraTopLeft';
import CameraTopRightSvg from '../../components/Icons/CameraTopRight';
import LoadingPage from '../../components/LoadingPage';
import bottomLeft from '../../images/bottomLeft.png';
import bottomRight from '../../images/bottomRight.png';
import topLeft from '../../images/topLeft.png';
import topRight from '../../images/topRight.png';
import { requestCertByToken } from '../../rest_client/apiClient';
import { openPicker } from '../../util/Constants';
import { getBackendServer } from '../../rest_client';

const v = -10;

export default function Index({}) {
    const t = useTranslate();

    const camera = useRef();
    const [qrString, setQrString] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigation();
    const [isOpen, setIsOpen] = React.useState(false);

    async function onChoosePhoto() {
        try {
            let image = await openPicker();
            let qr = await QRreader(image[0].uri);
            setQrString(qr);
        } catch (error) {
            let errorStr = JSON.stringify(error);
            if (errorStr.includes('No related')) setIsOpen(true);
        }
    }

    async function onQrChange() {
        if (!qrString) {
            return;
        }
        setLoading(true);
        try {
            if (qrString) {
                if (
                    qrString.indexOf(getBackendServer()) === -1 &&
                    qrString.indexOf('https://map.commonlands.org') === -1
                ) {
                    navigate.navigate('CredentialVerify', {
                        qrString,
                    });
                    setLoading(false);
                    return;
                }
                let { data } = await axios.get(qrString);
                if (data.status == 'deprecated' && !data.activePDF) {
                    requestCertByToken(qrString.split('/').pop(), null, null);
                }

                if (!data) {
                    throw t('error.networkError');
                }

                if (data.error_code) {
                    throw data.error_message;
                }
                navigate.navigate('CredentialVerify', {
                    pdfURL: data?.contract?.url,
                    ...data,
                    qrString,
                });
                setQrString(null);
                setError(null);
            }
        } catch (error) {
            setQrString(null);
            setError(error?.message || error);
        }
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }

    useEffect(() => {
        onQrChange();
    }, [qrString]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                setIsOpen(false);
            }, 3000);
        }
    }, [isOpen]);

    return (
        <Box h="100%" bgColor={'backdrop.1'}>
            {loading && <LoadingPage text="Verifying Certificate..." />}
            <Box position={'absolute'} left="6px" top={'6px'}>
                <TouchableOpacity
                    onPress={() => {
                        navigate.goBack();
                    }}
                >
                    <IconClose name="close" color={'white'} size={25} />
                </TouchableOpacity>
            </Box>
            <Text fontSize={'14px'} textAlign={'center'} mt="54px" color={'white'}>
                {t('scanQr.title')}
            </Text>
            <Box
                // overflow="hidden"
                position={'relative'}
                mt="54px"
                mx="auto"
                borderRadius="16px"
                height={'270px'}
                bgColor={'white'}
                width="270px"
            >
                <Box
                    position="absolute"
                    top={`${v}px`}
                    left={`${v}px`}
                    source={topLeft}
                    alt="top-left"
                >
                    <CameraTopLeftSvg />
                </Box>
                <Box
                    position="absolute"
                    top={`${v}px`}
                    right={`${v}px`}
                    source={topRight}
                    alt="top-right"
                >
                    <CameraTopRightSvg />
                </Box>
                <Box
                    position="absolute"
                    bottom={`${v}px`}
                    right={`${v}px`}
                    source={bottomRight}
                    alt="bottom-right"
                >
                    <CameraBottomRightSvg />
                </Box>
                <Box
                    position="absolute"
                    bottom={`${v}px`}
                    left={`${v}px`}
                    source={bottomLeft}
                    alt="bottom-left"
                >
                    <CameraBottomLeftSvg />
                </Box>

                <Box
                    height={'270px'}
                    width="270px"
                    bgColor={'black'}
                    position={'relative'}
                    borderRadius="16px"
                    overflow={'hidden'}
                >
                    {!loading && (
                        <Camera
                            onBarCodeRead={(e) => {
                                setQrString(e.data);
                            }}
                            type={RNCamera.Constants.Type.back}
                            camera={camera}
                        />
                    )}
                </Box>
            </Box>
            <Text mb="20px" fontSize={'10px'} textAlign={'center'} mt="54px" color={'white'}>
                {t('scanQr.moveCamera')}
            </Text>
            {error && (
                <Text fontSize={'14px'} textAlign={'center'} mt="54px" color={'danger.500'}>
                    {error}
                </Text>
            )}
            {loading && <ActivityIndicator color="white" size={32} />}
            <Center position={'absolute'} bottom={'16px'} left="0" right="0">
                <Button
                    variant={'ghost'}
                    borderColor={'primary.600'}
                    borderWidth={'1px'}
                    borderRadius={'8px'}
                    width={'90%'}
                    onPress={onChoosePhoto}
                    disabled={loading}
                >
                    <Text fontSize={'14px'} fontWeight={700} color={'primary.600'}>
                        {t('scanQr.chooseFromPhotos')}{' '}
                    </Text>
                </Button>
            </Center>
            <Slide in={isOpen} placement="top">
                <Alert justifyContent="center" status="error" safeAreaTop={8}>
                    <Center flexDirection={'row'}>
                        <Alert.Icon />
                        <Text ml="10px" color="error.600" fontWeight="medium">
                            {t('scanQr.invalidQrCode')}
                        </Text>
                    </Center>
                </Alert>
            </Slide>
        </Box>
    );
}
