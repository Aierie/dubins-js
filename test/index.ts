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
        mid_pt1: { x: 0.9477684264078723, y: 0.9986349997471999, psi: 0.052255351946003614 },
        mid_pt2: { x: 2.8680340444507486, y: 1.0990705892975654, psi: 0.052255351946003614 },
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
        y: 2296.5845755725018,
        psi: 0.052255351946003614
    }
)
assert.deepEqual(
    pathP1P2[6000],
    {
        x: 4700.364435840871,
        y: 2401.047722756757,
        psi: 0.052255351946003614
    }
)
assert.deepEqual(
    pathP1P2[9000],
    { x: 7627.51298322313, y: 2856.75969819994, psi: 0.5740554530089739 }
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
        mid_pt1: { x: -1.0809601254360313, y: 1.405265871539417, psi: 1.1368461473279976 },
        mid_pt2: { x: -0.29448329655730887, y: 3.102414272395046, psi: 1.1368461473279976 },
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
        x: 3987.2319321171585,
        y: 11144.885335302439,
        psi: 1.1368461473279972
    }
)
assert.deepEqual(
    pathP2P3[9000],
    {
        x: 5248.606287698785,
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
        mid_pt1: { x: 0.005129624147465317, y: -0.10115797176217224, psi: 4.813720275290308 },
        mid_pt2: { x: 0.5545113269872499, y: -5.504227761217056, psi: 4.813720275290308 },
        segments: [1, 2, 3]
    }
);
let pathP3P4 = dubins_traj(p3p4, 1);
assert.deepEqual(
    pathP3P4[2000],
    {
        x: 1190.6871507598557,
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
    { x: 1898.79295309506, y: 6045.379831374477, psi: 4.813720275290308 }
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
        mid_pt1: { x: 0.2942496475686832, y: 0.7084606129087714, psi: 0.7834817186619514 },
        mid_pt2: { x: 18.38541243559827, y: 18.73041452382904, psi: 0.7834817186619514 },
        segments: [3, 2, 1]
    }
);
let pathP1P2SmallTurn = dubins_traj(p1p2SmallTurn, 1);
assert.deepEqual(
    pathP1P2SmallTurn[2000],
    {
        x: 1326.598525167197,
        y: 1463.875752055968,
        psi: 0.7834817186619514
    }
)
assert.deepEqual(
    pathP1P2SmallTurn[4000],
    {
        x: 2743.51975098474,
        y: 2875.376456918601,
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
        x: 6285.822815528598,
        y: 6404.1282190751845,
        psi: 0.7834817186619514
    }
)

console.log('✅ tests passed!');
