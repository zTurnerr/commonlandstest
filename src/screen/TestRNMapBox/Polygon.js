import React, { useMemo, useRef } from 'react';
import { LineLayer, ShapeSource, FillLayer, CircleLayer } from '@rnmapbox/maps';

const fillActiveStyle = {
    lineColor: 'rgb(251, 176, 59)',
    fillColor: 'rgba(251, 176, 59, 0.1)',
    lineDasharray: [0.5, 1],
    lineWidth: 2,
    circleColor: 'rgb(251, 176, 59)',
    circleRadius: 3,
};

const strokeActiveStyle = {
    circleColor: '#FFF',
    circleRadius: 5,
};

const fillInactiveStyle = {
    // lineColor: 'rgb(23, 70, 82)',
    // fillColor: 'rgb(23, 70, 82, 0.1)',
    // lineWidth: 2,
    lineColor: 'rgb(59, 178, 208)',
    fillColor: 'rgba(59, 178, 208, 0.1)',
    lineWidth: 2,
    lineDasharray: [10, 0],
};

const selectedPointStyle = {
    lineColor: '#ff0000',
    circleColor: '#2AB849',
    circleRadius: 6,
};

const selectedStrokePointStyle = {
    circleColor: '#FFF',
    circleRadius: 7,
};

const midPointStyle = {
    lineColor: '#ff0000',
    circleColor: 'rgb(251, 176, 59)',
    circleRadius: 3,
};

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

const Polygon = ({ coordinates, selectedIndex, id = 'id', active }) => {
    const mainLayerRef = useRef();

    const pointFeature = useMemo(() => {
        return generateGeoJson([
            ...coordinates.map((c) => ({
                type: 'Feature',
                id: 'a-feature',
                geometry: {
                    type: 'Point',
                    coordinates: c,
                },
            })),
        ]);
    }, [coordinates]);

    const midPointFeature = useMemo(() => {
        return generateGeoJson([
            ...getMidPointList(coordinates).map((c) => ({
                type: 'Feature',
                id: 'a-feature',
                geometry: {
                    type: 'Point',
                    coordinates: c,
                },
            })),
        ]);
    }, [coordinates]);

    const selectedPointFeature = useMemo(() => {
        return generateGeoJson([
            {
                type: 'Feature',
                id: 'b-feature',
                geometry: {
                    type: 'Point',
                    coordinates: selectedIndex !== null ? coordinates[selectedIndex] : [0, 0],
                },
                properties: {},
            },
        ]);
    }, [coordinates, selectedIndex]);

    const polygonFeature = useMemo(() => {
        return generateGeoJson([
            {
                type: 'Feature',
                id: 'c-feature',
                geometry: {
                    type: 'LineString',
                    coordinates:
                        coordinates?.length >= 2
                            ? [...coordinates, coordinates[0]]
                            : [
                                  [0, 0],
                                  [0, 0],
                              ],
                },
                properties: {},
            },
        ]);
    }, [coordinates]);

    // const onClickPolygon = (e) => {
    //     console.log('click polygon', e);
    //     console.log('Main layer', mainLayerRef.current);
    //     fillLayerClick(e);
    // };

    return (
        <>
            <ShapeSource ref={mainLayerRef} id={`fill-source-${id}`} shape={polygonFeature}>
                <FillLayer
                    id={'fill-layer'}
                    style={active == true ? fillActiveStyle : fillInactiveStyle}
                />
            </ShapeSource>
            <ShapeSource id={`line-source-${id}`} shape={polygonFeature}>
                <LineLayer
                    id={'line-layer'}
                    style={active == true ? fillActiveStyle : fillInactiveStyle}
                />
            </ShapeSource>

            {active && (
                <>
                    <ShapeSource id={`circle-mid-source-${id}`} shape={midPointFeature}>
                        <CircleLayer id={'circle-layer-3'} style={midPointStyle} />
                    </ShapeSource>

                    <ShapeSource id={`circle-point-stroke-source-${id}`} shape={pointFeature}>
                        <CircleLayer id={'circle-layer-4'} style={strokeActiveStyle} />
                    </ShapeSource>

                    <ShapeSource id={`circle-point-source-${id}`} shape={pointFeature}>
                        <CircleLayer id={'circle-layer-2'} style={fillActiveStyle} />
                    </ShapeSource>

                    <ShapeSource
                        id={`circle-selected-stroke-source-${id}`}
                        shape={selectedPointFeature}
                    >
                        <CircleLayer
                            id={'circle-stroke-layer-1'}
                            style={selectedStrokePointStyle}
                        />
                    </ShapeSource>
                    <ShapeSource id={`circle-selected-source-${id}`} shape={selectedPointFeature}>
                        <CircleLayer id={'circle-layer-1'} style={selectedPointStyle} />
                    </ShapeSource>
                </>
            )}
        </>
    );
};

export default Polygon;
