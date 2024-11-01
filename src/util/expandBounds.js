/**
 * @description Expands a given bounds object by a given factor.
 * @param {import("../types/Bounds").Bounds} bounds - The bounds to expand.
 * @param {number} factor - The factor to expand the bounds by.
 * @returns {Bounds} The expanded bounds.
 * @example
 * Original bounds:
 *              _ne
 *               x-----------------+
 *               |                 |
 *               |                 |
 *               |                 |
 *               |                 |
 *               |                 |
 *               |                 |
 *               |                 |
 *               |                 |
 *               +-----------------x
 *                                 _sw
 *
 * Expanded bounds:
 *          _ne (+ factor * height, + factor * width)
 *          [ ] -----------------------+
 *           |                         |
 *           |                         |
 *           |                         |
 *           |                         |
 *           |                         |
 *           |                         |
 *           |                         |
 *           |                         |
 *           +----------------------- [ ]
 *                                    _sw (- factor * height, - factor * width)
 */
export default function expandBounds(bounds, factor = 0.5) {
    const expandedBounds = JSON.parse(JSON.stringify(bounds));

    const MIN = -180; // Minimum value for longitude and latitude
    const MAX = 180; // Maximum value for longitude and latitude

    const height = expandedBounds._ne.lat - expandedBounds._sw.lat;
    const width = expandedBounds._ne.lng - expandedBounds._sw.lng;

    expandedBounds._ne.lat = Math.max(MIN, Math.min(MAX, expandedBounds._ne.lat + height * factor));
    expandedBounds._ne.lng = Math.max(MIN, Math.min(MAX, expandedBounds._ne.lng + width * factor));
    expandedBounds._sw.lat = Math.max(MIN, Math.min(MAX, expandedBounds._sw.lat - height * factor));
    expandedBounds._sw.lng = Math.max(MIN, Math.min(MAX, expandedBounds._sw.lng - width * factor));

    return expandedBounds;
}
