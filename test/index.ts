import { assert } from 'chai';
import { SEGMENT_TYPES, Dubins, Waypoint } from '../src/index';

let wpt1: Waypoint = { x: 0, y: 0, psi: 1.5707963267948966 };
let wpt2: Waypoint = { x: 6000, y: 7000, psi: 3.3161255787892263 };
let wpt3: Waypoint = { x: 1000, y: 15000, psi: 4.71238898038469 };
let wpt4: Waypoint = { x: 0, y: 0, psi: 3.141592653589793 };
let turnRadius = 2270.8741936308616;
let turnRadius2 = 342.73935987877445;
let p1p2 = Dubins.path(
    wpt1,
    wpt2,
    turnRadius
);
let p2p3 = Dubins.path(
    wpt2,
    wpt3,
    turnRadius
);
let p3p4 = Dubins.path(
    wpt3,
    wpt4,
    turnRadius
);
let p1p2SmallTurn = Dubins.path(
    wpt1,
    wpt2,
    turnRadius2
);

describe('the whole thing', function () {
    it('runs the whole thing', function () {
        assert.deepEqual(
            p1p2.toObject(),
            {
                length: 15226,
                turnRadius: 2270.8741936308616,
                tprimeMax: 6.705301565567789,
                segments: [
                    {
                        type: SEGMENT_TYPES.RIGHT,
                        turnRadius: 2270.8741936308616,
                        startPoint: { x: 0, y: 0, psi: 1.5707963267948966 },
                        tprimeMax: 1.518540974848893,
                        length: 3448,
                        center: { x: 2270.8741936308616, y: -2.7810188124963616e-13 },
                        arcAngles: { start: 3.141592653589793, end: 1.6230516787409002 },
                    },
                    {
                        type: SEGMENT_TYPES.STRAIGHT,
                        turnRadius: 2270.8741936308616,
                        startPoint: {
                            x: 2152.2628610677675,
                            y: 2267.7744497824783,
                            psi: 0.052255351946003614
                        },
                        tprimeMax: 1.9228903638756734,
                        length: 4366,
                        center: { x: 4332.60367953286, y: 2381.8127439984914 },
                        arcAngles: undefined
                    },
                    {
                        type: SEGMENT_TYPES.LEFT,
                        turnRadius: 2270.8741936308616,
                        startPoint: {
                            x: 6512.944497997953,
                            y: 2495.8510382145046,
                            psi: 0.052255351946003614
                        },
                        tprimeMax: 3.2638702268432223,
                        length: 7411,
                        center: { x: 6394.3331654348585, y: 4763.625487996983 },
                        arcAngles: { start: -1.518540974848893, end: 1.7453292519943293 }
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
        // note that floating point is messing things up for pointAt
        assert.deepEqual(
            p1p2.pointAt(0.1),
            {
                x: 491.6616670126776,
                y: 1411.124512019954,
                psi: 0.9002661702381172
            }
        )
        assert.deepEqual(
            p1p2.pointAt(0.5),
            {
                x: 6311.610221598213,
                y: 2485.320658168689,
                psi: 0.052255351946003614
            }
        )
        assert.deepEqual(
            p1p2.pointAt(0.9),
            {
                x: 7475.062512408255,
                y: 6760.8469784404115,
                psi: 2.6455954222324465
            }
        )
        assert.deepEqual(
            p2p3.toObject(),
            {
                length: 17316,
                turnRadius: 2270.8741936308616,
                tprimeMax: 7.62534585348705,
                segments: [
                    {
                        type: SEGMENT_TYPES.RIGHT,
                        turnRadius: 2270.8741936308616,
                        startPoint: { y: 7000, x: 6000, psi: 3.3161255787892263 },
                        tprimeMax: 2.1792794314612287,
                        length: 4948,
                        center: { x: 5605.6668345651415, y: 9236.374512003018 },
                        arcAngles: { start: 4.886921905584122, end: 2.7076424741228937 },
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
                        length: 4247,
                        center: { x: 4438.2705140980015, y: 12118.18725600151 },
                        arcAngles: undefined,
                    },
                    {
                        type: SEGMENT_TYPES.LEFT,
                        turnRadius: 2270.8741936308616,
                        startPoint: {
                            x: 5331.265481392665,
                            y: 14045.192509133976,
                            psi: 1.1368461473279972
                        },
                        tprimeMax: 3.5755428330566925,
                        length: 8119,
                        center: { x: 3270.874193630862, y: 15000.000000000002 },
                        arcAngles: { start: -0.4339501794668994, end: 3.141592653589793 }
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

        assert.deepEqual(
            p3p4.toObject(),
            {
                length: 16360,
                turnRadius: 2270.8741936308616,
                tprimeMax: 7.204387327581109,
                segments: [
                    {
                        type: SEGMENT_TYPES.LEFT,
                        turnRadius: 2270.8741936308616,
                        startPoint: { x: 1000, y: 15000, psi: 4.71238898038469 },
                        tprimeMax: 0.10133129490561821,
                        length: 230,
                        center: { x: 3270.8741936308616, y: 15000 },
                        arcAngles: { start: 3.141592653589793, end: 3.2429239484954113 },
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
                        length: 12332,
                        center: { x: 1635.4370968154276, y: 8635.43709681543 },
                        arcAngles:
                            undefined,
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
                        length: 3797,
                        center: { x: -6.366462912410498e-12, y: 2270.8741936308616 },
                        arcAngles:
                            { start: 6.384516602085204, end: 4.71238898038469 }
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

        // note that floating point is messing things up for pointAt
        assert.deepEqual(
            p3p4.pointAt(0.1),
            {
                x: 1153.86825146002,
                y: 13371.579684806344,
                psi: 4.813720275290308
            }
        )
        assert.deepEqual(
            p3p4.pointAt(0.5),
            {
                x: 1815.8564283580538,
                y: 6861.045567842552,
                psi: 4.813720275290308
            }
        )
        assert.deepEqual(
            p3p4.pointAt(0.9),
            {
                x: 1498.128520353223,
                y: 564.2750784890368,
                psi: 3.8620313863479048
            }
        )

        assert.deepEqual(
            p1p2SmallTurn.toObject(),
            {
                length: 9890,
                turnRadius: 342.73935987877445,
                tprimeMax: 28.855835069432942,
                segments: [
                    {
                        type: SEGMENT_TYPES.RIGHT,
                        turnRadius: 342.73935987877445,
                        startPoint: { x: 0, y: 0, psi: 1.5707963267948966 },
                        tprimeMax: 0.7873146081329452,
                        length: 269,
                        center: { x: 342.73935987877445, y: -4.197346600173539e-14 },
                        arcAngles: { start: 3.141592653589793, end: 2.354278045456848 },
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
                        length: 8752,
                        center: { x: 3201.1277125682273, y: 3331.2338105644712 },
                        arcAngles: undefined,
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
                        length: 868,
                        center: { x: 6059.516065257681, y: 6662.4676211289425 },
                        arcAngles: { start: -0.7873146081329452, end: 1.7453292519943293 }
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

        // note that floating point is messing things up for pointAt
        assert.deepEqual(
            p1p2SmallTurn.pointAt(0.1),
            {
                x: 610.3470021034736,
                y: 750.3642940847923,
                psi: 0.7834817186619514
            },
        )
        assert.deepEqual(
            p1p2SmallTurn.pointAt(0.5),
            {
                x: 3413.0258131187525,
                y: 3542.3212816506248,
                psi: 0.7834817186619514
            }
        )
        assert.deepEqual(
            p1p2SmallTurn.pointAt(0.9),
            {
                x: 6215.70462413403,
                y: 6334.2782692164565,
                psi: 0.7834817186619514
            }
        )

        console.log('✅ tests passed!');
    })
})
