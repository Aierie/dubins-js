import { headingToStandard, modulo } from './util';
import type { Waypoint } from './util';
export type { Waypoint };
import { bestSegment, SEGMENT_TYPES } from './best-segment';
import type { Segments } from './best-segment';


export interface Param {
    p_init: Waypoint;
    // This is a set of condensed params used to generate the curve
    seg_final: [number, number, number];
    turn_radius: number;
    segments: Segments;
    mid_pt1: Waypoint;
    mid_pt2: Waypoint;
}

export function calcDubinsPath(wpt1: Waypoint, wpt2: Waypoint, vel: number, phi_lim: number) {
    // Calculate a dubins path between two waypoints
    let param: Param = {
        p_init: wpt1,
        seg_final: [0, 0, 0],
        turn_radius: 0,
        mid_pt1: {
            x: 0,
            y: 0,
            psi: 0,
        },
        mid_pt2: {
            x: 0,
            y: 0,
            psi: 0,
        },
        segments: [],
    };

    param.turn_radius = (vel * vel) / (9.8 * Math.tan(phi_lim * Math.PI / 180))

    let temp = bestSegment(wpt1, wpt2, param.turn_radius);

    param.seg_final = temp.seg_final as [number, number, number];
    param.segments = temp.segments;
    const mid_pt1 = dubins_segment(param.seg_final[0], { x: param.p_init.x, y: param.p_init.y, psi: headingToStandard(param.p_init.psi) * Math.PI / 180 }, param.segments[0], param.turn_radius);
    const mid_pt2 = dubins_segment(param.seg_final[1], mid_pt1, param.segments[1], param.turn_radius);

    // precalculate this and expose it in the summarized param
    // because it is useful for rendering
    // and is constant
    param.mid_pt1 = mid_pt1;
    param.mid_pt2 = mid_pt2;

    return param
}

// TODO: yet to check the trajectory and the drawing functions
// note that these should be modified so that the fish can exercise its movement along an arc
export function dubins_traj(param: Param, step: number) {
    // Build the trajectory from the lowest-cost path
    let x = 0
    let i = 0
    let length = (param.seg_final[0] + param.seg_final[1] + param.seg_final[2]) * param.turn_radius
    length = Math.floor(length / step);
    let path: Waypoint[] = Array.from({ length }, () => ({ x: -1, y: -1, psi: -1 }));

    while (x < length) {
        path[i] = dubins_path(param, x);
        x += step;
        i += 1;
    }
    return path
}


function dubins_path(param: Param, t: number) {
    // Helper function for curve generation
    let tprime = t / param.turn_radius
    // a mock point for easier calculation. the paths get their start points added on later at the end_pt definition
    const p_init: Waypoint = { x: param.p_init.x, y: param.p_init.y, psi: headingToStandard(param.p_init.psi) * Math.PI / 180 };
    //
    const types = param.segments;
    const param1 = param.seg_final[0]
    const param2 = param.seg_final[1]
    const mid_pt1 = param.mid_pt1;
    const mid_pt2 = param.mid_pt2;

    let end_pt;
    if (tprime < param1) {
        end_pt = dubins_segment(tprime, p_init, types[0], param.turn_radius)
    } else if (tprime < (param1 + param2)) {
        end_pt = dubins_segment(tprime - param1, mid_pt1, types[1], param.turn_radius)
    } else {
        end_pt = dubins_segment(tprime - param1 - param2, mid_pt2, types[2], param.turn_radius)
    }

    return end_pt
}

function dubins_segment(seg_param: number, seg_init: Waypoint, seg_type: number, turn_radius: number): Waypoint {
    const seg_end: Waypoint = {
        x: 0,
        y: 0,
        psi: 0
    };

    if (seg_type == SEGMENT_TYPES.LEFT) {
        seg_end.x = seg_init.x + (Math.sin(seg_init.psi + seg_param) - Math.sin(seg_init.psi)) * turn_radius
        seg_end.y = seg_init.y  + (-Math.cos(seg_init.psi + seg_param) + Math.cos(seg_init.psi)) * turn_radius
        seg_end.psi = seg_init.psi + seg_param
    } else if (seg_type == SEGMENT_TYPES.RIGHT) {
        seg_end.x = seg_init.x + (-Math.sin(seg_init.psi - seg_param) + Math.sin(seg_init.psi)) * turn_radius
        seg_end.y = seg_init.y + (Math.cos(seg_init.psi - seg_param) - Math.cos(seg_init.psi)) * turn_radius
        seg_end.psi = seg_init.psi - seg_param
    } else if (seg_type == SEGMENT_TYPES.STRAIGHT) {
        seg_end.x = seg_init.x + (Math.cos(seg_init.psi) * seg_param) * turn_radius
        seg_end.y = seg_init.y + (Math.sin(seg_init.psi) * seg_param) * turn_radius
        seg_end.psi = seg_init.psi
    };

    seg_end.psi = modulo(seg_end.psi, (2 * Math.PI));


    return seg_end;
}
