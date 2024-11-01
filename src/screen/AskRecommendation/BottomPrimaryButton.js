import { Box, HStack, Text } from 'native-base';
import React from 'react';
import Button from '../../components/Button';

const BottomPrimaryButton = ({
    title,
    onPress,
    isDisabled,
    isLoading,
    Icon,
    _text,
    error,
    ...other
}) => {
    return (
        <Box px={'20px'} py={'30px'} bgColor={'white'} shadow={9}>
            {error?.length > 0 && (
                <Text color={'red.500'} textAlign={'center'} mb={'10px'}>
                    {error}
                </Text>
            )}
            <Button
                onPress={onPress}
                isDisabled={isDisabled}
                isLoading={isLoading}
                bgColor={'primary.600'}
                _pressed={{ bgColor: 'primary.700' }}
                {...other}
            >
                <HStack alignItems={'center'} justifyContent={'center'} space={3}>
                    {Icon}
                    {title && (
                        <Text fontWeight={700} fontSize={14} color={'white'} {..._text}>
                            {title}
                        </Text>
                    )}
                </HStack>
            </Button>
        </Box>
    );
};

export default BottomPrimaryButton;
