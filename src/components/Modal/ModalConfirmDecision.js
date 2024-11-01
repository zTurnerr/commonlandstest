import { Box, Text } from 'native-base';
import React from 'react';
import ReactNativeModal from 'react-native-modal';
import Button from '../Button';

const ModalConfirmDecision = ({
    Icon,
    title,
    description,
    descriptionStyling,
    isLoading,
    onConfirm,
    onCancel,
    confirmBtnText,
    cancelBtnText,
    isVisible,
    error,
}) => {
    const onCanceling = () => {
        if (!isLoading) {
            onCancel();
        }
    };

    return (
        <ReactNativeModal isVisible={isVisible} onBackdropPress={onCanceling}>
            <Box bgColor={'white'} px={'20px'} pt={'30px'} pb={'20px'} borderRadius={'16px'}>
                {Icon && (
                    <Box justifyContent={'center'} alignItems={'center'} mb={'20px'}>
                        <Icon />
                    </Box>
                )}
                <Text textAlign={'center'} fontWeight={700} fontSize={16}>
                    {title}
                </Text>
                <Text textAlign={'center'} fontSize={14} {...descriptionStyling}>
                    {description}
                </Text>
                {error && (
                    <Text color={'error.400'} textAlign={'center'}>
                        {error}
                    </Text>
                )}
                <Button
                    _container={{ my: '15px', bgColor: 'primary.600' }}
                    onPress={onConfirm}
                    isLoading={isLoading}
                >
                    {confirmBtnText}
                </Button>
                <Button variant="outline" onPress={onCanceling} isDisabled={isLoading}>
                    {cancelBtnText}
                </Button>
            </Box>
        </ReactNativeModal>
    );
};

export default ModalConfirmDecision;
