import { Box, Center } from 'native-base';
import React from 'react';
import { TouchableOpacity, useWindowDimensions } from 'react-native';
import BlackSnapBtn from '../../Icons/BlackSnapBtn';
import CameraBottomLeft1 from '../../Icons/CameraBottomLeft1';
import CameraBottomRight1 from '../../Icons/CameraBottomRight1';
import CameraTopLeft1 from '../../Icons/CameraTopLeft1';
import CameraTopRight1 from '../../Icons/CameraTopRight1';

const TakePhotoStep = ({
    //  onSubmit = () => { },
    cameraHook = {},
    _cameraContainer = {},
}) => {
    const myRef = React.useRef(null);
    // get width of myRef
    const dim = useWindowDimensions();

    return (
        <Box w="full">
            {/* <Text mt="16px" fontSize={'14px'} fontWeight={500}>
                {`${t('others.step')} 1`}
            </Text>
            <Text color="gray.1800">{t('contract.takePhotoOfFace')}</Text> */}
            <Box
                ref={myRef}
                position={'relative'}
                left="-20px"
                w={dim.width - 40}
                h="330px"
                bg="gray.400"
                mt="15px"
                {..._cameraContainer}
            >
                {cameraHook.Component({})}
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
            <Center mt="30px">
                <TouchableOpacity
                    onPress={() => {
                        cameraHook.takePicture();
                    }}
                >
                    <BlackSnapBtn />
                </TouchableOpacity>
            </Center>
        </Box>
    );
};

export default TakePhotoStep;
