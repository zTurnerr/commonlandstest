import { Box, Stack, Text, useTheme } from 'native-base';
import useTranslate from '../../i18n/useTranslate';

import React from 'react';
import ReactNativeModal from 'react-native-modal';
import Button from '../../components/Button';
import { CloudOffline } from '../../components/Icons';

const ModalCreatePlot = ({ isOpen, onClose, onPressCreatePlot }) => {
    const t = useTranslate();
    const { colors } = useTheme();
    return (
        <ReactNativeModal isVisible={isOpen} onBackdropPress={onClose}>
            <Box borderRadius={'16px'} bgColor={'white'} py={'20px'} px={'15px'}>
                <Stack alignItems={'center'}>
                    <CloudOffline color={colors.primary[600]} />

                    <Text textAlign={'center'} fontWeight={'600'} fontSize={'16px'} mt={5}>
                        {t('offlineMaps.youAreOffline')}
                    </Text>
                    <Text textAlign={'center'} mt={2} mb={2}>
                        {t('offlineMaps.youAreOfflineDesc')}
                    </Text>

                    <Button
                        onPress={() => {
                            onClose();
                            onPressCreatePlot();
                        }}
                        _container={{ w: 'full', my: 5 }}
                        bgColor={'primary.600'}
                        _pressed={{ bgColor: 'primary.700' }}
                    >
                        {t('button.createOfflinePlot')}
                    </Button>

                    <Button variant={'outline'} onPress={onClose}>
                        {t('button.close')}
                    </Button>
                </Stack>
            </Box>
        </ReactNativeModal>
    );
};

export default ModalCreatePlot;
