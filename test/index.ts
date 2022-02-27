import { assert } from 'chai';
import { calcDubinsPath, dubins_traj, Waypoint } from '../src/index';

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
    p1p2,
    {
        p_init: { x: 0, y: 0, psi: 0 },
        seg_final: [1.518540974848893, 1.9228903638756734, 3.2638702268432223],
        turn_radius: 2270.8741936308616,
        mid_pt1: {
            x: 2152.2628610677675,
            y: 2267.7744497824783,
            psi: 0.052255351946003614
        },
        mid_pt2: {
            x: 6512.944497997953,
            y: 2495.8510382145046,
            psi: 0.052255351946003614
        },
        segments: [3, 2, 1],
    }
);
let pathP1P2 = dubins_traj(p1p2, 1);
assert.deepEqual(
    pathP1P2[2000],
    {
        x: 825.2413270673604,
        y: 1751.289587249924,
        psi: 0.6900782290643326
    }
)
assert.deepEqual(
    pathP1P2[4000],
    {
        x: 2703.094436346471,
        y: 2296.584575572502,
        psi: 0.052255351946003614
    }
)
assert.deepEqual(
    pathP1P2[6000],
    {
        x: 4700.364435840871,
        y: 2401.0477227567576,
        psi: 0.052255351946003614
    }
)
assert.deepEqual(
    pathP1P2[9000],
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
    p2p3,
    {
        turn_radius: 2270.8741936308616,
        seg_final: [2.1792794314612287, 1.8705235889691287, 3.5755428330566925],
        p_init: { y: 7000, x: 6000, psi: 260 },
        mid_pt1: {
            x: 3545.2755468033374,
            y: 10191.182002869044,
            psi: 1.1368461473279972
        },
        mid_pt2: {
            x: 5331.265481392665,
            y: 14045.192509133976,
            psi: 1.1368461473279972
        },
        segments: [3, 2, 1]
    }
);
let pathP2P3 = dubins_traj(p2p3, 1);
assert.deepEqual(
    pathP2P3[2000],
    { x: 4132.014784126039, y: 7508.595811609, psi: 2.435407481058663 }
)
assert.deepEqual(
    pathP2P3[4000],
    {
        x: 3335.0872051310885,
        y: 9272.949772736742,
        psi: 1.5546893833280988
    }
)
assert.deepEqual(
    pathP2P3[6000],
    {
        x: 3987.231932117159,
        y: 11144.885335302437,
        psi: 1.1368461473279972
    }
)
assert.deepEqual(
    pathP2P3[9000],
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
    p3p4,
    {
        p_init: { x: 1000, y: 15000, psi: 180 },
        seg_final: [0.10133129490561821, 5.430928410974976, 1.6721276217005148],
        turn_radius: 2270.8741936308616,
        mid_pt1: {
            x: 1011.6487310995047,
            y: 14770.282972445244,
            psi: 4.813720275290308
        },
        mid_pt2: {
            x: 2259.2254625313503,
            y: 2500.5912211856175,
            psi: 4.813720275290308
        },
        segments: [1, 2, 3]
    }
);
let pathP3P4 = dubins_traj(p3p4, 1);
assert.deepEqual(
    pathP3P4[2000],
    {
        x: 1190.687150759856,
        y: 13009.47246234222,
        psi: 4.813720275290308
    }
)
assert.deepEqual(
    pathP3P4[4000],
    { x: 1393.0030942842, y: 11019.731710637152, psi: 4.813720275290308 }
)
assert.deepEqual(
    pathP3P4[6000],
    {
        x: 1595.3190378085442,
        y: 9029.990958932081,
        psi: 4.813720275290308
    }
)
assert.deepEqual(
    pathP3P4[9000],
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
    p1p2SmallTurn,
    {
        p_init: { x: 0, y: 0, psi: 0 },
        seg_final: [0.7873146081329452, 25.535876601172724, 2.5326438601272745],
        turn_radius: 342.73935987877445,
        mid_pt1: {
            x: 100.85093585224547,
            y: 242.8173369676765,
            psi: 0.7834817186619514
        },
        mid_pt2: {
            x: 6301.404489284209,
            y: 6419.6502841612655,
            psi: 0.7834817186619514
        },
        segments: [3, 2, 1]
    }
);
let pathP1P2SmallTurn = dubins_traj(p1p2SmallTurn, 1);
assert.deepEqual(
    pathP1P2SmallTurn[2000],
    {
        x: 1326.5985251671968,
        y: 1463.8757520559677,
        psi: 0.7834817186619514
    }
)
assert.deepEqual(
    pathP1P2SmallTurn[4000],
    {
        x: 2743.51975098474,
        y: 2875.3764569186014,
        psi: 0.7834817186619514
    }
)
assert.deepEqual(
    pathP1P2SmallTurn[6000],
    {
        x: 4160.440976802282,
        y: 4286.8771617812345,
        psi: 0.7834817186619514
    }
)
assert.deepEqual(
    pathP1P2SmallTurn[9000],
    {
        x: 6285.822815528597,
        y: 6404.128219075186,
        psi: 0.7834817186619514
    }
)

console.log('✅ tests passed!');
