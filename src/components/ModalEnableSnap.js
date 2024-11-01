import { Box, CloseIcon, HStack, Switch, Text, useTheme } from 'native-base';
import React from 'react';
import ReactNativeModal from 'react-native-modal';
import { BlendSnap, InfoCircleRounded } from './Icons';
import useTranslate from '../i18n/useTranslate';
import { TouchableOpacity } from 'react-native';

const ModalEnableSnap = ({ checked, handleToggle, isVisible, onClose, onOpenLearnMore }) => {
    const t = useTranslate();
    const { colors } = useTheme();

    const onClickLearnMore = () => {
        onOpenLearnMore();
        onClose();
    };

    return (
        <>
            <ReactNativeModal isVisible={isVisible} onBackdropPress={onClose}>
                <Box bgColor={'white'} borderRadius={'12px'} position={'relative'}>
                    <Box position={'absolute'} top={4} right={4}>
                        <TouchableOpacity onPress={onClose}>
                            <CloseIcon />
                        </TouchableOpacity>
                    </Box>
                    <Box p={'20px'}>
                        <BlendSnap color={colors.primary[600]} />
                        <Text fontSize={16} fontWeight={700} mt={'12px'} mb={'20px'}>
                            {t('snap.snapping')}
                        </Text>
                        <Text>{t('snap.snapDescription1')}</Text>
                        <Text mt={'10px'} mb={'30px'}>
                            {t('snap.snapDescription2')}
                        </Text>
                        <TouchableOpacity onPress={onClickLearnMore}>
                            <HStack space={1} alignItems={'center'}>
                                <InfoCircleRounded
                                    width="24"
                                    height="24"
                                    color={colors.primary[600]}
                                />
                                <Text
                                    color={'primary.600'}
                                    fontWeight={500}
                                    fontSize={12}
                                    mb={'8px'}
                                >
                                    {t('snap.learnMoreAboutSnapping')}
                                </Text>
                            </HStack>
                        </TouchableOpacity>
                    </Box>
                    <Box h={'1px'} w={'full'} bgColor={'appColors.divider'}></Box>
                    <Box p={'20px'}>
                        <HStack alignItems={'center'}>
                            <Text flex={1} fontWeight={700} fontSize={12}>
                                {t('snap.enableSnapping')}
                            </Text>
                            <Switch size="md" isChecked={checked} onToggle={handleToggle} />
                        </HStack>
                    </Box>
                </Box>
            </ReactNativeModal>
        </>
    );
};

export default ModalEnableSnap;
