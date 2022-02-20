# What is this?
This is a JS port of [previous work](#where-did-the-code-come-from) on generating Dubins sets + paths.

# Install
```
npm i dubins-js
```

Supports CJS and ESM.
# Why?
I (the author) want to draw a fish, on HTML Canvas, using Javascript, that can move in an aesthetic and organic-looking way.

# Where did the code come from?
The Python version: https://github.com/fgabbert/dubins_py, by [@fgabbert](https://github.com/fgabbert)
The paper: https://cpb-us-e2.wpmucdn.com/faculty.sites.uci.edu/dist/e/700/files/2014/04/Dubins_Set_Robotics_2001.pdf

# This is WIP
There should still be significant changes to come for this package, particularly:
- [ ] Renaming of functions to follow JS convention
- [ ] Better (exported) types
- [ ] Restructure so that midpoints are easily accessible
- [ ] Easy API to lazily get a point from a Dubins path
- [ ] Utility functions to render on canvas + svg

# I've read the paper, but how does this work?
Coming soon!