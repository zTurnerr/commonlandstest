import { useNavigation } from '@react-navigation/native';
import { useDisclose, useTheme } from 'native-base';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import useTranslate from '../i18n/useTranslate';
// eslint-disable-next-line react-native/split-platform-components
import { Alert, Keyboard, Linking, PermissionsAndroid } from 'react-native';
import Share from 'react-native-share';
import { useDispatch } from 'react-redux';
import useShallowEqualSelector from '../redux/customHook/useShallowEqualSelector';
import { userSliceActions } from '../redux/reducer/user';
import { DeviceEventEmitter } from 'react-native';
import {
    getAllPlotFlagged,
    getInvitesByPlotFlagged,
    getInvitesByPlotID,
    getPlotFlaggedBoundaryImage,
    inviteClaimantPlotFlagged,
    updateBoundaryFlagged,
    updateStatusInviteClaimant,
    updateStatusInviteNeightbor,
    uploadBoundaryFlagged,
    deletePlot,
} from '../rest_client/apiClient';
import { around_plot_id } from '../screen/PlotInfo/Constants';
import ButtonConfirm from '../screen/PlotInfo/components/ButtonConfirm';
import {
    INVITE_STATUS,
    NEIGHTBORS,
    RECEIVE_TYPE,
    SEND_TYPE,
    boundaryDisputeColor,
    boundaryDisputeOutlineColor,
    deepClone,
    getDownloadUrl,
    getPlotStatus,
    getUrlShare,
    initSource,
    isArrayNotEmpty,
    ownerShipDisputeColor,
    ownerShipDisputeOutlineColor,
    deviceEvents,
} from '../util/Constants';
import { downloadFileFromURI } from '../util/script';

let interval;

export const usePlotInfo = ({ plotFlagged, isFlagged = false }) => {
    const t = useTranslate();
    const navigation = useNavigation();
    const webviewRef = useRef();
    const [statusMap, setStatusMap] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclose();
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const { isOpen: isOpenAccept, onOpen: onOpenAccept, onClose: onCloseAccept } = useDisclose();
    const {
        isOpen: isOpenInviteSheet,
        onOpen: onOpenInviteSheet,
        onClose: onCloseInviteSheet,
    } = useDisclose();
    const { user } = useShallowEqualSelector((state) => ({
        user: state.user,
    }));
    const sendMessage = (data) => {
        webviewRef?.current?.postMessage(JSON.stringify(data));
    };
    const {
        isOpen: isOpenAcceptClaimant,
        onOpen: onOpenAcceptClaimant,
        onClose: onCloseAcceptClaimant,
    } = useDisclose();

    const [plotsInvites, setPlotsInvites] = useState({});
    const [plotsN, setPlotsN] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState('');
    const [step, setStep] = useState(0);
    const [files, setFiles] = useState([]);
    const [images, setImages] = useState([]);
    const [activeImage, setActiveImage] = useState('');
    const [iDMarkerActive, setIDMarkerActive] = useState(null);
    const [selectedInvite, setSelectedInvite] = useState('');
    const [progressValue, setProgressValue] = useState(10);
    const [deleteFilesList, setDeleteFilesList] = useState([]);
    const [requesting, setRequesting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error] = useState('');
    const [updateError, setUpdateError] = useState('');
    const [newFiles, setNewFiles] = useState([]);
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclose();
    const TITLE = [
        t('others.plotView'),
        t('components.invitePeople'),
        t('plotInfo.editPlot'),
        t('subplot.photos'),
        t('subplot.manageClaimants'),
        t('subplot.manageNeighbors'),
    ];
    const { plot } = plotFlagged || {};
    const { _id, name, geojson, centroid } = plot || {};
    const coordinates = geojson?.geometry?.coordinates || [];
    const [points, setPoints] = useState([]);
    const [tab, setTab] = useState(1);

    useEffect(() => {
        if (coordinates?.[0]) {
            let newPoint = coordinates?.[0]?.slice(0, coordinates?.[0]?.length - 1);
            setPoints(newPoint);
        }
    }, [plotFlagged]);

    useEffect(() => {
        if (plot && isFlagged) {
            getInvites();
            getImagePlot();
            setTimeout(async () => {
                await renderPlot();
            }, 3500);
        }
    }, [plot, statusMap]);

    const getImagePlot = async () => {
        try {
            let response = await getPlotFlaggedBoundaryImage(_id);
            if (response?.data) {
                await initImages(response?.data, plot);
            }
        } catch (_error) {}
    };

    const updatePlotSuccess = async () => {
        let response = await getAllPlotFlagged();
        if (response?.data) {
            dispatch(
                userSliceActions.setData({
                    plotFlagged: response?.data,
                }),
            );
        }
    };

    const initImages = async (_images, _plotData) => {
        let points = _plotData?.geojson?.geometry?.coordinates?.[0];
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

    const isOwnerPlot = (plot) => {
        let found = user.plots?.some((p) => p.id === plot.id);
        return found;
    };

    const renderPlot = async () => {
        try {
            let boundsPolygon = {
                geometry: { type: 'Polygon', coordinates: [[]] },
                type: 'Feature',
            };

            boundsPolygon.geometry.coordinates[0] = [
                geojson.geometry.coordinates[0][geojson.geometry.coordinates[0].length - 1],
                ...boundsPolygon.geometry.coordinates[0].concat(geojson.geometry.coordinates[0]),
            ];
            let _plot = deepClone(plot);
            _plot.isOwner = isOwnerPlot(plot);
            _plot.properties = {
                // fill color for plot
                color: 'rgba(58, 151, 173, 1)',
                fillOpacity: 0.9,
            };
            // set color for plot is boundaryDisputeColor
            if (_plot.isBoundaryDispute) {
                _plot.properties.color = boundaryDisputeColor;
                _plot.properties.outlineColor = boundaryDisputeOutlineColor;
            }

            // set color for plot is ownerShipDisputeColor
            if (_plot.isOwnershipDispute) {
                _plot.properties.color = ownerShipDisputeColor;
                _plot.properties.outlineColor = ownerShipDisputeOutlineColor;
            }
            const source = await initSource({
                plots: [_plot],
                id: around_plot_id,
                type: 'fill_by_color_properties',
            });
            await sendMessage({
                type: SEND_TYPE.fitBoundsByPolygon,
                polygon: boundsPolygon,
            });
            await sendMessage({
                type: SEND_TYPE.addSource,
                source: source,
            });
        } catch (err) {}
    };

    const download = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: t('shareAndPermission.titlePermission'),
                    message: t('shareAndPermission.contentPermission'),
                    ok: '',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                await downloadFileFromURI(getDownloadUrl(_id), name + '.pdf', true);
            } else {
                Alert.alert('Error', t('error.storageNotGranted'), [
                    { text: t('button.ok2'), onPress: () => Linking.openSettings() },
                ]);
            }
        } catch (err) {
            Alert.alert('Error', err.message, [{ text: t('button.ok2') }]);
            throw err;
        }
    };

    const onEvent = (data) => {
        try {
            switch (data.type) {
                case RECEIVE_TYPE.online:
                    setStatusMap(true);
                    sendMessage({
                        type: SEND_TYPE.removeControl,
                        controls: ['geolocateControl', 'navigationControl', 'drawControl'],
                    });
                    sendMessage({
                        type: SEND_TYPE.disabledFeatures,
                        features: ['doubleClickZoom', 'dragPan', 'touchZoomRotate', 'scrollZoom'],
                    });

                    break;
                default:
                    break;
            }
        } catch (err) {}
    };

    const onInviteClaimantFlagged = async ({ invitesPending, plotID }) => {
        let data = {
            claimants: invitesPending,
            plotID,
            forFlag: true,
        };
        setRequesting(true);
        try {
            await inviteClaimantPlotFlagged(data, navigation, dispatch);
            await getInvites();
        } catch (_error) {
        } finally {
            setRequesting(false);
        }
    };

    const renderMarkerImageSelected = (image) => {
        let source = initSource({
            points: image ? [image.points] : [],
            type: 'selected',
            id: 'source_point_selected_image',
        });
        sendMessage({
            type: SEND_TYPE.addSource,
            source,
        });
    };

    const getStyle = useCallback(() => {
        switch (step) {
            case 0:
                return { height: 250 };
            default:
                return { height: 250 };
        }
    }, [step]);

    const setInvitePeople = (step = 1) => {
        renderMarkerImageSelected('');
        setStep(step);
    };

    const _acceptNeightbor = async () => {
        try {
            let d = JSON.parse(JSON.stringify(plotsN));
            d[selectedIndex] = {
                ...d[selectedIndex],
                status: INVITE_STATUS.accepted,
            };

            await updateStatusInviteNeightbor(
                {
                    inviteID: d[selectedIndex].inviteID,
                    accept: true,
                },
                navigation,
                dispatch,
            );
            let resInvites = await getInvitesByPlotID({ id: plot._id }, navigation, dispatch);
            setPlotsInvites(resInvites.data);
            setPlotsN(d);
            onCloseAccept();
        } catch (err) {
            throw err;
        }
    };

    // action call from step invite people
    const onReject = async () => {
        try {
            let d = JSON.parse(JSON.stringify(plotsN));
            d[selectedIndex] = {
                ...d[selectedIndex],
                status: INVITE_STATUS.rejected,
            };

            await updateStatusInviteNeightbor(
                {
                    inviteID: d[selectedIndex].inviteID,
                    accept: false,
                },
                navigation,
                dispatch,
            );
            let resInvites = await getInvitesByPlotID({ id: plot?._id }, navigation, dispatch);
            setPlotsInvites(resInvites.data);
            setPlotsN(d);
            onCloseAccept();
        } catch (err) {
            throw err;
        }
    };

    const onEditPlot = () => {
        setStep(() => 2);
        setPlotsN(() => []);
        const source = initSource({
            plots: [],
            id: around_plot_id,
            type: 'fill_by_color_properties',
        });
        sendMessage({
            type: SEND_TYPE.addSource,
            source: source,
        });
    };

    // action call from step view detail
    const acceptClaimantOrNeightBor = async () => {
        if (selectedInvite.relationship === NEIGHTBORS[0]) {
            await updateStatusInviteNeightbor(
                {
                    inviteID: selectedInvite._id,
                    accept: true,
                },
                navigation,
                dispatch,
            );
        } else {
            await updateStatusInviteClaimant(
                {
                    inviteID: selectedInvite._id,
                    accept: true,
                    isSub: Boolean(selectedInvite.subPlotId),
                },
                navigation,
                dispatch,
            );
        }
    };

    const cancelUploadFile = () => {
        onChangeStep(0);
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

    const onSubmittedImages = async () => {
        setStep(0);
        await renderPlot();
    };

    const share = async () => {
        let data = {
            id: _id,
            longlat: centroid,
        };
        try {
            let uri = getUrlShare(data);
            await Share.open({
                title: t('subplot.titleShare'),
                message: `${t('subplot.secureMyLand')}: `,
                url: uri,
            });
        } catch (err) {}
    };

    const onImagePress = (image) => {
        if (image) {
            setActiveImage(image);
            setStep(() => 3);
            setPlotsN(() => []);
            const source = initSource({
                plots: [],
                id: around_plot_id,
                type: 'fill_by_color_properties',
            });
            sendMessage({
                type: SEND_TYPE.addSource,
                source: source,
            });
            hideMarker();
        }
    };

    const getViewPhotosData = () => {
        let data = {
            activePoint: 0,
            imageActiveIndex: 0,
        };
        data.activePoint = points.findIndex((p) => {
            return p[0] === activeImage?.points[0] && p[1] === activeImage?.points[1];
        });
        data.imageActiveIndex = files[data.activePoint]?.images?.findIndex((i) => {
            return i.uri === activeImage?.uri;
        });
        return data;
    };

    const getStatus = () => {
        return getPlotStatus({
            plot: plot,
        });
    };

    // toggle marker
    const onPlotPress = (item) => {
        let isActive = item._id === iDMarkerActive;
        setIDMarkerActive(isActive ? null : item._id);
        sendMessage({
            type: SEND_TYPE.addMarker,
            longlat: isActive ? null : item.centroid,
            style: {
                color: 'red',
            },
        });
    };

    const hideMarker = () => {
        sendMessage({
            type: SEND_TYPE.addMarker,
            longlat: null,
        });
        setIDMarkerActive(null);
    };

    const getInvites = async () => {
        setIsLoading(true);
        try {
            let resInvites = await getInvitesByPlotFlagged({ id: _id }, navigation, dispatch);
            let created = resInvites?.data?.created.map((invite) => ({
                ...invite,
                button:
                    invite.inviteePhoneNumber === user.userInfo.phoneNumber ? (
                        <ButtonConfirm
                            invite={invite}
                            onOpenAcceptClaimant={onOpenAcceptClaimant}
                            setSelectedInvite={setSelectedInvite}
                        />
                    ) : null,
            }));
            setPlotsInvites(() => ({ ...resInvites?.data, created }));
        } catch (_error) {
            console.log(_error);
        } finally {
            setIsLoading(false);
        }
    };

    const _uploadBoundary = async () => {
        try {
            setUpdateError('');
            setRequesting(true);
            startInterVal();
            let length = points?.length;
            for (let index = 0; index < length; index++) {
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
                let data = {
                    data: form,
                    plotId: _id,
                    long: points[index][0],
                    lat: points[index][1],
                };
                if (isUpdate) {
                    const res = await updateBoundaryFlagged(data, navigation, dispatch);
                    if (res?.data) {
                        await getImagePlot();
                    }
                } else {
                    const res = await uploadBoundaryFlagged(data, navigation, dispatch);
                    if (res?.data) {
                        await getImagePlot();
                    }
                }
                Keyboard.dismiss();
                await updatePlotSuccess();
            }
            setProgressValue(94);
            clearInterval(interval);
            setTimeout(async () => {
                onSubmittedImages();
                setDeleteFilesList([]);
                setProgressValue(10);
                setRequesting(false);
            }, 100);
        } catch (err) {
            clearInterval(interval);
            setRequesting(false);
            setProgressValue(10);
            setUpdateError(err?.message || err);
        }
    };

    const onChangeStep = async (number) => {
        await renderPlot();
        setStep(number);
    };

    const onSetSelectedIndex = (index) => {
        setSelectedIndex(index);
    };

    const onSetIDMarkerActive = (id) => {
        setIDMarkerActive(id);
    };

    const onSetNewFiles = (data) => {
        setNewFiles(data);
    };

    const onSetDeleteFilesList = (file) => {
        setDeleteFilesList(file);
    };

    const onChangeTab = (number) => {
        setTab(number);
    };

    const onSelectAction = (key) => {
        switch (key) {
            case 'editPlot':
                onEditPlot();
                break;
            case 'managerClaimants':
                setInvitePeople(4);
                hideMarker();
                break;
            case 'managerNeighbors':
                setInvitePeople(5);
                hideMarker();
                break;
            case 'deletePlot':
                onOpenDelete();
                break;
            default:
                break;
        }
    };
    const onInvites = async (invitesPending) => {
        try {
            await onInviteClaimantFlagged({ invitesPending, plotID: plotFlagged?.plot?._id });
            await getInvites(plotFlagged?.plot?._id);
            onCloseInviteSheet();
        } catch (err) {
            throw err;
        }
    };
    const onDeleteInvite = async (data) => {
        try {
            console.log('onDeleteInvite', data);
            // await deleteInvite(data._id, navigation, dispatch);
            // await getInvites(plotData?.plot?._id);
        } catch (err) {
            // throw err;
        }
    };
    const onDeleteClaimant = async (data) => {
        try {
            console.log('onDeleteClaimant', data);
            // await deleteClaimant(data._id, navigation, dispatch);
            // await _getPlotData();
        } catch (err) {
            throw err;
        }
    };
    const onDeletePlot = async (plotName) => {
        try {
            if (plotName !== plotFlagged.plot?.name) {
                throw t('error.plotNotCorrect');
            }
            await deletePlot(plotFlagged.plot?._id, navigation, dispatch);

            await updatePlotSuccess();
            DeviceEventEmitter.emit(deviceEvents.plots.unSelectPolygon);
            if (navigation.canGoBack()) {
                navigation.goBack();
            } else {
                navigation.navigate('Main');
            }
        } catch (err) {
            throw err;
        }
    };
    return {
        onDeleteInvite,
        onDeleteClaimant,
        onSelectAction,
        download,
        onEvent,
        sendMessage,
        onInviteClaimantFlagged,
        getStyle,
        setInvitePeople,
        _acceptNeightbor,
        onReject,
        onEditPlot,
        initImages,
        acceptClaimantOrNeightBor,
        cancelUploadFile,
        startInterVal,
        onSubmittedImages,
        share,
        onImagePress,
        getViewPhotosData,
        getStatus,
        onPlotPress,
        hideMarker,
        getInvites,
        requesting,
        _uploadBoundary,
        step,
        onChangeStep,
        isOpenAccept,
        onOpenAccept,
        onCloseAccept,
        isOpenAcceptClaimant,
        onCloseAcceptClaimant,
        navigation,
        selectedInvite,
        webviewRef,
        coordinates,
        selectedIndex,
        onSetSelectedIndex,
        progressValue,
        TITLE,
        plotsN,
        plotsInvites,
        images,
        files,
        isLoading,
        error,
        updateError,
        iDMarkerActive,
        onSetIDMarkerActive,
        isOpen,
        onOpen,
        onClose,
        newFiles,
        onSetNewFiles,
        deleteFilesList,
        onSetDeleteFilesList,
        colors,
        setNewFiles,
        points,
        tab,
        onChangeTab,
        isOpenInviteSheet,
        onOpenInviteSheet,
        onCloseInviteSheet,
        onInvites,
        isOpenDelete,
        onCloseDelete,
        onDeletePlot,
    };
};
