/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-native/split-platform-components */
import { Camera, MapView, UserLocation } from '@rnmapbox/maps';
import { Box, IconButton } from 'native-base';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, PermissionsAndroid } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Rectangle from '../../components/Map/Rectangle';
import { createRectangle } from '../../util/polygon';
import { useNavigation } from '@react-navigation/native';

const INIT_COOR = [32.57146676047958, 1.708956744760215];

const MapPreview = ({ areaDownload, setAreaDownload, params, Downloading, setZoomMap }) => {
    const camera = useRef();
    const [location, setLocation] = useState([]);
    const userLocation = useRef();
    const [locationPermission, setLocationPermission] = useState(null);
    const [darkAreas] = useState([]);
    const [areaCover, setAreaCover] = useState([]);
    const [locationNow, setLocationNow] = useState({
        haveFly: false,
        showGPS: true,
    });
    const [movingDestination, setMovingDestination] = useState(false);
    const navigation = useNavigation();

    const OnUserLocationUpdate = (e) => {
        const long = e?.coords?.longitude,
            latitude = e?.coords?.latitude;
        // console.log('fly?', long, latitude);
        if (params?.center) return;

        // if (long && latitude && camera.current && location.length < 2) {
        //     camera.current.flyTo([long, latitude]);
        //     createAreaToDownload([long, latitude]);
        // }
        setLocation([long, latitude]);
    };

    const updateLocationNow = () => {
        if (params?.center) return;
        if (location.length < 2) return;
        if (locationNow?.haveFly) return;
        setLocationNow({
            ...locationNow,
            haveFly: true,
        });
        if (camera.current) {
            camera.current.flyTo(location, 1500);
        }
    };

    useEffect(() => {
        updateLocationNow();
    }, [location]);

    const gotoUserLocation = async () => {
        await fetchLocationPermission();
        if (camera.current && location.length > 0) {
            setLocationNow({
                ...locationNow,
                showGPS: true,
            });
            camera.current.flyTo(location, 1500);
        }
    };

    useEffect(() => {
        if (params?.location?.center) {
            if (camera.current) {
                setMovingDestination(true);
                setLocationNow({
                    ...locationNow,
                    showGPS: false,
                });
                camera.current.moveTo(params?.location?.center);
            }
        }
    }, [params?.location?.center]);

    const fetchLocationPermission = async () => {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            setLocationPermission(true);
        } else {
            setLocationPermission(false);
            Alert.alert('Location permission denied');
        }
    };

    const createAreaToDownload = async ({ point, bounds, zoom }) => {
        let totalZoom = 13.8 - zoom;
        // console.log('params zoom', params?.zoomMap);
        // console.log('zoom from map', zoom);
        if (movingDestination) {
            setMovingDestination(false);
        } else {
            navigation.setParams({
                location: {
                    placeName: null,
                    center: null,
                },
            });
        }
        if (params?.zoomMap) {
            totalZoom = 13.8 - params?.zoomMap;
        }
        setZoomMap(zoom);
        //2 to power totalZoom
        let sub = Math.pow(2, totalZoom);
        let lat = (bounds.sw[1] + bounds.ne[1]) / 2;
        lat = Math.abs(lat);
        let scale = 0;
        if (lat >= 90) scale = 0.05;
        else if (lat >= 80) scale = 0.1;
        else if (lat >= 60) scale = 0.3;
        else if (lat >= 40) scale = 0.5;
        else if (lat >= 20) scale = 0.6;
        else if (lat >= 0) scale = 0.7;

        const newRectangle = createRectangle(point, 1.3 * scale * sub, 0.8 * scale * sub);

        let boundsBottomLeft = bounds.sw,
            boundsTopRight = bounds.ne;
        let distance = 50;
        boundsBottomLeft = [boundsBottomLeft[0] - distance, boundsTopRight[1] + distance];
        boundsTopRight = [boundsTopRight[0] + distance, boundsTopRight[1] - distance];
        let boundsBottomRight = [boundsTopRight[0], boundsBottomLeft[1]],
            boundsTopLeft = [boundsBottomLeft[0], boundsTopRight[1]],
            smallRec = [boundsBottomLeft, boundsBottomRight, boundsTopRight, boundsTopLeft];

        setAreaCover(smallRec);
        setAreaDownload(newRectangle);
    };

    const onCameraChanged = (e) => {
        // console.log('e ', JSON.stringify(e, null, 2));
        createAreaToDownload({
            zoom: e?.properties?.zoom,
            point: e?.properties?.center,
            bounds: e?.properties?.bounds,
        });
    };

    useEffect(() => {
        fetchLocationPermission();
    }, []);

    const map = useRef(null);

    const canScrollMap = useCallback(() => {
        if (params?.center) return false;
        if (Downloading) return false;
        return true;
    }, [params, Downloading]);

    return (
        <>
            <Box flex={1}>
                <MapView
                    styleURL="mapbox://styles/mapbox/satellite-streets-v11?optimize=true"
                    ref={map}
                    style={{ flex: 1 }}
                    accessible={true}
                    scrollEnabled={canScrollMap()}
                    rotateEnabled={areaDownload.length === 0}
                    zoomEnabled={canScrollMap()}
                    logoEnabled={false}
                    // scaleBarEnabled={false}
                    attributionEnabled={false}
                    onMapLoadingError={(error) => {
                        console.log('onMapLoadingError', error);
                    }}
                    onPress={() => {
                        console.log('map press!');
                    }}
                    onCameraChanged={onCameraChanged}
                >
                    {locationPermission && (
                        <UserLocation
                            visible={true}
                            androidRenderMode="normal"
                            ref={userLocation}
                            onUpdate={OnUserLocationUpdate}
                            requestsAlwaysUse
                            minDisplacement={20}
                        />
                    )}

                    {!!areaDownload?.length && (
                        <Rectangle coordinates={areaDownload} id="download" areaCover={areaCover} />
                    )}
                    {darkAreas.length > 0 && (
                        <>
                            {darkAreas.map((item, index) => (
                                <Rectangle
                                    key={index}
                                    coordinates={item}
                                    id={'areaDark' + index}
                                    type="dark"
                                />
                            ))}
                        </>
                    )}
                    <Camera
                        defaultSettings={{
                            centerCoordinate: params?.center ? params?.center : INIT_COOR,
                            zoomLevel: params?.zoomMap ? params?.zoomMap : 13.8,
                        }}
                        // zoomLevel={params?.zoomMap}
                        minZoomLevel={8}
                        ref={camera}
                    />
                </MapView>
                {!params?.center && !Downloading && (
                    <IconButton
                        icon={
                            locationNow.showGPS ? (
                                <MaterialCommunityIcons
                                    name="crosshairs-gps"
                                    size={20}
                                    color={'black'}
                                />
                            ) : (
                                <MaterialIcons name="location-disabled" size={20} color={'black'} />
                            )
                        }
                        position={'absolute'}
                        bottom={3}
                        right={4}
                        backgroundColor={'white'}
                        borderRadius={'50px'}
                        zIndex={1000}
                        _pressed={{ opacity: 0.5 }}
                        onPress={() => {
                            gotoUserLocation();
                        }}
                    ></IconButton>
                )}
            </Box>
        </>
    );
};

MapPreview.title = 'React Native mapbox';
MapPreview.tags = [
    'LineLayer',
    'ShapeSource',
    'onCameraChanged',
    'getCoordinateFromView',
    'Overlay',
];
MapPreview.docs = `
# Draw Polyline

This example shows a simple polyline editor. It uses \`onCameraChanged\` to get the center of the map and \`getCoordinateFromView\` 
to get the coordinates of the crosshair.

The crosshair is an overlay that is positioned using \`onLayout\` and \`getCoordinateFromView\`.

The \`ShapeSource\` is updated with the new coordinates and the \`LineLayer\` is updated with the new coordinates.
`;

export default MapPreview;
