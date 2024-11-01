/* eslint-disable react-native/no-inline-styles */
import { Box, HStack, Icon, Text, useDisclose } from 'native-base';

import { useNavigation } from '@react-navigation/core';
import Mapbox from '@rnmapbox/maps';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../components/Button';
import Header from '../../components/Header';
import LearnMarketPlacement from '../../components/LearnMarkerPlacerment';
import useTranslate from '../../i18n/useTranslate';
import {
    OVERLAP_ERROR,
    RN_MAPBOX_ACCESS_TOKEN,
    getStorage,
    setStorage,
} from '../../util/Constants';
import { buildPolygon, validatePolygon } from '../../util/polygon';
import ModalOverlap from '../CreatePlot/ModalOverlap';
import EnterInfoAfterDraw from './EnterInfoAfterDraw';
import ModalAnnounce from './ModalAnnounce';
import ReactNativeMB from './ReactNativeMapBox';

Mapbox.setAccessToken(RN_MAPBOX_ACCESS_TOKEN);

export default function Index() {
    const [open, setOpen] = useState(false);
    const [openLear, setOpenLearn] = useState(false);
    const [coordinates, setCoordinates] = useState([]);
    const [started, setStarted] = useState(true);
    // const [submitted, setSubmitted] = useState(false);
    const [step, setStep] = useState(0);
    const [namePlot, setNamePlot] = useState('');
    const [error, setError] = useState('');
    const [offlinePlots, setOfflinePlots] = useState([]);
    const { isOpen: isOpenDispute, onClose: onCloseDispute, onOpen: onOpenDispute } = useDisclose();

    const functionRef = useRef();
    const navigate = useNavigation();
    const t = useTranslate();

    const StepItems = [t('components.addPolygon'), t('components.addInfo')];

    const _validatePolygon = (coordinates, plots) => {
        try {
            validatePolygon(coordinates, plots);
        } catch (err) {
            if (err === OVERLAP_ERROR) {
                onOpenDispute();
                throw '';
            }
            throw err;
        }
    };

    const queryFromStorage = async () => {
        const _data = await getStorage('offline-plot');
        if (_data) {
            setOfflinePlots(JSON.parse(_data));
        }
    };

    const onProgressToStep1 = () => {
        try {
            let Polygons = offlinePlots.map((item) => {
                const { coordinates } = item;
                const polygon = buildPolygon({
                    coordinates,
                    centroid: [],
                });
                return polygon;
            });

            _validatePolygon([[...coordinates, coordinates[0]]], Polygons);
            setStep(1);
        } catch (err) {
            console.log('err', err);
            setError(err);
        }
    };

    const submitToSystemPlot = async () => {
        functionRef.current?.OnStartDrawing();
        const storageStr = await getStorage('offline-plot');
        const storage = storageStr ? JSON.parse(storageStr) : [];
        // random uuid
        const uu = Math.random().toString(36);
        storage.push({
            coordinates: [...coordinates, coordinates[0]],
            date: new Date(),
            name: namePlot,
            uuid: uu,
        });
        await setStorage('offline-plot', JSON.stringify(storage));
        setOpen(true);
    };

    const getStyle = useCallback(() => {
        switch (step) {
            case 0:
                return {};
            case 1:
                return { height: 300, position: 'absolute', opacity: 0 };
            default:
                return 0;
        }
    }, [step]);

    useEffect(() => {
        queryFromStorage();
    }, []);

    return (
        <Box {...styles.container}>
            <Header
                icon={<Icon as={<MaterialCommunityIcons name="close" />} size={6} mr="4px" />}
                title={t('offlineMaps.createOfflinePlot')}
                style={{ shadow: 0 }}
                hideAgent
            ></Header>
            <HStack
                pl={'10px'}
                pt={'6px'}
                pb={'12px'}
                zIndex={1000}
                bgColor={'white'}
                borderBottomColor={'gray.2300'}
                borderBottomWidth={'1px'}
            >
                {StepItems.map((item, index) => (
                    <Box flex={1} key={index} mr={'10px'}>
                        <Box h={'4px'} bgColor={step >= index ? 'primary.600' : 'gray.2300'}></Box>
                        <Text
                            fontSize="10px"
                            fontWeight="600"
                            mt={'6px'}
                            color={step >= index ? 'primary.600' : 'gray.400'}
                        >
                            {item}
                        </Text>
                    </Box>
                ))}
            </HStack>
            <Box flex={1} style={getStyle()}>
                <ReactNativeMB
                    functionRef={functionRef}
                    setCoordinateOutside={setCoordinates}
                    setStartedOutside={setStarted}
                />
            </Box>
            {step === 0 && (
                <>
                    {error.length > 0 && (
                        <Text textAlign="center" mb="8px" color="error.400">
                            {error}
                        </Text>
                    )}
                    <Box mt={'10px'}>
                        <LearnMarketPlacement
                            isOpen={openLear}
                            onClose={() => setOpenLearn(false)}
                        />
                    </Box>
                </>
            )}
            {step === 1 && (
                <EnterInfoAfterDraw
                    error={error}
                    setError={setError}
                    text={namePlot}
                    setText={setNamePlot}
                />
            )}

            <Box>
                <Box flexDir={'row'} justifyContent={'space-between'} px={'20px'} mb={'10px'}>
                    <Button
                        variant={'outline'}
                        _container={{
                            w: '48%',
                        }}
                        onPress={() => {
                            if (step > 0) {
                                setStep(step - 1);
                            } else if (coordinates.length > 0) {
                                functionRef.current?.OnStartDrawing();
                            } else {
                                try {
                                    navigate.goBack();
                                } catch (error) {
                                    console.log(error);
                                }
                            }
                        }}
                    >
                        {step === 1
                            ? t('button.back')
                            : coordinates.length > 0
                              ? t('button.reset')
                              : t('button.cancel')}
                    </Button>
                    <Button
                        _container={{
                            w: '48%',
                        }}
                        bgColor={'primary.600'}
                        _pressed={{ bgColor: 'primary.700' }}
                        onPress={() => {
                            if (step < 1) {
                                onProgressToStep1();
                            } else {
                                submitToSystemPlot();
                            }
                        }}
                        isDisabled={
                            started ||
                            coordinates.length == 0 ||
                            (step === 1 && namePlot.length === 0)
                        }
                    >
                        {step === 0 ? t('button.next') : t('button.submit')}
                    </Button>
                </Box>
            </Box>
            <ModalAnnounce isOpen={open} onClose={() => {}} />
            <ModalOverlap
                onClose={onCloseDispute}
                isOpen={isOpenDispute}
                onPressSubmit={() => {
                    setStep(step + 1);
                    setError('');
                }}
            />
        </Box>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 'full',
        height: 'full',
        backgroundColor: 'white',
    },
    // containerList: {
    //     width: 'full',
    //     flex: 1,
    // },
    // groupTitle: {
    //     bg: 'gray.200',
    //     p: '12px',
    // },
    // divider: {
    //     borderBottomColor: 'gray.300',
    //     borderBottomWidth: '1px',
    //     marginTop: '12px',
    //     marginBottom: '12px',
    // },
    // buttonSignOut: {
    //     marginTop: '12px',
    //     marginBottom: '20px',
    // },
    // containerItem: {
    //     px: '12px',
    //     bg: 'white',
    //     minH: '44px',
    //     justifyContent: 'center',
    // },
});
