import { Box, CloseIcon, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import Modal from 'react-native-modal';
import { EVENT_NAME } from '../../constants/eventName';
import useTranslate from '../../i18n/useTranslate';
import ImageWithLoading from '../ImageWithLoading/ImageWithLoading';
import SignerItem from './SignerItem';

export const useModalContractSigner = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSigner, setSelectedSigner] = useState({});

    const open = (signer) => {
        setIsOpen(true);
        setSelectedSigner(signer);
    };

    const close = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        let listener = EventRegister.addEventListener(EVENT_NAME.viewCreatorPhotoOfFace, (data) => {
            open(data);
        });
        return () => {
            EventRegister.removeEventListener(listener);
        };
    }, []);

    const Component = ({ contract }) => {
        return (
            <ModalContractSigner
                isOpen={isOpen}
                onClose={close}
                selectedSigner={selectedSigner}
                contract={contract}
            />
        );
    };

    return {
        Component,
        open,
        close,
        selectedSigner,
        setSelectedSigner,
    };
};

export default function ModalContractSigner({
    isOpen,
    onClose,
    selectedSigner = {},
    contract = {},
}) {
    const t = useTranslate();

    const getAvt = () => {
        let signer = contract?.signers?.find(
            (item) => item?.user?._id === selectedSigner?.receiver?._id,
        );
        if (!signer) {
            if (selectedSigner?.receiver?._id === contract?.creator?.user?._id) {
                return contract?.creator?.pof;
            }
        }
        if (!signer) {
            if (!isOpen) {
                return null;
            }
            setTimeout(() => {
                EventRegister.emit(EVENT_NAME.refreshContract);
            }, 5000);
        }
        return signer?.pof;
    };
    return (
        <Modal isVisible={isOpen} safeAreaTop={true}>
            <Box
                justifyContent="center"
                alignItems="center"
                py="20px"
                borderRadius="8px"
                bgColor="white"
                mt="auto"
            >
                <Box zIndex={1} position={'absolute'} top="15px" right={'15px'}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <CloseIcon />
                    </TouchableOpacity>
                </Box>
                <Box mt="10px" w="full">
                    <SignerItem
                        info={selectedSigner}
                        contract={contract}
                        _container={{
                            px: '20px',
                            pb: '0px',
                        }}
                    />
                    <Box w="full" bg="gray.400" h="1px"></Box>
                    <Box p="20px">
                        <Text fontWeight={600} mb="15px">
                            {t('contract.photoOfFace2')}
                        </Text>
                        <Box w="full" h="330px">
                            <ImageWithLoading uri={getAvt()} h="full" resizeMode="cover" />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}

const styles = StyleSheet.create({
    closeButton: {
        padding: 5,
    },
});
