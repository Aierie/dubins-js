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
