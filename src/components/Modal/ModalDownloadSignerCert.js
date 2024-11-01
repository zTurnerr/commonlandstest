/* eslint-disable react-native/no-inline-styles */
import { Avatar, Box, Button, Center, HStack, Spinner, Text, Modal } from 'native-base';

import React, { useState } from 'react';
import useTranslate from '../../i18n/useTranslate';
import Download4 from '../Icons/Download4';
import { TouchableOpacity } from 'react-native';

export const useModalDownloadSignerCert = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSigner, setSelectedSigner] = useState({});

    const open = () => {
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
    };

    const onRemoveSigner = () => {
        open();
    };

    const Component = ({
        contract = {},
        downloadPdf = () => {},
        downloadAll = () => {},
        canDownloadAll = false,
        canDownload = () => {},
    }) => {
        return (
            <MemoModal
                isOpen={isOpen}
                onClose={close}
                contract={contract}
                downloadPdf={downloadPdf}
                downloadAll={downloadAll}
                canDownloadAll={canDownloadAll}
                canDownload={canDownload}
            />
        );
    };

    return {
        Component,
        open,
        close,
        selectedSigner,
        setSelectedSigner,
        onRemoveSigner,
    };
};
const PX = '20px';

const SignerItem = ({ signer, onDownload, canDownload = false }) => {
    return (
        <HStack px={PX} space={3} my="15px">
            <Avatar size="40px" source={{ uri: signer?.pof }} />
            <Box flex={1}>
                <Text fontWeight={600} fontSize={'14px'}>
                    {signer?.user?.fullName}
                </Text>
                <Text fontSize={'11px'}>{signer?.user?.phoneNumber}</Text>
            </Box>
            {canDownload ? (
                <TouchableOpacity onPress={onDownload}>
                    <Center
                        width={'40px'}
                        height={'40px'}
                        borderRadius={'8px'}
                        borderColor={'primary.600'}
                        borderWidth={'1px'}
                    >
                        <Download4 width={15} height={15} />
                    </Center>
                </TouchableOpacity>
            ) : (
                <Center width={'40px'} height={'40px'}>
                    <Spinner />
                </Center>
            )}
        </HStack>
    );
};

function ModalDownloadSignerCert({
    isOpen,
    onClose,
    contract,
    downloadPdf,
    downloadAll,
    canDownloadAll = false,
    canDownload,
}) {
    const t = useTranslate();
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Content width={'90%'} mt="auto" mb="20px">
                <Modal.CloseButton />
                <Box
                    justifyContent="center"
                    alignItems="center"
                    py="15px"
                    mt={'auto'}
                    borderRadius="8px"
                    bgColor="white"
                >
                    <Box w="full" alignItems="center">
                        <Text
                            textAlign={'left'}
                            w={'full'}
                            color="black"
                            fontWeight="500"
                            fontSize="16px"
                            mb="30px"
                            px={PX}
                        >
                            {t('contract.downloadSignerCertificate')}
                        </Text>
                        {contract?.signers?.map((signer, index) => (
                            <Box w="full" key={index}>
                                <SignerItem
                                    key={index}
                                    signer={signer}
                                    onDownload={() => {
                                        onClose();
                                        downloadPdf(signer?.user?._id);
                                    }}
                                    canDownload={canDownload(signer?.user?._id)}
                                />
                                {index !== contract?.signers?.length - 1 && (
                                    <Box w="full" h="1px" bgColor="#0000001A"></Box>
                                )}
                            </Box>
                        ))}
                        <Box w="full" px={PX}>
                            <Button
                                mt="40px"
                                isLoading={!canDownloadAll}
                                bg="primary.600"
                                onPress={() => {
                                    onClose();
                                    downloadAll();
                                }}
                            >
                                {t('button.downloadAll')}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal.Content>
        </Modal>
    );
}

const MemoModal = React.memo(ModalDownloadSignerCert);
