# What is this?
This is a JS port of [previous work](#where-did-the-code-come-from) on generating Dubins sets + paths.

# Install
```
npm i dubins-js
```

Supports CJS and ESM.

# Why?
I (the author) want to draw a fish, on HTML Canvas, using Javascript, that can move in an aestheticically pleasing and organic-looking way.

# Where did the code come from?
The Python version: https://github.com/fgabbert/dubins_py, by [@fgabbert](https://github.com/fgabbert)
The paper: https://cpb-us-e2.wpmucdn.com/faculty.sites.uci.edu/dist/e/700/files/2014/04/Dubins_Set_Robotics_2001.pdf

# This is WIP
There should still be significant changes to come for this package, particularly:
- [x] Restructure so that midpoints (and segments) are easily accessible
- [ ] Better (exported) types
- [ ] Easy API to lazily get a point from a Dubins path
      - [ ] add lerp
- [ ] Way to set the turn radius directly?
- [ ] Angles should only use radians and use the x axis as a base, as normal unit circles do
- [ ] Renaming of functions and other variables to follow JS convention
- [ ] Tests to ensure correctness as per paper
- [ ] Utility functions to render on canvas + svg (separate module, optional import?)
- [ ] Documentation
- [ ] Evaluate necessity of increased floating point precision

# ELI5 how does this work?
Coming soon!
