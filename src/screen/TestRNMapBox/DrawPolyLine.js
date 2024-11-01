/* eslint-disable react-native/no-inline-styles */
import { Camera, MapView } from '@rnmapbox/maps';
import { HStack } from 'native-base';
import React, { useRef, useState } from 'react';
import { Button, View } from 'react-native';
import { isPointInsidePolygon } from '../../util/polygon';
import Polygon, { getMidPoint } from './Polygon';

const SAME_POINT_DISTANCE = 30;
const INIT_COOR = [32.57146676047958, 1.708956744760215];

const DrawPolyline = () => {
    const [coordinates, setCoordinates] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [started, setStarted] = useState(false);
    const [onDrag, setOnDrag] = useState(false);
    const [dragCoor, setDragCoor] = useState(INIT_COOR);
    const [active, setActive] = useState(true);

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
                    console.log('Select index ', i);
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

                    console.log('Select index ', nextIndex);
                    return nextIndex;
                }
            }),
        );
        return idx;
    };

    // Drag point feature
    const onTouchStart = async (e) => {
        console.log('touche start');
        if (started) return;
        let x = e.nativeEvent.locationX;
        let y = e.nativeEvent.locationY;
        // console.log('location: ', x, y);
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

        // const tmpSelect = await checkIsSelectPoint(coord);
        // console.log('tmpSelect', tmpSelect);
        let selectedIdx;
        // console.log('selectedIdx', selectedIdx);
        // console.log('selectedIndex', selectedIndex);
        selectedIdx = selectedIndex;
        // selectedIdx = await checkIsSelectPoint(coord);
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
        console.log('layer: ', [x, y]);
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

    const map = useRef(null);

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <MapView
                    styleURL="mapbox://styles/mapbox/satellite-streets-v11?optimize=true"
                    ref={map}
                    style={{ height: 500 }}
                    scrollEnabled={!active || started}
                    accessible={true}
                    onTouchStart={onTouchStart}
                    onTouchEnd={() => {
                        setOnDrag(false);
                        OnMoveEnd();
                        lastPolygonShape.current = [];
                    }}
                    onTouchMove={onTouchMove}
                    onPress={onPress}
                    logoEnabled={false}
                    scaleBarEnabled={false}
                    attributionEnabled={false}
                    onMapLoadingError={(error) => {
                        console.log('onMapLoadingError', error);
                    }}
                    compassEnabled={true}
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
                            centerCoordinate: INIT_COOR,
                            zoomLevel: 6.5,
                        }}
                        minZoomLevel={6.5}
                        ref={camera}
                    />
                </MapView>
                {true && (
                    <MapView
                        styleURL="mapbox://styles/mapbox/satellite-streets-v11?optimize=true"
                        style={{
                            width: 120,
                            height: 120,
                            borderRadius: 1000,
                            zIndex: 1000,
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            borderColor: 'white',
                            // overflow: 'hidden',
                            borderWidth: 5,
                        }}
                        logoEnabled={false}
                        scaleBarEnabled={false}
                        attributionEnabled={false}
                        scrollEnabled={false}
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

DrawPolyline.title = 'Draw Polyline';
DrawPolyline.tags = [
    'LineLayer',
    'ShapeSource',
    'onCameraChanged',
    'getCoordinateFromView',
    'Overlay',
];
DrawPolyline.docs = `
# Draw Polyline

This example shows a simple polyline editor. It uses \`onCameraChanged\` to get the center of the map and \`getCoordinateFromView\` 
to get the coordinates of the crosshair.

The crosshair is an overlay that is positioned using \`onLayout\` and \`getCoordinateFromView\`.

The \`ShapeSource\` is updated with the new coordinates and the \`LineLayer\` is updated with the new coordinates.
`;

export default DrawPolyline;
