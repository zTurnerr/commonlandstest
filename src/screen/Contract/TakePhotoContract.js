import useTranslate from '../../i18n/useTranslate';
import { Box, Center, HStack, VStack, Text, Image } from 'native-base';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import HeaderPage from '../../components/HeaderPage';
import CameraTopLeft1 from '../../components/Icons/CameraTopLeft1';
import CameraTopRight1 from '../../components/Icons/CameraTopRight1';
import CameraBottomLeft1 from '../../components/Icons/CameraBottomLeft1';
import CameraBottomRight1 from '../../components/Icons/CameraBottomRight1';
import SnapButton from '../../components/Icons/SnapBtn';
import { useNavigation } from '@react-navigation/native';
import { useCamera } from '../../components/Camera';
import { RNCamera } from 'react-native-camera';

const TakePhotoContract = () => {
    const navigation = useNavigation();
    const cameraHook = useCamera();
    const [imgList, setImgList] = useState([]);

    useEffect(() => {
        if (!cameraHook.img) return;
        if (imgList[imgList.length - 1]?.uri === cameraHook.img.uri) return;
        setImgList([...imgList, cameraHook.img]);
    }, [cameraHook.img]);

    const t = useTranslate();
    return (
        <VStack h="full">
            <HeaderPage
                onPress={() => {
                    navigation.goBack();
                }}
                title={t('contract.takePhoto')}
                isRight={true}
            ></HeaderPage>
            <Box flex={10} bg="gray.300" position={'relative'}>
                {cameraHook.Component({
                    type: RNCamera.Constants.Type.back,
                })}
                <Box position={'absolute'} top="25px" left="25px">
                    <CameraTopLeft1 />
                </Box>
                <Box position={'absolute'} top="25px" right="25px">
                    <CameraTopRight1 />
                </Box>
                <Box position={'absolute'} bottom="25px" left="25px">
                    <CameraBottomLeft1 />
                </Box>
                <Box position={'absolute'} bottom="25px" right="25px">
                    <CameraBottomRight1 />
                </Box>
            </Box>
            <Box flex={3} bg="black">
                <Box flex={1}></Box>
                <HStack
                    position={'relative'}
                    mb="30px"
                    justifyContent={'center'}
                    alignItems={'center'}
                >
                    <TouchableOpacity
                        onPress={() => {
                            cameraHook.takePicture();
                        }}
                    >
                        <Box borderRadius={'100px'} bg={'primary.600'} p="2px">
                            <SnapButton />
                        </Box>
                    </TouchableOpacity>
                    <Box position={'absolute'} left="20px" h="full" p="10px">
                        <TouchableOpacity
                            disabled={imgList.length === 0}
                            onPress={() => {
                                navigation.navigate('ContractUploadPhoto', {
                                    imgList,
                                    setImgList,
                                });
                            }}
                        >
                            <Box borderRadius={'4px'} w="68px" h="68px" bg="gray.300">
                                <Image
                                    source={{ uri: imgList[imgList.length - 1]?.uri }}
                                    alt="image base"
                                    resizeMode="cover"
                                    h="full"
                                    w="full"
                                />
                                <Center
                                    w="25px"
                                    h="25px"
                                    borderWidth={'2px'}
                                    borderColor={'black'}
                                    borderRadius={'1000px'}
                                    position={'absolute'}
                                    right="-10px"
                                    top="-10px"
                                    zIndex={100}
                                    bg="primary.600"
                                >
                                    <Text color="white">{imgList.length}</Text>
                                </Center>
                            </Box>
                        </TouchableOpacity>
                    </Box>
                </HStack>
            </Box>
        </VStack>
    );
};

export default TakePhotoContract;
