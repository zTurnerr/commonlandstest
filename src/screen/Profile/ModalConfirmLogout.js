import useTranslate from '../../i18n/useTranslate';
/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import React from 'react';
import { Box, Text, Modal } from 'native-base';
import Button from '../../components/Button';
export default function Index({ isOpen, onClose, logout }) {
    const t = useTranslate();
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Content w="100%" maxW="350px">
                <Box p="20px" alignItems="center">
                    <Text fontWeight="700" fontSize="16px" mb="8px">
                        {t('profile.signOut')}
                    </Text>
                    <Text textAlign="center" color="text.secondary" lineHeight="16px" mb="28px">
                        {`${t('profile.contentSignOut')}`}
                    </Text>

                    <Box flexDirection="row" px="12px">
                        <Button
                            _container={{ w: '130px', mr: '12px' }}
                            variant="outline"
                            onPress={onClose}
                        >
                            {t('button.cancel')}
                        </Button>
                        <Button
                            _container={{
                                w: '130px',
                            }}
                            onPress={logout}
                        >
                            {t('profile.signOut')}
                        </Button>
                    </Box>
                </Box>
            </Modal.Content>
        </Modal>
    );
}
