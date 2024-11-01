import useTranslate from '../../i18n/useTranslate';
/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import { Modal, Text } from 'native-base';
import React from 'react';
import Button from '../../components/Button';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';

export default function Index({ isOpen = false, onClose }) {
    const { mapReducer } = useShallowEqualSelector((state) => ({
        mapReducer: state.map,
    }));
    const t = useTranslate();
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Content>
                <Modal.Body justifyContent="center" alignItems="center" p="20px">
                    <Text mt="20px" fontWeight="bold" fontSize="18px">
                        {t('others.landRegistryLimit')}
                    </Text>
                    <Text fontSize="14px" mt="4px" textAlign="center">
                        {t('others.cannotCreateMore')} {mapReducer.limitPlot} {t('others.plots')}.
                    </Text>
                    <Button
                        _container={{
                            mt: '40px',
                        }}
                        onPress={() => {
                            onClose();
                        }}
                    >
                        {t('button.ok')}
                    </Button>
                </Modal.Body>
            </Modal.Content>
        </Modal>
    );
}
