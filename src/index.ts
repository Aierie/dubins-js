import { modulo } from './util';
import * as calculate from './calculate-paths';

const SEGMENT_TYPES = {
    LEFT: 1,
    STRAIGHT: 2,
    RIGHT: 3,
}
const PATH_TYPES = {
    LSL: {
        calc: calculate.LSL,
        segments: [SEGMENT_TYPES.LEFT, SEGMENT_TYPES.STRAIGHT, SEGMENT_TYPES.LEFT],
    },
    LSR: {
        calc: calculate.LSR,
        segments: [SEGMENT_TYPES.LEFT, SEGMENT_TYPES.STRAIGHT, SEGMENT_TYPES.RIGHT]
    },
    RSL: {
        calc: calculate.RSL,
        segments: [SEGMENT_TYPES.RIGHT, SEGMENT_TYPES.STRAIGHT, SEGMENT_TYPES.LEFT],
    },
    RSR: {
        calc: calculate.RSR,
        segments: [SEGMENT_TYPES.RIGHT, SEGMENT_TYPES.STRAIGHT, SEGMENT_TYPES.RIGHT]
    },
    RLR: {
        calc: calculate.RLR,
        segments: [SEGMENT_TYPES.RIGHT, SEGMENT_TYPES.LEFT, SEGMENT_TYPES.RIGHT],
    },
    LRL: {
        calc: calculate.LRL,
        segments: [SEGMENT_TYPES.LEFT, SEGMENT_TYPES.RIGHT, SEGMENT_TYPES.LEFT]
    },
};
const SEGMENT_ORDER: (keyof typeof PATH_TYPES)[] = [
    'LSL',
    'LSR',
    'RSL',
    'RSR',
    'RLR',
    'LRL'
];

export interface Waypoint {
    x: number;
    y: number;
    psi: number;
}

export interface Param {
    p_init: Waypoint;
    // This is a set of condensed params used to generate the curve
    seg_final: [number, number, number];
    turn_radius: number;
    segments: typeof PATH_TYPES[keyof typeof PATH_TYPES]['segments'];
    mid_pt1: Waypoint;
    mid_pt2: Waypoint;
}

function wrapTo360(angle: number) {
    let posIn = angle > 0
    angle = modulo(angle, 360);
    if (angle == 0 && posIn)
        angle = 360
    return angle
}

function wrapTo180(angle: number) {
    let q = (angle < -180) || (180 < angle)
    if (q)
        angle = wrapTo360(angle + 180) - 180
    return angle
}

function headingToStandard(hdg: number) {
    // Convert NED heading to standard unit cirlce...degrees only for now (Im lazy)
    return wrapTo360(90 - wrapTo180(hdg))
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

    let tz = [0, 0, 0, 0, 0, 0]
    let pz = [0, 0, 0, 0, 0, 0]
    let qz = [0, 0, 0, 0, 0, 0]
    // Convert the headings from NED to standard unit cirlce, and then to radians
    let psi1 = headingToStandard(wpt1.psi) * Math.PI / 180
    let psi2 = headingToStandard(wpt2.psi) * Math.PI / 180

    // Do Math
    // we could also directly do the turn radius as an argument
    param.turn_radius = (vel * vel) / (9.8 * Math.tan(phi_lim * Math.PI / 180))
    let dx = wpt2.x - wpt1.x
    let dy = wpt2.y - wpt1.y
    let D = Math.sqrt(dx * dx + dy * dy)
    let d = D / param.turn_radius // Normalize by turn radius...makes length calculation easier down the road.

    // Angles defined in the paper
    let theta = modulo(Math.atan2(dy, dx), (2 * Math.PI));
    let alpha = modulo((psi1 - theta), (2 * Math.PI));
    let beta = modulo((psi2 - theta), (2 * Math.PI));
    let best_word = -1
    let best_cost = -1

    // Calculate all dubin's paths between points
    let orderedFns = SEGMENT_ORDER.map(key => PATH_TYPES[key].calc);
    for (let i = 0; i < orderedFns.length; i++) {
        const [t, p, q] = orderedFns[i](alpha, beta, d);
        tz[i] = t;
        pz[i] = p;
        qz[i] = q;
    }

    let cost;
    // Now, pick the one with the lowest cost
    for (let x = 0; x < 6; x++) {
        if (tz[x] != -1) {
            cost = tz[x] + pz[x] + qz[x]
            if (cost < best_cost || best_cost == -1) {
                best_word = x
                best_cost = cost
                param.seg_final = [tz[x], pz[x], qz[x]]
            }
        }
    }

    param.segments = PATH_TYPES[SEGMENT_ORDER[best_word]].segments;
    const mid_pt1 = dubins_segment(param.seg_final[0], { x: 0, y: 0, psi: headingToStandard(param.p_init.psi) * Math.PI / 180 }, param.segments[0])//  * param.turn_radius + param.p_init.x
    const mid_pt2 = dubins_segment(param.seg_final[1], mid_pt1, param.segments[1])// * param.turn_radius + param.p_init.y;

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
    const p_init: Waypoint = { x: 0, y: 0, psi: headingToStandard(param.p_init.psi) * Math.PI / 180 };
    //
    const types = param.segments;
    const param1 = param.seg_final[0]
    const param2 = param.seg_final[1]
    const mid_pt1 = param.mid_pt1;
    const mid_pt2 = param.mid_pt2;

    let end_pt;
    if (tprime < param1) {
        end_pt = dubins_segment(tprime, p_init, types[0])
    } else if (tprime < (param1 + param2)) {
        end_pt = dubins_segment(tprime - param1, mid_pt1, types[1])
    } else {
        end_pt = dubins_segment(tprime - param1 - param2, mid_pt2, types[2])
    }

    end_pt.x = end_pt.x * param.turn_radius + param.p_init.x
    end_pt.y = end_pt.y * param.turn_radius + param.p_init.y
    end_pt.psi = modulo(end_pt.psi, (2 * Math.PI));

    return end_pt
}

function dubins_segment(seg_param: number, seg_init: Waypoint, seg_type: number): Waypoint {
    // Helper function for curve generation
    const seg_end: Waypoint = {
        x: 0,
        y: 0,
        psi: 0
    };
    if (seg_type == SEGMENT_TYPES.LEFT) {
        seg_end.x = seg_init.x + Math.sin(seg_init.psi + seg_param) - Math.sin(seg_init.psi)
        seg_end.y = seg_init.y - Math.cos(seg_init.psi + seg_param) + Math.cos(seg_init.psi)
        seg_end.psi = seg_init.psi + seg_param
    } else if (seg_type == SEGMENT_TYPES.RIGHT) {
        seg_end.x = seg_init.x - Math.sin(seg_init.psi - seg_param) + Math.sin(seg_init.psi)
        seg_end.y = seg_init.y + Math.cos(seg_init.psi - seg_param) - Math.cos(seg_init.psi)
        seg_end.psi = seg_init.psi - seg_param
    } else if (seg_type == SEGMENT_TYPES.STRAIGHT) {
        seg_end.x = seg_init.x + Math.cos(seg_init.psi) * seg_param
        seg_end.y = seg_init.y + Math.sin(seg_init.psi) * seg_param
        seg_end.psi = seg_init.psi
    };


    return seg_end;
}
