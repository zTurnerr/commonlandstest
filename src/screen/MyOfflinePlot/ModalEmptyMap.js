import { Box, Stack, Text, useTheme } from 'native-base';
import useTranslate from '../../i18n/useTranslate';

import React from 'react';
import ReactNativeModal from 'react-native-modal';
import Button from '../../components/Button';
import { WarningTriangleRounded } from '../../components/Icons';

const ModalEmptyMap = ({ isOpen, onClose }) => {
    const t = useTranslate();
    const { colors } = useTheme();
    return (
        <ReactNativeModal isVisible={isOpen} onBackdropPress={onClose}>
            <Box borderRadius={'16px'} bgColor={'white'} py={'20px'} px={'15px'}>
                <Stack alignItems={'center'}>
                    <WarningTriangleRounded color={colors.appColors.primaryYellow} />
                    <Text textAlign={'center'} fontWeight={'600'} fontSize={'16px'} mt={5}>
                        {t('offlineMaps.offlineNotFoundOnDevice')}
                    </Text>
                    <Text
                        textAlign={'center'}
                        mt={2}
                        mb={'20px'}
                        color={'gray.700'}
                        maxWidth={'250px'}
                    >
                        {t('offlineMaps.offlineNotFoundDesc')}
                    </Text>

                    <Button variant={'outline'} onPress={onClose}>
                        {t('button.close')}
                    </Button>
                </Stack>
            </Box>
        </ReactNativeModal>
    );
};

export default ModalEmptyMap;
