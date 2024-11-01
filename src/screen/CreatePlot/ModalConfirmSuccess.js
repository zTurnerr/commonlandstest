import useTranslate from '../../i18n/useTranslate';
import { Box, Modal, Text } from 'native-base';

import Button from '../../components/Button';
import { Open } from '../../components/Icons';
import React from 'react';
import { useNavigation } from '@react-navigation/core';
import { useTheme } from 'native-base';

export default function Index({
    isOpen,
    description,
    title,
    onPress,
    error,
    Icon,
    buttonText,
    buttonStyle = {},
}) {
    const theme = useTheme();
    const navigate = useNavigation();
    const t = useTranslate();
    return (
        <Modal isOpen={isOpen} safeAreaTop={true}>
            <Modal.Content>
                <Modal.Body justifyContent="center" alignItems="center" p="20px">
                    {error ? (
                        Icon
                    ) : (
                        <Box mt="12px" bg="primary.100" p="12px" borderRadius="12px">
                            <Open color={theme.colors.primary[600]} />
                        </Box>
                    )}
                    <Text mt="20px" fontWeight="bold" fontSize="18px">
                        {title ?? t('contract.congrat')}
                    </Text>
                    <Text fontSize="14px" mt="4px" textAlign={'center'}>
                        {description ?? t('plot.plotSubmitted')}
                    </Text>
                    <Button
                        _container={{
                            mt: '20px',
                        }}
                        onPress={() => {
                            try {
                                if (onPress) {
                                    return onPress();
                                }
                                navigate.navigate('Main', {
                                    screen: 'Plot',
                                });
                            } catch (err) {
                                console.log('log error');
                            }
                        }}
                        {...buttonStyle}
                    >
                        {buttonText ? buttonText : t('plot.goToPlots')}
                    </Button>
                </Modal.Body>
            </Modal.Content>
        </Modal>
    );
}
