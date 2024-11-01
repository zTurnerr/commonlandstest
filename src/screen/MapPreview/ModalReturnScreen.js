import { Box, Text, useTheme } from 'native-base';
import React from 'react';
import ReactNativeModal from 'react-native-modal';
import Button from '../../components/Button';
import useTranslate from '../../i18n/useTranslate';
import { WarningTriangleRounded } from '../../components/Icons';

const ModalReturnScreen = ({ isOpen, onClose }) => {
    const t = useTranslate();
    const { colors } = useTheme();

    return (
        <ReactNativeModal isVisible={isOpen} onBackdropPress={onClose}>
            <Box bg={'white'} p={'20px'} mx={'20px'} borderRadius={'16px'}>
                <Box mx={'auto'} bgColor={'danger.1510'} p={'10px'} borderRadius={'12px'}>
                    <WarningTriangleRounded color={colors.danger[1500]} />
                </Box>

                <Text fontWeight={600} fontSize={16} mt={'20px'} mb={'10px'}>
                    {t('offlineMaps.beyondTheMaximumAllowed')}
                </Text>
                <Text>{t('offlineMaps.beyondTheMaximumAllowedDesc')}</Text>
                <Text>{t('offlineMaps.beyondTheMaximumAllowedDesc2')}</Text>
                <Text mb={'20px'}>{t('offlineMaps.beyondTheMaximumAllowedDesc3')}</Text>
                <Button onPress={onClose} variant="outline">
                    {t('button.close')}
                </Button>
            </Box>
        </ReactNativeModal>
    );
};

export default ModalReturnScreen;
