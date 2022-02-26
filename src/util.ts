export interface Waypoint {
    x: number;
    y: number;
    psi: number;
}

// js % does not behave the same as python
// js's implementation is remainder
// python's is modulo
// TODO: what is the actual difference?
export function modulo(n1: number, n2: number): number {
    return ((n1 % n2) + n2) % n2;
}

export function wrapTo360(angle: number) {
    let posIn = angle > 0
    angle = modulo(angle, 360);
    if (angle == 0 && posIn)
        angle = 360
    return angle
}

export function wrapTo180(angle: number) {
    let q = (angle < -180) || (180 < angle)
    if (q)
        angle = wrapTo360(angle + 180) - 180
    return angle
}

export function headingToStandard(hdg: number) {
    // Convert NED heading to standard unit cirlce...degrees only for now (Im lazy)
    return wrapTo360(90 - wrapTo180(hdg))
}