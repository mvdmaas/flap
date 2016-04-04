(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["collides"] = factory();
	else
		root["collides"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Utils = __webpack_require__(/*! utils */ 1);
	
	module.exports = function (a, b) {
	  a = Utils.parse(a);
	  b = Utils.parse(b);
	  return Utils.intersect(a, b) && Utils.intersect(b, a);
	};

/***/ },
/* 1 */
/*!**********************!*\
  !*** ./lib/utils.js ***!
  \**********************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var Utils = {
	  /* Nomalize a vector
	   *
	   * Normalized vectors are the ones with length = 1, so that the statement:
	   *
	   * |vector| = Math.sqrt(vector.x * vector.x + vector.y * vector.y) = 1
	   *
	   * is true.
	   *
	   * This can be achieved by dividing the vector's magnitude/length (|vector|)
	   * by each of its coordinates:
	   *
	   * vector = vector / |vector|
	   */
	  normalize: function normalize(vector) {
	    var length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
	    return {
	      x: vector.x / length,
	      y: vector.y / length
	    };
	  },
	
	  /* Executes a dot product between vectors 'a' and 'b' */
	  dot: function dot(a, b) {
	    return a.x * b.x + a.y * b.y;
	  },
	
	  /* Returns a perpendicular vector to the input */
	  perpendicular: function perpendicular(vector) {
	    return {
	      x: -vector.y,
	      y: vector.x
	    };
	  },
	
	  /* Project a polygon onto an axis
	   *
	   * +---------+ -> Polygon
	   * |         |
	   * |         |
	   * +---------+
	   *
	   * |*********|---------------------- -> Axis
	   *
	   * |---------| -> projection
	   *
	   * @returns return the maximum and minimal interval resulting from the
	   *          projection
	   * @param polygon {Object[]} The polygon that will be projected
	   * @param axis {Object} The axis that will receive the projection
	   */
	  project: function project(polygon, axis) {
	    var max = -Infinity;
	    var min = Infinity;
	
	    // Do not use forEach loop to increase execution speed
	    for (var i = 0; i < polygon.length; ++i) {
	      var dot = this.dot(polygon[i], axis);
	      max = Math.max(dot, max);
	      min = Math.min(dot, min);
	    }
	
	    return {
	      max: max,
	      min: min
	    };
	  },
	
	  /* Returns the distance between 'a' and 'b' intervals
	   *
	   * |*********|---------|********************|---------- -> Positive distance
	   *
	   * ^         ^         ^                    ^
	   * | a.min   | a.max   | b.min              | b.max
	   *
	   * |*****************|**************|***************|-- -> Negative distance
	   *
	   * ^                 ^              ^               ^
	   * | a.min           | b.min        | a.max         | b.max
	   *
	   * This is used to test whether two given intervals intersect or not.
	   */
	  distance: function distance(a, b) {
	    if (a.min < b.min) {
	      return b.min - a.max;
	    }
	    return a.min - b.max;
	  },
	
	  /* Test polygon intersection according to the SAT (Separating Axis Theorem)
	   *
	   * For further reading about SAT, refer to:
	   * http://www.metanetsoftware.com/technique/tutorialA.html
	   *
	   * @param a {Object[]} The main polygon we'll be testing, by extracting its
	   *                     edges
	   * @param b {Object[]} The polygon that will be projected onto a
	   *                     perpendicular edges
	   */
	  intersect: function intersect(a, b) {
	    for (var i = 0; i < a.length; ++i) {
	      // Get the edge that we'll be testing intersection against
	      var next = (i + 1) % a.length;
	      // edge AB is defined by B - A
	      var edge = {
	        x: a[next].x - a[i].x,
	        y: a[next].y - a[i].y
	      };
	
	      // Get the perpendicular axis relative to the edge that we'll be testing
	      var axis = this.perpendicular(edge);
	
	      // Get the projection intervals
	      var intervalA = this.project(a, axis);
	      var intervalB = this.project(b, axis);
	
	      // If the distance between the two intervals is greater than zero, the
	      // two intervals do not intersect - therefore no collision is ocurring
	      if (this.distance(intervalA, intervalB) > 0) {
	        return false;
	      }
	    }
	
	    return true;
	  },
	
	  /* Returns which type of polygon the given object is
	   *
	   * We currently accept this types of polygons:
	   *
	   * 'rectangle' - {defined by having a width parameter}
	   * 'polygon' - {is an array}
	   */
	  type: function type(object) {
	    if (object.width) {
	      return 'rectangle';
	    }
	    return 'polygon';
	  },
	
	  /* Returns the array of vertexes for a polygon (when possible) */
	  types: {
	    rectangle: function rectangle(_rectangle) {
	      return [{ x: _rectangle.x, y: _rectangle.y }, { x: _rectangle.x + _rectangle.width, y: _rectangle.y }, { x: _rectangle.x + _rectangle.width, y: _rectangle.y - _rectangle.height }, { x: _rectangle.x, y: _rectangle.y - _rectangle.height }];
	    }
	  },
	
	  /* Converts a described polygon into an array of vertexes (when possible) */
	  parse: function parse(object) {
	    if (Array.isArray(object)) {
	      return object;
	    }
	    return this.types[this.type(object)](object);
	  }
	};
	
	exports['default'] = Utils;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=collides.js.map