import useTranslate from '../../i18n/useTranslate';
/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import { Modal, Text } from 'native-base';
import React from 'react';
import Button from '../../components/Button';
export default function Index({ isOpen, onSubmit, onClose, onPressSubmit }) {
    const t = useTranslate();
    return (
        <Modal isOpen={isOpen} safeAreaTop={true} onClose={onClose}>
            <Modal.Content>
                <Modal.Body justifyContent="center" alignItems="center" p="20px">
                    {/* <Box
                        mt="12px"
                        bg="primary.100"
                        p="12px"
                        borderRadius="12px"
                    >
                        <Open color={theme.colors.primary[600]} />
                    </Box> */}
                    <Text mt="20px" fontWeight="bold" fontSize="18px">
                        {t('plot.plotOverlapping')}
                    </Text>
                    <Text fontSize="14px" mt="4px" textAlign="center">
                        {`${t('plot.contentPlotOverlapping')}`}
                    </Text>
                    <Button
                        _container={{
                            mt: '40px',
                        }}
                        onPress={() => {
                            onSubmit && onSubmit(true);
                            onPressSubmit && onPressSubmit();
                            onClose();
                        }}
                    >
                        {t('button.submit')}
                    </Button>
                </Modal.Body>
            </Modal.Content>
        </Modal>
    );
}
