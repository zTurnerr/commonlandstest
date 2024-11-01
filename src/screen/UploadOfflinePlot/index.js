/* eslint-disable react-native/no-inline-styles */
import { useNavigation } from '@react-navigation/native';
import { Danger } from 'iconsax-react-native';
import { Box, CloseIcon, Text, useDisclose, useTheme } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Button from '../../components/Button';
import ConfirmModal from '../../components/ConfirmModal';
import Header from '../../components/Header';
import LearnMarketPlacement from '../../components/LearnMarkerPlacerment';
import Steps from '../../components/Steps';
import useGetTotalPlot from '../../hooks/Plot/useGetTotalPlot';
import useTranslate from '../../i18n/useTranslate';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import { userSliceActions } from '../../redux/reducer/user';
import {
    assignOfflinePlot,
    createPlot,
    getClosedCenterPlots,
    getUserPlots,
} from '../../rest_client/apiClient';
import { OVERLAP_ERROR, delay, getStorage, setStorage } from '../../util/Constants';
import { buildPolygon, validatePolygon } from '../../util/polygon';
import ModalSuccess from '../CreatePlot/ModalConfirmSuccess';
import ModalPlotOverlap from '../CreatePlot/ModalOverlap';
import AssignOffline from './AssignOffline';
import ModalResultUpload from './ModalResultUpload';
import ViewOfflinePolygon from './ViewOfflinePolygon';

const Index = ({ route }) => {
    const t = useTranslate();
    const [step, setStep] = useState(0);
    const [nearPlots, setNearPlots] = useState(null);
    const [isOpenAssignWarning, setIsOpenAssignWarning] = useState(false);
    const stepItems = [
        { label: t('components.viewPolygon') },
        { label: t('components.assignPeople') },
    ];
    const { params } = route;
    const { user } = useShallowEqualSelector((state) => ({
        user: state.user,
    }));
    const navigation = useNavigation();
    const [assign, setAssign] = useState({
        self: false,
        users: [],
    });
    const [modalContent, setModalContent] = useState({
        title: null,
        description: null,
        error: false,
        button: null,
    });
    const [yourselfRole, setYourselfRole] = useState('owner');
    const [resultState, setResultState] = useState({
        progress: 0,
        message: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { isOpen: isOpenSuccess, onOpen: onOpenSuccess, onClose: onCloseSuccess } = useDisclose();
    const {
        isOpen: isOpenResultModal,
        onOpen: onOpenResultModal,
        onClose: onCloseResultModal,
    } = useDisclose();
    const dispatch = useDispatch();
    const { total: numberOfPlot, limitPlot, isTraining } = useGetTotalPlot();
    const { isOpen: isOpenOverlap, onClose: onCloseOverlap, onOpen: onOpenOverlap } = useDisclose();

    useEffect(() => {
        if (isTraining) {
            setAssign({
                self: true,
                users: [],
            });
        }
    }, [isTraining]);

    const fetchPlotsNearOfflinePlot = async () => {
        let near = {};
        for (let i = 0; i < params?.plots.length; i++) {
            const data = params?.plots[i];
            const closedPlots = await getClosedCenterPlots(
                { long: data?.centroid[0], lat: data?.centroid[1] },
                navigation,
                dispatch,
            );
            near[data?.uuid] = closedPlots?.data?.closePlots;
        }
        setNearPlots(near);
    };

    useEffect(() => {
        if (params?.plots) {
            fetchPlotsNearOfflinePlot();
        }
    }, [params?.plots]);

    const checkDispute = async () => {
        let isDispute = false;
        try {
            let plots = params?.plots;
            plots.forEach((plot) => {
                validatePolygon([plot?.coordinates], nearPlots[plot?.uuid]);
            });
        } catch (error) {
            if (error === OVERLAP_ERROR) {
                isDispute = true;
            }
            console.log(error);
        }

        return isDispute;
    };

    const onPressCancel = () => {
        if (step === 0) {
            navigation.goBack();
            return;
        }
        setStep(step - 1);
    };

    const onPressNext = async () => {
        if (step === 1) {
            let isDispute = await checkDispute();
            if (isDispute && assign.self) onOpenOverlap();
            else {
                params.plots.length >= 2 ? setIsOpenAssignWarning(true) : submitAssignPeople();
            }
            return;
        }
        setStep(step + 1);
    };

    const _assignPeople = async (data) => {
        // name, area, placeName, geojson, centroid, claimants
        const res = await assignOfflinePlot(data, navigation);
        return res?.data;
    };

    const _createPlot = async (data) => {
        let res = await createPlot(
            {
                creatorID: user?.userInfo?._id,
                claimant: yourselfRole,
                plot: {
                    geojson: data.geojson,
                    centroid: data.centroid,
                    area: data.area,
                    placeName: data.placeName,
                },
            },
            navigation,
            dispatch,
        );
        return res.data;
    };

    const submitAssignPeople = async () => {
        setLoading(true);
        let success = [],
            failed = [];
        const _claimants = assign?.users.map((item) => {
            return {
                id: item?._id,
                type: item?.roleSelected,
            };
        });
        let progress = 0;
        onOpenResultModal();
        for (let i = 0; i < params?.plots.length; i++) {
            const item = params?.plots[i];
            try {
                const polygon = buildPolygon({
                    coordinates: item?.coordinates,
                    centroid: item?.centroid,
                });
                const data = {
                    name: item?.name,
                    area: item?.area,
                    placeName: item?.placeName,
                    geojson: polygon?.geojson,
                    centroid: item?.centroid,
                    claimants: _claimants,
                };
                setResultState({
                    progress: progress,
                    message: t('offlineMaps.uploadingNamePlot', { name: item?.name }),
                });
                ++progress;
                let dx = null;
                if (assign.self) {
                    dx = await _createPlot(data);
                } else {
                    dx = await _assignPeople(data);
                }

                console.log('dx: ', dx);
                setResultState({
                    progress: progress,
                    message: t('offlineMaps.plotNameCreateSuccess', { name: item?.name }),
                });
                success.push(item?.uuid);
            } catch (err) {
                failed.push(err);
                setResultState({
                    progress: progress,
                    message: t('offlineMaps.plotNameCreateFailed', { name: item?.name }),
                });
            }
            await delay(1500);
        }
        setLoading(false);
        onCloseResultModal();
        if (failed.length === params?.plots.length) {
            setModalContent({
                title: t('error.uploadPlotFailed'),
                description: failed[0],
                error: true,
                button: t('button.close'),
            });
        } else if (!assign.self) {
            setModalContent({
                ...modalContent,
                description: t('offlineMaps.assignPlotComplete'),
                button: t('button.done'),
                error: false,
                title: t('contract.congrat'),
            });
        } else {
            setModalContent({
                ...modalContent,
                description: t('plot.plotSubmitted'),
                button: t('plot.goToPlots'),
                title: t('contract.congrat'),
                error: false,
            });
        }
        onOpenSuccess();
        eraseFromStorage(success);
        let resUserPlots = await getUserPlots(user.userInfo._id, navigation, dispatch);
        dispatch(
            userSliceActions.setData({
                plots: resUserPlots.data,
            }),
        );
    };

    const navigateToMain = () => {
        navigation.navigate('Main');
    };

    const closeBeforeNavigate = () => {
        onCloseSuccess();
    };

    const eraseFromStorage = async (plotsToErase) => {
        const _data = await getStorage('offline-plot');
        if (_data) {
            const tmpData = JSON.parse(_data);
            const filteredPlots = tmpData?.filter((item) => {
                return !plotsToErase.includes(item?.uuid);
            });
            await setStorage('offline-plot', JSON.stringify(filteredPlots));
        }
    };

    useEffect(() => {
        if (assign.self) {
            const numberSelected = params?.plots?.length;
            const _limitPlot = limitPlot;
            if (_limitPlot - numberOfPlot <= 0) {
                setError(t('error.alreadyEnoughAndCannot', { old: numberOfPlot }));
            } else if (_limitPlot - numberOfPlot < numberSelected) {
                setError(
                    t('error.alreadyOwnEnoughPlot', {
                        old: numberOfPlot,
                        new: _limitPlot - numberOfPlot,
                    }),
                );
            } else setError('');
        } else setError('');
    }, [assign]);

    const theme = useTheme();

    return (
        <>
            <Header title={'Upload Offline Plot'} />
            <Box
                px={'10px'}
                pb={'10px'}
                bgColor={'white'}
                borderBottomWidth={'1px'}
                borderBottomColor={'gray.400'}
                shadow={1}
            >
                <Steps steps={stepItems} step={step} />
            </Box>
            <Box flex={1}>
                <ViewOfflinePolygon step={step} plots={params?.plots} />
                {step === 1 && (
                    <AssignOffline
                        assign={assign}
                        setAssign={setAssign}
                        yourselfRole={yourselfRole}
                        setYourselfRole={setYourselfRole}
                    />
                )}
            </Box>
            <Box pt={step === 0 ? '10px' : '20px'} bgColor={'white'} shadow={9}>
                {step == 0 && <LearnMarketPlacement />}
                {error.length > 0 && (
                    <Text textAlign="center" mb="8px" color="error.400">
                        {error}
                    </Text>
                )}
                <Box justifyContent={'space-between'} flexDir={'row'} mx={'10px'} mb={'20px'}>
                    <Button
                        onPress={onPressCancel}
                        variant="outline"
                        _container={{
                            w: '48%',
                        }}
                        isDisabled={loading}
                    >
                        {step === 0 ? t('button.cancel') : t('button.back')}
                    </Button>
                    <Button
                        onPress={onPressNext}
                        bgColor="primary.600"
                        _container={{
                            w: '48%',
                        }}
                        _pressed={{ bgColor: 'primary.700' }}
                        isLoading={loading}
                        isDisabled={
                            (step === 1 && !assign.self && assign.users.length === 0) ||
                            error.length > 0
                        }
                    >
                        {step === 0 ? t('button.next') : t('button.submit')}
                    </Button>
                </Box>
            </Box>
            <ModalSuccess
                isOpen={isOpenSuccess}
                title={modalContent.title}
                description={modalContent.description}
                Icon={
                    <Box mt="12px" bg="danger.100" p="12px" borderRadius="28px">
                        <CloseIcon color="danger.300" size={5} />
                    </Box>
                }
                error={modalContent.error}
                buttonText={modalContent.button}
                onPress={
                    modalContent.error ? closeBeforeNavigate : !assign.self ? navigateToMain : null
                }
                buttonStyle={
                    modalContent.error
                        ? {
                              variant: 'outline',
                          }
                        : !assign.self
                          ? {
                                bgColor: 'primary.600',
                                _pressed: {
                                    bgColor: 'primary.700',
                                },
                            }
                          : {}
                }
            />
            <ModalResultUpload
                currentProgress={resultState.progress}
                totalProgress={params.plots.length}
                isOpen={isOpenResultModal}
                message={resultState.message}
            />
            <ModalPlotOverlap
                isOpen={isOpenOverlap}
                onClose={onCloseOverlap}
                onPressSubmit={submitAssignPeople}
            />
            <ConfirmModal
                isOpen={isOpenAssignWarning}
                description={t('offlineMaps.warningAssignPeople')}
                colorScheme="error"
                icon={<Danger color={theme.colors.error[400]} />}
                okColor="primary"
                confirmText={t('button.ok')}
                onConfirm={() => {
                    setIsOpenAssignWarning(false);
                    submitAssignPeople();
                }}
                onCancel={() => setIsOpenAssignWarning(false)}
            />
        </>
    );
};

export default Index;
