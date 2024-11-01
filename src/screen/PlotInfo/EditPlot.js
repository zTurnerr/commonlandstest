import useTranslate from '../../i18n/useTranslate';
import { Box, Button, Text } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';

import { SEND_TYPE } from '../../util/Constants';
import UploadImagePlot from '../CreatePlot/UploadImagePlot';
import { initSource } from '../../util/Constants';
import useWorthwhileNumber from '../../hooks/useWorthwhileNumber';

export default function Index({
    sendMessage,
    plotData,
    files,
    setFiles,
    deleteFilesList,
    setDeleteFilesList,
    oldFiles,
    points,
    onDelete = () => {},
}) {
    const t = useTranslate();

    const worthwhileNumber = useWorthwhileNumber();
    const [indexCoordinateActive, setIndexCoordinateActive] = useState(0);
    const [error, setError] = useState('');
    const swiperRef = useRef();
    useEffect(() => {
        if (plotData?.plot && plotData.isFlagged) {
            sendMessage({
                type: SEND_TYPE.addSource,
                source: getSource(plotData.plot),
            });
        }
    }, [plotData]);

    useEffect(() => {
        try {
            if (points) {
                setIndexCoordinateActive(0);
                addSourceDefault(0);
                addSourceSelected(0);
                addSourceUploaded(0);
            }
        } catch (err) {
            setError(err?.message || err);
        }
    }, [points]);

    useEffect(() => {
        setFiles(oldFiles);
        return () => {
            setIndexCoordinateActive(0);
            addSourceDefault(-1);
            addSourceSelected(-1);
            addSourceUploaded(-1);
            sendMessage({
                type: SEND_TYPE.addSource,
                source: getSource(null),
            });
            setFiles(oldFiles);
        };
    }, []);
    const getSource = (plot) => {
        let source = initSource({
            plots: !plot ? [] : [plot],
            type: 'selected',
            id: 'new_plot',
        });

        return source;
    };
    const onFilesChange = (newFiles) => {
        try {
            let _files = JSON.parse(JSON.stringify(files));
            _files[indexCoordinateActive] = {
                ..._files[indexCoordinateActive],
                images: [...(_files[indexCoordinateActive]?.images || []), ...newFiles],
            };
            setFiles(_files);
        } catch (err) {
            setError(err?.message || err);
        }
    };
    const getSelectedPoint = (index = indexCoordinateActive) => {
        return points.filter((e, i) => i === index);
    };
    const getDefaultPoint = (index = indexCoordinateActive) => {
        return points.filter((e, i) => {
            return i !== index && (!files[i] || !files[i].length);
        });
    };
    const getUploadedPoint = (index) => {
        return points.filter((e, i) => {
            return i !== index && files[i] && files[i].length;
        });
    };
    const addSourceDefault = (index) => {
        let p = getDefaultPoint(index);
        let source = initSource({
            points: isHide(index) ? [] : p,
            type: 'default',
            id: 'source_point_default',
        });
        sendMessage({
            type: SEND_TYPE.addSource,
            source,
        });
    };
    const isHide = (index) => {
        return index === -1;
    };
    const addSourceSelected = (index) => {
        let p = getSelectedPoint(index);
        let source = initSource({
            points: isHide(index) ? [] : p,
            type: 'selected',
            id: 'source_point_selected',
        });
        sendMessage({
            type: SEND_TYPE.addSource,
            source,
        });
    };
    const addSourceUploaded = (index) => {
        let p = getUploadedPoint(index);
        let source = initSource({
            points: isHide(index) ? [] : p,
            type: 'uploaded',
            id: 'source_point_uploaded',
        });
        sendMessage({
            type: SEND_TYPE.addSource,
            source,
        });
    };
    const onCoordinateChange = (index) => {
        if (index === indexCoordinateActive) {
            return;
        }
        setIndexCoordinateActive(index);
        addSourceDefault(index);
        addSourceSelected(index);
        addSourceUploaded(index);
    };
    const onDeleteFile = (f) => {
        let _files = JSON.parse(JSON.stringify(files));
        let _deleteFilesList = JSON.parse(JSON.stringify(deleteFilesList));
        _files[indexCoordinateActive].images = _files[indexCoordinateActive].images.filter(
            (i) => i.fileName !== f.fileName,
        );
        if (f.key) {
            if (!_deleteFilesList[indexCoordinateActive]) {
                _deleteFilesList[indexCoordinateActive] = [];
            }
            _deleteFilesList[indexCoordinateActive] = [
                ..._deleteFilesList[indexCoordinateActive],
                f.key,
            ];
            setDeleteFilesList(_deleteFilesList);
        }

        setFiles(_files);
    };
    const onDescriptionChange = (text) => {
        let _files = JSON.parse(JSON.stringify(files));
        if (!_files[indexCoordinateActive]) {
            _files[indexCoordinateActive] = { images: [] };
        }
        _files[indexCoordinateActive] = {
            ..._files[indexCoordinateActive],
            description: text,
            descriptionChanged: true,
        };
        setFiles(_files);
    };
    return (
        <>
            <Box>
                <UploadImagePlot
                    files={files[indexCoordinateActive]}
                    onFilesChange={onFilesChange}
                    coordinates={points}
                    onCoordinateChange={onCoordinateChange}
                    indexCoordinateActive={indexCoordinateActive}
                    onDelete={onDeleteFile}
                    onOpen={() => {}}
                    swiperRef={swiperRef}
                    onDescriptionChange={onDescriptionChange}
                />
                <Text textAlign="center" color="error.400" my="12px">
                    {error}
                </Text>
                {plotData?.permissions?.deletePlot &&
                    plotData.claimchainSize < worthwhileNumber && (
                        <Box alignItems="center" px="20px">
                            <Button variant="outline" onPress={onDelete} colorScheme="gray">
                                {t('button.deletePlot')}
                            </Button>
                        </Box>
                    )}
            </Box>
        </>
    );
}
