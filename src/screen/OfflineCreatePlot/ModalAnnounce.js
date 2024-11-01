import { useNavigation } from '@react-navigation/native';
import { t } from 'i18next';
import { Box, Stack, Text, useTheme } from 'native-base';
import React from 'react';
import Modal from 'react-native-modal';
import Button from '../../components/Button';
import { MaximizeIcon } from '../../components/Icons';

const ModalAnnounce = ({ isOpen, onClose }) => {
    const theme = useTheme();
    const navigate = useNavigation();

    return (
        <Modal isVisible={isOpen} onBackdropPress={onClose}>
            <Box p={'20px'} bgColor={'white'} borderRadius={'16px'}>
                <Stack alignItems={'center'}>
                    <Box
                        p={'7px'}
                        backgroundColor={theme.colors.primary[200]}
                        borderRadius={'12px'}
                    >
                        <MaximizeIcon color={theme.colors.primary[600]} />
                    </Box>

                    <Text textAlign={'center'} fontWeight={'600'} fontSize={'16px'} mt={5}>
                        {t('offlineMaps.plotSaved')}
                    </Text>
                    <Text textAlign={'center'} mt={2} mb={2}>
                        {t('offlineMaps.plotWillUpload')}
                    </Text>

                    <Button
                        onPress={() => navigate.navigate('MyOfflinePlot')}
                        _container={{ w: 'full', mt: 5 }}
                        bgColor={'primary.600'}
                        _pressed={{ bgColor: 'primary.700' }}
                    >
                        {t('plot.goToPlots')}
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
};

export default ModalAnnounce;
