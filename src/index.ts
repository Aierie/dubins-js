import type { Waypoint } from './util';
export type { Waypoint };
import { bestSegment, DubinsPath } from './best-segment';

export function calcDubinsPath(wpt1: Waypoint, wpt2: Waypoint, vel: number, phi_lim: number): DubinsPath {
    // Calculate a dubins path between two waypoints

    let turnRadius = (vel * vel) / (9.8 * Math.tan(phi_lim * Math.PI / 180))

    return bestSegment(wpt1, wpt2, turnRadius);
}
