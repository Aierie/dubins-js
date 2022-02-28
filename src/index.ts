import type { Waypoint } from './util';
export type { Waypoint };
import { modulo } from './util';

interface DubinsTurnCalculationFunction {
    (alpha: number, beta: number, d: number): [number, number, number];
}

export const SEGMENT_TYPES = {
    LEFT: 1,
    STRAIGHT: 2,
    RIGHT: 3,
} as const;

const PATH_TYPES: Record<string, {
    calc: DubinsTurnCalculationFunction,
    segments: typeof SEGMENT_TYPES[keyof typeof SEGMENT_TYPES][]
}> = {
    LSL: {
        calc: function LSL(alpha, beta, d) {
            let tmp0 = d + Math.sin(alpha) - Math.sin(beta)
            let tmp1 = Math.atan2((Math.cos(beta) - Math.cos(alpha)), tmp0)
            let pSquared = 2 + d * d - (2 * Math.cos(alpha - beta)) + (2 * d * (Math.sin(alpha) - Math.sin(beta)))
            if (pSquared < 0) {
                console.log('No LSL Path')
                return [-1, -1, -1];
            } else {
                return [
                    modulo((tmp1 - alpha), (2 * Math.PI)),
                    Math.sqrt(pSquared),
                    modulo((beta - tmp1), (2 * Math.PI))
                ];
            }
        },
        segments: [SEGMENT_TYPES.LEFT, SEGMENT_TYPES.STRAIGHT, SEGMENT_TYPES.LEFT],
    },
    LSR: {
        calc: function LSR(alpha, beta, d) {
            let tmp0 = d + Math.sin(alpha) + Math.sin(beta)
            let pSquared = -2 + d * d + 2 * Math.cos(alpha - beta) + 2 * d * (Math.sin(alpha) + Math.sin(beta))
            if (pSquared < 0) {
                console.log('No LSR Path')
                return [-1, -1, -1];
            } else {
                let p = Math.sqrt(pSquared)
                let tmp2 = Math.atan2((-1 * Math.cos(alpha) - Math.cos(beta)), tmp0) - Math.atan2(-2, p)
                let t = modulo((tmp2 - alpha), (2 * Math.PI));
                let q = modulo((tmp2 - beta), (2 * Math.PI));
                return [t, p, q]
            }
        },
        segments: [SEGMENT_TYPES.LEFT, SEGMENT_TYPES.STRAIGHT, SEGMENT_TYPES.RIGHT]
    },
    RSL: {
        calc: function RSL(alpha, beta, d) {
            let tmp0 = d - Math.sin(alpha) - Math.sin(beta)
            let pSquared = -2 + d * d + 2 * Math.cos(alpha - beta) - 2 * d * (Math.sin(alpha) + Math.sin(beta))
            if (pSquared < 0) {
                console.log('No RSL Path')
                return [-1, -1, -1];
            } else {
                let p = Math.sqrt(pSquared)
                let tmp2 = Math.atan2((Math.cos(alpha) + Math.cos(beta)), tmp0) - Math.atan2(2, p)
                let t = modulo((alpha - tmp2), (2 * Math.PI));
                let q = modulo((beta - tmp2), (2 * Math.PI));
                return [t, p, q];
            }
        },
        segments: [SEGMENT_TYPES.RIGHT, SEGMENT_TYPES.STRAIGHT, SEGMENT_TYPES.LEFT],
    },
    RSR: {
        calc: function RSR(alpha, beta, d) {
            let tmp0 = d - Math.sin(alpha) + Math.sin(beta)
            let tmp1 = Math.atan2((Math.cos(alpha) - Math.cos(beta)), tmp0)
            let pSquared = 2 + d * d - (2 * Math.cos(alpha - beta)) + 2 * d * (Math.sin(beta) - Math.sin(alpha))
            if (pSquared < 0) {
                console.log('No RSR Path')
                return [-1, -1, -1];
            } else {
                let t = modulo((alpha - tmp1), (2 * Math.PI));
                let p = Math.sqrt(pSquared);
                let q = modulo((-1 * beta + tmp1), (2 * Math.PI));
                return [t, p, q]
            }
        },
        segments: [SEGMENT_TYPES.RIGHT, SEGMENT_TYPES.STRAIGHT, SEGMENT_TYPES.RIGHT]
    },
    RLR: {
        calc: function RLR(alpha, beta, d) {
            let tmpRlr = (6 - d * d + 2 * Math.cos(alpha - beta) + 2 * d * (Math.sin(alpha) - Math.sin(beta))) / 8
            if (Math.abs(tmpRlr) > 1) {
                console.log('No RLR Path')
                return [-1, -1, -1];
            }
            else {
                let p = modulo((2 * Math.PI - Math.acos(tmpRlr)), (2 * Math.PI));
                let t = modulo((alpha - Math.atan2((Math.cos(alpha) - Math.cos(beta)), d - Math.sin(alpha) + Math.sin(beta)) + modulo(p / 2, (2 * Math.PI))), (2 * Math.PI))
                let q = modulo((alpha - beta - t + modulo(p, (2 * Math.PI))), (2 * Math.PI));

                return [t, p, q]
            }
        },
        segments: [SEGMENT_TYPES.RIGHT, SEGMENT_TYPES.LEFT, SEGMENT_TYPES.RIGHT],
    },
    LRL: {
        calc: function LRL(alpha, beta, d) {
            let tmpLrl = (6 - d * d + 2 * Math.cos(alpha - beta) + 2 * d * (-1 * Math.sin(alpha) + Math.sin(beta))) / 8
            if (Math.abs(tmpLrl) > 1) {
                console.log('No LRL Path')
                return [-1, -1, -1];
            } else {
                let p = modulo((2 * Math.PI - Math.acos(tmpLrl)), (2 * Math.PI));
                let t = modulo((-1 * alpha - Math.atan2((Math.cos(alpha) - Math.cos(beta)), d + Math.sin(alpha) - Math.sin(beta)) + p / 2), (2 * Math.PI));
                let q = modulo((modulo(beta, (2 * Math.PI)) - alpha - t + modulo(p, (2 * Math.PI))), (2 * Math.PI))
                return [t, p, q]
            }
        },
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

// https://github.com/manferlo81/map-number/blob/master/src/map.ts
function map(num: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    return (num - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

export class Dubins {
    constructor(
        public segments: Segment[],
        public turnRadius: number,
    ) { }

    // TODO: test curves method and make it public
    private curves(wpt1: Waypoint, wpt2: Waypoint, turnRadius: number): Dubins[] {
        throw new Error('Untested! Please test this before allowing use in the API.');
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
        let psi1 = wpt1.psi
        let psi2 = wpt2.psi

        // we could also directly do the turn radius as an argument
        let dx = wpt2.x - wpt1.x
        let dy = wpt2.y - wpt1.y
        let D = Math.sqrt(dx * dx + dy * dy)
        let d = D / turnRadius // Normalize by turn radius...makes length calculation easier down the road.

        // Angles defined in the paper
        let theta = modulo(Math.atan2(dy, dx), (2 * Math.PI));
        let alpha = modulo((psi1 - theta), (2 * Math.PI));
        let beta = modulo((psi2 - theta), (2 * Math.PI));
        let bestWord = -1
        let bestCost = -1

        // Calculate all dubin's paths between points
        let orderedFns = SEGMENT_ORDER.map(key => PATH_TYPES[key].calc);
        for (let i = 0; i < orderedFns.length; i++) {
            const [t, p, q] = orderedFns[i](alpha, beta, d);
            tz[i] = t;
            pz[i] = p;
            qz[i] = q;
        }

        let curves: Dubins[] = [];
        // Now, pick the one with the lowest cost
        for (let x = 0; x < 6; x++) {
            if (tz[x] === -1) {
                continue;
            }

            const segments: Segment[] = [];
            let segmentStart = wpt1;
            for (let i in PATH_TYPES[SEGMENT_ORDER[bestWord]].segments) {
                let type = PATH_TYPES[SEGMENT_ORDER[bestWord]].segments[i]
                let newSegment = new Segment(type, segmentStart, turnRadius, [tz, pz, qz][i][bestWord]);
                segments.push(newSegment);
                segmentStart = newSegment.absolutePointAt(newSegment.tprimeMax);
            }
            curves.push(new Dubins(segments, turnRadius));
        }

        return curves;
    }

    static path(wpt1: Waypoint, wpt2: Waypoint, turnRadius: number): Dubins {
        let tz = [0, 0, 0, 0, 0, 0]
        let pz = [0, 0, 0, 0, 0, 0]
        let qz = [0, 0, 0, 0, 0, 0]
        // Convert the headings from NED to standard unit cirlce, and then to radians
        let psi1 = wpt1.psi
        let psi2 = wpt2.psi

        // we could also directly do the turn radius as an argument
        let dx = wpt2.x - wpt1.x
        let dy = wpt2.y - wpt1.y
        let D = Math.sqrt(dx * dx + dy * dy)
        let d = D / turnRadius // Normalize by turn radius...makes length calculation easier down the road.

        // Angles defined in the paper
        let theta = modulo(Math.atan2(dy, dx), (2 * Math.PI));
        let alpha = modulo((psi1 - theta), (2 * Math.PI));
        let beta = modulo((psi2 - theta), (2 * Math.PI));
        let bestWord = -1
        let bestCost = -1

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
                if (cost < bestCost || bestCost == -1) {
                    bestWord = x
                    bestCost = cost
                }
            }
        }

        const segments: Segment[] = [];
        let segmentStart = wpt1;
        for (let i in PATH_TYPES[SEGMENT_ORDER[bestWord]].segments) {
            let type = PATH_TYPES[SEGMENT_ORDER[bestWord]].segments[i]
            let newSegment = new Segment(type, segmentStart, turnRadius, [tz, pz, qz][i][bestWord]);
            segments.push(newSegment);
            segmentStart = newSegment.absolutePointAt(newSegment.tprimeMax);
        }

        return new Dubins(segments, turnRadius);
    }


    get tprimeMax() {
        return this.segments[0].tprimeMax + this.segments[1].tprimeMax + this.segments[2].tprimeMax
    }

    get length() {
        return Math.floor(this.tprimeMax * this.turnRadius);
    }

    // TODO: good floating point solution would probably be good here
    // 0 <= pos <= 1
    pointAt(pos: number) {
        let tprime = map(pos, 0, 1, 0, this.tprimeMax);
        if (tprime < this.segments[0].tprimeMax) {
            return this.segments[0].absolutePointAt(tprime);
        } else if ((tprime - this.segments[0].tprimeMax) < this.segments[1].tprimeMax) {
            return this.segments[1].absolutePointAt((tprime - this.segments[0].tprimeMax));
        } else {
            return this.segments[2].absolutePointAt((tprime - this.segments[0].tprimeMax - this.segments[1].tprimeMax));
        }
    }

    pointAtLength(length: number) {
        // TODO: is this correct?
        if (length > this.length) {
            throw new Error('length exceeds unit length');
        }
        let tprime = length / this.turnRadius;
        if (tprime < this.segments[0].tprimeMax) {
            return this.segments[0].absolutePointAt(tprime);
        } else if ((tprime - this.segments[0].tprimeMax) < this.segments[1].tprimeMax) {
            return this.segments[1].absolutePointAt((tprime - this.segments[0].tprimeMax));
        } else {
            return this.segments[2].absolutePointAt((tprime - this.segments[0].tprimeMax - this.segments[1].tprimeMax));
        }
    }

    toJSON() {
        return {
            segments: this.segments.map(segment => segment.toJSON()),
            turnRadius: this.turnRadius,
            length: this.length,
        }
    }
}

export class Segment {
    constructor(
        public type: typeof SEGMENT_TYPES[keyof typeof SEGMENT_TYPES],
        public startPoint: Waypoint,
        public turnRadius: number,
        public tprimeMax: number,
    ) { }

    absolutePointAt(tprime: number): Waypoint {
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

    toJSON() {
        return {
            type: this.type,
            startPoint: this.startPoint,
            turnRadius: this.turnRadius,
            tprimeMax: this.tprimeMax,
        }
    }
}
