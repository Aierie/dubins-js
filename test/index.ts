import { assert } from 'chai';
import { calcDubinsPath, Waypoint } from '../src/index';

// currently just copying the python demo 
// accepting floating point differences for now
// seems like js is less precise than python (28 v 17)
let wpt1: Waypoint = { x: 0, y: 0, psi: 0 };
let wpt2: Waypoint = { x: 6000, y: 7000, psi: 260 };
let wpt3: Waypoint = { x: 1000, y: 15000, psi: 180 };
let wpt4: Waypoint = { x: 0, y: 0, psi: 270 };
let vel = 90;
let phi_lim = 20;

assert.deepEqual(
    calcDubinsPath(
        wpt1,
        wpt2,
        vel,
        phi_lim
    ),
    {
        p_init: { x: 0, y: 0, psi: 0 },
        seg_final: [1.518540974848893, 1.9228903638756734, 3.2638702268432223],
        turn_radius: 2270.8741936308616,
        type: 3
    }
);
assert.deepEqual(
    calcDubinsPath(
        wpt2,
        wpt3,
        vel,
        phi_lim
    ),
    { turn_radius: 2270.8741936308616, seg_final: [2.1792794314612287, 1.8705235889691287, 3.5755428330566925], type: 3, p_init: { y: 7000, x: 6000, psi: 260 } }
);
assert.deepEqual(
    calcDubinsPath(
        wpt3,
        wpt4,
        vel,
        phi_lim
    ),
    {
        p_init: { x: 1000, y: 15000, psi: 180 },
        seg_final: [0.10133129490561821, 5.430928410974976, 1.6721276217005148],
        turn_radius: 2270.8741936308616,
        type: 2
    }
);

// adding on some modifications in velocity and phi_lim
let vel2 = 30;
let phi_lim2 = 15;
assert.deepEqual(
    calcDubinsPath(
        wpt1,
        wpt2,
        vel2,
        phi_lim2
    ),
    {
        p_init: { x: 0, y: 0, psi: 0 },
        seg_final: [0.7873146081329452, 25.535876601172724, 2.5326438601272745],
        turn_radius: 342.73935987877445,
        type: 3
    }
);