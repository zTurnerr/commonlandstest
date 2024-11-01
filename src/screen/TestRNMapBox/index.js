/* eslint-disable react-native/no-unused-styles */
import Mapbox from '@rnmapbox/maps';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../util/Constants';
import DrawPolyline from './DrawPolyLine';

Mapbox.setAccessToken(
    'pk.eyJ1Ijoia2hvaWZ1aXhsYWJzIiwiYSI6ImNsZ2E4bzMzYzA5OHEzbnBhY3R4MnJ3amwifQ.2PzgKhOB8Sec_pJXGy9RfQ',
);

const Index = () => {
    // const progressListener = (offlineRegion, status) => console.log(offlineRegion, status);
    // const errorListener = (offlineRegion, err) => console.log(offlineRegion, err);

    // const downloadMap = async () => {
    //     const res = await Mapbox.offlineManager.createPack(
    //         {
    //             name: 'offline-test',
    //             styleURL: 'mapbox://styles/mapbox/satellite-streets-v11?optimize=true',
    //             bounds: [
    //                 [32.57146676047958, 1.708956744760215],
    //                 [32.97146676047958, 1.758956744760215],
    //             ],
    //             minZoom: 14,
    //             maxZoom: 20,
    //         },
    //         progressListener,
    //         errorListener
    //     );
    //     console.log(res);
    // };

    useEffect(() => {
        // downloadMap();
    }, []);

    return (
        <View style={styles.page}>
            <View style={styles.container}>
                <DrawPolyline />
            </View>

            {/* <Box
                    position={'absolute'}
                    left={1}
                    top={10}
                    zIndex={1000}
                    width={120}
                    borderRadius={1000}
                    height={120}
                    bg={'amber.100'}
                    overflow={'hidden'}
                >
                    <MapView
                        styleURL="mapbox://styles/mapbox/satellite-streets-v11?optimize=true"
                        style={{ flex: 1, borderRadius: 1000, zIndex: 1000 }}
                    />
                </Box> */}
        </View>
    );
};

export default Index;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        height: SCREEN_HEIGHT,
        width: SCREEN_WIDTH,
    },
    map: {
        flex: 1,
    },
});
