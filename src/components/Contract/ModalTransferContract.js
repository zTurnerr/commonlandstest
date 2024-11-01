import { Box, Center, HStack, Text } from 'native-base';

import Button from '../../components/Button';
import Modal from 'react-native-modal';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/core';
import useTranslate from '../../i18n/useTranslate';
import FileLock02 from '../Icons/FileLock02';
import UserItem1 from '../UserItem/UserItem1';
import { transferCreatorRight } from '../../rest_client/apiClient';
import { showErr } from '../../util/showErr';
import { EventRegister } from 'react-native-event-listeners';
import { EVENT_NAME } from '../../constants/eventName';

export const useModalTransferContract = () => {
    const [isOpen, setIsOpen] = useState(false);

    const open = () => {
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
    };

    const Component = ({ user, contract }) => {
        return (
            <ModalTransferContract
                contract={contract}
                user={user}
                isOpen={isOpen}
                onClose={close}
            />
        );
    };

    return {
        Component,
        open,
        close,
    };
};

export default function ModalTransferContract({ isOpen, onClose, user, contract }) {
    const navigation = useNavigation();
    const t = useTranslate();
    const [loading, setLoading] = useState(false);

    const onConfirm = async () => {
        setLoading(true);
        try {
            let { data } = await transferCreatorRight(contract?._id, {
                newCreatorId: user?._id,
            });
            onClose();
            setLoading(false);
            navigation.goBack();
        } catch (error) {
            showErr(error);
        }
        setLoading(false);
    };

    return (
        <Modal isVisible={isOpen} safeAreaTop={true}>
            <Box
                justifyContent="center"
                alignItems="center"
                p="20px"
                borderRadius="8px"
                bgColor="white"
            >
                <Center>
                    <Box bg="primary.200" p="10px" borderRadius={'12px'}>
                        <FileLock02 />
                    </Box>
                </Center>
                <Box mt="15px" w="full" alignItems="center">
                    <Text
                        color="black"
                        fontWeight="600"
                        fontSize="16px"
                        textAlign={'center'}
                        mb="15px"
                    >
                        {t('contract.modalTransferTitle', {
                            name: user?.fullName,
                        })}
                    </Text>

                    <Text fontSize={'14px'} textAlign={'center'} color="gray.700">
                        {t('contract.modalTransferContent')}
                    </Text>
                    <Box mt="15px" w="full" mb="20px">
                        <Text mb="15px" fontWeight={600}>
                            {t('others.selectedPerson')}:
                        </Text>
                        <HStack
                            bg="gray.1500"
                            p="5px"
                            borderRadius={'50px'}
                            justifyContent={'space-between'}
                            alignItems={'center'}
                        >
                            <UserItem1 user={{ user: user }} />
                        </HStack>
                    </Box>
                    <Button
                        isLoading={loading}
                        isDisabled={loading}
                        onPress={() => {
                            onClose();
                            onConfirm();
                        }}
                    >
                        {t('button.agreeProceed')}
                    </Button>
                    <Button
                        onPress={() => {
                            onClose();
                        }}
                        mt="14px"
                        variant="outline"
                    >
                        {t('button.cancel')}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
