/* eslint-disable react-native/no-inline-styles */
import { Box, IconButton, ScrollView, Skeleton, Text } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import useTranslate from '../../i18n/useTranslate';
import {
    cancelInvite,
    getEditPlotPolygon,
    getEditPlotPolygonBeDispute,
    getInvitesByPlotID,
    getNeighborByPlotID,
    getPlotBoundaryImage,
    getPlotByID,
} from '../../rest_client/apiClient';
import {
    INVITE_STATUS,
    NEIGHTBORS,
    RECEIVE_TYPE,
    SCREEN_HEIGHT,
    SEND_TYPE,
    boundaryDisputeColor,
    deepClone,
    getDataForRenderWithPlot,
    getUrlShare,
    initSource,
    ownerShipDisputeColor,
    subplotColor,
} from '../../util/Constants';
import {
    INVITE_TAB,
    SPACIAL_TAB,
    around_plot_id,
    isCreateSubplot,
    isEditPlot,
    isEditPolygon,
    isManagerClaimants,
    isManagerNeighbors,
    isPlotView,
    isViewPhotos,
} from './Constants';

import { useNavigation } from '@react-navigation/core';
import { useDisclose } from 'native-base';
import { EventRegister } from 'react-native-event-listeners';
import { useDispatch } from 'react-redux';
import ClaimantRemoveSuccessAlert from '../../components/Alert/ClaimantRemoveSuccessAlert';
import ReqClaimantSuccessAlert from '../../components/Alert/ReqClaimantSuccessAlert';
import Map from '../../components/Map';
import { useModalCannotDelete } from '../../components/Plot/ModalCannotDelete';
import { getPlotStatus } from '../../components/PlotStatus';
import { EVENT_NAME } from '../../constants/eventName';
import usePlotNumberOwner from '../../hooks/Plot/usePlotNumberOwner';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import ModalCreateSubPlotSuccess from '../../screen/CreatePlot/ModalConfirmSuccess';
import ReviewPlot from '../CreatePlot/ReviewPlot';
import CreateSubplot from './CreateSubPlot';
import EditPlot from './EditPlot';
import InvitePeopleStep from './InvitePeopleStep';
import ModalAcceptDeclineOwnership from './ModalAcceptDeclineOwnership';
import ModalConfirmDelete from './ModalConfirmDeletePlot';
import { useModalAcceptNeighbor } from './ModalConfirmInvite';
import ModalConfirmInviteClaimant from './ModalConfirmInviteClaimant';
import { useModalInviteNeighbor } from './ModalInvite';
import ModalWithdrawalPlot from './ModalWithdrawalPlot';
import ViewPhotos from './ViewPhotos';
import AnnounceWithdrawal from './components/AnnounceWithdrawal';
import ButtonConfirm from './components/ButtonConfirm';
import ButtonGoToInviteNeightbor from './components/ButtonGoToInviteNeightbor';
import ButtonInviteClamant from './components/ButtonInviteClaimant';
import GroupButtonEditStep from './components/GroupButtonEditStep';
import GroupButtonCreateSubPlot from './components/GroupsButtonCreateSubPlot';
import GroupButtonEditPolygon from './components/GroupsButtonEditPolygon';
import Header from './components/Header';
import HeaderCreateSubPlot from './components/HeaderCreateSubPlot';
import HeaderEditPolygon from './components/HeaderEditPolygon';
import InvitePeopleSheet from './components/InvitePeopleSheet';
import ResponseToAssign from './components/ResponseToAssign';
import ResponseToTransferOwnership from './components/ResponseToTransferOwnership';
import { useImageBoundary } from './components/Uploading';
import { useCreateSubPlot } from './hooks/useCreateSubPlot';
import FullScreenDetail from './FullScreenDetail';
import Share from 'react-native-share';
import useEditPolygonPlot from './hooks/useEditPolygonPlot';
import HeaderAnnounceEditPolygon from './components/HeaderAnnounceEditPolygon';
import useFunctionOnCreateEditMap from '../../hooks/useFunctionOnCreateEditMap';
import GroupDrawPlotFeature from '../../components/Button/GroupDrawPlotFeature';
import useMapWebview from '../../hooks/Webview/useMapWebview';
import usePlotNeighbor from '../../hooks/Plot/usePlotNeighbor';
import { useGuestPlotActionSheet } from '../../components/ActionSheet/GuestPlotActionSheet';
import HorizontalThreeDot from '../../components/Icons/HorizontalThreeDot';
import ModalCannotAttest from '../../components/Modal/ModalCannotAttest';
import { plotDetailPageFunction } from '../../redux/reducer/page/plotDetailPageSlice';
import { StyleOfGeolocation } from '../../components/DrawMap/styleMap';

export default function Index(props) {
    const { route } = props;
    const navigation = useNavigation();
    const t = useTranslate();
    const dispatch = useDispatch();
    const { user } = useShallowEqualSelector((state) => ({
        user: state.user,
    }));
    const plotDataProps = props.plotData;
    const refAnnounce = props.refAnnounce;
    let { plotID, longlat, manageNeighbors, requestAssignPlotId } = route?.params || {};
    const [statePlotID, setPlotID] = useState('');
    const [step, setStep] = useState(0);
    const [plotsInvites, setPlotsInvites] = useState({});
    const [plotData, setPlotData] = useState(null);
    const {
        plotNeighborIds,
        plotNeighbors,
        selectedNeighborIndex,
        setPlotNeighbors,
        setSelectedNeighborIndex,
        setPlotNeighborIds,
        onInviteNeighbor,
        _acceptNeightbor,
        onRejectNeighbor,
    } = usePlotNeighbor(plotData, setPlotsInvites);
    const [pointsOfPlot, setPointsOfPlot] = useState([]);
    const [statusMap, setStatusMap] = useState(false);
    const [ghostPlotDisputes, setGhostPlotDisputes] = useState([]);
    usePlotNumberOwner(plotData?.claimants);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [iDMarkerActive, setIDMarkerActive] = useState(null);
    const { onOpenModalInvite, ModalInviteNeighbor } = useModalInviteNeighbor();
    const [scrollEnabled, setScrollEnabled] = useState(true);
    const { onOpenModalAcceptNeighbor, ModalAcceptNeighbor } = useModalAcceptNeighbor();
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclose();
    const [showSnapButton, setShowSnapButton] = useState(false);
    const [snapButtonType, setSnapButtonType] = useState(0);
    const modalCannotDelHook = useModalCannotDelete();
    const {
        isOpen: isOpenInviteSheet,
        onOpen: onOpenInviteSheet,
        onClose: onCloseInviteSheet,
    } = useDisclose();
    const [tab, setTab] = useState(1);
    const {
        isOpen: isOpenAcceptClaimant,
        onOpen: onOpenAcceptClaimant,
        onClose: onCloseAcceptClaimant,
    } = useDisclose();
    const {
        isOpen: isOpenWithdrawalPlot,
        onOpen: onOpenWithdrawalPlot,
        onClose: onCloseWithdrawalPlot,
    } = useDisclose();
    const {
        isOpen: isOpenWholeMap,
        onOpen: onOpenWholeMap,
        onClose: onCloseWholeMap,
    } = useDisclose();
    const guestPlotSheetHook = useGuestPlotActionSheet();

    const [selectedInvite, setSelectedInvite] = useState('');
    const [boundsOfPolygon, setBoundsOfPolygon] = useState(null);
    const [responseTransfer, setResponseTransfer] = useState(refAnnounce.current.announce);
    const webviewRef = useRef();
    const { sendMessage, lockMap, unlockMap, centerMap } = useMapWebview(webviewRef, plotData);
    const scrollViewRef = useRef();

    const imageBoundaryHook = useImageBoundary();
    const {
        requesting,
        images,
        files,
        initImages,
        updateImageError,
        newFiles,
        setNewFiles,
        deleteFilesList,
        setDeleteFilesList,
        _uploadBoundary,
        setActiveImage,
        getViewPhotosData,
    } = imageBoundaryHook;
    const TITLE = [
        t('others.plotView'),
        t('components.invitePeople'),
        t('plotInfo.editPhotosBoundary'),
        t('subplot.photos'),
        t('subplot.manageClaimants'),
        t('subplot.manageNeighbors'),
        t('subplot.createSubPlot'),
        t('plotInfo.editPlot'),
    ];

    const getTitle = () => {
        if (isOpenWholeMap) {
            return t('plot.plotWithName', {
                name: plotData?.plot?.name,
            });
        }

        if (isManagerClaimants(step, tab)) {
            return TITLE[4];
        }
        if (isManagerNeighbors(step, tab)) {
            return TITLE[5];
        }
        return TITLE[step];
    };

    const getEditPlotData = async (plotData) => {
        let resPlotEditing = {};
        let smallRes = {};
        try {
            if (user.userInfo?._id && plotID) {
                resPlotEditing = await getEditPlotPolygon(plotID, navigation, dispatch);
            }
        } catch (err) {
            if (
                err?.includes('No pending edit plot request') ||
                err.includes('are no longer claimants')
            ) {
                console.log('No edit plot');
            } else throw err;
        }
        try {
            if (user.userInfo?._id && plotID) {
                smallRes = await getEditPlotPolygonBeDispute(plotID, navigation, dispatch);
                setGhostPlotDisputes(smallRes.data?.data || []);
            }
        } catch (err) {
            throw err;
        }
        if (resPlotEditing?.data?.ghostPlot?.status === 'pending') {
            plotData.isEditing = true;
            plotData.allOwnersVoted = resPlotEditing?.data?.allOwnersVoted;
        } else if (smallRes?.data?.data?.[0]?.status === 'pending') {
            plotData.isBeingGhostDispute = true;
        }
    };

    // fetch and init data repair for render plot function
    const _getPlotData = async (defaultData) => {
        try {
            let res = {};
            if (defaultData) {
                res = { data: defaultData };
            } else {
                if (user?.userInfo?._id && plotID) {
                    res = await getPlotByID(plotID, navigation, dispatch);
                }
            }
            await getEditPlotData(res.data);
            if (res.data) {
                if (res.data?.isFlagged) {
                    throw t('subplot.plotIsFlagged');
                }
                res.data.closePlots = res.data.closePlots || [];
                res.data.closePlots.push(res.data.plot);
                //check user have permission to accept neighbor invitation
                // exp: user is owner, render this plot
                if (res?.data?.permissions?.acceptNeighborInvitation) {
                    try {
                        await getInvites(res.data.plot._id, navigation, dispatch);
                    } catch (err) {}
                    //if user have any invite from this plot, render this invite and button confirm
                } else {
                    let invites = [];
                    if (res?.data?.invites) {
                        //show invites of this plot if user have invite pending
                        invites = res.data.invites.map((invite) => ({
                            ...invite,
                            button:
                                invite.inviteePhoneNumber === user.userInfo.phoneNumber ? (
                                    <ButtonConfirm
                                        // invite data will pass to ModalConfirmInvite
                                        invite={{
                                            ...invite,
                                            createdBy: res.data.claimants.find((i) => {
                                                return i._id === invite.createdBy;
                                            }),
                                            plotID: {
                                                ...res.data.plot,
                                            },
                                        }}
                                        onOpenAcceptClaimant={onOpenAcceptClaimant}
                                        setSelectedInvite={setSelectedInvite}
                                        key={0}
                                    />
                                ) : null,
                        }));
                    }
                    setPlotsInvites(() => ({
                        created: invites,
                    }));
                }
                if (res?.data?.plot?._id) {
                    let resNeighbor = await getNeighborByPlotID(res.data.plot._id);
                    setPlotNeighborIds(resNeighbor.data?.neighbors);
                    let imagesRes = await getPlotBoundaryImage(res.data.plot._id);
                    initImages(imagesRes.data, res.data.plot);
                }

                setPointsOfPlot(
                    res.data.plot.geojson.geometry.coordinates[0].slice(
                        0,
                        res.data.plot.geojson.geometry.coordinates[0].length - 1,
                    ),
                );
                if (res?.data?.plot?.disputes) {
                    res.data.plot.disputes = res.data.plot.disputes.map((dispute) => {
                        return {
                            ...dispute.plot,
                            // status: dispute.status === 'pending' ? t('plot.pending') : 'Resolved',
                        };
                    });
                }

                // map claimant(renter) to subplot
                if (res?.data?.subPlots) {
                    res.data.subPlots.forEach((subPlot) => {
                        let index = res.data.claimants.findIndex((claimant) => {
                            return subPlot.claimants.some((i) => i.user === claimant._id);
                        });
                        if (index >= 0) {
                            res.data.claimants[index].subPlotId = subPlot._id;
                        }
                    });
                }

                if (!res.data?.plot?.centroid && res.data?.centroid) {
                    res.data.plot.centroid = res.data.centroid;
                }
                setPlotData(res.data);
                plotDetailPageFunction.updatePlotData(res.data);
            }
        } catch (err) {
            setError(err?.message || err);
        }
    };

    const initData = async (isRefetch = false) => {
        try {
            setIsLoading(true);
            setError('');
            await _getPlotData(isRefetch ? null : plotDataProps);
        } catch (err) {
            setError(err?.message || err);
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const init = async () => {
            if (plotID && plotID !== statePlotID) {
                setPlotID(plotID);
                await initData();
                if (manageNeighbors) {
                    setStep(5);
                }
            } else if (requestAssignPlotId) {
                await initData();
            }
        };
        init();
    }, [plotID]);
    const setInvitePeople = (step = 1) => {
        renderMarkerImageSelected('');
        setStep(step);
    };
    const getMapStyle = () => {
        if (isCreateSubplot(step)) {
            if (isReviewCreateSubPlotStep()) {
                return { height: 250 };
            }
            return { height: SCREEN_HEIGHT - 200 };
        }
        if (isEditPolygon(step)) {
            if (isOnReviewEditPolygonStep()) {
                return { height: 250 };
            }
            return { height: SCREEN_HEIGHT - 200 };
        }
        if (isOpenWholeMap)
            return {
                height: SCREEN_HEIGHT + 50,
            };
        return { height: 250 };
    };

    const onWebviewEvent = (data) => {
        try {
            switch (data.type) {
                case RECEIVE_TYPE.online:
                    setStatusMap(true);
                    sendMessage({
                        type: SEND_TYPE.removeControl,
                        controls: ['geolocateControl', 'navigationControl', 'drawControl'],
                    });
                    sendMessage({
                        type: SEND_TYPE.styleMap,
                        style: StyleOfGeolocation,
                    });
                    lockMap();
                    break;
                case RECEIVE_TYPE.polygonUpdate:
                    onPolygonUpdate(data);
                    onPolygonUpdateEdit(data);
                    break;
                case RECEIVE_TYPE.showSnapButton:
                    if (!showSnapButton && isEnableSnap) {
                        if (data.options.corner) {
                            setSnapButtonType(1);
                        } else {
                            setSnapButtonType(0);
                        }
                        setShowSnapButton(true);
                    }
                    break;
                case RECEIVE_TYPE.hideSnapButton:
                    if (showSnapButton) {
                        setShowSnapButton(false);
                    }
                    break;
                case RECEIVE_TYPE.moveend:
                    handleWhenMapMove();
                    break;
                default:
                    break;
            }
        } catch (err) {}
    };
    const isOwnerPlot = (plot) => {
        let found = user.plots?.some((p) => p?.id === plot?.id);
        return found;
    };

    // check user is owner this plot or have invite from this plot
    const isHavePermissionToDoInvite = () => {
        return !['claimant_invitee', NEIGHTBORS[0]].includes(plotData?.role);
    };
    const renderPlot = (objectPlot) => {
        const plotIDActive = objectPlot?.plotIDActive;

        const noRenderCurrentPlot = !isRenderCurrentPlot;
        try {
            let plots = [];
            let boundsPolygon = {
                geometry: { type: 'Polygon', coordinates: [[]] },
                type: 'Feature',
            };
            //init plots data
            for (const plot of plotData.closePlots) {
                let _plot = deepClone(plot);
                if (noRenderCurrentPlot && _plot._id === plotData.plot._id) {
                    continue;
                }
                _plot.isOwner = isOwnerPlot(plot);
                let colors = {
                    fillColor: 'rgba(42, 184, 73, 0.65)',
                    color: 'rgba(42, 184, 73, 0.65)',
                    fillOpacity: 0.6,
                };
                _plot.properties = {
                    ...colors,
                };
                // set color for plot is active
                if (_plot._id === plotData.plot._id) {
                    _plot.properties.fillOpacity = 0.9;
                    _plot.properties.color = 'rgba(58, 151, 173, 1)';
                } else {
                    const { fillColor, outlineColor } = getDataForRenderWithPlot(_plot, colors);
                    _plot.properties = {
                        ...colors,
                        color: fillColor,
                        fillColor,
                        outlineColor,
                    };
                }
                //set status plot by invites, only use when user is owner this plot
                // check user is owner this plot or have invite from this plot
                if (isHavePermissionToDoInvite()) {
                    const excludeStatus = [
                        INVITE_STATUS.rejected,
                        INVITE_STATUS.expired,
                        INVITE_STATUS.cancelled,
                    ];
                    plotsInvites?.created?.forEach((invite) => {
                        if (invite.relationship !== NEIGHTBORS[0]) return; // Check invite is invite {t('invite.neighbor')}
                        if (invite.inviteePlotID._id !== _plot._id) return; // Check invite is invite this plot "_plot"
                        if (invite.plotID._id !== plotData.plot._id) return; // Check invite create by this plot "plotData"
                        if (excludeStatus.includes(invite.status)) return; // Check invite is not in status excludeStatus

                        // this data will use in invitePeopleStep
                        _plot.inviteStatus = _plot.inviteStatus || invite.status;
                        _plot.inviteID = _plot.inviteID || invite._id;
                        _plot.expiredAt = invite.expiredAt;
                        _plot.willExpireAfter = invite.willExpireAfter;
                        _plot.inviterID = invite.createdBy._id;
                        _plot.invite = invite;
                    });
                    //inviteePlotID is invited
                    plotsInvites?.receive?.forEach((invite) => {
                        if (invite.relationship !== NEIGHTBORS[0]) return; // Check invite is invite {t('invite.neighbor')}
                        if (invite.inviteePlotID._id !== plotData.plot._id) return; // Check invite is invite this plot "_plot"
                        if (invite.plotID._id !== _plot._id) return; // Check invite create by this plot "plotData"
                        if (excludeStatus.includes(invite.status)) return;

                        // this data will use in invitePeopleStep
                        _plot.inviteStatus =
                            invite.status === INVITE_STATUS.sent
                                ? INVITE_STATUS.receive
                                : invite.status;
                        _plot.inviteID = invite._id;
                        // _plot.inviterID = invite.in
                        /*To do: store invite object from this plot to _plot object and store to state,
                            after then when select confirm button on InvitePeople page,
                            we have invite object for pass to ModalConfirmInvite
                            */
                        _plot.invite = invite;
                    });
                }

                // set status plot by neighbors, only use when user is owner this plot
                if (plotNeighborIds.includes(_plot._id)) {
                    // this data will use in invitePeopleStep
                    // and render relationship
                    _plot.inviteStatus = INVITE_STATUS.accepted;
                }

                if (plotIDActive && _plot._id === plotIDActive) {
                    _plot.properties.fillOpacity = 0.9;
                }
                plots.push(_plot);
                //make bounds polygon
                boundsPolygon.geometry.coordinates[0] =
                    boundsPolygon.geometry.coordinates[0].concat(
                        _plot.geojson.geometry.coordinates[0],
                    );
            }
            // check if current plot is not render then no need to render relationship
            if (noRenderCurrentPlot) {
                setPlotNeighbors([]);
            } else {
                setPlotNeighbors(plots);
            }

            //add first coordinate and owner polygon to bounds polygon
            boundsPolygon.geometry.coordinates[0] = [
                plotData.plot.geojson.geometry.coordinates[0][
                    plotData.plot.geojson.geometry.coordinates[0].length - 1
                ],
                ...boundsPolygon.geometry.coordinates[0].concat(
                    plotData.plot.geojson.geometry.coordinates[0],
                ),
            ];
            //render subplots
            if (plotData.subPlots) {
                plotData.subPlots.forEach((subPlot) => {
                    // if (subPlot.claimants.length) {
                    plots.push({
                        isSub: true,
                        ...subPlot,
                        properties: {
                            outlineColor: '#fff',
                            color: subplotColor,
                        },
                    });
                    // }
                });
            }
            const source = initSource({
                plots: plots,
                id: 'around_plot',
                type: 'fill_by_color_properties',
            });

            setBoundsOfPolygon(boundsPolygon);
            sendMessage({
                type: SEND_TYPE.fitBoundsByPolygon,
                polygon: boundsPolygon,
            });
            sendMessage({
                type: SEND_TYPE.addSource,
                source: source,
            });
        } catch (err) {}
    };

    const getClaimchainSize = () => {
        if (!plotData || !plotData.plot) {
            return 1;
        }
        return plotData.claimchainSize;
    };
    useEffect(() => {
        renderRelationship();
    }, [plotNeighbors]);
    useEffect(() => {
        if (plotData && statusMap) {
            centerMap();
            renderPlot();
        }
        if (plotData) {
            navigation.setParams({
                plotClaimants: plotData.claimants,
            });
            navigation.setParams({
                plotName: plotData.plot.name,
            });
        }
    }, [plotData, statusMap]);

    const renderRelationship = () => {
        try {
            let points = [],
                lines = [],
                lines2 = [],
                points2 = [];
            if (!SPACIAL_TAB.includes(step) || isReviewCreateSubPlotStep()) {
                for (const plot of plotNeighbors) {
                    if (plot._id !== plotData?.plot._id) {
                        // pending confirm
                        if (
                            plot.inviteStatus === INVITE_STATUS.sent ||
                            plot.inviteStatus === INVITE_STATUS.receive
                        ) {
                            points.push({
                                coordinates: plot.centroid,
                                properties: {
                                    circleColor: plot.isOwnershipDispute
                                        ? ownerShipDisputeColor
                                        : plot.isBoundaryDispute
                                          ? boundaryDisputeColor
                                          : '#2AB848',
                                    circleStrokeColor: '#fff',
                                    circleRadius: 6,
                                    circleStrokeWidth: 1,
                                },
                            });
                            lines.push([plotData?.plot.centroid, plot.centroid]);
                        }
                        // accepted
                        if (plot.inviteStatus === INVITE_STATUS.accepted) {
                            points2.push({
                                coordinates: plot.centroid,
                                properties: {
                                    circleColor: plot.isOwnershipDispute
                                        ? ownerShipDisputeColor
                                        : plot.isBoundaryDispute
                                          ? boundaryDisputeColor
                                          : '#2AB848',
                                    circleStrokeColor: '#fff',
                                    circleRadius: 6,
                                    circleStrokeWidth: 1,
                                },
                            });
                            lines2.push([plotData?.plot.centroid, plot.centroid]);
                        }
                    }
                }
                // if (imageActive && step === 0) {
                //     renderMarkerImageSelected(imageActive);
                // }
            }
            // render plot relationship is pending confirm
            const _source = initSource({
                points,
                lines,
                id: 'point_relationship',
                type: 'set_color_properties',
                lineType: 'white_dasharray',
            });

            sendMessage({
                type: SEND_TYPE.addSource,
                source: _source,
            });
            // render plot relationship is accepted
            const _source2 = initSource({
                points: points2,
                lines: lines2,
                id: 'point_relationship_2',
                type: 'set_color_properties',
                lineType: 'white',
            });
            sendMessage({
                type: SEND_TYPE.addSource,
                source: _source2,
            });
            if (plotData?.plot?.centroid) {
                const source = initSource({
                    points:
                        SPACIAL_TAB.includes(step) || !isRenderCurrentPlot
                            ? []
                            : [
                                  {
                                      coordinates: plotData?.plot.centroid,
                                      properties: {
                                          circleColor: plotData.plot.isOwnershipDispute
                                              ? ownerShipDisputeColor
                                              : plotData.plot.isBoundaryDispute
                                                ? boundaryDisputeColor
                                                : '#267385',
                                          circleStrokeColor: '#fff',
                                          circleRadius: 6,
                                          circleStrokeWidth: 2,
                                      },
                                  },
                              ],
                    id: 'active_point',
                    type: 'set_color_properties',
                });
                sendMessage({
                    type: SEND_TYPE.addSource,
                    source: source,
                });
            }
        } catch (Err) {}
    };
    const getPlotNeightborsData = () => {
        let data = [];
        plotNeighbors.forEach((i) => {
            if (plotNeighborIds.includes(i._id)) {
                data.push(i);
            }
        });

        return data;
    };
    const editPlot = () => {
        setStep(() => 2);
        clearPlot();
    };
    //clear polygon on map
    const clearPlot = () => {
        setPlotNeighbors(() => []);
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
    const onSubmittedImages = (images) => {
        initImages(images, plotData.plot);
        setStep(0);
        renderPlot();
    };
    const getInvites = async (id) => {
        // get all invites of this plot from other plot
        let resInvites = await getInvitesByPlotID({ id: id }, navigation, dispatch);
        let created = resInvites.data.created.map((invite) => ({
            ...invite,
            button:
                // only show button accept or reject if user is owner this plot and inviteePhoneNumber is this user
                invite.inviteePhoneNumber === user.userInfo.phoneNumber ? (
                    <ButtonConfirm
                        // invite data will pass to ModalConfirmInvite
                        invite={invite}
                        onOpenAcceptClaimant={onOpenAcceptClaimant}
                        setSelectedInvite={setSelectedInvite}
                        key={0}
                    />
                ) : null,
        }));

        setPlotsInvites(() => ({ ...resInvites.data, created }));
    };
    const getStatus = () => {
        return getPlotStatus({
            plot: plotData?.plot,
        });
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
    const onImagePress = (image) => {
        if (image) {
            setActiveImage(image);
            setStep(() => 3);
            clearPlot();
            hideMarker();
        }

        // renderMarkerImageSelected(image);
    };

    // toggle marker
    const onPlotPress = (item) => {
        let isActive = item._id === iDMarkerActive;
        setIDMarkerActive(isActive ? null : item._id);
        renderPlot({ isActive: isActive ? null : item._id });
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
        renderPlot(null);
    };
    const onTransfer = () => {
        navigation.navigate('TransferOwnership', {
            plotId: plotData.plot._id,
            claimants: plotData?.claimants,
            plotName: plotData?.plot?.name,
            goBack: () => {
                _getPlotData();
            },
        });
    };

    const onEditPolygon = () => {
        onStartEditPolygon();
        hideMarker();
    };

    const openWithdrawalPlot = () => {
        onOpenWithdrawalPlot();
    };

    const onDeletePlot = () => {
        let { numberOwner } = route?.params || {};
        if (numberOwner > 1) {
            modalCannotDelHook.open();
            return;
        }
        onOpenDelete();
    };

    const share = async () => {
        try {
            let uri = getUrlShare({
                id: plotData?.plot?._id,
                longlat: plotData?.plot?.centroid,
            });
            await Share.open({
                title: t('subplot.titleShare'),
                message: `${t('subplot.secureMyLand')}: `,
                url: uri,
            });
        } catch (err) {}
    };

    const onSelectAction = (key) => {
        switch (key) {
            case 'editPlot':
                editPlot();
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
                onDeletePlot();
                break;
            case 'createSubplot':
                onStartCreateSubPlot();
                break;
            case 'transferOwnership':
                onTransfer();
                break;
            case 'withdrawalFromPlot':
                openWithdrawalPlot();
                break;
            case 'editPlotPolygon':
                onEditPolygon();
                break;
            case 'attestPlot':
                EventRegister.emit(EVENT_NAME.openAttestModal);
                break;
            default:
            case 'sharePlot':
                share();
                break;
        }
    };
    const onDeleteInvite = async (inviteId) => {
        try {
            await cancelInvite(inviteId, navigation, dispatch);
        } catch (error) {
            throw error;
        } finally {
            setPlotsInvites((prev) => ({
                ...prev,
                created: prev.created.filter((i) => i._id !== inviteId),
            })); // Update invites
        }
    };

    useEffect(() => {
        renderPlot(); // Render plot when plotsN change
    }, [plotsInvites]);

    const onDeleteClaimant = async (data) => {
        try {
            console.log('onDeleteClaimant', data);
            // await deleteClaimant(data._id, navigation, dispatch);
            await _getPlotData();
        } catch (err) {
            throw err;
        }
    };
    const getInvitesPending = () => {
        let invites = plotsInvites?.created
            ?.filter((i) => i.status === INVITE_STATUS.sent)
            ?.map((i) => {
                return {
                    ...i,
                    phoneNumber: i.inviteePhoneNumber,
                    inviteID: i._id,
                };
            });
        if (isCreateSubplot(step) && isReviewCreateSubPlotStep()) {
            invites.push({
                _id: 'tmp',
                status: INVITE_STATUS.sent,
                inviteePhoneNumber: selectedClaimant.phoneNumber,
                ...selectedClaimant,
            });
        }
        return invites;
    };

    useEffect(() => {
        let listener = EventRegister.addEventListener(EVENT_NAME.gotoPendingClaimantReq, () => {
            setStep(1);
            setTimeout(() => {
                EventRegister.emit(EVENT_NAME.gotoPendingClaimantReq2);
            }, 20);
        });

        return () => {
            EventRegister.removeEventListener(listener);
        };
    }, []);

    useEffect(() => {
        let listener = EventRegister.addEventListener(EVENT_NAME.refetchPlotData, () => {
            initData(true);
        });
        return () => {
            EventRegister.removeEventListener(listener);
        };
    }, []);

    useEffect(() => {
        if (step == 6) {
            return;
        }
        if (plotID) {
            _getPlotData();
        }
    }, [step]);

    useEffect(() => {
        // Update status of invite when expired
        const interval = setInterval(() => {
            setPlotsInvites((prev) => {
                if (!prev) {
                    return prev;
                }
                return {
                    ...prev,
                    created: prev.created?.map((i) => {
                        if (i.status === INVITE_STATUS.sent) {
                            let expiredAt = new Date(i.expiredAt).getTime();
                            let now = new Date().getTime();
                            let diff = expiredAt - now;
                            if (diff < 0) {
                                i.status = INVITE_STATUS.expired;
                            }
                        }
                        return i;
                    }),
                    receive: prev.receive?.map((i) => {
                        if (i.status === INVITE_STATUS.sent) {
                            let expiredAt = new Date(i.expiredAt).getTime();
                            let now = new Date().getTime();
                            let diff = expiredAt - now;
                            if (diff < 0) {
                                i.status = INVITE_STATUS.expired;
                            }
                        }
                        return i;
                    }),
                };
            });
            renderPlot();
        }, 60000); // 1 minute

        return () => clearInterval(interval);
    }, []);

    const onPressOpenMapWide = () => {
        if (!isOpenWholeMap) {
            onOpenWholeMap();
            unlockMap();
        } else {
            onCloseWholeMap();
            lockMap();
        }
    };

    useEffect(() => {
        if (isOpenWholeMap) {
            setScrollEnabled(false);
            scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false });
        } else {
            setScrollEnabled(true);
            if (boundsOfPolygon) {
                sendMessage({
                    type: SEND_TYPE.fitBoundsByPolygon,
                    polygon: boundsOfPolygon,
                });
            }
        }
    }, [isOpenWholeMap]);

    const {
        onCancelCreateSubPlot,
        onNextCreateSubPlot,
        onSaveCreateSubPlot,
        onStartCreateSubPlot,
        onPolygonUpdate,
        onResetCreateSubPlot,
        createSubPlotStep,
        polygon,
        createSubPlotError,
        selectedClaimant,
        setSelectedClaimant,
        isReviewCreateSubPlotStep,
        setCreateSubPlotError,
        requestingCreateSubPlot,
        success,
        setSuccess,
    } = useCreateSubPlot({
        step,
        renderPlot,
        setStep,
        sendMessage,
        clearPlot,
        setScrollEnabled,
        plotData,
        setShowSnapButton,
        t,
    });

    const {
        isEnableSnap,
        onToggleModalSnap,
        goingLocation,
        handleGotoMyLocation,
        handleWhenMapMove,
        onToggleSnap,
        onEnableSnap,
        isLocationAllow,
        isOpenSnapModal,
    } = useFunctionOnCreateEditMap({
        sendMessage: sendMessage,
    });

    const {
        editPolygonStep,
        onCancelEditPolygon,
        onNextEditPolygon,
        onStartEditPolygon,
        isOnReviewEditPolygonStep,
        onBackEditPolygon,
        onPolygonUpdateEdit,
        isRenderCurrentPlot,
        isDisabledNextEditPolygon,
        overlap: overlapEditPolygon,
        setOverlap: setOverlapEditPolygon,
        isLoading: isLoadingEditPolygon,
        error: errorEditPolygon,
        isOverlap,
    } = useEditPolygonPlot({
        sendMessage,
        setStep,
        setScrollEnabled,
        setShowSnapButton,
        renderPlot,
        plotData,
        onEnableSnap,
        isEnableSnap,
    });

    return (
        <Box h="full">
            <Box h="full">
                {modalCannotDelHook.Component({
                    onConfirm: openWithdrawalPlot,
                    plotData: plotData,
                })}
                <Header
                    step={step}
                    setStep={setStep}
                    plotData={plotData}
                    isLoading={isLoading}
                    hideMarker={hideMarker}
                    renderPlot={renderPlot}
                    navigation={navigation}
                    onSelectAction={onSelectAction}
                    title={getTitle()}
                    SPACIAL_TAB={SPACIAL_TAB}
                    centerMap={centerMap}
                    onCancelCreateSubPlot={onCancelCreateSubPlot}
                    onCancelEditPolygon={onCancelEditPolygon}
                    isOpenWholeMap={isOpenWholeMap}
                    onPressOpenMapWide={onPressOpenMapWide}
                    guestBtn={
                        <IconButton
                            icon={<HorizontalThreeDot color="#5EC4AC" />}
                            borderRadius={'full'}
                            size="8"
                            name="email"
                            mr="10px"
                            onPress={guestPlotSheetHook.open}
                        ></IconButton>
                    }
                />
                <HeaderCreateSubPlot createSubPlotStep={createSubPlotStep} step={step} />
                <HeaderEditPolygon step={step} editPolygonStep={editPolygonStep} />
                <HeaderAnnounceEditPolygon
                    plotData={plotData}
                    step={step}
                    ghostPlotDisputes={ghostPlotDisputes}
                    isOpenWholeMap={isOpenWholeMap}
                />
                <ScrollView
                    overScrollMode="never"
                    w="full"
                    contentContainerStyle={{
                        paddingBottom: requestAssignPlotId ? 150 : 100,
                    }}
                    scrollEnabled={scrollEnabled}
                    bg={'gray.1500'}
                    ref={scrollViewRef}
                >
                    {error ? (
                        <Text textAlign="center" fontSize="14px" color="error.400" mt="30px">
                            {error}
                        </Text>
                    ) : (
                        <>
                            {(!INVITE_TAB.includes(step) || step === 5) && (
                                <Box style={getMapStyle()} position={'relative'}>
                                    {isLoading && (
                                        <Box position="absolute" zIndex="2" w="full" h="full">
                                            <Skeleton height="100%" />
                                        </Box>
                                    )}
                                    {!isLoading && (
                                        <FullScreenDetail
                                            isOpenWholeMap={isOpenWholeMap}
                                            onPressOpenMapWide={onPressOpenMapWide}
                                            neighbors={getPlotNeightborsData()}
                                            invitesPending={getInvitesPending()}
                                            onPlotPress={onPlotPress}
                                            step={step}
                                        />
                                    )}

                                    <Map
                                        useGlobalData={false}
                                        onEvent={onWebviewEvent}
                                        mapRef={webviewRef}
                                        search={`${longlat ? `longlat=${longlat}&` : ''}zoom=10`}
                                        preventUserInteraction={
                                            !isCreateSubplot(step) &&
                                            !isEditPolygon(step) &&
                                            !isOpenWholeMap
                                        }
                                    />
                                </Box>
                            )}
                            {(isPlotView(step) ||
                                isReviewCreateSubPlotStep() ||
                                isOnReviewEditPolygonStep()) && (
                                <ReviewPlot
                                    tab={tab}
                                    setStep={setStep}
                                    plotData={{
                                        attestedBy: plotData?.attestedBy,
                                        ...plotData?.plot,
                                        location: plotData?.location || plotData?.plot?.location,
                                        claimStrength: plotData?.claimStrength,
                                        claimants: plotData?.claimants,
                                        claimantsMap: plotData?.claimantsMap,
                                    }}
                                    permissions={plotData?.permissions}
                                    claimants={plotData?.claimants}
                                    transferOwnershipRequest={plotData?.transferOwnershipRequest}
                                    withdrawalOwnershipRequest={
                                        plotData?.withdrawalOwnershipRequest
                                    }
                                    initData={_getPlotData}
                                    disputedPlot={plotData?.plot?.disputes}
                                    setInvitePeople={() => {
                                        setInvitePeople(1);
                                        hideMarker();
                                    }}
                                    images={images}
                                    neightbors={getPlotNeightborsData()}
                                    numberClaimchain={getClaimchainSize()}
                                    status={getStatus()}
                                    invitesPending={getInvitesPending()}
                                    onImagePress={onImagePress}
                                    // imageActive={imageActive}
                                    isLoading={isLoading}
                                    hideShare={
                                        isReviewCreateSubPlotStep() || isOnReviewEditPolygonStep()
                                    }
                                    onPlotPress={onPlotPress}
                                    onChangeTab={(index) => {
                                        setTab(index);
                                    }}
                                    onDeleteInvite={onDeleteInvite}
                                    onDeleteClaimant={onDeleteClaimant}
                                    disabledPressPlotStatus={isReviewCreateSubPlotStep()}
                                    onOpenClaimantManagement={() =>
                                        onSelectAction('managerClaimants')
                                    }
                                    _container={{
                                        pt: '10px',
                                    }}
                                />
                            )}
                            {INVITE_TAB.includes(step) && (
                                <InvitePeopleStep
                                    tab={isManagerClaimants(step, tab) ? 1 : 2}
                                    renderPlot={renderPlot}
                                    sendMessage={sendMessage}
                                    plotsN={plotNeighbors}
                                    onOpenAccept={onOpenModalAcceptNeighbor}
                                    setIDMarkerActive={setIDMarkerActive}
                                    iDMarkerActive={iDMarkerActive}
                                    setSelectedIndex={setSelectedNeighborIndex}
                                    onOpen={onOpenModalInvite}
                                    plotData={plotData}
                                    plotsInvites={plotsInvites}
                                    onInvited={getInvites}
                                    minH={SCREEN_HEIGHT - 310}
                                    onDeleteInvite={onDeleteInvite}
                                    onDeleteClaimant={onDeleteClaimant}
                                />
                            )}
                            {isEditPlot(step) && (
                                <EditPlot
                                    sendMessage={sendMessage}
                                    plotData={plotData}
                                    oldFiles={files}
                                    files={newFiles}
                                    setFiles={setNewFiles}
                                    setDeleteFilesList={setDeleteFilesList}
                                    deleteFilesList={deleteFilesList}
                                    points={pointsOfPlot}
                                    onDelete={onOpenDelete}
                                ></EditPlot>
                            )}
                            {isViewPhotos(step) && (
                                <ViewPhotos
                                    sendMessage={sendMessage}
                                    plotData={plotData}
                                    files={files}
                                    points={pointsOfPlot}
                                    {...getViewPhotosData(pointsOfPlot)}
                                ></ViewPhotos>
                            )}
                            {isCreateSubplot(step) && (
                                <CreateSubplot
                                    height={getMapStyle().height}
                                    createSubPlotStep={createSubPlotStep}
                                    selectedClaimant={selectedClaimant}
                                    setSelectedClaimant={setSelectedClaimant}
                                    claimants={plotData?.claimants}
                                    setCreateSubPlotError={setCreateSubPlotError}
                                    plotsInvites={plotsInvites}
                                />
                            )}
                        </>
                    )}
                </ScrollView>
                {/* show when edit mode */}
                <GroupButtonEditStep
                    step={step}
                    updateError={updateImageError}
                    cancelUploadFile={() => {
                        renderPlot();
                        setStep(0);
                    }}
                    uploadBoundary={() => {
                        _uploadBoundary({ onSubmittedImages, pointsOfPlot, plotData });
                    }}
                    requesting={requesting}
                />
                {/* show when review plot */}
                <ButtonGoToInviteNeightbor
                    isLoading={isLoading}
                    step={step}
                    tab={tab}
                    plotData={plotData}
                    onClick={() => onSelectAction('managerNeighbors')}
                    isOpenWholeMap={isOpenWholeMap}
                />
                {/* show when invite clamant  step === 1,4,5*/}
                <ButtonInviteClamant
                    step={step}
                    tab={tab}
                    plotData={plotData}
                    onOpenInviteSheet={onOpenInviteSheet}
                    isOpenWholeMap={isOpenWholeMap}
                />

                {/* show when create sub plot step = 6*/}
                <GroupButtonCreateSubPlot
                    step={step}
                    onCancel={onCancelCreateSubPlot}
                    onNext={onNextCreateSubPlot}
                    onSave={onSaveCreateSubPlot}
                    onReset={onResetCreateSubPlot}
                    polygonData={polygon}
                    createSubPlotStep={createSubPlotStep}
                    error={createSubPlotError}
                    selectedClaimant={selectedClaimant}
                    requesting={requestingCreateSubPlot}
                    showSnapButton={showSnapButton}
                    setShowSnapButton={setShowSnapButton}
                    snapButtonType={snapButtonType}
                    setSnapButtonType={setSnapButtonType}
                    sendMessage={sendMessage}
                />
                <GroupButtonEditPolygon
                    step={step}
                    editPolygonStep={editPolygonStep}
                    onNext={onNextEditPolygon}
                    onCancel={onCancelEditPolygon}
                    onSave={onNextEditPolygon}
                    showSnapButton={showSnapButton}
                    setShowSnapButton={setShowSnapButton}
                    snapButtonType={snapButtonType}
                    sendMessage={sendMessage}
                    onBackEditPolygon={onBackEditPolygon}
                    isDisabledNextEditPolygon={isDisabledNextEditPolygon}
                    overlapEditPolygon={overlapEditPolygon}
                    setOverlapEditPolygon={setOverlapEditPolygon}
                    error={errorEditPolygon}
                    isLoading={isLoadingEditPolygon}
                    isOverlap={isOverlap}
                />
                {step === 7 && editPolygonStep === 0 && (
                    <GroupDrawPlotFeature
                        isEnableSnap={isEnableSnap}
                        onToggleSnap={onToggleSnap}
                        goingLocation={goingLocation}
                        handleGotoMyLocation={handleGotoMyLocation}
                        handleClickSnap={onToggleModalSnap}
                        onCloseModalSnap={onToggleModalSnap}
                        isLocationAllow={isLocationAllow}
                        isOpenModalSnap={isOpenSnapModal}
                    />
                )}
                {plotData?.transferOwnershipRequest?.status && (
                    <ResponseToTransferOwnership
                        claimants={plotData?.claimants}
                        step={step}
                        tab={tab}
                        plot={plotData?.plot}
                        transferRequest={plotData?.transferOwnershipRequest}
                        initData={_getPlotData}
                        setResponseTransfer={setResponseTransfer}
                    />
                )}
                <AnnounceWithdrawal
                    step={step}
                    tab={tab}
                    claimants={plotData?.claimants}
                    withdrawalOwnershipRequest={plotData?.withdrawalOwnershipRequest}
                />
                <ResponseToAssign
                    plotData={plotData}
                    setResponseTransfer={setResponseTransfer}
                    requestAssignPlotId={requestAssignPlotId}
                    initData={_getPlotData}
                    refAnnounce={refAnnounce}
                />
            </Box>
            {imageBoundaryHook.Component({})}
            {ModalInviteNeighbor({ onSubmit: onInviteNeighbor })}
            {ModalAcceptNeighbor({
                onReject: onRejectNeighbor,
                onSubmit: _acceptNeightbor,
                invite: plotNeighbors[selectedNeighborIndex]?.invite,
            })}
            <ModalConfirmInviteClaimant
                isOpen={isOpenAcceptClaimant}
                onClose={onCloseAcceptClaimant}
                invite={selectedInvite}
                selectedInvite={selectedInvite}
            />
            <ModalConfirmDelete isOpen={isOpenDelete} onClose={onCloseDelete} plotData={plotData} />
            <InvitePeopleSheet
                plotData={plotData}
                isOpen={isOpenInviteSheet}
                onClose={onCloseInviteSheet}
            />
            <ModalCreateSubPlotSuccess
                isOpen={success}
                description={t('subplot.subPlotSubmitted')}
                onPress={() => {
                    setSuccess(false);
                    onCancelCreateSubPlot();
                    getInvites(plotData?.plot?._id);
                }}
            />
            <ReqClaimantSuccessAlert />
            <ClaimantRemoveSuccessAlert />
            <ModalAcceptDeclineOwnership
                plotData={plotData}
                responseTransfer={responseTransfer}
                refAnnounce={refAnnounce}
            />
            <ModalWithdrawalPlot
                plotData={plotData}
                isOpen={isOpenWithdrawalPlot}
                onClose={onCloseWithdrawalPlot}
                _getPlotData={_getPlotData}
            />
            {guestPlotSheetHook.Component({
                plotData: plotData,
                onShare: isOwnerPlot(plotData?.plot) ? share : null,
            })}
            <ModalCannotAttest />
        </Box>
    );
}

// const styles = StyleSheet.create({
//     scrollView: {
//         paddingBottom: 100,
//     },
// });
