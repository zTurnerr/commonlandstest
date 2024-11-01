import * as Turf from '@turf/turf';
import { Decimal } from 'decimal.js';
import { OVERLAP_ERROR } from './Constants';
import { isArrayNotEmpty } from './Constants';
import i18n from 'i18next';

function linesOverlap(line1, line2) {
    // Check if the endpoints of line1 are on opposite sides of line2
    const side1 = getLineSide(line1[0], line1[1], line2[0]);
    const side2 = getLineSide(line1[0], line1[1], line2[1]);
    if (side1 * side2 >= 0) {
        return false;
    }

    // Check if the endpoints of line2 are on opposite sides of line1
    const side3 = getLineSide(line2[0], line2[1], line1[0]);
    const side4 = getLineSide(line2[0], line2[1], line1[1]);
    if (side3 * side4 >= 0) {
        return false;
    }

    return true;
}

function getLineSide(p1, p2, p) {
    return Math.sign((p2[0] - p1[0]) * (p[1] - p1[1]) - (p2[1] - p1[1]) * (p[0] - p1[0]));
}

function getEdges(poly) {
    const edges = [];
    for (let i = 0; i < poly.length; i++) {
        const j = (i + 1) % poly.length;
        edges.push([poly[i], poly[j]]);
    }
    return edges;
}

function getPerpendicular([p1, p2]) {
    return [-1 * (p2[1] - p1[1]), p2[0] - p1[0]];
}

function project(poly, axis) {
    const projections = [];
    for (let point of poly) {
        projections.push(dotProduct(point, axis));
    }
    return [Math.min(...projections), Math.max(...projections)];
}

function overlap1D([min1, max1], [min2, max2]) {
    return Math.max(min1, min2) <= Math.min(max1, max2);
}

function dotProduct([x1, y1], [x2, y2]) {
    return x1 * x2 + y1 * y2;
}

export function isPointInsidePolygon(point, polygon) {
    return Turf.booleanPointInPolygon(
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: point,
            },
        },
        {
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: [polygon],
            },
        },
    );
}

export function createRectangle(centerPoint, widthKm = 0.5, heightKm = 0.5) {
    const [centerLongitude, centerLatitude] = centerPoint;

    // Calculate the distance in kilometers corresponding to 0.5 kilometers in latitude and longitude
    const latDistance = widthKm / 110.574; // Approximately 1 degree of latitude is about 110.574 kilometers
    const lonDistance = heightKm / (111.32 * Math.cos((centerLatitude * Math.PI) / 180));

    // Calculate the coordinates of the rectangle corners
    const topLeft = [centerLongitude - lonDistance, centerLatitude - latDistance];
    const topRight = [centerLongitude + lonDistance, centerLatitude - latDistance];
    const bottomLeft = [centerLongitude - lonDistance, centerLatitude + latDistance];
    const bottomRight = [centerLongitude + lonDistance, centerLatitude + latDistance];

    // Return the coordinates of the rectangle corners in GeoJSON format
    const rectangleGeoJSON = [topLeft, topRight, bottomRight, bottomLeft, topLeft];

    return rectangleGeoJSON;
}

//conver sw, ne to a rectangular
export const createRectangleFromBounds = (sw, ne) => {
    return [
        [sw[0], sw[1]],
        [ne[0], sw[1]],
        [ne[0], ne[1]],
        [sw[0], ne[1]],
        [sw[0], sw[1]],
    ];
};

export const getCenterPointPolygon = (coordinates) => {
    const center = coordinates.reduce(
        (acc, coord) => [acc[0] + coord[0], acc[1] + coord[1]],
        [0, 0],
    );

    center[0] /= coordinates.length;
    center[1] /= coordinates.length;
    return center;
};

export const turfGetCenter = (coordinates) => {
    const polygon = Turf.polygon([coordinates]);
    const centroid = Turf.centroid(polygon);
    return centroid;
};

export const turfGetArea = (coordinates) => {
    const polygon = Turf.polygon([coordinates]);
    const area = Turf.area(polygon);
    return area;
};

export const buildPolygon = ({ coordinates, centroid }) => {
    let item = {
        geojson: {
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: [coordinates],
            },
        },
        centroid: centroid,
    };
    return item;
};

// check two polygon overlap
function checkOverlap(poly1, poly2) {
    if (JSON.stringify(poly1) === JSON.stringify(poly2)) {
        return true;
    }

    // Get the edges of both polygons
    const edges1 = getEdges(poly1);
    const edges2 = getEdges(poly2);

    // Check if any edge separates the two polygons
    for (let edge of [...edges1, ...edges2]) {
        const axis = getPerpendicular(edge);
        const projection1 = project(poly1, axis);
        const projection2 = project(poly2, axis);
        if (!overlap1D(projection1, projection2)) {
            return false;
        }
    }

    // Check if any vertex of poly1 is inside poly2
    if (poly1.every((vertex) => isPointInsidePolygon(vertex, poly2))) {
        return true;
    }

    // Check if any vertex of poly2 is inside poly1
    if (poly2.every((vertex) => isPointInsidePolygon(vertex, poly1))) {
        return true;
    }

    // Check if any edge of poly1 overlaps with an edge of poly2
    for (let edge1 of edges1) {
        for (let edge2 of edges2) {
            if (linesOverlap(edge1, edge2)) {
                return true;
            }
        }
    }

    return false;
}

function getClosestPointOnSegment(point, segStart, segEnd) {
    segStart = [new Decimal(segStart[0], 100), new Decimal(segStart[1], 100)];
    segEnd = [new Decimal(segEnd[0], 100), new Decimal(segEnd[1], 100)];
    point = [new Decimal(point[0], 100), new Decimal(point[1], 100)];
    if (segStart[0] === segEnd[0] && segStart[1] === segEnd[1]) return [Infinity, Infinity];
    const segDir = [Decimal.sub(segEnd[0], segStart[0]), Decimal.sub(segEnd[1], segStart[1])];
    const pointDir = [Decimal.sub(point[0], segStart[0]), Decimal.sub(point[1], segStart[1])];

    const segLength = Decimal.sqrt(segDir[0].pow(2).plus(segDir[1].pow(2)));
    segDir[0] = segDir[0].div(segLength);
    segDir[1] = segDir[1].div(segLength);

    const projectionLength = Decimal.mul(pointDir[0], segDir[0]).plus(
        Decimal.mul(pointDir[1], segDir[1]),
    );

    let closestPoint;

    if (projectionLength.lte(0)) {
        closestPoint = segStart;
    } else if (projectionLength.gte(segLength)) {
        closestPoint = segEnd;
    } else {
        const projection = [segDir[0].times(projectionLength), segDir[1].times(projectionLength)];
        closestPoint = [segStart[0].plus(projection[0]), segStart[1].plus(projection[1])];
    }
    return closestPoint;
}

function distance(point1, point2) {
    const [x1, y1] = point1;
    const [x2, y2] = point2;
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function getClosestPointsOfTwoPolygons(poly1, poly2) {
    var minDist = Infinity;
    var closest1, closest2;

    // loop each point in poly 1
    for (var i = 0; i < poly1.length; i++) {
        var p1 = poly1[i];
        // var p2 = poly1[(i + 1) % poly1.length];

        // loop each edge in poly 2
        for (var j = 0; j < poly2.length; j++) {
            var q1 = poly2[j];
            var q2 = poly2[(j + 1) % poly2.length];

            // get closest point to p1 on edge q1 - q2 of poly2
            var closest = getClosestPointOnSegment(p1, q1, q2);

            // get distance between p1 and closest point
            var dist = distance(p1, closest);

            if (dist < minDist) {
                minDist = dist;
                closest1 = p1;
                closest2 = closest;
            }

            // get distance between two vertices
            dist = distance(q1, p1);
            if (dist < minDist) {
                minDist = dist;
                closest1 = p1;
                closest2 = q1;
            }
        }
    }

    // loop each points in poly2
    for (var i = 0; i < poly2.length; i++) {
        var p1 = poly2[i];
        // var p2 = poly2[(i + 1) % poly2.length];

        // loop each edges in poly1
        for (var j = 0; j < poly1.length; j++) {
            // get closest point to p1 on edge q1 - q2 of poly 1
            var q1 = poly1[j];
            var q2 = poly1[(j + 1) % poly1.length];
            var closest = getClosestPointOnSegment(p1, q1, q2);

            // get distance between p1 and closest point
            var dist = distance(p1, closest);
            if (dist < minDist) {
                minDist = dist;
                closest1 = closest;
                closest2 = p1;
            }

            // get distance between two vertices
            dist = distance(q1, p1);
            if (dist < minDist) {
                minDist = dist;
                closest1 = q1;
                closest2 = p1;
            }
        }
    }

    if (typeof closest1[0] !== 'number') closest1[0] = closest1[0].toNumber();
    if (typeof closest1[1] !== 'number') closest1[1] = closest1[1].toNumber();
    if (typeof closest2[0] !== 'number') closest2[0] = closest2[0].toNumber();
    if (typeof closest2[1] !== 'number') closest2[1] = closest2[1].toNumber();
    return { point1: closest1, point2: closest2, distance: minDist };
}

export const getDistanceBetweenPolygons = function (anchorPolygon, targetPolygon) {
    const closestPoints = getClosestPointsOfTwoPolygons(anchorPolygon, targetPolygon);
    const isOverlap = checkOverlap(anchorPolygon, targetPolygon);
    return isOverlap
        ? 0
        : Turf.distance(
              {
                  type: 'Point',
                  coordinates: closestPoints.point1,
              },
              {
                  type: 'Point',
                  coordinates: closestPoints.point2,
              },
              {
                  units: 'feet',
              },
          );
};
export const validatePolygon = (
    polygon,
    plots = [],
    options = {
        strictValidate: true,
    },
) => {
    let p = Turf.polygon(polygon);
    const kinks = Turf.kinks(p);
    if (isArrayNotEmpty(kinks.features)) {
        throw i18n.t('error.plotInvalid');
    }
    if (Turf)
        //check overlap
        for (let i = 0; i < plots.length; i++) {
            let p2 = Turf.polygon(plots[i].geojson.geometry.coordinates);
            if (options.strictValidate) {
                if (Turf.booleanOverlap(p, p2) || Turf.intersect(p, p2) || Turf.intersect(p2, p)) {
                    throw OVERLAP_ERROR;
                }
            } else {
                if (
                    Turf.booleanOverlap(p, p2) &&
                    (Turf.intersect(p, p2) || Turf.intersect(p2, p))
                ) {
                    throw OVERLAP_ERROR;
                }
            }

            if (Turf.booleanWithin(p, p2) || Turf.booleanWithin(p2, p)) {
                throw OVERLAP_ERROR;
            }
        }
    //check inside uganda country
    // let p3 = Turf.polygon(uganda.coordinates);
    // let intersect = Turf.intersect(p, p3);
    // if (!intersect) {
    //     throw `${i18n.t('error.plotInvalid2')}`;
    // }
    // let area = Number(Turf.area(p)).toFixed(2);
    // let area2 = Number(Turf.area(intersect)).toFixed(2);
    // if (area !== area2) {
    //     throw i18n.t('error.plotInvalid2');
    // }
};

//check polygon children inside polygon parent
export const checkPolygonInsidePolygon = (polygonParent, polygonChild) => {
    let p = Turf.polygon(polygonParent);
    let p2 = Turf.polygon(polygonChild);
    let intersect = Turf.intersect(p, p2);
    if (!intersect) {
        throw i18n.t('error.plotInvalid');
    }
    let area = Number(Turf.area(p2)).toFixed(2);
    let area2 = Number(Turf.area(intersect)).toFixed(2);
    if (area !== area2) {
        throw i18n.t('error.plotInvalid');
    }
    return true;
};

function CrossProduct(A) {
    // Stores coefficient of X
    // direction of vector A[1]A[0]
    var X1 = A[1][0] - A[0][0];

    // Stores coefficient of Y
    // direction of vector A[1]A[0]
    var Y1 = A[1][1] - A[0][1];

    // Stores coefficient of X
    // direction of vector A[2]A[0]
    var X2 = A[2][0] - A[0][0];

    // Stores coefficient of Y
    // direction of vector A[2]A[0]
    var Y2 = A[2][1] - A[0][1];

    // Return cross product
    return X1 * Y2 - Y1 * X2;
}

// Function to check if the polygon is
// convex polygon or not
export function isConvex(points) {
    // Stores count of
    // edges in polygon
    var N = points.length;

    // Stores direction of cross product
    // of previous traversed edges
    var prev = 0;

    // Stores direction of cross product
    // of current traversed edges
    var curr = 0;

    // Traverse the array
    for (let i = 0; i < N; i++) {
        // Stores three adjacent edges
        // of the polygon
        var temp = [points[i], points[(i + 1) % N], points[(i + 2) % N]];

        // Update curr
        curr = CrossProduct(temp);

        // If curr is not equal to 0
        if (curr != 0) {
            // If direction of cross product of
            // all adjacent edges are not same
            if (curr * prev < 0) {
                return false;
            } else {
                // Update curr
                prev = curr;
            }
        }
    }
    return true;
}
