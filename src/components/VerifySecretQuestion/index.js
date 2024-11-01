import { Box, Text } from 'native-base';
import React, { useState } from 'react';
import useTranslate from '../../i18n/useTranslate';

import { verifySecretQuestion, verifySecretQuestionWithoutAuth } from '../../rest_client/apiClient';
import Button from '../Button';
import SelectSecretQuestion from '../SelectSecretQuestion';

export default function Index({
    onVerified,
    onCancel,
    noAuth = false,
    phoneNumber = '',
    getData = () => {},
    ...other
}) {
    const [data, setData] = useState({
        secretQuestion: 1,
        secretAnswer: '',
    });
    const [error, setError] = useState(true);
    const [requesting, setRequesting] = useState(false);
    const submit = async () => {
        try {
            setRequesting(true);
            setError('');
            let payload = {
                questionID: data.secretQuestion,
                answer: data.secretAnswer,
            };
            let res = noAuth
                ? await verifySecretQuestionWithoutAuth({ ...payload, phoneNumber })
                : await verifySecretQuestion(payload);

            if (!res.data.isValid) {
                return setError(t('error.invalidSecurity'));
            }
            if (onVerified) {
                onVerified();
                getData(data);
            }
        } catch (err) {
            setError(err?.message ? err.message : err);
        } finally {
            setRequesting(false);
        }
    };

    const t = useTranslate();
    return (
        <Box w="full" {...other}>
            <Text fontSize="14px" fontWeight="bold">
                {t('components.titleQuestions')}
            </Text>
            <Text color="rgba(0, 0, 0, 0.60)">{t('components.contentQuestion')}</Text>
            <SelectSecretQuestion onChange={setData} data={data} />
            <Text mb="16px" color="error.400">
                {error}
            </Text>
            <Box w="full" flexDir="row" justifyContent="space-between">
                {onCancel ? (
                    <Button
                        onPress={onCancel}
                        isDisabled={requesting}
                        _container={{
                            mt: '12px',
                            w: '48%',
                        }}
                        variant="outline"
                    >
                        {t('button.cancel')}
                    </Button>
                ) : null}

                <Button
                    isLoading={requesting}
                    onPress={submit}
                    isDisabled={requesting || !data.secretAnswer}
                    _container={{
                        mt: '12px',
                        w: onCancel ? '48%' : '100%',
                    }}
                >
                    {t('button.verify')}
                </Button>
            </Box>
        </Box>
    );
}
