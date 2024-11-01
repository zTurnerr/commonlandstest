import useTranslate from '../i18n/useTranslate';
import { Box, Text, useTheme } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Button from '../components/Button';

const GroupButton = ({
    onCancel,
    onPress,
    isDisabled = false,
    width = '86%',
    title,
    mb = '14px',
    hideCancel = false,
    horizontal = false,
    loading = false,
    containerStyle = {},
    primaryBtnStyle = {},
}) => {
    const theme = useTheme();

    const t = useTranslate();
    return (
        <Box mb={mb} {...containerStyle}>
            {horizontal ? (
                <Box
                    alignSelf={'center'}
                    mb={'18px'}
                    w={'92%'}
                    flexDir="row"
                    justifyContent="space-between"
                    mt={'auto'}
                >
                    <Button onPress={onCancel} _container={{ w: '48%' }} variant="outline">
                        {t('button.cancel')}
                    </Button>
                    <Button
                        isDisabled={isDisabled}
                        isLoading={loading}
                        _container={{ w: '48%' }}
                        onPress={onPress}
                    >
                        {title}
                    </Button>
                </Box>
            ) : (
                <>
                    <Button
                        isLoading={loading}
                        _container={{
                            mt: '40px',
                            w: width,
                            alignSelf: 'center',
                            ...primaryBtnStyle,
                        }}
                        textColor={theme.colors.white}
                        isDisabled={isDisabled}
                        onPress={onPress}
                    >
                        {title}
                    </Button>
                    {!hideCancel && (
                        <TouchableOpacity onPress={onCancel}>
                            <Text
                                mt={'20px'}
                                textAlign={'center'}
                                fontWeight={'700'}
                                fontSize={'14px'}
                                color={theme.colors.appColors.primary}
                            >
                                {t('button.cancel')}
                            </Text>
                        </TouchableOpacity>
                    )}
                </>
            )}
        </Box>
    );
};

export default GroupButton;
