import { headingToStandard, modulo } from './util';
import type { Waypoint } from './util';

interface DubinsTurnCalculationFunction {
    (alpha: number, beta: number, d: number): [number, number, number];
}

let LSL: DubinsTurnCalculationFunction = function LSL(alpha, beta, d) {
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

let RSR: DubinsTurnCalculationFunction = function RSR(alpha, beta, d) {
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

let RSL: DubinsTurnCalculationFunction = function RSL(alpha, beta, d) {
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

let LSR: DubinsTurnCalculationFunction = function LSR(alpha, beta, d) {
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

let RLR: DubinsTurnCalculationFunction = function RLR(alpha, beta, d) {
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

let LRL: DubinsTurnCalculationFunction = function LRL(alpha, beta, d) {
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

export const SEGMENT_TYPES = {
    LEFT: 1,
    STRAIGHT: 2,
    RIGHT: 3,
};

export const PATH_TYPES = {
    LSL: {
        calc: LSL,
        segments: [SEGMENT_TYPES.LEFT, SEGMENT_TYPES.STRAIGHT, SEGMENT_TYPES.LEFT],
    },
    LSR: {
        calc: LSR,
        segments: [SEGMENT_TYPES.LEFT, SEGMENT_TYPES.STRAIGHT, SEGMENT_TYPES.RIGHT]
    },
    RSL: {
        calc: RSL,
        segments: [SEGMENT_TYPES.RIGHT, SEGMENT_TYPES.STRAIGHT, SEGMENT_TYPES.LEFT],
    },
    RSR: {
        calc: RSR,
        segments: [SEGMENT_TYPES.RIGHT, SEGMENT_TYPES.STRAIGHT, SEGMENT_TYPES.RIGHT]
    },
    RLR: {
        calc: RLR,
        segments: [SEGMENT_TYPES.RIGHT, SEGMENT_TYPES.LEFT, SEGMENT_TYPES.RIGHT],
    },
    LRL: {
        calc: LRL,
        segments: [SEGMENT_TYPES.LEFT, SEGMENT_TYPES.RIGHT, SEGMENT_TYPES.LEFT]
    },
};

export type Segments = typeof PATH_TYPES[keyof typeof PATH_TYPES]['segments'];

const SEGMENT_ORDER: (keyof typeof PATH_TYPES)[] = [
    'LSL',
    'LSR',
    'RSL',
    'RSR',
    'RLR',
    'LRL'
];

export function bestSegment(wpt1: Waypoint, wpt2: Waypoint, turn_radius: number) {
    wpt1 = {
        ...wpt1
    };
    wpt2 = {
        ...wpt2
    }
    let tz = [0, 0, 0, 0, 0, 0]
    let pz = [0, 0, 0, 0, 0, 0]
    let qz = [0, 0, 0, 0, 0, 0]
    // Convert the headings from NED to standard unit cirlce, and then to radians
    let psi1 = headingToStandard(wpt1.psi) * Math.PI / 180
    let psi2 = headingToStandard(wpt2.psi) * Math.PI / 180

    // we could also directly do the turn radius as an argument
    let dx = wpt2.x - wpt1.x
    let dy = wpt2.y - wpt1.y
    let D = Math.sqrt(dx * dx + dy * dy)
    let d = D / turn_radius // Normalize by turn radius...makes length calculation easier down the road.

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
            }
        }
    }

    const segments: DubinsPathSegment[] = [];
    wpt1.psi = headingToStandard(wpt1.psi) * Math.PI / 180
    let segmentStart = wpt1;
    for (let i in PATH_TYPES[SEGMENT_ORDER[best_word]].segments) {
        let type = PATH_TYPES[SEGMENT_ORDER[best_word]].segments[i]
        let newSegment = new DubinsPathSegment(type, segmentStart, turn_radius, [tz, pz, qz][i][best_word]);
        segments.push(newSegment);
        segmentStart = newSegment.pointAtLength(newSegment.tprimeMax);
    }

    const maxSteps = Math.floor((tz[best_word] + pz[best_word] + qz[best_word]) * turn_radius);

    return new DubinsPath(segments, turn_radius, maxSteps);
}

export class DubinsPath {
    constructor(
        public segments: DubinsPathSegment[],
        public turnRadius: number,
        public maxSteps: number
    ) { }

    pointAtLength(step: number) {
        if (step > this.maxSteps) {
            throw new Error('step count too large');
        }
        let tprime = step / this.turnRadius;
        if (tprime < this.segments[0].tprimeMax) {
            return this.segments[0].pointAtLength(tprime);
        } else if ((tprime - this.segments[0].tprimeMax) < this.segments[1].tprimeMax) {
            return this.segments[1].pointAtLength((tprime - this.segments[0].tprimeMax));
        } else {
            return this.segments[2].pointAtLength((tprime - this.segments[0].tprimeMax - this.segments[1].tprimeMax));
        }
    }
}

export class DubinsPathSegment {
    constructor(
        public type: typeof SEGMENT_TYPES[keyof typeof SEGMENT_TYPES],
        public startPoint: Waypoint,
        public turnRadius: number,
        public tprimeMax: number,
    ) { }

    pointAtLength(tprime: number): Waypoint {
        const point: Waypoint = {
            x: 0,
            y: 0,
            psi: 0
        };

        if (this.type == SEGMENT_TYPES.LEFT) {
            point.x = this.startPoint.x + (Math.sin(this.startPoint.psi + tprime) - Math.sin(this.startPoint.psi)) * this.turnRadius
            point.y = this.startPoint.y + (-Math.cos(this.startPoint.psi + tprime) + Math.cos(this.startPoint.psi)) * this.turnRadius
            point.psi = this.startPoint.psi + tprime
        } else if (this.type == SEGMENT_TYPES.RIGHT) {
            point.x = this.startPoint.x + (-Math.sin(this.startPoint.psi - tprime) + Math.sin(this.startPoint.psi)) * this.turnRadius
            point.y = this.startPoint.y + (Math.cos(this.startPoint.psi - tprime) - Math.cos(this.startPoint.psi)) * this.turnRadius
            point.psi = this.startPoint.psi - tprime
        } else if (this.type == SEGMENT_TYPES.STRAIGHT) {
            point.x = this.startPoint.x + (Math.cos(this.startPoint.psi) * tprime) * this.turnRadius
            point.y = this.startPoint.y + (Math.sin(this.startPoint.psi) * tprime) * this.turnRadius
            point.psi = this.startPoint.psi
        };

        point.psi = modulo(point.psi, (2 * Math.PI));

        return point;
    }
}
