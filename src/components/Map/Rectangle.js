import { FillLayer, LineLayer, ShapeSource } from '@rnmapbox/maps';
import { useTheme } from 'native-base';
import React, { useMemo, useRef } from 'react';

function generateGeoJson(features) {
    return {
        type: 'FeatureCollection',
        features: features,
    };
}

export function getMidPoint(a, b) {
    return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
}

export function getMidPointList(coordinates) {
    let midPointList = [];
    for (let i = 0; i < coordinates.length; i++) {
        let nextIndex = i === coordinates.length - 1 ? 0 : i + 1;
        let midPoint = getMidPoint(coordinates[i], coordinates[nextIndex]);
        midPointList.push(midPoint);
    }

    return midPointList;
}

const Rectangle = ({ coordinates, id = 'id', areaCover, type = 'active' }) => {
    const mainLayerRef = useRef();

    const theme = useTheme();

    const fillActiveStyle = {
        lineColor: theme.colors.primary[600],
        lineDasharray: [10, 0],
        lineWidth: 4,
        fillColor: 'rgba(0, 0, 0, 0.60)',
    };

    const darkAreaFill = {
        fillColor: '#000000',
        fillOpacity: 0.6,
    };

    const polygonFeature = useMemo(() => {
        return generateGeoJson([
            {
                type: 'Feature',
                id: 'c-feature',
                geometry: {
                    type: 'Polygon',
                    coordinates:
                        coordinates?.length >= 2
                            ? [areaCover, [...coordinates, coordinates[0]]]
                            : [
                                  [0, 0],
                                  [0, 0],
                              ],
                },
                properties: {},
            },
        ]);
    }, [coordinates]);

    return (
        <>
            <ShapeSource ref={mainLayerRef} id={`fill-source-${id}`} shape={polygonFeature}>
                <FillLayer
                    id={'fill-layer' + id}
                    style={type === 'active' ? fillActiveStyle : darkAreaFill}
                />
            </ShapeSource>
            <ShapeSource id={`line-source-${id}`} shape={polygonFeature}>
                <LineLayer
                    id={'line-layer' + id}
                    style={type === 'active' ? fillActiveStyle : darkAreaFill}
                />
            </ShapeSource>
        </>
    );
};

export default Rectangle;
