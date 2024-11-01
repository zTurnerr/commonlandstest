/* eslint-disable react-native/no-inline-styles */
import { Camera, MapView, UserLocation } from '@rnmapbox/maps';
import { Button, View } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { Box, HStack } from 'native-base';
import Polygon, { getMidPoint } from './Polygon';
import { createRectangle, isPointInsidePolygon } from '../../util/polygon';
import Rectangle from './Rectangle';

const SAME_POINT_DISTANCE = 30;
const INIT_COOR = [32.57146676047958, 1.708956744760215];

const ReactNativeMapbox = () => {
    const [coordinates, setCoordinates] = useState([]);
    const [areaDownload, setAreaDownload] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [started, setStarted] = useState(false);
    const [onDrag, setOnDrag] = useState(false);
    const [dragCoor, setDragCoor] = useState(INIT_COOR);
    const [active, setActive] = useState(false);

    const camera = useRef();
    const lastPolygonShape = useRef([]);

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

    // Drag point feature
    const onTouchStart = async (e) => {
        if (started) return;
        let x = e.nativeEvent.locationX;
        let y = e.nativeEvent.locationY;
        console.log('coordinate: ', x, y);
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
        }

        if (!onDrag) return;
        setDragCoor(coord);
        let tmpCoordinates = [...coordinates];
        if (selectedIndex != null) {
            tmpCoordinates[selectedIndex] = coord;
            setCoordinates(tmpCoordinates);
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

    const fillLayerClick = async (feature) => {
        if (!active) {
            setActive(true);
            return;
        }
        let x = feature?.coordinates.latitude;
        let y = feature?.coordinates.longitude;
        // let coord = await map.current?.getCoordinateFromView([x, y]);
        checkIsSelectPoint([x, y]);
    };

    // On press to add point
    const onPressToAddPoint = async (feature) => {
        let isStop = false;
        let x = feature.geometry.coordinates[0];
        let y = feature.geometry.coordinates[1];
        setDragCoor(feature.geometry.coordinates);
        await Promise.all(
            coordinates.map(async (c) => {
                let tmpIsSamePoint = await isSamePoint([x, y], c);
                if (tmpIsSamePoint) {
                    isStop = true;
                }
            }),
        );
        if (isStop) {
            setStarted(false);
            return;
        }
        setCoordinates([...coordinates, feature.geometry.coordinates]);
    };
    // On press handle
    const onPress = async (feature) => {
        if (!started) {
            onPressToSelect(feature);
            return;
        }
        onPressToAddPoint(feature);
    };

    const getCenterZoom = async () => {
        let data = await map.current?.getCenter();
        let Zooming = await map.current?.getZoom();
        let long = data[0].toFixed(4),
            lat = data[0].toFixed(4),
            zoom = Zooming.toFixed(2),
            bounds = await map.current.getVisibleBounds();
        return { long, lat, zoom, bounds };
    };

    const OnMoveEnd = async () => {
        await getCenterZoom();
    };

    const userLocation = useRef();

    const OnUserLocationUpdate = (e) => {
        const long = e?.coords?.longitude,
            latitude = e?.coords?.latitude;
        if (long && latitude && camera.current) {
            camera.current.flyTo([long, latitude]);
            createAreaToDownload([long, latitude]);
        }
    };

    const createAreaToDownload = async (point) => {
        const newRectangle = createRectangle(point, 1, 0.5);
        // setCoordinates(newRectangle);
        boundaryCoordinates();
        setAreaDownload(newRectangle);
    };

    const onCameraChanged = (e) => {
        createAreaToDownload(e?.properties?.center);
    };

    const boundaryCoordinates = async () => {
        // const bounds = await map.current.getVisibleBounds();
        // console.log('bounds:', bounds);
        // const topRightLat = bounds[0][1];
        // const topRightLng = bounds[0][0];
        // const downLeftLat = bounds[1][1];
        // const downLeftLng = bounds[1][0];
        // const _bounds = [
        //     [topRightLng, downLeftLat],
        //     bounds[0],
        //     [downLeftLng, topRightLat],
        //     bounds[1],
        // ];
        // setAreaDownload(bounds);
        // return [sw.lng, sw.lat, ne.lng, ne.lat];
    };

    useEffect(() => {
        // console.log(areaDownload);
    }, []);

    const map = useRef(null);

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <MapView
                    styleURL="mapbox://styles/mapbox/satellite-streets-v11?optimize=true"
                    ref={map}
                    style={{ height: 500, backgroundColor: 'red' }}
                    scrollEnabled={!active || started}
                    accessible={true}
                    onTouchStart={onTouchStart}
                    onTouchEnd={() => {
                        setOnDrag(false);
                        OnMoveEnd();
                        lastPolygonShape.current = [];
                    }}
                    rotateEnabled={areaDownload.length === 0}
                    zoomEnabled={areaDownload.length === 0}
                    onTouchMove={onTouchMove}
                    onPress={onPress}
                    logoEnabled={false}
                    // scaleBarEnabled={false}
                    attributionEnabled={false}
                    onMapLoadingError={(error) => {
                        console.log('onMapLoadingError', error);
                    }}
                    onCameraChanged={onCameraChanged}
                >
                    <UserLocation
                        visible={true}
                        androidRenderMode="normal"
                        ref={userLocation}
                        onUpdate={OnUserLocationUpdate}
                    />
                    {!!coordinates?.length && (
                        <Polygon
                            selectedIndex={selectedIndex}
                            coordinates={coordinates}
                            active={active}
                            fillLayerClick={fillLayerClick}
                            polygonClick={onPressToSelect}
                        />
                    )}
                    {!!areaDownload?.length && (
                        <Rectangle coordinates={areaDownload} id="download" />
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
                {onDrag && (
                    <Box
                        style={{
                            position: 'absolute',
                            bottom: 0,
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
                                    fillLayerClick={fillLayerClick}
                                    polygonClick={onPressToSelect}
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
            </View>
            <View>
                {!started ? (
                    <Button
                        title="start"
                        onPress={() => {
                            setStarted(true);
                            setCoordinates([]);
                            setSelectedIndex(null);
                            setActive(true);
                        }}
                    />
                ) : (
                    <HStack mt="10px" space="10px">
                        <Button
                            title="stop"
                            onPress={() => {
                                setStarted(false);
                                if (coordinates?.length === 0) {
                                    setActive(false);
                                }
                            }}
                        />
                        <Button
                            title="clear"
                            onPress={() => {
                                setCoordinates([]);
                                setSelectedIndex(null);
                                setActive(true);
                            }}
                        />
                    </HStack>
                )}
            </View>
        </View>
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
