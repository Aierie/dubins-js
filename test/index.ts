import { assert } from 'chai';
import { SEGMENT_TYPES, calcDubinsPath, Waypoint } from '../src/index';

// currently just copying the python demo 
// accepting floating point differences for now
let wpt1: Waypoint = { x: 0, y: 0, psi: 0 };
let wpt2: Waypoint = { x: 6000, y: 7000, psi: 260 };
let wpt3: Waypoint = { x: 1000, y: 15000, psi: 180 };
let wpt4: Waypoint = { x: 0, y: 0, psi: 270 };
let vel = 90;
let phi_lim = 20;

let p1p2 = calcDubinsPath(
    wpt1,
    wpt2,
    vel,
    phi_lim
);
assert.deepEqual(
    p1p2.toJSON(),
    {
        maxSteps: 15226,
        turnRadius: 2270.8741936308616,
        segments: [
            {
                type: SEGMENT_TYPES.RIGHT,
                turnRadius: 2270.8741936308616,
                startPoint:  { x: 0, y: 0, psi: 1.5707963267948966 },
                tprimeMax: 1.518540974848893, 
            },
            {
                type: SEGMENT_TYPES.STRAIGHT,
                turnRadius: 2270.8741936308616,
                startPoint:  {
                    x: 2152.2628610677675,
                    y: 2267.7744497824783,
                    psi: 0.052255351946003614
                },
                tprimeMax: 1.9228903638756734, 
            },
            {
                type: SEGMENT_TYPES.LEFT,
                turnRadius: 2270.8741936308616,
                startPoint: {
                    x: 6512.944497997953,
                    y: 2495.8510382145046,
                    psi: 0.052255351946003614
                },
                tprimeMax: 3.2638702268432223
            },
        ]
    }
);
assert.deepEqual(
    p1p2.pointAtLength(2000),
    {
        x: 825.2413270673604,
        y: 1751.289587249924,
        psi: 0.6900782290643326
    }
)
assert.deepEqual(
    p1p2.pointAtLength(4000),
    {
        x: 2703.094436346471,
        y: 2296.584575572502,
        psi: 0.052255351946003614
    }
)
assert.deepEqual(
    p1p2.pointAtLength(6000),
    {
        x: 4700.364435840871,
        y: 2401.0477227567576,
        psi: 0.052255351946003614
    }
)
assert.deepEqual(
    p1p2.pointAtLength(9000),
    {
        x: 7627.5129832231305,
        y: 2856.75969819994,
        psi: 0.5740554530089739
    }
)

let p2p3 = calcDubinsPath(
    wpt2,
    wpt3,
    vel,
    phi_lim
);
assert.deepEqual(
    p2p3.toJSON(),
    {
        maxSteps: 17316,
        turnRadius: 2270.8741936308616,
        segments: [
            {
                type: SEGMENT_TYPES.RIGHT,
                turnRadius: 2270.8741936308616,
                startPoint: { y: 7000, x: 6000, psi: 3.3161255787892263 },
                tprimeMax: 2.1792794314612287,
            },
            {
                type: SEGMENT_TYPES.STRAIGHT,
                turnRadius: 2270.8741936308616,
                startPoint: {
                    x: 3545.2755468033374,
                    y: 10191.182002869044,
                    psi: 1.1368461473279972
                },
                tprimeMax: 1.8705235889691287,
            },
            {
                type: SEGMENT_TYPES.LEFT,
                turnRadius: 2270.8741936308616,
                startPoint: {
                    x: 5331.265481392665,
                    y: 14045.192509133976,
                    psi: 1.1368461473279972
                },
                tprimeMax: 3.5755428330566925
            },
        ]
    }
);
assert.deepEqual(
    p2p3.pointAtLength(2000),
    { x: 4132.014784126039, y: 7508.595811609, psi: 2.435407481058663 }
)
assert.deepEqual(
    p2p3.pointAtLength(4000),
    {
        x: 3335.0872051310885,
        y: 9272.949772736742,
        psi: 1.5546893833280988
    }
)
assert.deepEqual(
    p2p3.pointAtLength(6000),
    {
        x: 3987.231932117159,
        y: 11144.885335302437,
        psi: 1.1368461473279972
    }
)
assert.deepEqual(
    p2p3.pointAtLength(9000),
    {
        x: 5248.606287698787,
        y: 13866.821178609738,
        psi: 1.1368461473279972
    }
)

let p3p4 = calcDubinsPath(
    wpt3,
    wpt4,
    vel,
    phi_lim
);
assert.deepEqual(
    p3p4.toJSON(),
    {
        maxSteps: 16360,
        turnRadius: 2270.8741936308616,
        segments: [
            {
                type: SEGMENT_TYPES.LEFT,
                turnRadius: 2270.8741936308616,
                startPoint: { x: 1000, y: 15000, psi: 4.71238898038469 },
                tprimeMax: 0.10133129490561821,
            },
            {
                type: SEGMENT_TYPES.STRAIGHT,
                turnRadius: 2270.8741936308616,
                startPoint: {
                    x: 1011.6487310995047,
                    y: 14770.282972445244,
                    psi: 4.813720275290308
                },
                tprimeMax: 5.430928410974976,
            },
            {
                type: SEGMENT_TYPES.RIGHT,
                turnRadius: 2270.8741936308616,
                startPoint: {
                    x: 2259.2254625313503,
                    y: 2500.5912211856175,
                    psi: 4.813720275290308
                },
                tprimeMax: 1.6721276217005148,
            },
        ]
    }
);
assert.deepEqual(
    p3p4.pointAtLength(2000),
    {
        x: 1190.687150759856,
        y: 13009.47246234222,
        psi: 4.813720275290308
    }
)
assert.deepEqual(
    p3p4.pointAtLength(4000),
    { x: 1393.0030942842, y: 11019.731710637152, psi: 4.813720275290308 }
)
assert.deepEqual(
    p3p4.pointAtLength(6000),
    {
        x: 1595.3190378085442,
        y: 9029.990958932081,
        psi: 4.813720275290308
    }
)
assert.deepEqual(
    p3p4.pointAtLength(9000),
    { x: 1898.79295309506, y: 6045.379831374479, psi: 4.813720275290308 }
)

// adding on some modifications in velocity and phi_lim
let vel2 = 30;
let phi_lim2 = 15;
let p1p2SmallTurn = calcDubinsPath(
    wpt1,
    wpt2,
    vel2,
    phi_lim2
);
assert.deepEqual(
    p1p2SmallTurn.toJSON(),
    {
        maxSteps: 9890,
        turnRadius: 342.73935987877445,
        segments: [
            {
                type: SEGMENT_TYPES.RIGHT,
                turnRadius: 342.73935987877445,
                startPoint: { x: 0, y: 0, psi: 1.5707963267948966 },
                tprimeMax: 0.7873146081329452,
            },
            {
                type: SEGMENT_TYPES.STRAIGHT,
                turnRadius: 342.73935987877445,
                startPoint: {
                    x: 100.85093585224547,
                    y: 242.8173369676765,
                    psi: 0.7834817186619514
                },
                tprimeMax: 25.535876601172724,
            },
            {
                type: SEGMENT_TYPES.LEFT,
                turnRadius: 342.73935987877445,
                startPoint: {
                    x: 6301.404489284209,
                    y: 6419.6502841612655,
                    psi: 0.7834817186619514
                },
                tprimeMax: 2.5326438601272745,
            },
        ]
    }
);
assert.deepEqual(
    p1p2SmallTurn.pointAtLength(2000),
    {
        x: 1326.5985251671968,
        y: 1463.8757520559677,
        psi: 0.7834817186619514
    }
)
assert.deepEqual(
    p1p2SmallTurn.pointAtLength(4000),
    {
        x: 2743.51975098474,
        y: 2875.3764569186014,
        psi: 0.7834817186619514
    }
)
assert.deepEqual(
    p1p2SmallTurn.pointAtLength(6000),
    {
        x: 4160.440976802282,
        y: 4286.8771617812345,
        psi: 0.7834817186619514
    }
)
assert.deepEqual(
    p1p2SmallTurn.pointAtLength(9000),
    {
        x: 6285.822815528597,
        y: 6404.128219075186,
        psi: 0.7834817186619514
    }
)

console.log('✅ tests passed!');
