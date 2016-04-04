let Utils = {
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
  normalize: function(vector) {
    var length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    return {
      x: vector.x / length,
      y: vector.y / length,
    };
  },

  /* Executes a dot product between vectors 'a' and 'b' */
  dot: function(a, b) {
    return a.x * b.x + a.y * b.y;
  },

  /* Returns a perpendicular vector to the input */
  perpendicular: function(vector) {
    return {
      x: -vector.y,
      y: vector.x,
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
  project: function(polygon, axis) {
    let [max, min] = [-Infinity, Infinity];

    // Do not use forEach loop to increase execution speed
    for (let i = 0; i < polygon.length; ++i) {
      let dot = this.dot(polygon[i], axis);
      max = Math.max(dot, max);
      min = Math.min(dot, min);
    }

    return {
      max: max,
      min: min,
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
  distance: function(a, b) {
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
  intersect: function(a, b) {
    for (let i = 0; i < a.length; ++i) {
      // Get the edge that we'll be testing intersection against
      let next = (i + 1) % a.length;
      // edge AB is defined by B - A
      let edge = {
        x: a[next].x - a[i].x,
        y: a[next].y - a[i].y,
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
  type: function(object) {
    if (object.width) {
      return 'rectangle';
    }
    return 'polygon';
  },

  /* Returns the array of vertexes for a polygon (when possible) */
  types: {
    rectangle: function(rectangle) {
      return [
        {x: rectangle.x, y: rectangle.y},
        {x: rectangle.x + rectangle.width, y: rectangle.y},
        {x: rectangle.x + rectangle.width, y: rectangle.y - rectangle.height},
        {x: rectangle.x, y: rectangle.y - rectangle.height},
      ];
    },
  },

  /* Converts a described polygon into an array of vertexes (when possible) */
  parse: function(object) {
    if (Array.isArray(object)) {
      return object;
    }
    return this.types[this.type(object)](object);
  },
};

export default Utils;
