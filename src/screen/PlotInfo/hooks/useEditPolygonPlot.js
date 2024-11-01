import { useEffect, useMemo, useState } from 'react';
import {
    delay,
    initSource,
    newPolygonColor,
    OVERLAP_ERROR,
    SEND_TYPE,
} from '../../../util/Constants';
import { useDisclose } from 'native-base';
import { validatePolygon } from '../../../util/polygon';
import { EventRegister } from 'react-native-event-listeners';
import { EVENT_NAME } from '../../../constants/eventName';
import { createEditPlotPolygon } from '../../../rest_client/apiClient';

const CONTROLS = ['geolocateControl', 'drawControl'];
const FEATURES = ['doubleClickZoom', 'dragPan', 'touchZoomRotate', 'scrollZoom'];
const NEW_PLOT = 'new_plot';
const useEditPolygonPlot = ({
    sendMessage,
    setStep,
    setScrollEnabled,
    setShowSnapButton,
    plotData,
    onEnableSnap,
    isEnableSnap,
}) => {
    const [editPolygonStep, setEditPolygonStep] = useState(0);
    const [dataSubmit, setDataSubmit] = useState({
        plot: {},
    });
    const [overlap, setOverlap] = useState(false);
    const [error, setError] = useState('');
    const {
        isOpen: isRenderCurrentPlot,
        onOpen: onRenderCurrentPlot,
        onClose: onStopRenderCurrentPlot,
    } = useDisclose(true);
    const { isOpen: isLoading, onOpen: onOpenLoading, onClose: onCloseLoading } = useDisclose();
    const [isOverlap, setIsOverlap] = useState(0);

    const removeEvent = () => {
        sendMessage({
            type: SEND_TYPE.removeControl,
            controls: CONTROLS,
        });

        sendMessage({
            type: SEND_TYPE.disabledFeatures,
            features: FEATURES,
        });
    };

    const isOnReviewEditPolygonStep = () => {
        return editPolygonStep === 1;
    };

    const addEvent = () => {
        sendMessage({
            type: SEND_TYPE.addControl,
            controls: CONTROLS,
        });
        sendMessage({
            type: SEND_TYPE.enableFeatures,
            features: FEATURES,
        });
    };

    const onPolygonUpdateEdit = (data) => {
        try {
            let newData = JSON.parse(JSON.stringify(dataSubmit));
            newData = {
                plot: {
                    geojson: { ...data.polygon, type: 'Feature' },
                    ...data,
                    centroid: data?.centroid?.geometry?.coordinates,
                },
            };

            setDataSubmit(newData);
        } catch (err) {
            console.log('onPolygonUpdate', err);
        }
    };

    const showPlot = () => {
        let source = initSource({
            plots: [
                {
                    ...dataSubmit.plot,
                    properties: {
                        outlineColor: '#fff',
                        color: newPolygonColor,
                    },
                },
            ],
            id: NEW_PLOT,
            type: 'fill_by_color_properties',
        });
        sendMessage({
            type: SEND_TYPE.addSource,
            source,
        });
    };
    const hidePlot = () => {
        let source = initSource({
            plots: [],
            id: NEW_PLOT,
            type: 'fill_by_color_properties',
        });
        sendMessage({
            type: SEND_TYPE.addSource,
            source,
        });
    };

    const _validatePolygon = () => {
        const plotsOnMap = plotData?.closePlots?.filter((plot) => plot._id !== plotData.plot._id);
        validatePolygon(dataSubmit?.plot?.geojson?.geometry?.coordinates, plotsOnMap || [], {
            strictValidate: false,
        });
    };

    const prepareDataForStep1 = () => {
        try {
            _validatePolygon();
        } catch (err) {
            if (OVERLAP_ERROR === err) {
                setOverlap(true);
                throw '';
            }
            setError(err);
            throw err;
        }
    };

    const onNextEditPolygon = async (ignoreOverlap = false) => {
        setShowSnapButton(false);
        try {
            if (editPolygonStep === 0) {
                setError('');
                if (!ignoreOverlap) {
                    prepareDataForStep1();
                }
                setEditPolygonStep(1);
                removeEvent();
                showPlot();
                setScrollEnabled(true);
                let coordinates = dataSubmit.plot.geojson.geometry.coordinates;
                const boundsPolygon = {
                    geometry: {
                        type: 'Polygon',
                        coordinates: [
                            [coordinates[0][coordinates[0]?.length - 1], ...coordinates[0]],
                        ],
                    },
                    type: 'Feature',
                };
                setTimeout(() => {
                    sendMessage({
                        type: SEND_TYPE.fitBoundsByPolygon,
                        polygon: boundsPolygon,
                    });
                }, 1000);
                return;
            } else if (editPolygonStep === 1) {
                try {
                    onOpenLoading();
                    await createEditPlotPolygon({
                        data: dataSubmit,
                        plotId: plotData.plot._id,
                    });
                    // await for database to change data
                    await delay(2000);
                    EventRegister.emit(EVENT_NAME.refetchPlotData);
                    onCancelEditPolygon();
                    onCloseLoading();
                    return 'success';
                } catch (err) {
                    setError(err);
                }
                onCloseLoading();
            }
        } catch (err) {}
    };

    const isDisabledNextEditPolygon = useMemo(() => {
        if (Object.keys(dataSubmit?.plot).length === 0) {
            return true;
        }
        if (isOverlap > 0 && isEnableSnap) return true;
        return false;
    }, [dataSubmit, isEnableSnap, isOverlap]);

    const detectOverlap = () => {
        try {
            _validatePolygon();
            setIsOverlap(0);
        } catch (err) {
            if (OVERLAP_ERROR === err) {
                setIsOverlap((prev) => prev + 1);
            } else setIsOverlap(0);
        }
    };

    useEffect(() => {
        if (isEnableSnap && Object.keys(dataSubmit?.plot).length > 0) {
            detectOverlap();
        }
    }, [dataSubmit, isEnableSnap]);

    const onBackEditPolygon = () => {
        if (editPolygonStep === 1) {
            setEditPolygonStep(0);
            setScrollEnabled(false);
            addEvent();
            hidePlot();
            sendMessage({
                type: SEND_TYPE.updateDrawPolygon,
                polygon: dataSubmit.plot.geojson.geometry.coordinates,
            });
            return;
        }
    };

    const onCancelEditPolygon = () => {
        setStep(0);
        hidePlot();
        setError('');
        onRenderCurrentPlot();
        setShowSnapButton(false);
        setScrollEnabled(true);
        onResetEditPolygon();
        removeEvent();
        setEditPolygonStep(0);
        onEnableSnap();
    };

    const onResetEditPolygon = () => {
        // setPolygon(null);
        setDataSubmit({ plot: {} });
        sendMessage({ type: SEND_TYPE.resetPolygon });
    };

    const onStartEditPolygon = () => {
        setStep(() => 7);
        setScrollEnabled(false);
        onStopRenderCurrentPlot();
        addEvent();
        sendMessage({
            type: SEND_TYPE.enableSnap,
        });
        let polygons = [];
        const plotsOnMap = plotData?.closePlots?.filter((plot) => plot._id !== plotData.plot._id);
        plotsOnMap.forEach((plot) => {
            polygons.push(plot.geojson.geometry.coordinates[0]);
        });

        sendMessage({
            type: SEND_TYPE.polygonListChange,
            polygons,
        });
        setTimeout(() => {
            sendMessage({
                type: SEND_TYPE.updateDrawPolygon,
                polygon: plotData.plot.geojson.geometry.coordinates,
            });
        }, 300);
    };

    return {
        editPolygonStep,
        onStartEditPolygon,
        onCancelEditPolygon,
        onNextEditPolygon,
        isOnReviewEditPolygonStep,
        onPolygonUpdateEdit,
        onBackEditPolygon,
        isRenderCurrentPlot,
        isDisabledNextEditPolygon,
        error,
        overlap,
        isOverlap,
        setOverlap,
        isLoading,
    };
};

export default useEditPolygonPlot;
