# Collides

Collision test for two polygons

# Installation
```
$ npm install --save collides
```

# Usage

```
var collides = require('collides');

collides(
  {
    x: 1,
    y: 1,
    width: 1,
    height: 1
  }, {
    x: 1,
    y: 2,
    width: 1,
    height: 1.1,
  }
) // => true

collides(
  {
    x: 1,
    y: 1,
    width: 1,
    height: 1
  }, {
    x: 1,
    y: 2,
    width: 1,
    height: 1,
  }
) // => false
```

# TBA

- Generic polygon collisions

# License

This code is released under
[CC0](http://creativecommons.org/publicdomain/zero/1.0/) (Public Domain)
