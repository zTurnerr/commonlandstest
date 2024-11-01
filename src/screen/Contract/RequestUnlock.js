import { keccak256 } from 'js-sha3';
import { Box, Center, CloseIcon, Divider, HStack, ScrollView, Text, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import AutoIncreaseProgress from '../../components/AutoIncreaseProgress/AutoIncreaseProgress';
import Button from '../../components/Button';
import { useErrorAlert } from '../../components/ErrorAlert';
import HeaderPage from '../../components/HeaderPage';
import FileCheck from '../../components/Icons/FileCheck';
import FileUp from '../../components/Icons/FileUp';
import Trash from '../../components/Icons/Trash';
import Upload from '../../components/Icons/Upload';
import useTranslate from '../../i18n/useTranslate';
import {
    borrowerRequestCmlUnlock,
    postImageS3,
    updateContractProof,
} from '../../rest_client/apiClient';
import { openPicker } from '../../util/Constants';
import { useModalRequestUnlock } from './components/ModalRequestUnlock';
import { useModalTxPermissionRequest } from './components/ModalTxPermissionRequest';

const getInitImages = (contract, type) => {
    const requestUnlockObj = contract?.requestToUnlock?.history?.[0];
    if (!requestUnlockObj) {
        return [];
    }
    if (type === 'borrower') {
        return requestUnlockObj?.proofByBorrower?.map((item) => ({
            uri: item?.identifier,
            fileName: item?.identifier.split('-')[1],
            uploaded: true,
            imageAWSKey: item?.identifier,
        }));
    }
    return requestUnlockObj?.proofByUnderwriter?.map((item) => ({
        uri: item?.identifier,
        fileName: item?.identifier.split('-')[1],
        uploaded: true,
        imageAWSKey: item?.identifier,
    }));
};

const RequestUnlock = ({ route, navigation }) => {
    const t = useTranslate();
    const { contract, type = 'borrower' } = route.params;
    const modalRequestUnlock = useModalRequestUnlock();
    const [images, setImages] = useState(getInitImages(contract, type));
    const [loading, setLoading] = useState(false);
    const alertHook = useErrorAlert();
    const modalTxPermissionRequest = useModalTxPermissionRequest();
    const isPending = contract?.requestToUnlock?.isPending;

    const getPrefixFileName = () => {
        if (type == 'borrower') {
            return 'borrower_cmlproof_';
        } else {
            return 'creator_cmlproof_';
        }
    };

    const onSelectImages = async () => {
        try {
            let tmpImages = await openPicker({
                multiple: true,
            });
            // max 2 images
            if (images.length + tmpImages.length > 2) {
                alertHook.showErrorAlert(t('error.max2Images'));
                return;
            }
            // each image max 4MB
            for (let i = 0; i < tmpImages.length; i++) {
                if (tmpImages[i].size > 4 * 1024 * 1024) {
                    alertHook.showErrorAlert(t('error.imageMax4MB'));
                    return;
                }
                // hash file name
                let fileName = tmpImages[i].fileName;
                let fileExtension = fileName.split('.').pop();
                let hash = keccak256(fileName).slice(0, 10);
                tmpImages[i].fileName = getPrefixFileName() + `${hash}.${fileExtension}`;
            }
            setImages([...images, ...tmpImages]);
        } catch (error) {
            console.log('err', error);
        }
    };

    const uploadImages = async () => {
        try {
            images.forEach(async (item) => {
                if (item?.uploaded) {
                    return;
                }

                let imgData = {
                    uri: item?.uri,
                    type: item?.type,
                    name: item?.fileName,
                };
                let form = new FormData();
                form.append('image', imgData);
                let { data } = await postImageS3(form, null, null);
                setImages((prev) => {
                    let tmp = [...prev];
                    for (let i = 0; i < tmp.length; i++) {
                        if (tmp[i].fileName == item.fileName) {
                            tmp[i].uploaded = true;
                            tmp[i].imageAWSKey = data?.imageAWSKey;
                        }
                    }
                    return tmp;
                });
            });
        } catch (error) {
            console.log('err');
        }
    };

    const checkAllUploaded = () => {
        for (let i = 0; i < images.length; i++) {
            if (!images[i].uploaded) {
                return false;
            }
        }
        return true;
    };

    const onSubmitProof = async () => {
        setLoading(true);
        try {
            let dataSubmit = {
                contractDid: contract?.did,
                proofByBorrower: images.map((item) => ({
                    type: 'IMAGE',
                    identifier: item?.imageAWSKey,
                })),
            };
            await borrowerRequestCmlUnlock(dataSubmit, null, null);
            navigation.navigate('JoinContractDetail', {
                reload: true,
            });
        } catch (error) {}
        setLoading(false);
    };
    const onUpdateProof = async () => {
        let key = type == 'borrower' ? 'proofByBorrower' : 'proofByUnderwriter';
        setLoading(true);
        try {
            let dataSubmit = {
                id: contract?.requestToUnlock?.history?.[0]?._id,
                [key]: images.map((item) => ({
                    type: 'IMAGE',
                    identifier: item?.imageAWSKey,
                })),
            };
            await updateContractProof(dataSubmit, null, null);
            navigation.goBack({
                reload: true,
            });
        } catch (error) {
            console.log(error, 'eerr');
        }
        setLoading(false);
    };

    useEffect(() => {
        if (images.length) {
            uploadImages();
        }
    }, [images]);

    const styles = StyleSheet.create({
        uploadButton: {
            opacity: images.length >= 2 ? 0.5 : 1,
        },
    });

    return (
        <Box flex={1}>
            {alertHook.Component()}
            {modalTxPermissionRequest.Component({})}
            <ScrollView>
                <HeaderPage
                    onPress={() => navigation.goBack()}
                    title={`${t('contract.uploadProofTitle')}`}
                />
                {/* <EnterTransaction1 />
                <ContractTransactionInfo /> */}
                {/* <Box px="15px" pt="15px" fontSize={'12px'} fontWeight={500} color="gray.700">
                    <Text>t('contract.typeOfProof')</Text>
                    <Select
                        selectedValue={service}
                        _selectedItem={{
                            bg: 'gray.400',
                        }}
                        maxWidth={'150px'}
                        mt={1}
                        p={0}
                        onValueChange={(itemValue) => setService(itemValue)}
                        borderWidth={0}
                        color={'black'}
                        fontSize={'14px'}
                        fontWeight={600}
                        position={'relative'}
                        left={'-7px'}
                        dropdownIcon={<ChevronDownIcon size="4" />}
                    >
                        <Select.Item label="t('contract.uploadImages')" value="upload" />
                        <Select.Item label="t('contract.transactionCode')" value="code" />
                    </Select>
                </Box> */}
                <Box mt="5px" bg="white" p="15px">
                    <Text fontSize={'14px'} fontWeight={600}>
                        {t('contract.uploadImages')}
                    </Text>
                    <Text color="gray.900" mt="5px" fontSize={'12px'} fontWeight={400}>
                        {t('contract.uploadImagesDesc')}
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            if (images.length >= 2) {
                                return;
                            }
                            onSelectImages();
                        }}
                        style={styles.uploadButton}
                        disabled={images.length >= 2}
                    >
                        <Box
                            mt="15px"
                            borderStyle={'dashed'}
                            borderWidth={'1px'}
                            textAlign={'center'}
                            borderRadius={'8px'}
                            py="15px"
                            borderColor="gray.1000"
                        >
                            <Center>
                                <Box p="12px" bg="gray.1100" borderRadius={'8px'}>
                                    <Upload />
                                </Box>
                            </Center>
                            <Text
                                mt="5px"
                                fontWeight={600}
                                fontSize={'14px'}
                                color="primary.600"
                                textAlign={'center'}
                            >
                                {t('contract.browseFiles')}
                            </Text>
                            <Text
                                color="gray.800"
                                fontSize={'12px'}
                                fontWeight={400}
                                textAlign={'center'}
                            >
                                {t('contract.recommendedFile')}
                            </Text>
                            <Text
                                color="gray.800"
                                fontSize={'12px'}
                                fontWeight={400}
                                textAlign={'center'}
                            >
                                {t('contract.maxFileSize')}
                            </Text>
                        </Box>
                    </TouchableOpacity>
                    {!!images?.length && (
                        <>
                            <Text mt="18px" fontSize={'14px'} fontWeight={600}>
                                {t('contract.uploadFilesTitle') + ' '}
                                <Text fontWeight={400}>({t('contract.max2Files')})</Text>
                            </Text>
                            <VStack
                                borderColor={'gray.1200'}
                                borderWidth={'1'}
                                divider={<Divider m="0px" p="0px" bg="gray.1200" />}
                                borderRadius={'8px'}
                                mt="8px"
                            >
                                {images.map((item, index) => {
                                    return (
                                        <HStack
                                            key={item?.fileName}
                                            p="10px"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            space={2}
                                        >
                                            {item?.uploaded ? <FileCheck /> : <FileUp />}
                                            <Text flex={1} noOfLines={1}>
                                                {item.fileName}
                                            </Text>
                                            {!item?.uploaded && (
                                                <Box minW={'40px'}>
                                                    <AutoIncreaseProgress />
                                                </Box>
                                            )}
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setImages((prev) => {
                                                        let tmp = [...prev];
                                                        tmp.splice(index, 1);
                                                        return tmp;
                                                    });
                                                }}
                                            >
                                                {!item?.uploaded ? <CloseIcon /> : <Trash />}
                                            </TouchableOpacity>
                                        </HStack>
                                    );
                                })}
                            </VStack>
                        </>
                    )}
                </Box>
            </ScrollView>
            <Box p="25px">
                <Button
                    isLoading={loading}
                    isDisabled={!images?.length || !checkAllUploaded()}
                    _container={{ mt: '41px' }}
                    onPress={!isPending ? onSubmitProof : onUpdateProof}
                >
                    {type == 'borrower'
                        ? t('contract.submitProofToUnlock')
                        : t('button.submitProof')}
                </Button>
            </Box>
            {modalRequestUnlock.Component({
                onPress: () => {
                    console.log('active');
                },
            })}
        </Box>
    );
};

export default RequestUnlock;
