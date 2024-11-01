import { useNavigation } from '@react-navigation/core';
import { Box, Icon, Progress, ScrollView, Text, useDisclose } from 'native-base';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DeviceEventEmitter, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import DrawMap from '../../components/DrawMap';
import AgentHeader from '../../components/Header/AgentHeader';
import SnapButton from '../../components/SnapButton';
import Steps from '../../components/Steps';
import useTranslate from '../../i18n/useTranslate';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import { userSliceActions } from '../../redux/reducer/user';
import {
    createPlot,
    getUserPlots,
    inviteClaimants,
    uploadBoundary,
} from '../../rest_client/apiClient';
import {
    CLAIMANTS,
    OVERLAP_ERROR,
    PROGRESS_OPTIONS,
    RECEIVE_TYPE,
    SCREEN_HEIGHT,
    SEND_TYPE,
    STEPS_CREATE_PLOT,
    deviceEvents,
    initSource,
    isArrayNotEmpty,
} from '../../util/Constants';
import { validatePolygon } from '../../util/polygon';
import Footer from './Footer';
import InvitePeople from './InvitePeople';
import InvitePeopleSheet from './InvitePeople/InvitePeopleSheet';
import ModalSuccess from './ModalConfirmSuccess';
import ModalOverlap from './ModalOverlap';
import ModalSnapping from './ModalSnappingSystem';
import ReviewPlot from './ReviewPlot';
import ModalOverlapNotAllow from './ModalOverlapNotAllow';

let interval;

const scrollStyle = {
    alignItems: 'center',
    minHeight: '100%',
    paddingBottom: 140,
};
const claimantRole = 'owner';
export default function Index(props) {
    const t = useTranslate();
    const { plots: reduxPlots, user } = useShallowEqualSelector((state) => ({
        user: state.user,
        plots: state?.map?.plots || [],
    }));
    const plots = useMemo(() => {
        return reduxPlots.map((i) => i.plots).flat() || []; // Fix this warning: https://redux.js.org/usage/deriving-data-selectors#optimizing-selectors-with-memoization
    }, [reduxPlots]);
    const dispatch = useDispatch();
    const webviewRef = useRef();
    const swiperRef = useRef();
    const progressRef = useRef();
    const progressOptionRef = useRef();
    const navigation = useNavigation();
    const [step, setStep] = useState(0);
    const [requesting, setRequesting] = useState(false);
    const [error, setError] = useState('');
    const [points, setPoints] = useState([]);
    const [invitesPending, setInvitesPending] = useState([]);
    const [showSnapButton, setShowSnapButton] = useState(false);
    const [enableSnap, setEnableSnap] = useState(true);
    const [snapButtonType, setSnapButtonType] = useState(0);
    const [role, setRole] = useState(claimantRole);
    const [dataSubmit, setDataSubmit] = useState({
        plot: {
            geojson: {},
            centroid: [],
            area: 0,
            placeName: '',
        },
        creatorID: user.userInfo._id,
        claimant: role,
    });
    const {
        isOpen: isOpenModalPlotOverlapSnap,
        onOpen: onOpenModalPlotOverlapSnap,
        onClose: onCloseModalPlotOverlapSnap,
    } = useDisclose();

    const {
        isOpen: isOpenSnapping,
        onOpen: onOpenSnapping,
        onClose: onCloseSnapping,
    } = useDisclose();
    const { isOpen: isOpenOverlap, onOpen: onOpenOverlap, onClose: onCloseOverlap } = useDisclose();
    const { isOpen: isOverStep1, onOpen: onOverStep1 } = useDisclose();
    const { isOpen: isOpenSuccess, onOpen: onOpenSuccess } = useDisclose();

    const {
        isOpen: isOpenInviteSheet,
        onOpen: onOpenInviteSheet,
        onClose: onCloseInviteSheet,
    } = useDisclose();
    const [progress, setProgress] = useState(-1);
    const [progressValue, setProgressValue] = useState(0);

    const sendMessage = (data) => {
        webviewRef?.current?.postMessage(JSON.stringify(data));
    };

    useEffect(() => {
        renderOldPlot();
    }, [plots]);

    const renderOldPlot = () => {
        const source = initSource({
            plots: plots,
            id: user.userInfo._id,
        });
        sendMessage({
            type: SEND_TYPE.addSource,
            source: source,
        });
        let polygons = plots.map((item) => item.geojson.geometry.coordinates[0]);
        sendMessage({
            type: SEND_TYPE.polygonListChange,
            polygons,
        });
    };

    const [polygon, setPolygon] = useState('');

    const getSelectedPoint = (index) => {
        return points.filter((e, i) => i === index);
    };

    const startStep1 = (notValidate) => {
        try {
            setError('');
            if (enableSnap && !notValidate) {
                _validatePolygon(onOpenDisputeNotAllow);
            }
            if (!notValidate) {
                _validatePolygon();
            }
            setStep(step + 1);
            let _plot = dataSubmit.plot;
            setShowSnapButton();
            sendMessage({
                type: SEND_TYPE.addSource,
                source: getSource(_plot),
            });
            sendMessage({
                type: SEND_TYPE.removeControl,
                controls: ['geolocateControl', 'navigationControl', 'drawControl'],
            });

            sendMessage({
                type: SEND_TYPE.disabledFeatures,
                features: ['doubleClickZoom', 'dragPan', 'touchZoomRotate', 'scrollZoom'],
            });

            addSourceDefaultFull();
            addSourceSelected(0);
            onOverStep1();
            setTimeout(() => {
                sendMessage({
                    type: SEND_TYPE.fitBoundsByPolygon,
                    polygon: _plot.geojson,
                });
            }, 1000);
        } catch (err) {
            setError(err);
        }
    };

    const addSourceDefaultFull = () => {
        let p = points;
        let source = initSource({
            points: p,
            type: 'default',
            id: 'source_point_default',
        });
        sendMessage({
            type: SEND_TYPE.addSource,
            source,
        });
    };

    const addSourceSelected = (index) => {
        let p = getSelectedPoint(index);
        let source = initSource({
            points: p,
            type: 'selected',
            id: 'source_point_selected',
        });
        sendMessage({
            type: SEND_TYPE.addSource,
            source,
        });
    };

    const getSource = (plot) => {
        let source = initSource({
            plots: [plot],
            type: 'selected',
            id: 'new_plot',
        });

        return source;
    };
    const onPointClick = (data) => {
        let coordinates = JSON.parse(data.coordinates);
        let index = points.findIndex((p) => {
            return p[0] == coordinates[0] && p[1] == coordinates[1];
        });
        if (index !== 0) {
            swiperRef.current.scrollToIndex({ index });
        }
    };

    const onPolygonUpdate = (data) => {
        setPolygon(data.polygon);
        let newData = JSON.parse(JSON.stringify(dataSubmit));
        let points = [];
        data.polygon?.geometry?.coordinates[0]?.forEach((i, index) => {
            if (index < data?.polygon?.geometry?.coordinates[0].length - 1) {
                points.push(i);
            }
        });
        newData.plot.centroid = data?.centroid?.geometry?.coordinates;
        newData.plot.area = data?.area;
        newData.plot.placeName = data?.placeName;
        newData.creatorID = user.userInfo._id;
        newData.plot.geojson = { ...data?.polygon, type: 'Feature' };

        setDataSubmit(newData);
        setPoints(points);
    };

    const onEvent = (data) => {
        switch (data.type) {
            case RECEIVE_TYPE.polygonUpdate:
                onPolygonUpdate(data);
                break;
            case RECEIVE_TYPE.pointClick:
                onPointClick(data.coordinates);
                break;
            case RECEIVE_TYPE.online:
                renderOldPlot();
                break;
            case RECEIVE_TYPE.hideSnapButton:
                if (showSnapButton) {
                    setShowSnapButton(false);
                }
                break;
            case RECEIVE_TYPE.showSnapButton:
                if (!showSnapButton && enableSnap) {
                    if (data.options.corner) {
                        setSnapButtonType(1);
                    } else {
                        setSnapButtonType(0);
                    }
                    setShowSnapButton(true);
                }
                break;
            default:
                break;
        }
    };

    const getStyle = useCallback(() => {
        switch (step) {
            case 0:
                return { height: '100%' };
            case 1:
                return { height: 300, position: 'absolute', opacity: 0 };
            case 2:
                return { height: 300 };
            default:
                return 0;
        }
    }, [step]);

    const _validatePolygon = (callBack) => {
        try {
            validatePolygon(dataSubmit.plot.geojson.geometry.coordinates, plots);
        } catch (err) {
            if (err === OVERLAP_ERROR) {
                callBack ? callBack() : onOpenOverlap();
                throw '';
            }
            throw err;
        }
    };

    const startInterVal = () => {
        interval = setInterval(() => {
            setProgressValue((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                let option = progressOptionRef.current[progressRef.current];
                return prev >= option.maxValue
                    ? option.maxValue
                    : Math.min(option.maxValue, prev + option.addValue);
            });
        }, 250);
    };

    const getProgressOptions = () => {
        const _hasInvitePeople = hasInvitePeople();
        if (_hasInvitePeople) {
            return PROGRESS_OPTIONS[3];
        }
        return PROGRESS_OPTIONS[4];
    };

    const submit = async () => {
        try {
            setError('');
            setRequesting(true);
            setProgress(0);
            progressRef.current = 0;
            progressOptionRef.current = getProgressOptions();
            startInterVal();
            let plot = await _createPlot();
            let max = progressOptionRef.current[progressRef.current].maxValue;
            if (progressValue < max) {
                setProgressValue(max + 1);
            }
            try {
                if (hasInvitePeople()) {
                    progressRef.current = progressRef.current + 1;
                    setProgress(progressRef.current);
                    await _inviteClaimants(plot);
                    let max = progressOptionRef.current[progressRef.current].maxValue;
                    if (progressValue < max) {
                        setProgressValue(max + 1);
                    }
                }
            } catch (err) {}
            let resUserPlots = await getUserPlots(user.userInfo._id, navigation, dispatch);
            dispatch(
                userSliceActions.setData({
                    plots: resUserPlots.data,
                }),
            );
            setProgressValue(100);
            clearInterval(interval);
            setTimeout(() => {
                setProgress(-1);
                onOpenSuccess();
            }, 500);
            DeviceEventEmitter.emit(deviceEvents.explore.centroid, plot.centroid);
            DeviceEventEmitter.emit(deviceEvents.explore.filter, { plot });
            DeviceEventEmitter.emit(deviceEvents.plots.selectPolygon, plot.geojson);
        } catch (err) {
            if (err === 'create plot cancel') {
                return;
            }
            setError(err?.message || err);
            setProgress(-1);
        } finally {
            clearInterval(interval);
            setRequesting(false);
        }
    };

    const _inviteClaimants = async (plot) => {
        if (invitesPending && invitesPending?.length) {
            return await inviteClaimants(
                {
                    claimants: invitesPending,
                    plotID: plot._id,
                },
                navigation,
                dispatch,
            );
        }
    };

    const _createPlot = async () => {
        let res = await createPlot(
            {
                ...dataSubmit,
                claimant: role,
                plot: {
                    geojson: dataSubmit.plot.geojson,
                    centroid: dataSubmit.plot.centroid,
                    area: dataSubmit.plot.area,
                    placeName: dataSubmit.plot.placeName,
                },
            },
            navigation,
            dispatch,
        );
        return res.data;
    };

    const onDeleteUser = (u, index) => {
        let newList = JSON.parse(JSON.stringify(invitesPending));
        newList = newList.filter((e, i) => i !== index);
        setInvitesPending(newList);
    };

    const hasInvitePeople = () => {
        return Boolean(invitesPending && invitesPending.length);
    };
    const _uploadBoundary = async (plot) => {
        for (let index = 0; index < points.length; index++) {
            var form = new FormData();

            if (!isArrayNotEmpty(form._parts)) {
                continue;
            }

            await uploadBoundary(
                {
                    data: form,
                    plotId: plot._id,
                    long: points[index][0],
                    lat: points[index][1],
                },
                navigation,
                dispatch,
            );
        }
    };
    const validateData = (data) => {
        try {
            let error = '';
            invitesPending?.forEach((i) => {
                if (CLAIMANTS.includes(i.relationship)) {
                    if (i.phoneNumber === data.phoneNumber) {
                        error = t('error.phoneInvitedAdded');
                    }
                }
            });
            return error;
        } catch (err) {
            return '';
        }
    };
    const snapPoint = (corner = false) => {
        let data = { type: SEND_TYPE.snapPoint };
        data.options = {
            newSnap: true,
        };
        if (corner) {
            data.options.corner = true;
        }
        sendMessage(data);
    };

    const resetPolygon = () => {
        sendMessage({ type: SEND_TYPE.resetPolygon });
    };

    const getProgressText = (progress) => {
        return progressOptionRef.current[progress]?.text;
    };

    const onOpenDisputeNotAllow = () => {
        if (enableSnap) {
            onOpenModalPlotOverlapSnap();
        }
    };

    const detectBoundaryDispute = () => {
        try {
            setError('');
            _validatePolygon(onOpenDisputeNotAllow);
        } catch (err) {
            setError(err);
        }
    };

    useEffect(() => {
        if (dataSubmit?.plot?.geojson?.geometry?.coordinates && step === 0) {
            detectBoundaryDispute();
        }
    }, [dataSubmit, enableSnap, polygon]);

    return (
        <>
            <Box
                py="12px"
                px="4px"
                bg="white"
                borderBottomColor="rgba(0, 0, 0, 0.6)"
                borderBottomWidth="1px"
            >
                <AgentHeader style={styles.agentHeader} />
                <Box flexDirection="row" alignItems="center">
                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack(null);
                        }}
                    >
                        <Icon
                            as={<MaterialCommunityIcons name="close" />}
                            size={6}
                            ml="2"
                            color="black"
                        />
                    </TouchableOpacity>

                    <Text ml="12px" fontSize="16px" fontWeight="bold">
                        {t('plot.createAPlot')}
                    </Text>
                </Box>
                <Steps steps={STEPS_CREATE_PLOT} step={step} />
            </Box>

            <ScrollView
                h="full"
                bg="white"
                scrollEnabled={step === 0 ? false : true}
                contentContainerStyle={scrollStyle}
                overScrollMode="never"
            >
                <Box h="full" w="full">
                    {step === 1 && (
                        <InvitePeople
                            ownerInfo={user.userInfo}
                            onPress={onDeleteUser}
                            onOpenInviteSheet={onOpenInviteSheet}
                            role={role}
                            setRole={setRole}
                            invitesPending={invitesPending}
                        />
                    )}
                    <Box style={getStyle()}>
                        {/* <Map
                            onEvent={onEvent}
                            mapRef={webviewRef}
                            style={getStyle()}
                            search={`features=3&controls=1,2,3${
                                props.route?.params?.longlat
                                    ? `&longlat=${props?.route?.params?.longlat}`
                                    : ''
                            }${
                                props.route?.params?.zoom
                                    ? `&zoom=${props?.route?.params?.zoom || 6}`
                                    : ''
                            }`}
                        /> */}

                        <DrawMap
                            style={getStyle()}
                            longlat={props.route?.params?.longlat}
                            zoom={props.route?.params?.zoom}
                            webviewRef={webviewRef}
                            onEvent={onEvent}
                            showControls={step === 0}
                            onPolygonUpdate={onPolygonUpdate}
                            onOpenSnapping={onOpenSnapping}
                            setEnableSnap={setEnableSnap}
                            isOverStep1={isOverStep1}
                        />

                        {[2].includes(step) && (
                            <Box position="absolute" w="100%" h="100%">
                                <TouchableOpacity onPress={() => {}}>
                                    <Box w="100%" h="100%"></Box>
                                </TouchableOpacity>
                            </Box>
                        )}
                    </Box>
                    {step === 2 && (
                        <ReviewPlot
                            plotData={dataSubmit.plot}
                            invitesPending={invitesPending}
                            userInfo={{ ...user.userInfo, role: role }}
                            images={[]}
                            showPlotID={false}
                            onDeleteClaimant={onDeleteUser}
                            setInvitePeople={() => {
                                onOpenInviteSheet();
                            }}
                        />
                    )}
                </Box>
            </ScrollView>
            <SnapButton
                open={showSnapButton}
                snapPoint={snapPoint}
                onOpenSnapping={onOpenSnapping}
                type={snapButtonType}
            />
            {/* footer */}
            <Footer
                step={step}
                polygon={polygon}
                setStep={setStep}
                error={error}
                requesting={requesting}
                submit={submit}
                files={[]}
                points={points}
                uploadBoundary={_uploadBoundary}
                startStep1={startStep1}
                resetPolygon={resetPolygon}
            />
            {progress > -1 && (
                <Box
                    position="absolute"
                    alignItems="center"
                    justifyContent="center"
                    w="full"
                    bottom={0}
                    h={SCREEN_HEIGHT - 0}
                    bgColor="rgba(0,0,0,.6)"
                    px="22px"
                >
                    <Progress value={progressValue} w="100%" />
                    <Text fontSize="16px" mt="12px" color="white">
                        {getProgressText(progress)}
                    </Text>
                </Box>
            )}
            <ModalSnapping isOpen={isOpenSnapping} onClose={onCloseSnapping} />
            <ModalOverlap onClose={onCloseOverlap} isOpen={isOpenOverlap} onSubmit={startStep1} />
            <ModalOverlapNotAllow
                onClose={onCloseModalPlotOverlapSnap}
                isVisible={isOpenModalPlotOverlapSnap}
            />
            <InvitePeopleSheet
                isOpen={isOpenInviteSheet}
                onClose={onCloseInviteSheet}
                onPress={() => {
                    step === 1 ? setStep(step + 1) : onCloseInviteSheet();
                }}
                list={invitesPending}
                setList={setInvitesPending}
                buttonLabel={step === 2 ? t('button.close') : t('button.next')}
                buttonProps={
                    step === 2
                        ? {
                              variant: 'outline',
                              onPress: onCloseInviteSheet,
                              isDisabled: false,
                          }
                        : {}
                }
                validateData={validateData}
            />
            <ModalSuccess isOpen={isOpenSuccess} />
        </>
    );
}

const styles = StyleSheet.create({
    agentHeader: {
        marginTop: '-12px',
    },
});
