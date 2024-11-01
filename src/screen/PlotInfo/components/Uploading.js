import useTranslate from '../../../i18n/useTranslate';
import { Box, Progress, Text } from 'native-base';

import React, { useState } from 'react';
import { isArrayNotEmpty } from '../../../util/Constants';
import {
    getPlotBoundaryImage,
    updateBoundary,
    uploadBoundary,
} from '../../../rest_client/apiClient';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

let interval;

export const useImageBoundary = () => {
    const [requesting, setRequesting] = useState(false);
    const [progressValue, setProgressValue] = useState(10);
    const [images, setImages] = useState([]);
    const [files, setFiles] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const [deleteFilesList, setDeleteFilesList] = useState([]);
    const [activeImage, setActiveImage] = useState('');

    const [updateImageError, setUpdateImageError] = useState('');
    const t = useTranslate();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const getViewPhotosData = (pointsOfPlot) => {
        let data = {
            activePoint: 0,
            imageActiveIndex: 0,
        };
        data.activePoint = pointsOfPlot.findIndex((p) => {
            return p[0] === activeImage?.points[0] && p[1] === activeImage?.points[1];
        });
        data.imageActiveIndex = files[data.activePoint]?.images?.findIndex((i) => {
            return i.uri === activeImage?.uri;
        });
        return data;
    };

    const startInterVal = () => {
        interval = setInterval(() => {
            setProgressValue((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }

                return prev >= 90 ? 90 : Math.min(90, prev + 5);
            });
        }, 1000);
    };

    const initImages = async (_images, _plotData) => {
        let points = _plotData.geojson.geometry.coordinates[0];
        let img = [];
        let _files = [];
        for (let i = 0; i < points.length - 1; i++) {
            let item = points[i];
            _files[i] = {};
            let key = item[0] + ':' + item[1];
            let images = _images[key]?.images;
            _files[i].description = _images[key]?.description || '';
            if (images) {
                _images[key].checked = true;
                _files[i].images = [];

                for (let j in images) {
                    img.push({
                        uri: images[j],
                        label: `${t('plotInfo.marker')} ` + (i + 1),
                        points: item,
                    });
                    _files[i].images.push({
                        uri: images[j],
                        key: j,
                        fileName: j,
                    });
                }
            }
        }
        setFiles(_files);
        setImages(img);
    };

    const _uploadBoundary = async ({ onSubmittedImages, pointsOfPlot, plotData }) => {
        try {
            setUpdateImageError('');
            setRequesting(true);
            startInterVal();
            for (let index = 0; index < pointsOfPlot.length; index++) {
                var form = new FormData();
                let isUpdate = false;

                if (files[index]?.description || files[index]?.images?.length) {
                    isUpdate = true;
                }
                if (newFiles[index]) {
                    newFiles[index].images?.forEach((f, index2) => {
                        //if file have key, this file is uploaded
                        if (!f.key) {
                            let photo = {
                                uri: f.uri,
                                type: f.type,
                                name: `${f.fileName}`,
                            };
                            form.append('image' + index2, photo);
                        }
                    });
                }
                if (isArrayNotEmpty(deleteFilesList[index])) {
                    isUpdate = true;
                    let fs = [];
                    deleteFilesList[index].forEach((f) => {
                        fs.push(f);
                    });
                    form.append('deletedImageKeys', JSON.stringify(fs));
                }

                if (newFiles[index]?.descriptionChanged) {
                    form.append('description', newFiles[index]?.description);
                }

                if (!isArrayNotEmpty(form._parts)) {
                    continue;
                }
                if (isUpdate) {
                    await updateBoundary(
                        {
                            data: form,
                            plotId: plotData.plot._id,
                            long: pointsOfPlot[index][0],
                            lat: pointsOfPlot[index][1],
                        },
                        navigation,
                        dispatch,
                    );
                } else {
                    await uploadBoundary(
                        {
                            data: form,
                            plotId: plotData.plot._id,
                            long: pointsOfPlot[index][0],
                            lat: pointsOfPlot[index][1],
                        },
                        navigation,
                        dispatch,
                    );
                }
            }
            setProgressValue(94);
            clearInterval(interval);
            setTimeout(async () => {
                let imagesRes = await getPlotBoundaryImage(plotData.plot._id);
                onSubmittedImages(imagesRes.data);
                setDeleteFilesList([]);
                setProgressValue(10);
                setRequesting(false);
            }, 50);
        } catch (err) {
            clearInterval(interval);
            setRequesting(false);
            setProgressValue(10);
            setUpdateImageError(err?.message || err);
        }
    };

    const Component = () => {
        return <Uploading progressValue={progressValue} requesting={requesting} />;
    };

    return {
        requesting,
        progressValue,
        setRequesting,
        setProgressValue,
        startInterVal,
        Component,
        interval,
        images,
        setImages,
        files,
        setFiles,
        initImages,
        updateImageError,
        setUpdateImageError,
        newFiles,
        setNewFiles,
        deleteFilesList,
        setDeleteFilesList,
        _uploadBoundary,
        activeImage,
        setActiveImage,
        getViewPhotosData,
    };
};

export default function Uploading({ progressValue, requesting }) {
    const t = useTranslate();
    return (
        requesting && (
            <Box
                position="absolute"
                alignItems="center"
                justifyContent="center"
                w="full"
                bottom={0}
                h="full"
                bgColor="rgba(0,0,0,.6)"
                px="22px"
            >
                <Progress value={progressValue} w="100%" />
                <Text fontSize="16px" mt="12px" color="white">
                    {t('plotInfo.uploadingImages')}...
                </Text>
            </Box>
        )
    );
}
