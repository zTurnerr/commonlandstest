import { Box, Text } from 'native-base';
import React from 'react';
import ReactNativeModal from 'react-native-modal';
import Button from '../../components/Button';
import useTranslate from '../../i18n/useTranslate';

const ModalDeleteOffPlot = ({ isOpen, onClose, onPressDelete }) => {
    const t = useTranslate();

    const onPress = () => {
        if (onPressDelete) {
            onPressDelete();
        }
        onClose();
    };

    return (
        <ReactNativeModal
            isVisible={isOpen}
            onBackdropPress={onClose}
            animationIn={'zoomIn'}
            animationOut={'zoomOut'}
        >
            <Box p="20px" borderRadius="16px" bgColor="white">
                <Text fontWeight={600} fontSize={16}>
                    {t('offlineMaps.deleteOfflinePlot')}
                </Text>
                <Text>{t('offlineMaps.deleteOfflinePlotDesc')}</Text>
                <Box justifyContent={'space-between'} flexDir={'row'} mt={5}>
                    <Button
                        onPress={onClose}
                        variant="outline"
                        _container={{
                            w: '48%',
                        }}
                    >
                        {t('button.cancel')}
                    </Button>
                    <Button
                        onPress={onPress}
                        bgColor="primary.600"
                        _container={{
                            w: '48%',
                        }}
                        _pressed={{ bgColor: 'primary.700' }}
                    >
                        {t('button.save')}
                    </Button>
                </Box>
            </Box>
        </ReactNativeModal>
    );
};

export default ModalDeleteOffPlot;
