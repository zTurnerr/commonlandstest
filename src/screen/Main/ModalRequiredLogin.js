import useTranslate from '../../i18n/useTranslate';
/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import { useNavigation } from '@react-navigation/core';
import { Modal, Text } from 'native-base';
import React from 'react';
import Button from '../../components/Button';

export default function Index({ isOpen = false, onClose }) {
    const navigate = useNavigation();
    const t = useTranslate();
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Content>
                <Modal.Body justifyContent="center" alignItems="center" p="20px">
                    <Text mt="20px" fontWeight="bold" fontSize="18px">
                        {t('others.identificationRequired')}
                    </Text>
                    <Text fontSize="14px" mt="4px" textAlign="center">
                        {t('others.becomeMember')}
                    </Text>
                    <Button
                        _container={{
                            mt: '40px',
                        }}
                        onPress={() => {
                            navigate.navigate('Welcome');
                        }}
                    >
                        {t('others.getMeIn')}
                    </Button>
                </Modal.Body>
            </Modal.Content>
        </Modal>
    );
}
