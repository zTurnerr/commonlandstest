import { useNavigation } from '@react-navigation/native';
import { Box, Image, Text, VStack, useTheme } from 'native-base';
import React, { useRef, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../../components/Button';
import Camera from '../../../components/Camera';
import HeaderPage from '../../../components/HeaderPage';
import useTranslate from '../../../i18n/useTranslate';
import bottomLeft from '../../../images/bottomLeft.png';
import bottomRight from '../../../images/bottomRight.png';
import topLeft from '../../../images/topLeft.png';
import topRight from '../../../images/topRight.png';

const v = -10;
export default function CreatorTakePhoto(props) {
    const { onSubmitImage } = props.route.params;
    const camera = useRef();
    const navigation = useNavigation();
    const [takingPic, setTakingPic] = useState(false);
    const [img, setImg] = useState('');

    const [, setReady] = useState(false);
    const theme = useTheme();
    let {
        submitButton = {
            label: t('button.submit'),
        },
        _container = {},
        isDisabled = false,
        children,
        // handleSubmit,
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

    const t = useTranslate();
    return (
        <Box flex={1}>
            <HeaderPage
                onPress={() => {
                    props.navigation.goBack();
                }}
                title={t('contract.takePhotoOfFace')}
            />
            <Box flex={1} w="full" alignItems="center" p="12px" bg="white" {..._container}>
                <Box mt="20%" alignItems={'center'}>
                    {img ? (
                        <Box
                            h="270px"
                            width="270px"
                            borderWidth="1px"
                            borderRadius="12px"
                            borderColor={theme.input.borderColor}
                            overflow="hidden"
                        >
                            <Image source={{ uri: img?.uri }} alt="img" w="full" h="full" />
                        </Box>
                    ) : (
                        <>
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
                        </>
                    )}
                </Box>
                <Box mb="20px">
                    {!img && (
                        <Text mt="32px" textAlign="center" width="270px">
                            {t('contract.placeYourPhone')}
                        </Text>
                    )}
                </Box>
                {children}
                <Box w="full" justifyContent={'center'} flex={1} flexDirection="row" mb="32px">
                    {img ? (
                        <VStack w="full" alignItems={'center'} justifyContent={'space-between'}>
                            <Button
                                onPress={() => setImg('')}
                                variant="outline"
                                _container={{
                                    mr: '12px',
                                    width: '150px',
                                }}
                                color="primary"
                                isDisabled={isDisabled}
                            >
                                {t('button.retake')}
                            </Button>
                            <Button
                                _container={{
                                    width: 'full',
                                }}
                                isDisabled={isDisabled}
                                isLoading={submitButton.isLoading}
                                onPress={() => {
                                    onSubmitImage(img.uri);
                                    navigation.goBack();
                                }}
                            >
                                {t('button.acceptAndSign')}
                            </Button>
                        </VStack>
                    ) : (
                        <TouchableOpacity onPress={takePicture} disabled={takingPic}>
                            <Box
                                bg={theme.colors.buttonPrimary.bgColor}
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
