/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-native/split-platform-components */
import { Camera, MapView, UserLocation } from '@rnmapbox/maps';
import * as Turf from '@turf/turf';
import { Box, IconButton } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, PermissionsAndroid } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { OVERLAP_ERROR, getStorage, offlineMapsConstant } from '../../util/Constants';
import {
    buildPolygon,
    isPointInsidePolygon,
    turfGetCenter,
    validatePolygon,
} from '../../util/polygon';
import Polygon, { getMidPoint } from './Polygon';

const SAME_POINT_DISTANCE = 30;
const INIT_COOR = [32.57146676047958, 1.708956744760215];

const ReactNativeMapbox = ({
    functionRef = {},
    setCoordinateOutside,
    setStartedOutside,
    selectedCoordinates = null,
    offlineData = null,
    selectedIndexCoord = -1,
}) => {
    const [coordinates, setCoordinates] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [started, setStarted] = useState(true);
    const [onDrag, setOnDrag] = useState(false);
    const [dragCoor, setDragCoor] = useState(INIT_COOR);
    const [active, setActive] = useState(true);
    const [location, setLocation] = useState(null);
    const [OfflinePlots, setOfflinePlots] = useState([]);
    const [allowGetLocation, setAllowGetLocation] = useState(false);

    const camera = useRef();
    const lastPolygonShape = useRef([]);

    const _validatePolygon = (coordinates, plots) => {
        try {
            validatePolygon(coordinates, plots);
            return false;
        } catch (err) {
            if (err === OVERLAP_ERROR) {
                return true;
            }
            return false;
        }
    };

    const checkDispute = (coordinates, plotsPolygons) => {
        let Polygons = plotsPolygons.map((item) => {
            const { coordinates } = item;
            const polygon = buildPolygon({
                coordinates,
                centroid: [],
            });
            return polygon;
        });

        return _validatePolygon([coordinates], Polygons);
    };

    const queryFromStorage = async () => {
        if (offlineData) setOfflinePlots(offlineData);
        else {
            const _data = await getStorage('offline-plot');
            if (_data) {
                let jsonData = JSON.parse(_data);
                let done = jsonData.map((item) => {
                    const _plots = jsonData.filter((p) => p.uuid !== item.uuid);
                    const isDispute = checkDispute(item?.coordinates, _plots);
                    return { ...item, isDispute };
                });
                setOfflinePlots(done);
            }
        }
    };
    useEffect(() => {
        if (offlineData) {
            queryFromStorage();
        }
    }, [offlineData]);

    const isSamePoint = async (a, b) => {
        let viewA = await map.current?.getPointInView(a);
        let viewB = await map.current?.getPointInView(b);
        const dx = viewA[0] - viewB[0];
        const dy = viewA[1] - viewB[1];
        const d = Math.sqrt(dx * dx + dy * dy);
        return d < SAME_POINT_DISTANCE;
    };

    const checkIsSelectPoint = async (_coordinate, func) => {
        let idx = null;
        await Promise.all(
            coordinates.map(async (c, i) => {
                let tmpIsSamePoint = await isSamePoint(c, _coordinate);
                if (tmpIsSamePoint) {
                    setSelectedIndex(i);
                    if (func) {
                        func();
                    }
                    idx = i;
                    return i;
                }
                //
                let nextIndex = i === coordinates.length - 1 ? 0 : i + 1;
                let midPoint = getMidPoint(c, coordinates[nextIndex]);
                tmpIsSamePoint = await isSamePoint(midPoint, _coordinate);
                if (tmpIsSamePoint) {
                    // insert new point
                    let tmpCoordinates = [...coordinates];
                    tmpCoordinates.splice(nextIndex, 0, _coordinate);
                    setCoordinates(tmpCoordinates);
                    setCoordinateOutside(tmpCoordinates);
                    setSelectedIndex(nextIndex);
                    idx = nextIndex;
                    if (func) {
                        func();
                    }
                    return nextIndex;
                }
            }),
        );
        return idx;
    };

    const gotoUserLocation = async () => {
        if (!allowGetLocation) {
            requestToUseLocation();
            return;
        }
        if (camera.current) {
            camera.current.flyTo(location, 1500);
        }
    };

    // Drag point feature
    const onTouchStart = async (e) => {
        if (started) return;
        let x = e.nativeEvent.locationX;
        let y = e.nativeEvent.locationY;
        let coord = await map.current?.getCoordinateFromView([x, y]);

        if (coordinates.length > 2) {
            const insidePolygon = isPointInsidePolygon(coord, coordinates);
            if (insidePolygon) {
                lastPolygonShape.current = coordinates.map((item) => {
                    const distanceX = item[0] - coord[0],
                        distanceY = item[1] - coord[1];
                    return [distanceX, distanceY];
                });
            }
        }

        let selectedIdx;
        selectedIdx = selectedIndex;
        if (selectedIdx == null) return;
        let tmpIsSamePoint = await isSamePoint(coordinates[selectedIdx], coord);
        if (tmpIsSamePoint) {
            setOnDrag(true);
        }
    };
    const onTouchMove = async (e) => {
        let x = e.nativeEvent.locationX;
        let y = e.nativeEvent.locationY;

        let coord = await map.current?.getCoordinateFromView([x, y]);

        if (lastPolygonShape.current.length > 0 && active) {
            let polygonCoordinates = lastPolygonShape.current.map((item) => {
                const finalX = coord[0] + item[0];
                const finalY = coord[1] + item[1];
                return [finalX, finalY];
            });
            setCoordinates(polygonCoordinates);
            setCoordinateOutside(polygonCoordinates);
        }

        if (!onDrag) return;
        setDragCoor(coord);
        let tmpCoordinates = [...coordinates];
        if (selectedIndex != null) {
            tmpCoordinates[selectedIndex] = coord;
            setCoordinates(tmpCoordinates);
            setCoordinateOutside(tmpCoordinates);
            return;
        }
    };

    // On press to select
    const onPressToSelect = async (feature) => {
        let isSelect = null;
        //check corner point
        isSelect = await checkIsSelectPoint(feature.geometry.coordinates);
        if (coordinates.length < 3) return null;
        const insidePolygon = isPointInsidePolygon(feature.geometry.coordinates, coordinates);
        if (insidePolygon || isSelect != null) {
            setActive(true);
        } else {
            setActive(false);
        }
        if (isSelect == null) {
            setSelectedIndex(null);
        }
        return null;
    };

    // On press to add point
    const onPressToAddPoint = async (feature) => {
        let isStop = -1;
        let x = feature.geometry.coordinates[0];
        let y = feature.geometry.coordinates[1];
        setDragCoor(feature.geometry.coordinates);
        await Promise.all(
            coordinates.map(async (c, i) => {
                let tmpIsSamePoint = await isSamePoint([x, y], c);
                if (tmpIsSamePoint) {
                    isStop = i;
                }
            }),
        );
        if (isStop !== -1 && (isStop == 0 || isStop == coordinates.length - 1)) {
            setStarted(false);
            setStartedOutside(false);
            return;
        }
        setCoordinates([...coordinates, feature.geometry.coordinates]);
        setCoordinateOutside([...coordinates, feature.geometry.coordinates]);
    };
    // On press handle
    const onPress = async (feature) => {
        if (selectedCoordinates) return;
        if (!started) {
            onPressToSelect(feature);
            return;
        }
        onPressToAddPoint(feature);
    };

    const userLocation = useRef();

    const OnUserLocationUpdate = (e) => {
        const long = e?.coords?.longitude,
            latitude = e?.coords?.latitude;
        if (selectedCoordinates && selectedCoordinates?.length > 0) {
            flyToSelectedCoordinates();
            return;
        }
        setLocation([long, latitude]);
    };

    const flyToSelectedCoordinates = () => {
        if (selectedCoordinates && selectedCoordinates?.length > 0) {
            const center = turfGetCenter(selectedCoordinates);
            const polygon = buildPolygon({
                coordinates: selectedCoordinates,
                centroid: center.geometry.coordinates,
            });
            const bbox = Turf.bbox(polygon.geojson);
            if (camera.current) {
                camera.current.fitBounds([bbox[0], bbox[1]], [bbox[2], bbox[3]], 100, 1500);
            }
        }
    };

    useEffect(() => {
        flyToSelectedCoordinates();
    }, [selectedCoordinates, camera.current]);

    useEffect(() => {
        if (selectedCoordinates && selectedCoordinates?.length > 0) {
        } else if (location && camera.current) {
            camera.current.flyTo(location, 1500);
        }
    }, [location]);

    const requestToUseLocation = async () => {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            setAllowGetLocation(true);
        } else {
            Alert.alert('Location permission denied');
            setAllowGetLocation(false);
        }
    };

    useEffect(() => {
        queryFromStorage();
        requestToUseLocation();
    }, []);

    const OnStopDrawing = () => {
        setStarted(false);
        setStartedOutside(false);
        if (coordinates?.length === 0) {
            setActive(false);
        }
    };

    const OnClearDrawing = () => {
        setCoordinates([]);
        setCoordinateOutside([]);
        setSelectedIndex(null);
        setActive(true);
    };

    const OnStartDrawing = () => {
        setStarted(true);
        setStartedOutside(true);
        setCoordinates([]);
        setCoordinateOutside([]);
        setSelectedIndex(null);
        setActive(true);
    };

    functionRef.current = {
        OnStartDrawing,
        OnStopDrawing,
        OnClearDrawing,
        coordinates,
        started,
    };

    const map = useRef(null);

    return (
        <Box flex={1}>
            <MapView
                styleURL="mapbox://styles/mapbox/satellite-streets-v11?optimize=true"
                ref={map}
                style={{ flex: 1 }}
                scrollEnabled={(!active || started) && !selectedCoordinates}
                accessible={true}
                onTouchStart={onTouchStart}
                onTouchEnd={() => {
                    setOnDrag(false);
                    lastPolygonShape.current = [];
                }}
                onTouchMove={onTouchMove}
                onPress={onPress}
                logoEnabled={false}
                // scaleBarEnabled={false}
                attributionEnabled={false}
                onMapLoadingError={(error) => {
                    console.log('onMapLoadingError', error);
                }}
            >
                {allowGetLocation && (
                    <UserLocation
                        visible={true}
                        androidRenderMode="normal"
                        ref={userLocation}
                        onUpdate={OnUserLocationUpdate}
                        minDisplacement={20}
                    />
                )}
                {!!coordinates?.length && (
                    <Polygon
                        selectedIndex={selectedIndex}
                        coordinates={coordinates}
                        active={active}
                        started={started}
                    />
                )}
                {OfflinePlots.length > 0 && (
                    <>
                        {OfflinePlots.filter((item, index) => index !== selectedIndexCoord).map(
                            (item, index) => (
                                <Polygon
                                    selectedIndex={-1}
                                    coordinates={item.coordinates}
                                    active={false}
                                    started={false}
                                    typeOfPlot={
                                        item?.isDispute
                                            ? offlineMapsConstant.plotDispute
                                            : offlineMapsConstant.plotCreated
                                    }
                                    id={offlineMapsConstant.plotCreated + index}
                                    key={index}
                                />
                            ),
                        )}
                    </>
                )}
                {selectedCoordinates && (
                    <Polygon
                        selectedIndex={-1}
                        coordinates={selectedCoordinates}
                        active={false}
                        started={false}
                        typeOfPlot={offlineMapsConstant.plotSelected}
                        id={offlineMapsConstant?.plotSelected}
                    />
                )}

                <Camera
                    defaultSettings={{
                        centerCoordinate: INIT_COOR,
                        zoomLevel: 14,
                    }}
                    minZoomLevel={6.5}
                    ref={camera}
                />
            </MapView>
            <IconButton
                icon={<MaterialCommunityIcons name="crosshairs-gps" size={20} color={'black'} />}
                position={'absolute'}
                bottom={3}
                right={4}
                backgroundColor={'white'}
                borderRadius={'50px'}
                zIndex={1000}
                onPress={() => {
                    gotoUserLocation();
                }}
                opacity={selectedCoordinates ? 0 : 1}
                isDisabled={selectedCoordinates}
                _disabled={{
                    opacity: selectedCoordinates ? 0 : 0.5,
                }}
                _pressed={{
                    opacity: 0.8,
                }}
            ></IconButton>
            {onDrag && (
                <Box
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: 120,
                        height: 120,
                        overflow: 'hidden',
                        borderColor: 'white',
                        borderRadius: 1000,
                        borderWidth: 2,
                    }}
                >
                    <MapView
                        styleURL="mapbox://styles/mapbox/satellite-streets-v11?optimize=true"
                        style={{
                            width: 120,
                            height: 120,
                            borderRadius: 1000,
                            zIndex: 1000,
                        }}
                        logoEnabled={false}
                        scaleBarEnabled={false}
                        attributionEnabled={false}
                        scrollEnabled={false}
                        surfaceView={false}
                        accessible={false}
                        pointerEvents="none"
                    >
                        {!!coordinates?.length && (
                            <Polygon
                                selectedIndex={selectedIndex}
                                coordinates={coordinates}
                                active={active}
                            />
                        )}

                        <Camera
                            defaultSettings={{
                                zoomLevel: 18,
                            }}
                            animationMode="none"
                            centerCoordinate={dragCoor}
                        />
                    </MapView>
                </Box>
            )}
        </Box>
    );
};

ReactNativeMapbox.title = 'React Native mapbox';
ReactNativeMapbox.tags = [
    'LineLayer',
    'ShapeSource',
    'onCameraChanged',
    'getCoordinateFromView',
    'Overlay',
];
ReactNativeMapbox.docs = `
# Draw Polyline

This example shows a simple polyline editor. It uses \`onCameraChanged\` to get the center of the map and \`getCoordinateFromView\` 
to get the coordinates of the crosshair.

The crosshair is an overlay that is positioned using \`onLayout\` and \`getCoordinateFromView\`.

The \`ShapeSource\` is updated with the new coordinates and the \`LineLayer\` is updated with the new coordinates.
`;

export default ReactNativeMapbox;
