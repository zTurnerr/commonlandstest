import { Box, Button, Modal, Text } from 'native-base';
import React from 'react';
import useTranslate from '../../i18n/useTranslate';

/**
 * @description ConfirmModal component
 * @typedef {{
 * isOpen?: boolean
 * title?: string
 * description?: string
 * onClose?: () => void
 * onConfirm?: () => void
 * onCancel?: () => void
 * confirmText: string
 * cancelText: string
 * icon?: React.ReactNode
 * colorScheme?: import('native-base/lib/typescript/components/types/utils').ColorSchemeType
 * isLoading?: boolean
 * error?: string
 * okColor?: import('native-base/lib/typescript/components/types/utils').ColorSchemeType
 * }} ConfirmModalProps
 * @param {ConfirmModalProps} props
 * @returns {JSX.Element}
 */
export default function ConfirmModal({
    isOpen,
    title,
    description,
    onClose,
    onConfirm,
    onCancel,
    confirmText,
    cancelText,
    icon,
    colorScheme = 'primary',
    isLoading,
    error,
    okColor,
}) {
    const t = useTranslate();

    confirmText = confirmText || t('button.confirm');
    cancelText = cancelText || t('button.cancel');

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Content py="20px" borderRadius="2xl">
                <Modal.Body>
                    {icon && (
                        <Box alignItems="center" mb="20px">
                            <Box
                                w="48px"
                                h="48px"
                                bg={`${colorScheme}.100`}
                                borderRadius="xl"
                                alignItems="center"
                                justifyContent="center"
                            >
                                {icon}
                            </Box>
                        </Box>
                    )}
                    {title && (
                        <Text
                            fontSize="16px"
                            fontWeight="700"
                            textAlign="center"
                            lineHeight="22px"
                            mb="12px"
                        >
                            {title}
                        </Text>
                    )}
                    {description && (
                        <Text fontSize="14px" textAlign="center" lineHeight="20px" mb="31px">
                            {description}
                        </Text>
                    )}
                    {error && (
                        <Text
                            fontSize="12px"
                            textAlign="center"
                            color="error.600"
                            mb="20px"
                            mt="-20px"
                        >
                            {error}
                        </Text>
                    )}
                    <Button.Group direction="column" space="12px">
                        {onConfirm && (
                            <Button
                                colorScheme={
                                    okColor
                                        ? okColor
                                        : colorScheme === 'error'
                                          ? 'buttonError'
                                          : colorScheme
                                }
                                isLoading={isLoading}
                                onPress={onConfirm}
                            >
                                {confirmText}
                            </Button>
                        )}
                        {onCancel && (
                            <Button variant="outline" onPress={onCancel}>
                                {cancelText}
                            </Button>
                        )}
                    </Button.Group>
                </Modal.Body>
            </Modal.Content>
        </Modal>
    );
}
