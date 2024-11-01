import { Box, Stack, Text, useTheme } from 'native-base';
import useTranslate from '../../i18n/useTranslate';

import { useNavigation } from '@react-navigation/native';
import React from 'react';
import ReactNativeModal from 'react-native-modal';
import Button from '../../components/Button';
import { GlobalRefreshIcon, SignalIcon } from '../../components/Icons';

const CheckUseOfflineMap = ({ isOpen, onClose, status = 'offline' }) => {
    const t = useTranslate();
    const { colors } = useTheme();
    const navigate = useNavigation();

    const content = {
        online: {
            Icon: GlobalRefreshIcon,
            title: t('offlineMaps.internetGoodUseOnline'),
            button: t('button.login'),
        },
        offline: {
            Icon: SignalIcon,
            title: t('offlineMaps.internetPoorUseOffline'),
            button: t('button.useOfflineMaps'),
        },
    };

    const onPressNavigation = () => {
        if (status === 'offline') {
            onClose();
            navigate.navigate('MyOfflinePlot');
        } else {
            navigate.navigate('Login');
        }
    };

    const Icon = content[status].Icon;

    return (
        <ReactNativeModal isVisible={isOpen} onBackdropPress={onClose}>
            <Box borderRadius={'16px'} bgColor={'white'} py={'20px'} px={'15px'}>
                <Stack alignItems={'center'}>
                    <Box px={'10px'} py={'10px'} bgColor={'primary.100'} borderRadius={'12px'}>
                        <Icon color={colors.primary[600]} />
                    </Box>

                    <Text textAlign={'center'} fontWeight={'600'} fontSize={'16px'} mt={5}>
                        {content[status].title}
                    </Text>

                    <Button
                        onPress={onPressNavigation}
                        _container={{ w: 'full', my: 5 }}
                        bgColor={'primary.600'}
                        _pressed={{ bgColor: 'primary.700' }}
                    >
                        {content[status].button}
                    </Button>

                    <Button variant={'outline'} onPress={onClose}>
                        {t('button.close')}
                    </Button>
                </Stack>
            </Box>
        </ReactNativeModal>
    );
};

export default CheckUseOfflineMap;
