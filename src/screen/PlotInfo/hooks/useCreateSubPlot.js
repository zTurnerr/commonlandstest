import { useEffect, useState } from 'react';
import { createSubPlot } from '../../../rest_client/apiClient';
import { OVERLAP_ERROR, SEND_TYPE, initSource, subplotColor } from '../../../util/Constants';
import { checkPolygonInsidePolygon, validatePolygon } from '../../../util/polygon';
import { useNavigation } from '@react-navigation/native';

const CONTROLS = ['navigationControl', 'drawControl'];
const FEATURES = ['doubleClickZoom', 'dragPan', 'touchZoomRotate', 'scrollZoom'];
const SUB_PLOT_ID = 'sub_plot_2';
const PARENT_PLOT_ID = 'parent_plot_2';
const NEW_SUB_PLOT_ID = 'new_sub_plot_2';

const useTrackCreateSubPlot = (step) => {
    const navigation = useNavigation();
    useEffect(() => {
        if (step === 6) {
            navigation.setParams({
                creatingSubPlot: true,
            });
        } else {
            navigation.setParams({
                creatingSubPlot: false,
            });
        }
    }, [step]);
};

export const useCreateSubPlot = ({
    renderPlot,
    setStep,
    clearPlot,
    plotData,
    sendMessage,
    setScrollEnabled,
    setShowSnapButton,
    t,
    step,
}) => {
    const [polygon, setPolygon] = useState('');
    const [createSubPlotError, setCreateSubPlotError] = useState('');
    const [selectedClaimant, setSelectedClaimant] = useState('');
    const [requesting, setRequesting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [dataSubmit, setDataSubmit] = useState({
        plot: {},
    });
    const [createSubPlotStep, setCreateSubPlotStep] = useState(0);
    useTrackCreateSubPlot(step);
    const onCancelCreateSubPlot = () => {
        setStep(0);
        setCreateSubPlotStep(0);
        setPolygon(null);
        setCreateSubPlotError(null);
        setSelectedClaimant(null);
        hideSubPlot();
        setShowSnapButton(false);
        hideParentPlot();
        hideSubPlots();
        setScrollEnabled(true);
        removeEvent();
        //make sure map resized
        setTimeout(() => {
            renderPlot(null);
        }, 500);
    };

    const onPolygonUpdate = (data) => {
        try {
            setPolygon(data.polygon);
            let newData = JSON.parse(JSON.stringify(dataSubmit));
            newData = {
                subPlot: {
                    geojson: { ...data.polygon, type: 'Feature' },
                    ...data,
                    centroid: data?.centroid?.geometry?.coordinates,
                },
                rootPlotID: plotData.plot._id,
                claimants: [],
            };

            setDataSubmit(newData);
        } catch (err) {
            console.log('onPolygonUpdate', err);
        }
    };
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
    const onNextCreateSubPlot = () => {
        setShowSnapButton(false);
        try {
            //prepare for step 1
            if (createSubPlotStep === 0) {
                setCreateSubPlotError('');
                prepareDataForStep1();
                setCreateSubPlotStep(1);
                removeEvent();
                return;
            }
            //prepare for step 2
            if (createSubPlotStep === 1) {
                setCreateSubPlotStep(2);
                setScrollEnabled(true);
                hideParentPlot();
                hideSubPlots();
                showSubPlot();
                setTimeout(() => {
                    renderPlot();
                }, 500);

                return;
            }
        } catch (err) {}
    };
    const hideParentPlot = () => {
        sendMessage({
            type: SEND_TYPE.addSource,
            source: getSource(null, PARENT_PLOT_ID),
        });
    };
    const showParentPlot = () => {
        let plots = [
            {
                ...plotData?.plot,
                properties: {
                    outlineColor: '#fff',
                    color: 'rgba(42, 184, 73, 0.65)',
                    fillOpacity: 0.7,
                },
            },
        ];
        sendMessage({
            type: SEND_TYPE.addSource,
            source: getSource(plots, PARENT_PLOT_ID),
        });
    };
    const showSubPlots = () => {
        if (haveSubPlots) {
            let subPlots = [];
            plotData?.subPlots?.forEach((subPlot) => {
                // if (subPlot?.claimants?.length > 0) {
                subPlots.push({
                    ...subPlot,
                    properties: {
                        outlineColor: '#fff',
                        color: subplotColor,
                        fillOpacity: 0.5,
                    },
                });
                // }
            });
            sendMessage({
                type: SEND_TYPE.addSource,
                source: getSource(subPlots, SUB_PLOT_ID),
            });
        }
    };
    const hideSubPlots = () => {
        sendMessage({
            type: SEND_TYPE.addSource,
            source: getSource(null, SUB_PLOT_ID),
        });
    };
    const showSubPlot = () => {
        let source = initSource({
            plots: [
                {
                    ...dataSubmit.subPlot,
                    properties: {
                        outlineColor: '#fff',
                        color: subplotColor,
                    },
                },
            ],
            id: NEW_SUB_PLOT_ID,
            type: 'fill_by_color_properties',
        });
        sendMessage({
            type: SEND_TYPE.addSource,
            source,
        });
    };
    const hideSubPlot = () => {
        let source = initSource({
            plots: [],
            id: NEW_SUB_PLOT_ID,
            type: 'fill_by_color_properties',
        });
        sendMessage({
            type: SEND_TYPE.addSource,
            source,
        });
    };
    const prepareDataForStep1 = () => {
        try {
            validatePolygon(
                dataSubmit.subPlot.geojson.geometry.coordinates,
                plotData?.subPlots.filter((i) => i.hasClaimant) || [],
                {
                    strictValidate: false,
                },
            );
            checkPolygonInsidePolygon(
                plotData.plot.geojson.geometry.coordinates,
                dataSubmit.subPlot.geojson.geometry.coordinates,
            );
        } catch (err) {
            if (OVERLAP_ERROR === err) {
                setCreateSubPlotError(t('subplot.contentOverlap'));
                throw err;
            }
            setCreateSubPlotError(err);
            throw err;
        }
    };
    const onSaveCreateSubPlot = async () => {
        try {
            setRequesting(true);
            setCreateSubPlotError('');
            let data = JSON.parse(JSON.stringify(dataSubmit));
            data.claimants = [
                {
                    ...selectedClaimant,
                    type: selectedClaimant.relationship,
                },
            ];
            await createSubPlot(data);

            setSuccess(true);
        } catch (err) {
            setCreateSubPlotError(err);
            console.log(err);
        }
        setRequesting(false);
    };
    const onResetCreateSubPlot = () => {
        setPolygon(null);
        setDataSubmit({ plot: {} });
        sendMessage({ type: SEND_TYPE.resetPolygon });
    };
    const haveSubPlots = plotData?.subPlots && plotData?.subPlots?.length > 0;
    const onStartCreateSubPlot = () => {
        setStep(() => 6);
        clearPlot();
        setScrollEnabled(false);
        showParentPlot();
        showSubPlots();
        addEvent();
        sendMessage({
            type: SEND_TYPE.enableSnap,
        });

        let polygons = [plotData.plot.geojson.geometry.coordinates[0]];
        if (haveSubPlots) {
            plotData.subPlots.forEach((subPlot) => {
                polygons.push(subPlot.geojson.geometry.coordinates[0]);
            });
        }
        sendMessage({
            type: SEND_TYPE.polygonListChange,
            polygons,
        });

        setTimeout(() => {
            sendMessage({
                type: SEND_TYPE.fitBoundsByPolygon,
                polygon: plotData.plot.geojson,
            });
        }, 700);
        // centerMap();
    };
    const getSource = (plots, id) => {
        let source = initSource({
            plots: !plots ? [] : plots,
            id,
            type: 'fill_by_color_properties',
        });
        return source;
    };
    const isReviewCreateSubPlotStep = () => createSubPlotStep === 2;
    return {
        onCancelCreateSubPlot,
        onNextCreateSubPlot,
        onSaveCreateSubPlot,
        onStartCreateSubPlot,
        onPolygonUpdate,
        setPolygon,
        onResetCreateSubPlot,
        createSubPlotStep,
        setCreateSubPlotStep,
        polygon,
        createSubPlotError,
        selectedClaimant,
        setSelectedClaimant,
        isReviewCreateSubPlotStep,
        setCreateSubPlotError,
        requestingCreateSubPlot: requesting,
        success,
        setSuccess,
    };
};
