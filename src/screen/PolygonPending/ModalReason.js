import { Box, CloseIcon, HStack, Text, TextArea, useTheme } from 'native-base';
import React, { useState } from 'react';
import ReactNativeModal from 'react-native-modal';
import { EditPolygonIcon } from '../../components/Icons';
import useTranslate from '../../i18n/useTranslate';
import Button from '../../components/Button';
import { TouchableOpacity } from 'react-native';
import { useEffect } from 'react';

const ModalReason = ({
    isVisible,
    onClose,
    onSubmit,
    inputReason = false,
    info,
    reason,
    loading,
    error,
}) => {
    const t = useTranslate();
    const name = info?.name || 'WGS-888';
    const placeName = info?.placeName || 'Uganda';
    const { colors } = useTheme();
    const [textInputReason, setTextInputReason] = useState(reason || '');

    const onPressClose = () => {
        setTextInputReason('');
        onClose();
    };

    useEffect(() => {
        if (reason) {
            setTextInputReason(reason);
        }
    }, [reason]);

    const onPressSubmit = () => {
        onSubmit(textInputReason);
    };

    return (
        <ReactNativeModal isVisible={isVisible} onBackdropPress={onPressClose}>
            <Box flex={1}>
                <Box flex={1}></Box>
                <Box bgColor={'white'} borderRadius={'12px'} p={'20px'} position={'relative'}>
                    {inputReason ? (
                        <>
                            <HStack>
                                <Box bgColor={'primary.100'} p={'6px'} borderRadius={'full'}>
                                    <EditPolygonIcon color={colors.primary[600]} />
                                </Box>
                            </HStack>
                            <Text fontWeight={500} fontSize={12} mt={'10px'} mb={'10px'}>
                                {t('polygonEditing.rejectEditingDesc')}
                            </Text>
                        </>
                    ) : (
                        <>
                            <HStack>
                                <Box flex={1}>
                                    <Text fontWeight={600} fontSize={14}>
                                        {name}
                                    </Text>
                                    <Text color={'black:alpha.60'} mb={'6px'}>
                                        {placeName}
                                    </Text>
                                </Box>
                                <TouchableOpacity onPress={onPressClose}>
                                    <CloseIcon />
                                </TouchableOpacity>
                            </HStack>
                        </>
                    )}
                    <TextArea
                        my={'10px'}
                        _focus={{ borderColor: 'primary.600' }}
                        placeholder={t('polygonEditing.reasonForDenial')}
                        h={'100px'}
                        value={textInputReason}
                        onChangeText={setTextInputReason}
                        isDisabled={!inputReason}
                        _disabled={{ opacity: 1, bgColor: 'white', color: 'black' }}
                    />
                    {inputReason && (
                        <Box mt={'40px'}>
                            {error?.length > 0 && (
                                <Text
                                    color={'danger.1500'}
                                    fontSize={12}
                                    textAlign={'center'}
                                    mb={'6px'}
                                >
                                    {error}
                                </Text>
                            )}
                            <HStack justifyContent={'space-between'}>
                                <Button
                                    variant={'outline'}
                                    onPress={onPressClose}
                                    _container={{ w: '45%' }}
                                >
                                    {t('button.cancel')}
                                </Button>
                                <Button
                                    bgColor={'primary.600'}
                                    _pressed={{ bgColor: 'primary.700' }}
                                    onPress={onPressSubmit}
                                    _container={{ w: '45%' }}
                                    isLoading={loading === 'submit'}
                                    color="custom"
                                    _loading={{ bgColor: 'primary.600', opacity: 0.8 }}
                                    isDisabled={textInputReason.length === 0}
                                >
                                    <Text fontWeight={700} fontSize={14} color={'white'}>
                                        {t('button.submit')}
                                    </Text>
                                </Button>
                            </HStack>
                        </Box>
                    )}
                </Box>
            </Box>
        </ReactNativeModal>
    );
};

export default ModalReason;
