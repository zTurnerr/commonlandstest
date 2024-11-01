import useTranslate from '../../i18n/useTranslate';
import { AddIcon, Box, Button, HStack, Text } from 'native-base';
import React from 'react';
import Camera from '../Icons/Camera';
import { useNavigation } from '@react-navigation/native';
import FileList1 from '../FileList/FileList1';
import { openPicker } from '../../util/Constants';

const CreateContractUploadImgSection = ({
    imgList = [],
    setImgList = () => {},
    setErr = () => {},
}) => {
    const navigation = useNavigation();

    const t = useTranslate();
    return (
        <Box>
            <Text fontWeight={500}>
                {t('contract.uploadImagesOfContract')}
                <Text> *</Text>
            </Text>
            <Box
                mt="12px"
                p="25px"
                borderStyle={'dashed'}
                borderWidth={'1px'}
                borderRadius={'8px'}
                borderColor={'gray.400'}
            >
                <HStack space={4}>
                    <Button
                        onPress={() => {
                            navigation.navigate('TakePhotoContract');
                        }}
                        variant={'outline'}
                        borderRadius={'100px'}
                        flex={1}
                        borderColor={'primary.600'}
                    >
                        <HStack space={1} alignItems={'center'}>
                            <Camera />
                            <Text fontWeight={600} fontSize={'13px'}>
                                {t('contract.takePhoto')}
                            </Text>
                        </HStack>
                    </Button>
                    <Button
                        borderColor={'primary.600'}
                        variant={'outline'}
                        borderRadius={'100px'}
                        flex={1}
                        onPress={() => {
                            openPicker({ multiple: true, mediaType: 'photo' })
                                .then((res) => {
                                    // check file size not over 4MB
                                    let isOverSize = false;
                                    res.forEach((item) => {
                                        if (item.size > 4 * 1024 * 1024) {
                                            isOverSize = true;
                                            return;
                                        }
                                    });

                                    if (isOverSize) {
                                        setErr(t('contract.fileSizeOver'));
                                        return;
                                    }
                                    if (!res) return;
                                    setImgList([...imgList, ...res]);
                                })
                                .catch((err) => {
                                    console.log('err', err);
                                });
                        }}
                    >
                        <HStack space={1} alignItems={'center'}>
                            <AddIcon size={'22px'} />
                            <Text fontWeight={600} fontSize={'13px'}>
                                {t('contract.browseFiles')}
                            </Text>
                        </HStack>
                    </Button>
                </HStack>
                <Text textAlign={'center'} mt="16px" color="gray.800">
                    {t('contract.recommendedFileType')}
                </Text>
                <Text textAlign={'center'} color="gray.800">
                    {t('contract.maxFileSize')}
                </Text>
            </Box>
            {!!imgList?.length && (
                <Box>
                    <Text mt="13px" fontWeight={500} mb="10px">
                        {t('contract.selectedPhotos')}
                    </Text>
                    <FileList1 fileList={imgList} setFileList={setImgList} />
                </Box>
            )}
        </Box>
    );
};

export default CreateContractUploadImgSection;
