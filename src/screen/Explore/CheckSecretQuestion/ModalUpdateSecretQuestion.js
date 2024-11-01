import useTranslate from '../../../i18n/useTranslate';
import { Box, Text } from 'native-base';
import React, { useState } from 'react';

import Button from '../../../components/Button';
import Modal from 'react-native-modal';
import SelectSecretQuestion from '../../../components/SelectSecretQuestion';
import { updateSecretQuestionToUser } from '../../../rest_client/apiClient';

export default function Index({ isOpen, onClose }) {
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
            await updateSecretQuestionToUser({
                questionID: data.secretQuestion,
                answer: data.secretAnswer,
            });
            onClose();
        } catch (err) {
            setError(err);
        } finally {
            setRequesting(false);
        }
    };
    const t = useTranslate();
    return (
        <Modal isVisible={isOpen} safeAreaTop={true}>
            <Box
                justifyContent="center"
                alignItems="center"
                p="16px"
                borderRadius="8px"
                bgColor="white"
                pb="26px"
            >
                <Text fontWeight="bold" fontSize="16px">
                    {t('explore.updateSecurityQuestion')}
                </Text>
                <SelectSecretQuestion onChange={setData} data={data} isDisabled={false} />
                <Text color="error.400">{error}</Text>
                <Button
                    isLoading={requesting}
                    onPress={submit}
                    isDisabled={requesting || !data.secretAnswer}
                >
                    {t('button.save')}
                </Button>
            </Box>
        </Modal>
    );
}
