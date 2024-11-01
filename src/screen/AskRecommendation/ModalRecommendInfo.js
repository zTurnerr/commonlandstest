import { Box, CloseIcon, HStack, Text, useTheme } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import { NotificationSquareIcon } from '../../components/Icons';
import useTranslate from '../../i18n/useTranslate';

const ModalRecommendInfo = ({ isVisible, onClose }) => {
    const { colors } = useTheme();
    const t = useTranslate();
    return (
        <ReactNativeModal isVisible={isVisible} onBackdropPress={onClose}>
            <Box flex={1}>
                <Box flex={1}></Box>
                <Box
                    bgColor={'white'}
                    p={'20px'}
                    pb={'30xpx'}
                    position={'relative'}
                    borderRadius={'12px'}
                >
                    <Box position={'absolute'} top={5} right={5}>
                        <TouchableOpacity onPress={onClose}>
                            <CloseIcon />
                        </TouchableOpacity>
                    </Box>
                    <HStack space={2}>
                        <NotificationSquareIcon color={colors.primary[600]} />
                        <Text fontWeight={500} fontSize={14}>
                            {t('askRecommendation.recommendationDetail')}
                        </Text>
                    </HStack>
                    <Text color={'black:alpha.50'} mt={'20px'}>
                        {t('askRecommendation.recommendationDetailDesc')}
                    </Text>
                </Box>
            </Box>
        </ReactNativeModal>
    );
};

export default ModalRecommendInfo;
