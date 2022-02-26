import { modulo } from './util';

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

export {
    LSL, 
    RSR, 
    RSL, 
    LSR, 
    RLR, 
    LRL
}