// js % does not behave the same as python
// js's implementation is remainder
// python's is modulo
// TODO: what is the actual difference?
function modulo(n1: number, n2: number): number {
    return ((n1 % n2) + n2) % n2;
}

interface DubinsTurnCalculationFunction {
    (alpha: number, beta: number, d: number): [number, number, number];
}

export interface Waypoint {
    x: number;
    y: number;
    psi: number;
}

export interface Param {
    p_init: Waypoint;
    seg_final: any;
    turn_radius: number;
    type: number;
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
        type: 0
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
    let orderedFns = [dubinsLSL, dubinsLSR, dubinsRSL, dubinsRSR, dubinsRLR, dubinsLRL];
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
                best_word = x + 1
                best_cost = cost
                param.seg_final = [tz[x], pz[x], qz[x]]
            }
        }
    }

    param.type = best_word;
    return param
}

// Here's all of the dubins path Math
let dubinsLSL: DubinsTurnCalculationFunction = function dubinsLSL(alpha, beta, d) {
    let tmp0 = d + Math.sin(alpha) - Math.sin(beta)
    let tmp1 = Math.atan2((Math.cos(beta) - Math.cos(alpha)), tmp0)
    let p_squared = 2 + d * d - (2 * Math.cos(alpha - beta)) + (2 * d * (Math.sin(alpha) - Math.sin(beta)))
    if (p_squared < 0) {
        console.log('No LSL Path')
        return [-1, -1, -1];
    } else {
        let result = [
            modulo((tmp1 - alpha), (2 * Math.PI)),
            Math.sqrt(p_squared),
            modulo((beta - tmp1), (2 * Math.PI))
        ];
        return [
            modulo((tmp1 - alpha), (2 * Math.PI)),
            Math.sqrt(p_squared),
            modulo((beta - tmp1), (2 * Math.PI))
        ];
    }
}

let dubinsRSR: DubinsTurnCalculationFunction = function dubinsRSR(alpha, beta, d) {
    let tmp0 = d - Math.sin(alpha) + Math.sin(beta)
    let tmp1 = Math.atan2((Math.cos(alpha) - Math.cos(beta)), tmp0)
    let p_squared = 2 + d * d - (2 * Math.cos(alpha - beta)) + 2 * d * (Math.sin(beta) - Math.sin(alpha))
    if (p_squared < 0) {
        console.log('No RSR Path')
        return [-1, -1, -1];
    } else {
        let t = modulo((alpha - tmp1), (2 * Math.PI));
        let p = Math.sqrt(p_squared);
        let q = modulo((-1 * beta + tmp1), (2 * Math.PI));
        return [t, p, q]
    }
}

let dubinsRSL: DubinsTurnCalculationFunction = function dubinsRSL(alpha, beta, d) {
    let tmp0 = d - Math.sin(alpha) - Math.sin(beta)
    let p_squared = -2 + d * d + 2 * Math.cos(alpha - beta) - 2 * d * (Math.sin(alpha) + Math.sin(beta))
    if (p_squared < 0) {
        console.log('No RSL Path')
        return [-1, -1, -1];
    } else {
        let p = Math.sqrt(p_squared)
        let tmp2 = Math.atan2((Math.cos(alpha) + Math.cos(beta)), tmp0) - Math.atan2(2, p)
        let t = modulo((alpha - tmp2), (2 * Math.PI));
        let q = modulo((beta - tmp2), (2 * Math.PI));
        return [t, p, q];
    }
}

let dubinsLSR: DubinsTurnCalculationFunction = function dubinsLSR(alpha, beta, d) {
    let tmp0 = d + Math.sin(alpha) + Math.sin(beta)
    let p_squared = -2 + d * d + 2 * Math.cos(alpha - beta) + 2 * d * (Math.sin(alpha) + Math.sin(beta))
    if (p_squared < 0) {
        console.log('No LSR Path')
        return [-1, -1, -1];
    } else {
        let p = Math.sqrt(p_squared)
        let tmp2 = Math.atan2((-1 * Math.cos(alpha) - Math.cos(beta)), tmp0) - Math.atan2(-2, p)
        let t = modulo((tmp2 - alpha), (2 * Math.PI));
        let q = modulo((tmp2 - beta), (2 * Math.PI));
        return [t, p, q]
    }
}

let dubinsRLR: DubinsTurnCalculationFunction = function dubinsRLR(alpha, beta, d) {
    let tmp_rlr = (6 - d * d + 2 * Math.cos(alpha - beta) + 2 * d * (Math.sin(alpha) - Math.sin(beta))) / 8
    if (Math.abs(tmp_rlr) > 1) {
        console.log('No RLR Path')
        return [-1, -1, -1];
    }
    else {
        let p = modulo((2 * Math.PI - Math.acos(tmp_rlr)), (2 * Math.PI));
        let t = modulo((alpha - Math.atan2((Math.cos(alpha) - Math.cos(beta)), d - Math.sin(alpha) + Math.sin(beta)) + modulo(p / 2, (2 * Math.PI))), (2 * Math.PI))
        let q = modulo((alpha - beta - t + modulo(p, (2 * Math.PI))), (2 * Math.PI));

        return [t, p, q]
    }
}

let dubinsLRL: DubinsTurnCalculationFunction = function dubinsLRL(alpha, beta, d) {
    let tmp_lrl = (6 - d * d + 2 * Math.cos(alpha - beta) + 2 * d * (-1 * Math.sin(alpha) + Math.sin(beta))) / 8
    if (Math.abs(tmp_lrl) > 1) {
        console.log('No LRL Path')
        return [-1, -1, -1];
    } else {
        let p = modulo((2 * Math.PI - Math.acos(tmp_lrl)), (2 * Math.PI));
        let t = modulo((-1 * alpha - Math.atan2((Math.cos(alpha) - Math.cos(beta)), d + Math.sin(alpha) - Math.sin(beta)) + p / 2), (2 * Math.PI));
        let q = modulo((modulo(beta, (2 * Math.PI)) - alpha - t + modulo(p, (2 * Math.PI))), (2 * Math.PI))
        return [t, p, q]
    }
}

// TODO: yet to check the trajectory and the drawing functions
// note that these should be modified so that the fish can exercise its movement along an arc
export function dubins_traj(param: Param, step: number) {
    // Build the trajectory from the lowest-cost path
    let x = 0
    let i = 0
    let length = (param.seg_final[0] + param.seg_final[1] + param.seg_final[2]) * param.turn_radius
    length = Math.floor(length / step);
    let path = Array.from({ length }, () => [-1, -1, -1]);

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
    const p_init: [number, number, number] = [0, 0, headingToStandard(param.p_init.psi) * Math.PI / 180];
    //
    const L_SEG = 1
    const S_SEG = 2
    const R_SEG = 3
    const DIRDATA = [[L_SEG, S_SEG, L_SEG], [L_SEG, S_SEG, R_SEG], [R_SEG, S_SEG, L_SEG], [R_SEG, S_SEG, R_SEG], [R_SEG, L_SEG, R_SEG], [L_SEG, R_SEG, L_SEG]];
    //
    const types = DIRDATA[param.type - 1].slice();
    const param1 = param.seg_final[0]
    const param2 = param.seg_final[1]
    const mid_pt1: [number, number, number] = dubins_segment(param1, p_init, types[0])
    const mid_pt2 = dubins_segment(param2, mid_pt1, types[1])

    let end_pt;
    if (tprime < param1) {
        end_pt = dubins_segment(tprime, p_init, types[0])
    } else if (tprime < (param1 + param2)) {
        end_pt = dubins_segment(tprime - param1, mid_pt1, types[1])
    } else {
        end_pt = dubins_segment(tprime - param1 - param2, mid_pt2, types[2])
    }

    end_pt[0] = end_pt[0] * param.turn_radius + param.p_init.x
    end_pt[1] = end_pt[1] * param.turn_radius + param.p_init.y
    end_pt[2] = modulo(end_pt[2], (2 * Math.PI));

    return end_pt
}

function dubins_segment(seg_param: number, seg_init: [number, number, number], seg_type: number): [number, number, number] {
    // Helper function for curve generation
    const L_SEG = 1
    const S_SEG = 2
    const R_SEG = 3
    const seg_end: [number, number, number] = [0.0, 0.0, 0.0];
    if (seg_type == L_SEG) {
        seg_end[0] = seg_init[0] + Math.sin(seg_init[2] + seg_param) - Math.sin(seg_init[2])
        seg_end[1] = seg_init[1] - Math.cos(seg_init[2] + seg_param) + Math.cos(seg_init[2])
        seg_end[2] = seg_init[2] + seg_param
    } else if (seg_type == R_SEG) {
        seg_end[0] = seg_init[0] - Math.sin(seg_init[2] - seg_param) + Math.sin(seg_init[2])
        seg_end[1] = seg_init[1] + Math.cos(seg_init[2] - seg_param) - Math.cos(seg_init[2])
        seg_end[2] = seg_init[2] - seg_param
    } else if (seg_type == S_SEG) {
        seg_end[0] = seg_init[0] + Math.cos(seg_init[2]) * seg_param
        seg_end[1] = seg_init[1] + Math.sin(seg_init[2]) * seg_param
        seg_end[2] = seg_init[2]
    };


    return seg_end;
}
