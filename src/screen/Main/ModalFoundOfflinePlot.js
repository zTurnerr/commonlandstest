import useTranslate from '../../i18n/useTranslate';
/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import React, { useEffect } from 'react';
import { Text, Modal, useDisclose, useTheme, Box } from 'native-base';
import Button from '../../components/Button';
import { getStorage } from '../../util/Constants';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import { Open } from '../../components/Icons';
import { useNavigation } from '@react-navigation/native';
export default function Index() {
    const navigation = useNavigation();
    const user = useShallowEqualSelector((state) => state.user);
    const { isOpen, onOpen, onClose } = useDisclose();
    const t = useTranslate();

    const { colors } = useTheme();

    const fetchOfflinePlots = async () => {
        const _data = await getStorage('offline-plot');
        if (_data) {
            let jsonData = JSON.parse(_data);
            if (jsonData?.length > 0) {
                onOpen();
            }
        }
    };

    useEffect(() => {
        if (user?.userInfo?.isTrainer) {
            fetchOfflinePlots();
        }
    }, [user?.userInfo]);
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Content>
                <Modal.Body justifyContent="center" alignItems="center" p="20px">
                    <Box mt="12px" bg="primary.100" p="12px" borderRadius="12px">
                        <Open color={colors.primary[600]} />
                    </Box>
                    <Text mt="20px" fontWeight="bold" fontSize="18px" mb={'10px'}>
                        {t('offlineMaps.OfflinePlots')}
                    </Text>
                    <Text fontSize="14px" mt="4px" textAlign="center">
                        {t('offlineMaps.foundOfflinePlotsDesc')}
                    </Text>
                    <Button
                        _container={{
                            mt: '40px',
                        }}
                        onPress={() => {
                            navigation.navigate('OfflineMap');
                            onClose();
                        }}
                    >
                        {t('button.goToOfflinePlots')}
                    </Button>
                </Modal.Body>
            </Modal.Content>
        </Modal>
    );
}
