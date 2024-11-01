/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import { Box, ScrollView, Text } from 'native-base';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import ImageUpload from '../../components/ImageUpload';
import useTranslate from '../../i18n/useTranslate';
import { deepClone, openPicker, validateImages } from '../../util/Constants';

const ContainerImages = ({ title, files, onAddPhoto, onDeletePhoto }) => {
    const t = useTranslate();
    return (
        <Box w="full" mt="12px" borderWidth="1px" borderColor="divider" borderRadius="8px">
            <Box
                flexDir="row"
                w="full"
                borderBottomColor="divider"
                borderBottomWidth="1px"
                p="4px"
                px="12px"
                alignItems="center"
            >
                <Text fontWeight="bold" flex={1}>
                    {title}
                </Text>
                <TouchableOpacity onPress={onAddPhoto}>
                    <Box
                        borderWidth="1px"
                        borderColor="primary.500"
                        p="4px"
                        px="8px"
                        borderRadius="30px"
                    >
                        <Text color="primary.500">{t('profile.addPhotos')}</Text>
                    </Box>
                </TouchableOpacity>
            </Box>
            <Box minH="120px" p="12px" w="full">
                <ScrollView horizontal overScrollMode="never">
                    {files?.map((item) => {
                        return (
                            <ImageUpload
                                key={item.uri + item.fileName}
                                data={item}
                                onDelete={onDeletePhoto}
                                style={styles.imageUpload}
                            />
                        );
                    })}
                </ScrollView>
            </Box>
        </Box>
    );
};

export default function Index({ setFiles, files, setError, setDeleteFiles, deleteFiles }) {
    const t = useTranslate();
    const TYPE = [
        {
            title: t('profile.nationalID'),
            key: 'nationalID',
        },
        {
            title: t('profile.driverLicense'),
            key: 'driverLicense',
        },
        {
            title: t('profile.passport'),
            key: 'passport',
        },
    ];
    const [, setRequesting] = useState(false);
    const onFileChange = (key, _files) => {
        try {
            setError('');
            let newFiles = deepClone(files);
            if (newFiles[key]?.length === 2 || _files.length > 2) {
                return setError(t('error.multiplePhoto'));
            }
            let f = [...(newFiles[key] || []), ..._files];
            newFiles[key] = f;
            setFiles(newFiles);
        } catch (err) {}
    };
    const selectImage = async (type) => {
        try {
            setRequesting(true);
            let images = await openPicker({
                multiple: true,
            });
            if (!images || !images.length) {
                setRequesting(false);
                return;
            }
            validateImages(images);
            onFileChange(type, images);
        } catch (err) {
            setError(err.message ? err.message : err);
        } finally {
            setRequesting(false);
        }
    };
    const onDeletePhoto = (type, photo) => {
        let newFiles = deepClone(files);
        newFiles[type] = newFiles[type].filter((f) => f.uri !== photo.uri);
        setFiles(newFiles);
        if (photo.key) {
            let newDeleteFiles = deepClone(deleteFiles);

            newDeleteFiles[type].push(photo.key);
            setDeleteFiles(newDeleteFiles);
        }
    };
    return (
        <Box f="full">
            <Text mt="12px">{t('profile.uploadDocuments')}</Text>
            {TYPE.map((item) => (
                <ContainerImages
                    key={item.key}
                    title={item.title}
                    files={files[item.key]}
                    onAddPhoto={() => {
                        selectImage(item.key);
                    }}
                    onDeletePhoto={(photo) => {
                        onDeletePhoto(item.key, photo);
                    }}
                />
            ))}
        </Box>
    );
}

const styles = StyleSheet.create({
    imageUpload: {
        width: 160,
    },
});
