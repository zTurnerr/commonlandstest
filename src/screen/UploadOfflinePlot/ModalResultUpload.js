import { Box, Progress, Text } from 'native-base';
import React from 'react';
import ReactNativeModal from 'react-native-modal';

const ModalResultUpload = ({ isOpen, message, totalProgress, currentProgress }) => {
    const percent = Math.floor((currentProgress / totalProgress) * 100);

    return (
        <ReactNativeModal isVisible={isOpen} safeAreaTop={true}>
            <Box>
                <Text mb={'10px'} fontWeight={600} color={'white'} textAlign={'center'}>
                    {message}
                </Text>
                <Progress value={percent} />
            </Box>
        </ReactNativeModal>
    );
};

export default ModalResultUpload;
