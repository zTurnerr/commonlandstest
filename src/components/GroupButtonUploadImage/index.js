import useTranslate from '../../i18n/useTranslate';
/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import { Box, Text, useTheme } from 'native-base';
import React, { useState } from 'react';
import { openCamera, openPicker, validateImages } from '../../util/Constants';
import Button from '../Button';
import { UploadImage } from '../Icons';

export default function Index({ icon, title, description, style, onFilesChange = () => {} }) {
    const [error, setError] = useState('');
    const theme = useTheme();

    const selectImage = async () => {
        try {
            setError('');
            let images = await openPicker({
                multiple: true,
            });
            if (!images || !images.length) {
                return;
            }
            validateImages(images);
            onFilesChange(images);
        } catch (err) {
            setError(err?.message || err);
        }
    };

    const startCamera = async () => {
        try {
            let images = await openCamera();
            if (images) {
                validateImages(images);
                onFilesChange(images);
            }
        } catch (err) {
            setError(err?.message || err);
        }
    };

    const t = useTranslate();
    return (
        <Box
            alignItems="center"
            bg="primary.100"
            w="full"
            h="210px"
            mt="24px"
            borderRadius="12px"
            borderColor="primary.600"
            borderWidth="1px"
            style={style}
        >
            <Box mt="24px">{icon ? <UploadImage color={theme.colors.primary[600]} /> : null}</Box>
            {title ? (
                <Text mt="16px" fontWeight="700">
                    {title}
                </Text>
            ) : null}
            {description ? (
                <Text mt="8px" color="#71727A" fontSize="11px">
                    {description}
                </Text>
            ) : null}

            <Box mt="24px" flexDirection="row" justifyContent="center">
                <Button
                    onPress={selectImage}
                    variant="outline"
                    _container={{
                        mr: '12px',
                        w: '130px',
                    }}
                >
                    {t('components.selectPhoto')}
                </Button>
                <Button
                    onPress={startCamera}
                    _container={{
                        w: '130px',
                    }}
                >
                    {t('components.takeAPhoto')}
                </Button>
            </Box>
            <Text mt="12px" color="error.400">
                {error}
            </Text>
        </Box>
    );
}
