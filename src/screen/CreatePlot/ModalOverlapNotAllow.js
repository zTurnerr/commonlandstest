import { Box, Text } from 'native-base';
import React from 'react';
import ReactNativeModal from 'react-native-modal';
import useTranslate from '../../i18n/useTranslate';
import Button from '../../components/Button';

const ModalOverlapNotAllow = ({ isVisible, onPressSubmit, onClose }) => {
    const t = useTranslate();
    return (
        <ReactNativeModal isVisible={isVisible} animationIn={'fadeIn'} animationOut={'fadeOut'}>
            <Box bgColor={'white'} borderRadius={'12px'} p={'20px'}>
                <Text mt="20px" fontWeight="bold" fontSize="18px" textAlign={'center'}>
                    {t('plot.plotOverlapping')}
                </Text>
                <Text fontSize="14px" mt="4px" textAlign="center">
                    {`${t('snap.snapIsEnable')}`}
                </Text>
                <Button
                    _container={{
                        mt: '40px',
                    }}
                    onPress={() => {
                        onPressSubmit && onPressSubmit();
                        onClose();
                    }}
                >
                    {t('button.ok')}
                </Button>
            </Box>
        </ReactNativeModal>
    );
};

export default ModalOverlapNotAllow;
