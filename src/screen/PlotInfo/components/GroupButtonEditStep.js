import useTranslate from '../../../i18n/useTranslate';
import { Box, Text } from 'native-base';

import Button from '../../../components/Button';
import React from 'react';

export default function Index({ step, updateError, cancelUploadFile, uploadBoundary, requesting }) {
    const t = useTranslate();
    return (
        step === 2 && (
            <Box w="full" px="20px" bottom="0px" py="20px" shadow={1}>
                {updateError ? (
                    <Text mb="12px" color="error.400" textAlign="center">
                        {updateError}
                    </Text>
                ) : null}
                <Box flexDir="row" justifyContent="space-between">
                    <Button
                        isDisabled={requesting}
                        onPress={cancelUploadFile}
                        _container={{ w: '48%' }}
                        variant="outline"
                    >
                        {t('button.cancel')}
                    </Button>
                    <Button
                        isLoading={requesting}
                        isDisabled={requesting}
                        _container={{ w: '48%' }}
                        onPress={uploadBoundary}
                    >
                        {t('button.save')}
                    </Button>
                </Box>
            </Box>
        )
    );
}
