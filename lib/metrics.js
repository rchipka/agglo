'use strict';

module.exports = {
  linkage: {
    average: function (source, target) {
      return (
        (source.linkage * source.count) +
        (target.linkage * target.count)
      ) / (source.count + target.count);
    },
    single: function (source, target) {
      if (source.linkage < target.linkage) {
        return source.linkage;
      }

      return target.linkage;
    },
    complete: function (source, target) {
      if (source.linkage > target.linkage) {
        return source.linkage;
      }

      return target.linkage;
    }
  },
  distance: {
    euclidean: function (a, b) {
      return Math.sqrt(
        iterate(a, b, function (av, bv, distance) {
         return distance + Math.pow(bv - av, 2);
       }));
    },
    manhattan: function (a, b) {
      return iterate(a, b, function (av, bv, distance) {
        return distance + Math.abs(av - bv);
      });
    },
    max: function (a, b) {
      return iterate(a, b, function (av, bv, distance) {
        return Math.max(Math.abs(av - bv), distance);
      });
    }
  },
};

function iterate(a, b, callback) {
  var distance = 0, index;

  if (!(a instanceof Array)) {
    return callback(a, b, distance);
  }

  index = a.length;

  while (index--) {
    distance = callback(a[index], b[index], distance);
  }

  return distance;
}
