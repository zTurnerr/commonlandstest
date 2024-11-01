import useTranslate from '../../i18n/useTranslate';
/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import { Box, FlatList, Icon, Text, TextArea, useDisclose } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GroupButtonUploadImage from '../../components/GroupButtonUploadImage';
import ImageUpload from '../../components/ImageUpload';
import MarkerSwiper from '../../components/MarkerSwiper';
import ModalLearnTakePhoto from './ModalLearnTakePhoto';

export default function Index({
    coordinates,
    onCoordinateChange,
    onFilesChange,
    files = {},
    onDelete,
    indexCoordinateActive,
    swiperRef = {},
    onDescriptionChange,
}) {
    const { isOpen, onOpen, onClose } = useDisclose();
    const t = useTranslate();
    return (
        <>
            <MarkerSwiper
                swiperRef={swiperRef}
                data={coordinates}
                onChange={onCoordinateChange}
                value={indexCoordinateActive}
            />

            <Box px="24px">
                <Text mt="23px" mb="12px">
                    {t('plot.recommend')}
                </Text>
                <TouchableOpacity onPress={onOpen}>
                    <Box flexDirection="row" alignItems="center" mb="12px">
                        <Text fontWeight="bold" color="primary.600">
                            {t('plot.learnTakePhoto')}
                        </Text>
                        <Icon
                            as={<MaterialCommunityIcons name="arrow-right-circle-outline" />}
                            color="primary.600"
                            size={5}
                        />
                    </Box>
                </TouchableOpacity>
                <Text fontWeight="600">{t('plot.uploadPhoto')}</Text>
                <GroupButtonUploadImage
                    onFilesChange={onFilesChange}
                    icon="file-image-plus-outline"
                    description={t('plot.recommendedPNG')}
                />
                <Text mt="12px" mb="12px" fontWeight="bold">
                    {t('plot.photosUploaded')}
                </Text>
                <FlatList
                    horizontal
                    overScrollMode="never"
                    data={files?.images || []}
                    renderItem={({ item }) => {
                        return <ImageUpload key={item.fileName} data={item} onDelete={onDelete} />;
                    }}
                ></FlatList>
                <Text mt="12px" mb="12px" fontWeight="bold">
                    {t('plot.description')}
                </Text>
                <TextArea
                    value={files?.description}
                    placeholder={`${t('plot.descriptionMarker')} ${indexCoordinateActive + 1}`}
                    onChangeText={onDescriptionChange}
                />
            </Box>
            <ModalLearnTakePhoto isOpen={isOpen} onClose={onClose} />
        </>
    );
}
