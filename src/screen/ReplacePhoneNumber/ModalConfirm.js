import { Box, Stack, Text } from 'native-base';
import React from 'react';
import Modal from 'react-native-modal';
import Button from '../../components/Button';
import EditPen2 from '../../components/Icons/EditPen2';
import useTranslate from '../../i18n/useTranslate';

export default function Index({ isOpen, onClose, onConfirm, isLoading }) {
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
                <EditPen2 />
                <Text
                    textAlign={'center'}
                    my="8px"
                    mb="20px"
                    color="black"
                    fontWeight="500"
                    fontSize="16px"
                >
                    {t('replacePhoneNumber.wantToSubmit')}
                </Text>
                <Stack space={2} direction={'row'} w="full" alignItems="center">
                    <Box flex={1}>
                        <Button
                            onPress={() => {
                                onClose();
                            }}
                            variant="outline"
                        >
                            {t('button.no')}
                        </Button>
                    </Box>
                    <Box flex={1}>
                        <Button
                            isLoading={isLoading}
                            onPress={() => {
                                onConfirm();
                            }}
                        >
                            {t('button.yes')}
                        </Button>
                    </Box>
                </Stack>
            </Box>
        </Modal>
    );
}
