export const ownerShipDisputeColor = 'rgba(254, 74, 62, 0.8)';
export const ownerShipDisputeOutlineColor = 'rgba(254, 74, 62, 1)';
export const boundaryDisputeColor = 'rgba(251, 255, 72, 0.8)';
export const boundaryDisputeOutlineColor = 'rgba(254, 223, 62, 1)';

export const TYPE_SOURCE = {
    default: {
        fill: {
            paint: {
                'fill-color': 'rgba(42, 184, 73, 0.65)', // blue color fill,
                'fill-opacity': 0.8,
            },
        },
        outline: {
            paint: {
                'line-width': 1,
                'line-color': 'rgba(123, 231, 147, 1)',
            },
        },
        circle: {
            paint: {
                'circle-radius': 4,
                'circle-color': 'rgba(58, 151, 173, 1)',
                'circle-stroke-width': 1,
                'circle-stroke-color': 'rgba(123, 231, 147, 1)',
            },
        },
    },
    default_can_select: {
        fill: {
            paint: {
                // 'fill-color': 'rgba(42, 184, 73, 0.65)', // blue color fill,
                'fill-color': [
                    'case',
                    ['boolean', ['feature-state', 'click'], false],
                    'rgba(58, 151, 173, 1)',
                    'rgba(42, 184, 73, 0.65)',
                ],
                'fill-opacity': ['case', ['boolean', ['feature-state', 'click'], false], 1, 0.8],
            },
        },
        outline: {
            paint: {
                'line-width': 1,
                'line-color': 'rgba(123, 231, 147, 1)',
            },
        },
        circle: {
            paint: {
                'circle-radius': 4,
                'circle-color': 'rgba(58, 151, 173, 1)',
                'circle-stroke-width': 1,
                'circle-stroke-color': 'rgba(123, 231, 147, 1)',
            },
        },
    },
    selected: {
        fill: {
            paint: {
                'fill-color': 'rgba(58, 151, 173, 1)', // blue color fill,
                'fill-opacity': 0.8,
            },
        },
        outline: {
            paint: {
                // 'line-color': '#7BE793',
                'line-width': 1,
                'line-color': 'rgba(123, 231, 147, 1)',
            },
        },
    },
    fill_by_color_properties: {
        fill: {
            paint: {
                'fill-opacity': ['case', ['has', 'fillOpacity'], ['get', 'fillOpacity'], 0.8],
                'fill-color': { type: 'identity', property: 'color' },
            },
        },
        outline: {
            paint: {
                // 'line-color': '#7BE793',
                'line-width': 1,
                'line-color': [
                    'case',
                    ['has', 'outlineColor'],
                    ['get', 'outlineColor'],
                    'rgba(123, 231, 147, 1)',
                ],
            },
        },
    },
    set_color_properties: {
        fill: {
            paint: {
                'fill-opacity': ['case', ['has', 'fillOpacity'], ['get', 'fillOpacity'], 0.8],
                'fill-color': ['get', 'fillColor'], //{ type: 'identity', property: 'fillColor' },
            },
        },
        outline: {
            paint: {
                'line-width': ['case', ['has', 'lineWidth'], ['get', 'lineWidth'], 1],
                'line-color': ['get', 'outlineColor'],
            },
        },
    },
};
const TYPE_LINE = {
    white_dasharray: {
        line: {
            layout: {
                'line-join': 'round',
                'line-cap': 'round',
            },
            paint: {
                'line-color': '#ffffff',
                'line-width': 1,
                'line-dasharray': [2, 2, 2, 2],
            },
        },
    },
    white: {
        line: {
            layout: {
                'line-join': 'round',
                'line-cap': 'round',
            },
            paint: {
                'line-color': '#ffffff',
                'line-width': 1,
            },
        },
    },
    set_color_properties: {
        line: {
            layout: {
                'line-join': 'round',
                'line-cap': 'round',
            },
            paint: {
                'line-color': ['get', 'lineColor'],
                'line-width': 1,
            },
        },
    },
};
const TYPE_POINT = {
    green_white: {
        circle: {
            paint: {
                'circle-radius': 6,
                'circle-color': '#2AB848',
                'circle-stroke-width': 1,
                'circle-stroke-color': '#FFFFFF',
            },
        },
    },
    blue_white: {
        circle: {
            paint: {
                'circle-radius': 6,
                'circle-color': '#267385',
                'circle-stroke-width': 1,
                'circle-stroke-color': '#FFFFFF',
            },
        },
    },
    uploaded: {
        circle: {
            paint: {
                'circle-radius': 4,
                'circle-color': 'rgba(255, 255, 255, 1)',
                'circle-stroke-width': 1,
                'circle-stroke-color': 'rgba(123, 231, 147, 1)',
            },
        },
    },
    selected: {
        circle: {
            paint: {
                'circle-radius': 8,
                'circle-color': 'rgba(255, 255, 255, 1)',
                'circle-stroke-width': 1,
                'circle-stroke-color': 'rgba(123, 231, 147, 1)',
            },
        },
    },
    default: {
        circle: {
            paint: {
                'circle-radius': 4,
                'circle-color': 'rgba(58, 151, 173, 1)',
                'circle-stroke-width': 1,
                'circle-stroke-color': 'rgba(123, 231, 147, 1)',
            },
        },
    },
    set_color_properties: {
        circle: {
            paint: {
                'circle-radius': ['case', ['has', 'circleRadius'], ['get', 'circleRadius'], 8],
                'circle-color': ['get', 'circleColor'],
                'circle-stroke-width': [
                    'case',
                    ['has', 'circleStrokeWidth'],
                    ['get', 'circleStrokeWidth'],
                    2,
                ],
                'circle-stroke-color': ['get', 'circleStrokeColor'],
            },
        },
    },
};

export const PLOTS_STATUS = [
    {
        value: 0,
        label: 'Free & Clear',
    },
    {
        value: 1,
        label: 'Pending',
    },
    {
        value: 2,
        label: 'Ownership Dispute',
    },
    {
        value: 3,
        label: 'Boundary Dispute',
    },
    {
        value: 4,
        label: 'Locked',
    },
    {
        value: 5,
        label: 'Default',
    },
    {
        value: 7,
        label: 'Certificate On Hold',
    },
];

export const CLAIM_RANK = [
    {
        value: 0,
        label: 'Pending',
    },
    {
        value: 1,
        label: 'Very Poor',
    },
    {
        value: 2,
        label: 'Ok',
    },
    {
        value: 3,
        label: 'Good',
    },
    {
        value: 4,
        label: 'Excellent',
    },
];
export const CLAIMCHAIN_NUMBER = [
    {
        label: 'Claimchain greater than 150 plots',
        min: 150,
        max: 100000,
        value: 1,
    },
    {
        label: 'Claimchain from 101 - 150 plots',
        min: 100,
        max: 150,
        value: 2,
    },
    {
        label: 'Claimchain from 51 - 100 plots',
        min: 50,
        max: 100,
        value: 3,
    },
    {
        label: 'Claimchain less than 50 plots',
        min: 0,
        max: 50,
        value: 4,
    },
];
export const getColors = ({ numberClaimchain }) => {
    if (numberClaimchain === 1) {
        return {
            fillColor: 'rgba(42, 184, 73, 0.4)',
            outlineColor: 'rgba(123, 231, 147, 1)',
        };
    }
    if (numberClaimchain < 150) {
        return {
            fillColor: 'rgba(42, 184, 73, 1)',
            outlineColor: 'rgba(123, 231, 147, 1)',
            circleColor: 'rgba(123, 231, 147, 1)',
            circleStrokeColor: 'white',
            iconName: 'claimchain',
            iconSize: 0.2,
            lineColor: 'white',
        };
    }
    if (numberClaimchain >= 150) {
        return {
            fillColor: 'rgba(42, 184, 73, 0.9)',
            outlineColor: 'rgba(123, 231, 147, 1)',
            circleColor: 'rgba(123, 231, 147, 1)',
            circleStrokeColor: 'white',
            iconName: 'claimchain',
            iconSize: 0.2,
            lineColor: 'white',
        };
    }
};
const STATUS_STRING_MAP_TO_NUMBER = {
    'F&C': 0,
    pending: 1,
    ownershipDispute: 2,
    boundaryDispute: 3,
    locked: 4,
    defaulted: 5,
    inContract: 6,
};
const STATUS_STRING_MAP_TO_COLOR = {
    locked: {
        fillColor: '#61C7DF',
        outlineColor: '#ffffff',
        circleColor: '#61C7DF',
        iconName: 'activeContract',
    },
    defaulted: {
        fillColor: '#AD1457',
        outlineColor: '#ffffff',
        circleColor: '#AD1457',
        iconName: 'defaultedContract',
    },
    inContract: {
        fillColor: '#61C7DF',
        outlineColor: '#ffffff',
        circleColor: '#61C7DF',
        iconName: 'activeContract',
    },
    // inContract: {
    //     fillColor: '#5E7BC4',
    //     outlineColor: '#ffffff',
    //     circleColor: '#5E7BC4',
    //     iconName: 'activeContract',
    // },
};
export const getPlotStatus = ({ plot }) => {
    if (plot?.isOnHold) return 7;
    return STATUS_STRING_MAP_TO_NUMBER[plot?.status] === undefined
        ? 1
        : STATUS_STRING_MAP_TO_NUMBER[plot?.status];
};
const CERTIFICATE_STATUS_STRING_MAP_TO_NUMBER = {
    locked: 4,
    defaulted: 5,
    'awaiting-locked': 4,
};
export const getCertificateStatus = (status) => {
    return CERTIFICATE_STATUS_STRING_MAP_TO_NUMBER[status];
};
export const initPlot = (plot, index) => {
    if (!plot) return null;
    return {
        ...plot.geojson,
        properties: {
            name: plot.name,
            placeName: plot.placeName,
            area: plot.area,
            id: plot.id,
            _id: plot._id,
            ...plot.properties,
        },
        id: index + 1,
    };
};

export const initPoint = (coordinates) => {
    if (Array.isArray(coordinates)) {
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: coordinates,
            },
            properties: {
                coordinates,
            },
        };
    }
    return {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: coordinates.coordinates,
        },
        properties: {
            coordinates: coordinates.coordinates,
            ...coordinates.properties,
        },
    };
};
export const initLine = (coordinates) => {
    if (Array.isArray(coordinates)) {
        return {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: coordinates,
            },
        };
    }
    return {
        type: 'Feature',
        geometry: {
            type: 'LineString',
            coordinates: coordinates.coordinates,
        },
        properties: {
            coordinates: coordinates.coordinates,
            ...coordinates.properties,
        },
    };
};
export const initSource = ({
    plots = [],
    points = [],
    lines = [],
    type = 'default',
    lineType = type,
    pointType = type,
    id,
    symbol = false,
    disabledClick = false,
}) => {
    let source = JSON.parse(
        JSON.stringify({
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: [],
            },
            id,
            symbol,
            disabledClick,
        }),
    );
    plots?.forEach((plot, index) => {
        let polygon = initPlot(plot, index);
        source.data.features.push(polygon);
    });

    points?.forEach((point) => {
        let marker = initPoint(point);
        source.data.features.push(marker);
    });
    lines?.forEach((line) => {
        let l = initLine(line);
        source.data.features.push(l);
    });
    source = { ...source };
    if (TYPE_SOURCE[type]) {
        source = { ...source, ...TYPE_SOURCE[type] };
    }
    if (TYPE_LINE[lineType]) {
        source = { ...source, ...TYPE_LINE[lineType] };
    }
    if (TYPE_POINT[pointType]) {
        source = { ...source, ...TYPE_POINT[pointType] };
    }
    return source;
};
export const deepClone = (object = {}) => {
    return JSON.parse(JSON.stringify(object));
};
export const getFillColor = (plot, defaultFillColor) => {
    if (STATUS_STRING_MAP_TO_COLOR[plot.status]) {
        return STATUS_STRING_MAP_TO_COLOR[plot.status].fillColor;
    }
    if (plot.isOwnershipDispute) {
        return ownerShipDisputeColor;
    }
    if (plot.isBoundaryDispute) {
        return boundaryDisputeColor;
    }
    return defaultFillColor;
};
export const getOutlineColor = (plot, defaultOutlineColor) => {
    if (STATUS_STRING_MAP_TO_COLOR[plot.status]) {
        return STATUS_STRING_MAP_TO_COLOR[plot.status].outlineColor;
    }
    if (plot.isOwnershipDispute) {
        return ownerShipDisputeOutlineColor;
    }
    if (plot.isBoundaryDispute) {
        return boundaryDisputeOutlineColor;
    }
    return defaultOutlineColor;
};
export const getIconName = (plot, defaultIconName) => {
    if (STATUS_STRING_MAP_TO_COLOR[plot.status]) {
        return STATUS_STRING_MAP_TO_COLOR[plot.status].iconName;
    }
    return defaultIconName;
};
export const getDataForRenderWithPlot = (plot, defaultData) => {
    if (STATUS_STRING_MAP_TO_COLOR[plot.status]) {
        return {
            ...defaultData,
            ...STATUS_STRING_MAP_TO_COLOR[plot.status],
        };
    }
    if (plot.isOwnershipDispute) {
        return {
            ...defaultData,
            fillColor: ownerShipDisputeColor,
            outlineColor: ownerShipDisputeOutlineColor,
        };
    }
    if (plot.isBoundaryDispute) {
        return {
            ...defaultData,
            fillColor: boundaryDisputeColor,
            outlineColor: boundaryDisputeOutlineColor,
        };
    }
    return defaultData;
};
export const renderPublicPlot = ({
    claimchains = [],
    worthwhileNumber: globalWorthwhileNumber = 0,
    addSource,
    selectPolygon,
    firstTime,
    setFirstTime,
}) => {
    let plots = [],
        lines = [],
        points = [],
        allUnion = [];

    const start = new Date().getTime();

    claimchains.forEach((claimchain) => {
        let worthwhileNumber = globalWorthwhileNumber;
        if (claimchain?.location?.claimchainSize) {
            worthwhileNumber = claimchain.location.claimchainSize;
        }
        //get color data default with claimchain size
        let colors = getColors({
            numberClaimchain: claimchain.size,
        });
        // let unionPolygon;

        claimchain.plots.forEach((plot) => {
            // if (claimchain.size >= worthwhileNumber) {
            //     if (!index) {
            //         unionPolygon = plot.geojson;
            //     } else {
            //         unionPolygon = Turf.union(unionPolygon, plot.geojson);
            //     }
            // }

            let _plot = deepClone(plot);
            // get color data by plot status
            const { fillColor, outlineColor, iconName } = getDataForRenderWithPlot(_plot, colors);
            _plot.properties = {
                ...colors,
                fillColor,
                outlineColor: claimchain.size >= worthwhileNumber ? '#fff' : outlineColor,
                lineWidth: claimchain.size >= worthwhileNumber ? 2 : 1,
                claimchainSize: claimchain.size,
                centroid: plot.centroid,
            };
            plots.push(_plot);
            if (claimchain.size > 1) {
                points.push({
                    coordinates: _plot.centroid,
                    properties: {
                        ...colors,
                        iconName,
                        circleColor: fillColor,
                    },
                });
            }
        });
        // if (claimchain.size >= worthwhileNumber) {
        //     allUnion.push({
        //         geojson: unionPolygon,
        //         properties: {
        //             outlineColor: 'white',
        //             fillColor: 'transparent',
        //             lineWidth: 2,
        //         },
        //     });
        // }
        claimchain.neighbors?.forEach((ids) => {
            let first = claimchain.plots.find((i) => i._id === ids[0]);
            let second = claimchain.plots.find((i) => i._id === ids[1]);
            if (first && second) {
                lines.push({
                    coordinates: [first.centroid, second.centroid],
                    properties: {
                        ...colors,
                    },
                });
            }
        });
    });

    const end = new Date().getTime();

    console.log('[cml-script] Execution time: ' + (end - start) + 'ms');

    // render polygon
    const source = initSource({
        plots,
        id: 'all_plot_explore',
        type: 'set_color_properties',
    });
    if (addSource) {
        addSource(source);
    }

    if (!firstTime) {
        setFirstTime(true);
        selectPolygon(
            {
                polygon: null,
            },
            true,
        );
    }

    const source3 = initSource({
        plots: allUnion,
        id: 'all_union',
        type: 'set_color_properties',
        disabledClick: true,
        // lineType: 'set_color_properties',
    });
    if (addSource) {
        addSource(source3);
    }

    //point and line
    const source2 = initSource({
        points,
        symbol: true,
        lines,
        id: 'all_plot_explore_marker',
        type: 'set_color_properties',
    });
    if (addSource) {
        addSource(source2);
    }
};

export const renderCluster = ({ addSource, claimchains }) => {
    let plots = claimchains?.map((i) => i.plots)?.flat();
    let source = JSON.parse(
        JSON.stringify({
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: [],
            },
            id: 'earthquakes_clusters',
            cluster: true,
            // clusterMaxZoom: 14, // Max zoom to cluster points on
            clusterRadius: 50,
        }),
    );
    plots.forEach((plot) => {
        let point = initPoint({
            coordinates: plot.centroid,
            properties: {
                id: plot._id,
                mag: 1,
                tsunami: 0,
            },
        });
        source.data.features.push(point);
    });
    let layers = [
        {
            id: 'clusters',
            type: 'circle',
            source: 'earthquakes_clusters',
            filter: ['has', 'point_count'],
            paint: {
                'circle-color': '#5EC4AC',
                'circle-radius': 20,
            },
        },
        {
            id: 'cluster-count',
            type: 'symbol',
            source: 'earthquakes_clusters',
            filter: ['has', 'point_count'],
            layout: {
                'text-field': ['get', 'point_count_abbreviated'],
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12,
            },
            paint: {
                'text-color': '#ffffff',
            },
        },
        {
            id: 'unclustered-point',
            type: 'circle',
            source: 'earthquakes_clusters',
            filter: ['!', ['has', 'point_count']],
            paint: {
                'circle-color': '#11b4da',
                'circle-radius': 4,
                'circle-stroke-width': 1,
                'circle-stroke-color': '#fff',
            },
        },
    ];
    addSource({
        source,
        layers,
    });
};
