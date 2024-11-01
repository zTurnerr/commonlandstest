import useTranslate from '../../i18n/useTranslate';
import { Box, Modal, Spinner, Text } from 'native-base';
import React from 'react';

export default function DownloadingModal({ isOpen }) {
    const t = useTranslate();
    return (
        <Modal isOpen={isOpen}>
            <Box bg="white" w="80%" p="35px 100px" borderRadius={'12px'}>
                <Spinner color="primary.500" size={32} />
                <Text textAlign={'center'} mt="5px" fontWeight={600} fontSize={'14px'}>
                    {t('certificate.downloading')}...
                </Text>
            </Box>
        </Modal>
    );
}
