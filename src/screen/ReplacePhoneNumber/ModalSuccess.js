import useTranslate from '../../i18n/useTranslate';
import { Box, Text } from 'native-base';

import Button from '../../components/Button';
import Modal from 'react-native-modal';
import React from 'react';
import { useNavigation } from '@react-navigation/core';

export default function Index({ isOpen, onClose }) {
    const navigation = useNavigation();
    const t = useTranslate();
    return (
        <Modal isVisible={isOpen} safeAreaTop={true}>
            <Box
                justifyContent="center"
                alignItems="center"
                p="20px"
                borderRadius="8px"
                bgColor="white"
            >
                <Box w="full" alignItems="center">
                    <Text mb="8px" color="black" fontWeight="bold" fontSize="18px">
                        {t('plot.congratulations')}!
                    </Text>
                    <Text mb="32px">{t('components.changePhoneSuccess')}</Text>
                    <Button
                        onPress={() => {
                            onClose();
                            navigation.navigate('Login', { updateListAccount: true });
                        }}
                    >
                        {t('auth.goToSignIn')}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
