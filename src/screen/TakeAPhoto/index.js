import { Box, Image, Text } from 'native-base';
import React, { useRef, useState } from 'react';
import useTranslate from '../../i18n/useTranslate';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'native-base';
import { TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../components/Button';
import Camera from '../../components/Camera';
import bottomLeft from '../../images/bottomLeft.png';
import bottomRight from '../../images/bottomRight.png';
import topLeft from '../../images/topLeft.png';
import topRight from '../../images/topRight.png';
import { _faceSearch } from '../../util/faceSearch/faceSearch';
import { useModalFaceMatch } from '../../components/Modal/ModalFaceMatch';
import HeaderPage from '../../components/HeaderPage';
const v = -10;
export default function Index(props) {
    const t = useTranslate();
    const camera = useRef();
    const navigation = useNavigation();
    const faceMatchModalHook = useModalFaceMatch();
    const [takingPic, setTakingPic] = useState(false);
    const [img, setImg] = useState('');
    const [loading, setLoading] = useState(false);
    const [matchId, setMatchId] = useState(null);

    const [, setReady] = useState(false);
    const theme = useTheme();
    let {
        submitButton = {
            label: t('button.submit'),
        },
        _container = {},
        isDisabled = false,
        children,
        faceRecognition,
        snapBtnColor = null,
        showHeader = true,
    } = props;
    const takePicture = async () => {
        if (camera.current && !takingPic) {
            let options = {
                quality: 0.85,
                fixOrientation: true,
                forceUpOrientation: true,
            };

            setTakingPic(true);

            try {
                const data = await camera.current.takePictureAsync(options);
                setImg(data);
            } catch (err) {
                return;
            } finally {
                setTakingPic(false);
            }
        }
    };

    return (
        <Box h="full">
            {showHeader && (
                <HeaderPage
                    title={t('components.takeAPhoto')}
                    onPress={() => {
                        if (loading) return;
                        navigation.goBack();
                    }}
                />
            )}
            <Box
                p="12px"
                bg="white"
                flex={1}
                // h="full"
                w="full"
                alignItems="center"
                justifyContent="center"
                {..._container}
            >
                {faceMatchModalHook.Component({
                    onProceed: () => {
                        navigation.navigate('SetPassword', {
                            uri: img.uri,
                            matchId,
                            ...props.route?.params,
                        });
                    },
                })}
                {faceRecognition && (
                    <Text mb="30px" fontSize="14px" textAlign="center" fontWeight="500">
                        {t('replacePhoneNumber.takeAPhoto')}
                    </Text>
                )}
                <Box flex={1} alignItems="center" justifyContent="center">
                    <Box>
                        {img ? (
                            <Box
                                // h="270px"
                                h="full"
                                width="270px"
                                // w="500px"
                                // borderWidth="1px"
                                borderRadius="12px"
                                borderColor={theme.input.borderColor}
                                overflow="hidden"
                            >
                                <Image
                                    source={{ uri: img?.uri }}
                                    alt="img"
                                    w="full"
                                    h="full"
                                    resizeMode="contain"
                                />
                            </Box>
                        ) : (
                            <Box h="270px" w="270px">
                                <Image
                                    position="absolute"
                                    top={`${v}px`}
                                    left={`${v}px`}
                                    source={topLeft}
                                    alt="top-left"
                                />
                                <Image
                                    position="absolute"
                                    top={`${v}px`}
                                    right={`${v}px`}
                                    source={topRight}
                                    alt="top-right"
                                />
                                <Image
                                    position="absolute"
                                    bottom={`${v}px`}
                                    right={`${v}px`}
                                    source={bottomRight}
                                    alt="bottom-right"
                                />
                                <Image
                                    position="absolute"
                                    bottom={`${v}px`}
                                    left={`${v}px`}
                                    source={bottomLeft}
                                    alt="bottom-left"
                                />
                                <Box
                                    h="270px"
                                    width="270px"
                                    borderWidth="1px"
                                    borderRadius="12px"
                                    overflow="hidden"
                                    borderColor="transparent"
                                >
                                    <Camera camera={camera} onCameraReady={() => setReady(true)} />
                                </Box>
                            </Box>
                        )}
                    </Box>

                    <Box mb="20px">
                        {!img && (
                            <Text mt="32px" textAlign="center" width="270px">
                                {t('scanQr.placePhone')}
                            </Text>
                        )}
                    </Box>
                    {children}
                </Box>
                <Box flexDirection="row" paddingTop="32px" paddingBottom="32px">
                    {img ? (
                        <>
                            <Button
                                onPress={() => setImg('')}
                                variant="outline"
                                _container={{
                                    mr: '12px',
                                    width: '150px',
                                }}
                                color="primary"
                                isDisabled={isDisabled || loading || submitButton.isLoading}
                            >
                                {t('button.retake')}
                            </Button>
                            <Button
                                _container={{
                                    width: '150px',
                                }}
                                isDisabled={isDisabled}
                                isLoading={submitButton.isLoading || loading}
                                onPress={async () => {
                                    if (submitButton.onPress) {
                                        return submitButton.onPress(img.uri);
                                    }
                                    // signup flow
                                    setLoading(true);
                                    try {
                                        let data = await _faceSearch(img.uri);
                                        if (data?.match) {
                                            setMatchId(data?.matchWith);
                                            faceMatchModalHook.open();
                                        } else {
                                            navigation.navigate('SetPassword', {
                                                uri: img.uri,
                                                ...props.route?.params,
                                            });
                                        }
                                    } catch (error) {}
                                    setLoading(false);
                                }}
                            >
                                {submitButton.label}
                            </Button>
                        </>
                    ) : (
                        <TouchableOpacity onPress={takePicture} disabled={takingPic}>
                            <Box
                                bg={snapBtnColor || theme.colors.buttonPrimary.bgColor}
                                w="56px"
                                h="56px"
                                borderRadius="28px"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <MaterialCommunityIcons
                                    color={theme.colors.buttonPrimary.color}
                                    name="camera-outline"
                                    size={30}
                                />
                            </Box>
                        </TouchableOpacity>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
