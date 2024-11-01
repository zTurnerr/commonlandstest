import * as turf from '@turf/turf';

/**
 * @description Compare two polygons and return percentage of overlap
 * @param {turf.Polygon} polygon1
 * @param {turf.Polygon} polygon2
 * @returns {number} percentage of overlap
 */
export default function comparePolygon(polygon1, polygon2) {
    if (!polygon1 || !polygon2) return 0;
    const intersect = turf.intersect(polygon1, polygon2);
    const union = turf.union(polygon1, polygon2);

    if (!intersect || !union) return 0;

    return (turf.area(intersect) / turf.area(union)) * 100;
}

/**
 * @description Convert bounds to a polygon:
 * @example
 *
 *           North East --------> North West
 *               ^                    |
 *               |                    |
 *               |                    |
 *               |                    v
 *           South East <-------- South West
 *
 * @param {import('../types/Bounds').Bounds} bounds
 */
export function boundsToPolygon(bounds) {
    return turf.polygon([
        [
            [bounds._ne.lng, bounds._ne.lat],
            [bounds._ne.lng, bounds._sw.lat],
            [bounds._sw.lng, bounds._sw.lat],
            [bounds._sw.lng, bounds._ne.lat],
            [bounds._ne.lng, bounds._ne.lat],
        ],
    ]);
}
